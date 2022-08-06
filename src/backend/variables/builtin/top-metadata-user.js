// Migration: info - Needs implementation details

"use strict";

const { OutputDataType, VariableCategory } = require("../../../shared/variable-constants");

const userDatabase = require("../../database/userDatabase");

const model = {
    definition: {
        handle: "topMetadataUser",
        description: "Get the username or amount for a specific position in the top metadata list",
        examples: [
            {
                usage: "topMetadataUser[slaps, 1, username]",
                description: "Get the username for the top slapper"
            },
            {
                usage: "topMetadataUser[slaps, 5, amount]",
                description: "Get the number of slaps for the top 5th slapper"
            }
        ],
        usage: "topMetadataUser[metadataKey, position, username/amount]",
        categories: [VariableCategory.USER, VariableCategory.ADVANCED],
        possibleDataOutput: [OutputDataType.TEXT, OutputDataType.NUMBER]
    },
    evaluator: async (_, metadataKey, position = 1, usernameOrPosition = "username") => {

        if (metadataKey == null) {
            return "[Invalid metadata name]";
        }

        const userAtPosition = await userDatabase.getTopMetadataPosition(metadataKey, position);

        if (userAtPosition == null) {
            return "[Can't find user at position]";
        }

        if (usernameOrPosition === "username") {
            return userAtPosition.displayName;
        }
        return userAtPosition.metadata[metadataKey];
    }
};

module.exports = model;
