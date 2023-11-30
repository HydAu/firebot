"use strict";

const replaceVariableManager = require("./replace-variable-manager");

exports.loadReplaceVariables = () => {
    [
        'account-creation-date',
        'active-chat-user-count',
        'arg-array',
        'arg-array-raw',
        'arg-count',
        'arg',
        'array-add',
        'array-add-raw',
        'array-element',
        'array-element-raw',
        'array-filter',
        'array-filter-raw',
        'array-find',
        'array-find-raw',
        'array-find-index',
        'array-find-index-raw',
        'array-from-raw',
        'array-join',
        'array-join-raw',
        'array-length',
        'array-length-raw',
        'array-remove',
        'array-remove-raw',
        'array-reverse',
        'array-reverse-raw',
        'array-shuffle',
        'array-shuffle-raw',
        'bits-badge-tier',
        'bits-badge-unlocked-message',
        'bits-cheered',
        'bits-leaderboard',
        'bits-top-cheerers',
        'bits-top-cheerers-raw',
        'bot',
        'category',
        'category-image-url',
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
        'commafy',
        'command-trigger',
        'concat',
        'convert-from-json',
        'convert-to-json',
        'count',
        'counter',
        'currency-name',
        'currency',
        'currency-rank',
        'current-viewer-count',
        'custom-role-user-count',
        'custom-role-users',
        'custom-role-users-raw',
        'custom-variable',
        'custom-variable-raw',
        'custom-variable-keys',
        'custom-variable-keys-raw',
        'custom-variable-created-data',
        'custom-variable-created-name',
        'custom-variable-expired-data',
        'custom-variable-expired-name',
        'date',
        'discord-timestamp',
        'donation-amount-formatted',
        'donation-amount',
        'donation-from',
        'donation-message',
        'effect-output',
        'ensure-number',
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
        'gift-receivers',
        'gift-receivers-raw',
        'gift-sub-months',
        'gift-sub-type',
        'has-role',
        'has-roles',
        'loop-count',
        'loop-item',
        'math',
        'mod-reason',
        'moderator',
        'new-currency-amount',
        'number-ceil',
        'number-floor',
        'number-max',
        'number-min',
        'number-pad',
        'number-round',
        'object-set-property',
        'object-set-property-raw',
        'object-walk-path',
        'object-walk-path-raw',
        'ordinal-indicator',
        'preset-list-arg',
        'previous-currency-amount',
        'profile-page-bytebin-token',
        'quick-store',
        'quote',
        'raid-viewer-count',
        'random-active-viewer',
        'random-custom-role-user',
        'random-number',
        'random-viewer',
        'random-reddit-image',
        'random-dad-joke',
        'random-advice',
        'read-api',
        'read-api-raw',
        'read-file',
        'regex-matches',
        'regex-matches-raw',
        'regex-exec',
        'regex-test',
        'replace',
        'reward-description',
        'reward-cost',
        'reward-id',
        'reward-image-url',
        'reward-message',
        'reward-name',
        'reward-redemption-id',
        'roll-dice',
        'run-effect',
        'spoofed/all',
        'spoofed/and',
        'spoofed/any',
        'spoofed/if',
        'spoofed/nall',
        'spoofed/nand',
        'spoofed/nany',
        'spoofed/nor',
        'spoofed/not',
        'spoofed/or',
        'stream-title',
        'streamer',
        'sub-count',
        'sub-points',
        'sub-message',
        'sub-months',
        'sub-streak',
        'sub-type',
        'target',
        'text-length',
        'text-lowercase',
        'text-scramble',
        'text-uppercase',
        'text-capitalize',
        'text-contains',
        'text-decode-from-html',
        'text-decode-from-url',
        'text-encode-for-html',
        'text-encode-for-url',
        'text-split',
        'text-split-raw',
        'text-substring',
        'text-trim',
        'time',
        'timeout-duration',
        'top-currency-user',
        'top-currency',
        'top-currency-raw',
        'top-metadata-user',
        'top-metadata',
        'top-metadata-raw',
        'top-view-time',
        'top-view-time-raw',
        'uptime',
        'user-avatar-url',
        'user-exists',
        'user-id',
        'user-metadata',
        'user-metadata-raw',
        'user',
        'username',
        'username-array',
        'username-array-raw',
        'view-time',
        'whisper-message',
        'word'
    ].forEach(filename => {
        const definition = require(`./builtin/${filename}`);
        replaceVariableManager.registerReplaceVariable(definition);
    });
};