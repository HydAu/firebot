import { ReplaceVariable } from "../../../../../types/variables";
import { OutputDataType, VariableCategory } from "../../../../../shared/variable-constants";
import { EffectTrigger } from '../../../../../shared/effect-constants';

import { getAllRolesForViewerNameSpaced } from '../../../../roles/role-helpers';

const triggers = {};
triggers[EffectTrigger.COMMAND] = true;
triggers[EffectTrigger.EVENT] = true;
triggers[EffectTrigger.MANUAL] = true;
triggers[EffectTrigger.CUSTOM_SCRIPT] = true;
triggers[EffectTrigger.PRESET_LIST] = true;
triggers[EffectTrigger.CHANNEL_REWARD] = true;

const model : ReplaceVariable = {
    definition: {
        handle: "userRoles",
        usage: "userRoles[username, all|twitch|team|firebot|custom]",
        description: "Returns an array containing all roles of the user",
        examples: [
            {
                usage: 'userRoles',
                description: "Returns all roles for the user"
            },
            {
                usage: 'userRoles[$user]',
                description: "Returns all roles of the specified user"
            },
            {
                usage: 'userRoles[$user, all]',
                description: "Returns all roles of the specified user as nested arrays in the order of: twitch, team, firebot and custom"
            },
            {
                usage: 'userRoles[$user, firebot]',
                description: "Returns all firebot roles of the specified user"
            },
            {
                usage: 'userRoles[$user, custom]',
                description: "Returns all custom roles of the specified user"
            },
            {
                usage: 'userRoles[$user, twitch]',
                description: "Returns all Twitch roles of the specified user"
            },
            {
                usage: 'userRoles[$user, team]',
                description: "Returns all Twitch team roles of the specified user"
            }
        ],
        triggers: triggers,
        categories: [VariableCategory.COMMON, VariableCategory.USER],
        possibleDataOutput: [OutputDataType.ALL]
    },
    evaluator: async (trigger, username: null | string, roleType) : Promise<unknown[]> => {
        if (username == null && roleType == null) {
            username = trigger.metadata.username;
            roleType = 'all';
        }

        if (username == null || username === '') {
            return [];
        }

        if (roleType == null || roleType === "") {
            roleType = 'all';
        } else {
            roleType = (`${roleType}`).toLowerCase();
        }

        const userRoles = await getAllRolesForViewerNameSpaced(username);

        Object
            .keys(userRoles)
            .forEach((key: string) => {
                userRoles[key] = userRoles[key].map(r => r.name);
            });

        if (roleType === 'all') {
            return [
                ...userRoles.twitchRoles,
                ...userRoles.teamRoles,
                ...userRoles.firebotRoles,
                ...userRoles.customRoles
            ];
        }
        if (roleType === 'twitch') {
            return userRoles.twitchRoles;
        }
        if (roleType === 'team') {
            return userRoles.teamRoles;
        }
        if (roleType === 'firebot') {
            return userRoles.firebotRoles;
        }
        if (roleType === 'custom') {
            return userRoles.customRoles;
        }
        return [];
    }
};

export default model;