import { join } from 'node:path';
import { BrowserWindow, MessageChannelMain, session } from 'electron';

import { ReplaceVariable, Trigger } from "../../../../../types/variables";
import { OutputDataType, VariableCategory } from "../../../../../shared/variable-constants";

const preloadPath = join(__dirname, 'sandbox-preload.js');
const htmlPath = join(__dirname, './sandbox.html');

const charList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const handlers = new Map<string, (...args: unknown[]) => unknown>();


interface Sandbox {
    finished: boolean,
    tunnel: Electron.MessagePortMain,
    timeout?: ReturnType<typeof setTimeout>,
    window?: Electron.BrowserWindow,

    resolve?: (...args: unknown[]) => void,
    reject?: (...args: unknown[]) => void
}

const model : ReplaceVariable = {
    definition: {
        handle: "js",
        usage: "js[code, ...parameters]",
        description: 'Evaluates the given js in a sandboxed browser instance.<br/>Parameters can be accessed via parameters[N] within the js.<br/>You must use return to return a result from the evaluation.',
        categories: [VariableCategory.ADVANCED],
        possibleDataOutput: [OutputDataType.ALL]
    },
    evaluator: (trigger: Trigger, code: string, ...args: unknown[]) => {
        if (<unknown>code instanceof String) {
            code = `${code}`;
        }
        if (typeof code !== 'string' || code === '') {
            return;
        }

        return new Promise((resolve, reject) => {
            let { port1: portToBackend, port2: portToSandbox } = new MessageChannelMain();

            const sandbox : Sandbox = {
                finished: false,
                tunnel: portToSandbox
            };

            // Frees all resources related to the sandbox
            const cleanup = () => {
                sandbox.finished = true;

                if (sandbox.timeout) {
                    clearTimeout(sandbox.timeout);
                    sandbox.timeout = null;
                }

                try {
                    sandbox.window.webContents.removeAllListeners();
                } catch (err) {}
                try {
                    sandbox.window.removeAllListeners();
                    sandbox.window.destroy();
                } catch (err) {}
                sandbox.window = null;

                try {
                    sandbox.tunnel.close();
                    sandbox.tunnel.removeAllListeners();
                } catch (err) {}
                sandbox.tunnel = null;
                portToSandbox = null;

                try {
                    portToBackend.close();
                    portToBackend.removeAllListeners();
                } catch (err) {}
                portToBackend = null;
            };

            // Called when the sandbox successfully returns a result
            sandbox.resolve = (result: unknown) => {
                if (!sandbox.finished) {
                    cleanup();
                    resolve(result);
                }
            };

            // Called when the sandbox ends with an error
            sandbox.reject = (reason?: string | Error) => {
                if (!sandbox.finished) {
                    cleanup();
                    reason = typeof reason === 'string' ? new Error(reason) : reason == null ? new Error('unknown error') : reason;
                    reject(reason);
                }
            };

            // Listen for messages from sandbox
            portToSandbox.on('message', async (event) => {
                if (sandbox.finished) {
                    cleanup();
                    return;
                }

                const { id, action, method, parameters, status, result } = event.data;

                // Sandbox returned a result for the evaluation
                if ((id === 0 || id === '0') && action === 'result') {
                    if (status === 'ok') {
                        sandbox.resolve(result);
                    } else if (status === 'error') {
                        sandbox.reject(result);
                    }

                // Sandbox is leveraging Firebot.* apis
                } else if (action === 'method') {
                    const base = { id, action: "result" };
                    if (method === 'meta') {
                        sandbox.tunnel.postMessage({ ...base, status: "ok", result: trigger.metadata || {} });

                    } else if (handlers.has(method)) {
                        try {
                            const result = await handlers.get(method)(...parameters);
                            if (sandbox.finished) {
                                return;
                            }
                            sandbox.tunnel.postMessage({ ...base, status: "ok", result });
                        } catch (err) {
                            sandbox.tunnel.postMessage({ ...base, status: "error", result: err.message });
                        }
                    } else {
                        sandbox.tunnel.postMessage({ ...base, status: "error", result: "unknown method"});
                    }
                }
            });

            // Start listening for messages from sandbox
            portToSandbox.start();

            // Generate a unique session id for the sandbox; this equates to each sandbox getting its own session data(LocalStorage, cache, etc)
            let sandboxSessionId = '', index = 10;
            while (index) {
                sandboxSessionId += charList[Math.floor(62 * Math.random())];
                index -= 1;
            }
            sandboxSessionId = `firebot-sandbox-${Date.now()}-${sandboxSessionId}`;

            // Create a new, hidden, browser window
            sandbox.window = new BrowserWindow({
                show: false,
                title: 'Firebot - $JS Eval Sandbox',
                webPreferences: {
                    preload: preloadPath,

                    // Sandbox the context
                    sandbox: true,
                    nodeIntegration: false,
                    contextIsolation: true,

                    // Unique session for each sandbox
                    session: session.fromPartition(sandboxSessionId, { cache: false }),

                    // Loosen web restrictions - still under discussion
                    webSecurity: false,

                    // Tighten web restrictions
                    //   No autoplay without user interaction and since the window is
                    //   never shown there will never be a user action thus: no autoplay.
                    //   Also, since window is hidden, audio/video will never play.
                    autoplayPolicy: 'user-gesture-required',

                    // Disable abusable and/or irrelevent features
                    disableDialogs: true,
                    webgl: false,
                    images: false,
                    enableWebSQL: false
                }
            });

            // Prevent sandbox js from opening windows
            sandbox.window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

            // Prevent sandbox js from navigating away from sandbox page
            sandbox.window.webContents.on('will-navigate', event => event.preventDefault());

            // Prevent sandbox from altering page title
            sandbox.window.on('page-title-updated', event => event.preventDefault());

            // Cleanup the sandbox if it becomes unresponsive
            sandbox.window.on('unresponsive', () => sandbox.reject('sandbox unresponsive'));

            // Cleanup the sandbox if the window closes
            sandbox.window.on('closed', () => sandbox.reject('sandbox closed'));

            // Wait for the contents of the sandbox window to be ready
            sandbox.window.on('ready-to-show', () => {

                // Give evaluation 30s to resolve
                sandbox.timeout = setTimeout(() => sandbox.reject('eval timed out'), 15000);

                // send the message port the sandbox should use to the preload script
                sandbox.window.webContents.postMessage('firebot-port', null, [portToBackend]);

                // tell sandbox the code to evaluate
                sandbox.tunnel.postMessage({
                    id: 0,
                    action: 'method',
                    method: 'evaluate',
                    parameters: [code, ...args]
                });
            });

            // load the sandbox html
            sandbox.window.loadFile(htmlPath);
        });
    }
};

export default model;