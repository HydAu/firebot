"use strict";

const model = {
    definition: {
        id: "firebot:followcheck",
        name: "Follow Check",
        description: "Restrict based on if user is following everyone in a comma separated list.",
        triggers: []
    },
    optionsTemplate: `
        <div>
            <firebot-radio-container>
                <firebot-radio label="Follows my channel" model="restriction.checkMode" value="'streamer'"/>
                <firebot-radio label="Follows custom channel" model="restriction.checkMode" value="'custom'" />
                <div ng-show="restriction.checkMode === 'custom'" style="padding-top: 4px;">
                    <div id="userFollowList" class="modal-subheader" style="padding: 0 0 4px 0">
                        User follows
                    </div>
                    <input type="text" class="form-control" placeholder="Enter value" ng-model="restriction.value">

                    <div style="margin-top: 10px;" class="alert alert-warning">
                        You must be the streamer or a moderator to check follows for a channel.
                    </div>
                </div>
            </firebot-radio-container>
        </div>
    `,

    optionsController: ($scope) => {
        if ($scope.restriction.checkMode == null) {
            $scope.restriction.checkMode = "custom";
        }
    },

    optionsValueDisplay: (restriction) => {
        const value = restriction.checkMode === "custom" ? restriction.value : "Follows my channel";

        if (value == null) {
            return "";
        }

        return value;
    },
    /*
      function that resolves/rejects a promise based on if the restriction criteria is met
    */
    predicate: async (trigger, restrictionData) => {
        return new Promise(async (resolve, reject) => {
            const userAccess = require("../../common/user-access");
            const accountAccess = require("../../common/account-access");

            const triggerUsername = trigger.metadata.username || "";
            const followListString = restrictionData.checkMode === "custom" ? restrictionData.value || "" : accountAccess.getAccounts().streamer.username;

            if (triggerUsername === "" || followListString === "") {
                return resolve();
            }

            const followCheckList = followListString.split(',')
                .filter(f => f != null)
                .map(f => f.toLowerCase().trim());

            const followCheck = await userAccess.userFollowsChannels(triggerUsername, followCheckList);

            if (followCheck) {
                return resolve();
            }

            return reject(`You must be following: ${followListString}`);
        });
    }
};

module.exports = model;