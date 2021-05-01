"use strict";
const { ipcMain } = require("electron");
const moment = require("moment");
const logger = require("../../logwrapper");
const profileManager = require("../../common/profile-manager");
const frontendCommunicator = require("../../common/frontend-communicator");

let getCommandsDb = () => profileManager.getJsonDbInProfile("/chat/commands");

// in memory commands storage
let commandsCache = {
    systemCommandOverrides: {},
    customCommands: []
};

function saveSystemCommandOverride(command) {
    let commandDb = getCommandsDb();

    // remove forward slashes just in case
    let id = command.id.replace("/", "");

    try {
        commandDb.push("/systemCommandOverrides/" + id, command);
    } catch (err) {} //eslint-disable-line no-empty
}

function removeSystemCommandOverride(id) {
    let commandDb = getCommandsDb();

    // remove forward slashes just in case
    id = id.replace("/", "");
    try {
        commandDb.delete("/systemCommandOverrides/" + id);
    } catch (err) {} //eslint-disable-line no-empty
}

// Refreshes the commands cache
function refreshCommandCache(retry = 1) {
    // FB: I've set a weird retry thing here because I ran into a rare issue where upon saving settings the app tried to
    // save and get the same file at the same time which threw errors and caused the cache to get out
    // of sync.

    // Get commands file
    let commandsDb = getCommandsDb();

    // We've got the last used board! Let's update the interactive cache.
    if (commandsDb != null) {
        if (retry <= 3) {
            let cmdData;
            try {
                cmdData = commandsDb.getData("/");
            } catch (err) {
                logger.info(
                    "Command cache update failed. Retrying. (Try " + retry + "/3)"
                );
                retry = retry + 1;
                logger.error("error getting command data", err);
                refreshCommandCache(retry);
                return;
            }

            if (cmdData.systemCommandOverrides) {
                commandsCache.systemCommandOverrides = cmdData.systemCommandOverrides;
            }

            if (cmdData.customCommands) {
                commandsCache.customCommands = Object.values(
                    cmdData.customCommands
                ).map(c => {
                    c.type = "custom";
                    return c;
                });
            }

            logger.info("Updated Command cache.");
        } else {
            renderWindow.webContents.send(
                "error",
                "Could not sync up command cache. Reconnect to try resyncing."
            );
        }
    }
}

function saveCustomCommand(command) {
    let commandDb = getCommandsDb();

    if (command.id == null || command.id === "") {
        // generate id for new command
        const uuidv1 = require("uuid/v1");
        command.id = uuidv1();
        command.createdAt = moment().format();
    } else {
        command.lastEditAt = moment().format();
    }

    if (command.count == null) {
        command.count = 0;
    }

    try {
        commandDb.push("/customCommands/" + command.id, command);
    } catch (err) {} //eslint-disable-line no-empty
}

function saveCommandActiveState(command, state) {
    if (command.id == null || command.id === "") return;

    if (command.type === "system") {
        command.active = state;

        saveSystemCommandOverride(command);
        refreshCommandCache();
    }

    if (command.type === "custom") {
        command.active = state;
        command.lastEditAt = moment().format();

        saveCustomCommand(command);
        frontendCommunicator.send("custom-commands-updated");
    }
}

function saveImportedCustomCommand(command) {
    logger.debug("Saving imported command: " + command.trigger);

    if (command.id == null || command.id === "") {
        command.createdBy = "Imported";
    } else {
        command.lastEditBy = "Imported";
    }

    saveCustomCommand(command);
}

function deleteCustomCommand(commandId) {
    const commandDb = getCommandsDb();

    if (commandId == null) return;

    try {
        commandDb.delete("/customCommands/" + commandId);
    } catch (err) {
        logger.warn("error when deleting command", err);
    } //eslint-disable-line no-empty
}

refreshCommandCache();

// Refresh Command Cache
// Refreshes backend command cache
ipcMain.on("refreshCommandCache", function() {
    refreshCommandCache();
});

exports.triggerUiRefresh = () => {
    frontendCommunicator.send("custom-commands-updated");
};

exports.refreshCommandCache = refreshCommandCache;
exports.getSystemCommandOverrides = () => commandsCache.systemCommandOverrides;
exports.saveSystemCommandOverride = saveSystemCommandOverride;
exports.removeSystemCommandOverride = removeSystemCommandOverride;
exports.saveCommandActiveState = saveCommandActiveState;
exports.saveImportedCustomCommand = saveImportedCustomCommand;
exports.deleteCustomCommand = deleteCustomCommand;
exports.getCustomCommands = () => commandsCache.customCommands;
exports.getCustomCommand = id =>
    commandsCache.customCommands.find(c => c.id === id);
