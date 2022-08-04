"use strict";

const { EffectCategory, EffectDependency } = require('../../../shared/effect-constants');
const logger = require('../../logwrapper');
const twitchChat = require("../../chat/twitch-chat");

const model = {
    definition: {
        id: "firebot:clearchat",
        name: "Clear Chat",
        description: "Clear all chat messages.",
        icon: "fad fa-eraser",
        categories: [EffectCategory.COMMON, EffectCategory.MODERATION, EffectCategory.TWITCH],
        dependencies: [EffectDependency.CHAT]
    },
    optionsTemplate: `
        <eos-container>
            <p>This effect will clear all chat messages from chat, exactly like the Twitch /clear command.</p>
        </eos-container>
    `,
    optionsController: () => {},
    optionsValidator: () => {
        const errors = [];
        return errors;
    },
    onTriggerEvent: async () => {
        await twitchChat.clearChat();
        logger.debug("Chat was cleared via the clear chat effect.");
        return true;
    }
};

module.exports = model;
