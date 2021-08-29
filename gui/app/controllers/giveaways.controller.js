"use strict";
(function() {
    angular
        .module("firebotApp")
        .controller("giveawaysController", function(
            $scope,
            giveawayssService,
            utilityService
        ) {
            $scope.giveawayssService = giveawayssService;

            $scope.onGiveawaysUpdated = (items) => {
                giveawayssService.saveAllGiveaways(items);
            };

            $scope.headers = [
                {
                    name: "NAME",
                    icon: "fa-user",
                    cellTemplate: `{{data.name}}`,
                    cellController: () => {}
                },
                {
                    name: "ITEM",
                    icon: "fa-gift",
                    cellTemplate: `{{data.giveawayItem}}`,
                    cellControler: () => {}
                },
                {
                    name: "ENTRIES",
                    icon: "fa-th-list",
                    cellTemplate: `{{data.giveawayEntries ? data.giveawayEntries.length : 0}}`,
                    cellControler: () => {}
                },
                {
                    name: "WINNER",
                    icon: "fa-trophy",
                    cellTemplate: `{{data.winner ? data.winner : "-"}}`,
                    cellControler: () => {}
                },
                {
                    name: "OPEN/CLOSED",
                    icon: "fa-unlock",
                    cellTemplate: `{{data.isOpen ? "Open" : "Closed"}}`,
                    cellControler: () => {}
                }
            ];

            $scope.giveawayOptions = (item) => {
                const options = [
                    {
                        html: `<a href ><i class="far fa-pen" style="margin-right: 10px;"></i> Edit</a>`,
                        click: function () {
                            giveawayssService.showAddEditGiveawayModal(item);
                        }
                    },
                    {
                        html: `<a href ><i class="far fa-clone" style="margin-right: 10px;"></i> Duplicate</a>`,
                        click: function () {
                            giveawayssService.duplicateGiveaway(item.id);
                        }
                    },
                    {
                        html: `<a href style="color: #fb7373;"><i class="far fa-trash-alt" style="margin-right: 10px;"></i> Delete</a>`,
                        click: function () {
                            utilityService
                                .showConfirmationModal({
                                    title: "Delete Giveaway",
                                    question: `Are you sure you want to delete the Giveaway "${item.name}"?`,
                                    confirmLabel: "Delete",
                                    confirmBtnType: "btn-danger"
                                })
                                .then(confirmed => {
                                    if (confirmed) {
                                        giveawayssService.deleteGiveaway(item.id);
                                    }
                                });

                        }
                    }
                ];

                return options;
            };
        });
}());
