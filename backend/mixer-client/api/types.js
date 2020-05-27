"use strict";

const Mixer = require("@mixer/client-node");
const mixerClient = require("../client");

/**
 * A Mixer type (ie a game or category a channel can be set to)
 * @typedef {Object} MixerTypeInformation
 * @property {string} id - The type ID
 * @property {string} [name] - Name for the type
 * @property {string} parent - The parent of the type
 * @property {string} [description] - A text description of the type
 * @property {string} [coverUrl] - URL to cover picture
 * @property {string} [backgroundUrl] - URL to background picture
 * @property {number} viewersCurrent - The current number of viewers for the type
 */

/**
  * Gets the information for a particular type.
  * @argument {string} typeId - The unique ID of the type
  * @return {Promise<MixerTypeInformation>}
  */
exports.getTypeInformation = async (typeId) => {
    try {
        /**@type {Mixer.IResponse<MixerTypeInformation>} */
        const response = await mixerClient.streamer.request("get", `types/${typeId}`);
        return response.body;
    } catch (error) {
        return null;
    }
};