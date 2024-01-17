"use strict";

const replaceVariableManager = require("./replace-variable-manager");

exports.loadReplaceVariables = () => {
    [
        'account-creation-date',
        'active-chat-user-count',
        'arg-array-raw',
        'arg-array',
        'arg-count',
        'arg',
        'audio-duration',
        'bits-badge-tier',
        'bits-badge-unlocked-message',
        'bits-cheered',
        'bits-leaderboard',
        'bits-top-cheerers-raw',
        'bits-top-cheerers',
        'bot',
        'category-image-url',
        'category',
        'charity-campaign-goal',
        'charity-campaign-total',
        'charity-description',
        'charity-logo',
        'charity-name',
        'charity-website',
        'chat-message-animated-emote-urls',
        'chat-message-emote-names',
        'chat-message-emote-urls',
        'chat-message',
        'chat-messages',
        'chat-mode-duration',
        'chat-mode-state',
        'chat-mode',
        'cheer-bits',
        'cheer-message',
        'cheer-total-bits',
        'command-trigger',
        'convert-from-json',
        'convert-to-json',
        'count',
        'counter',
        'counter-change',
        'counter-maximum',
        'counter-minimum',
        'counter-name',
        'counter-new-value',
        'counter-previous-value',
        'currency-name',
        'currency-rank',
        'currency',
        'current-viewer-count',
        'custom-role-user-count',
        'custom-role-users-raw',
        'custom-role-users',
        'custom-variable-created-data',
        'custom-variable-created-name',
        'custom-variable-expired-data',
        'custom-variable-expired-name',
        'custom-variable-keys-raw',
        'custom-variable-keys',
        'custom-variable-raw',
        'custom-variable',
        'date',
        'discord-timestamp',
        'donation-amount-formatted',
        'donation-amount',
        'donation-from',
        'donation-message',
        'effect-output',
        'effect-queue-id',
        'effect-queue-name',
        'eval-vars',
        'file-exists',
        'file-line-count',
        'follow-age',
        'follow-count',
        'game',
        'gift-count',
        'gift-duration',
        'gift-giver-user',
        'gift-receiver-user',
        'gift-receivers-raw',
        'gift-receivers',
        'gift-sub-months',
        'gift-sub-type',
        'has-role',
        'has-roles',
        'is-whisper',
        'loop-count',
        'loop-item',
        'mod-reason',
        'moderator',
        'new-currency-amount',
        'overlay-instance',
        'poll-winning-choice-name',
        'poll-winning-choice-votes',
        'prediction-winning-outcome-name',
        'preset-list-arg',
        'previous-currency-amount',
        'profile-page-bytebin-token',
        'pronouns',
        'quick-store',
        'quote',
        'quote-as-object',
        'quote-as-raw-object',
        'raid-viewer-count',
        'random-active-viewer',
        'random-advice',
        'random-custom-role-user',
        'random-dad-joke',
        'random-reddit-image',
        'random-viewer',
        'read-api-raw',
        'read-api',
        'read-file',
        'regex-exec',
        'regex-matches-raw',
        'regex-matches',
        'regex-test',
        'reward-cost',
        'reward-description',
        'reward-id',
        'reward-image-url',
        'reward-message',
        'reward-name',
        'reward-redemption-id',
        'roll-dice',
        'run-effect',
        'stream-title',
        'streamer',
        'sub-message',
        'sub-months',
        'sub-streak',
        'sub-type',
        'sub-users',
        'target',
        'time',
        'timeout-duration',
        'top-currency-raw',
        'top-currency-user',
        'top-currency',
        'top-metadata-raw',
        'top-metadata-user',
        'top-metadata',
        'top-view-time-raw',
        'top-view-time',
        'uptime',
        'user-avatar-url',
        'user-badge-urls',
        'user-exists',
        'user-id-name',
        'user-id',
        'user-is-banned',
        'user-is-timed-out',
        'user-metadata-raw',
        'user-metadata',
        'user-roles-raw',
        'user-roles',
        'user',
        'username-array-raw',
        'username-array',
        'username',
        'video-duration',
        'view-time',
        'viewer-count',
        'whisper-message',
        'whisper-recipient',

        'twitch/channel-goal-current-amount',
        'twitch/channel-goal-description',
        'twitch/channel-goal-target-amount',
        'twitch/channel-goal-type',
        'twitch/cheermote-amounts',
        'twitch/cheermote-animated-urls',
        'twitch/cheermote-colors',
        'twitch/cheermote-names',
        'twitch/cheermote-urls',
        'twitch/hype-train-level',
        'twitch/hype-train-percent',
        'twitch/sub-count',
        'twitch/sub-points',
        'twitch/twitch-channel-url'
    ].forEach((filename) => {
        const definition = require(`./builtin/${filename}`);
        replaceVariableManager.registerReplaceVariable(definition);
    });
};