"use strict";

const integrationManager = require("./IntegrationManager");

exports.loadIntegrations = () => {
    [
        'aws/aws',
        'discord/discord',
        'elgato/elgato',
        'philips-hue/hue',
        'streamelements/streamelements',
        'streamlabs/streamlabs',
        'streamloots/streamloots',
        'tipeeestream/tipeeestream'
    ].forEach(filename => {
        const definition = require(`./builtin/${filename}.js`);
        integrationManager.registerIntegration(definition);
    });
};