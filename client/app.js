(function() {
    'use strict';

    angular.module('app', ['ngAnimate'])
        .constant('API_URL', 'http://localhost:8888')
        .controller('appCtrl', ['$scope', '$http', 'API_URL', function($scope, $http, API_URL) {
            var socket = io.connect(API_URL),
                vm = this,
                element = angular.element;

            // set default value 
            vm.notifications = [];
            vm.unreadNotification = [];
            vm.unreadNotificationCount = 0;

            // click handler on notification bell
            vm.toggleNotificationDrop = function() {
                vm.isNotificationDrop = !vm.isNotificationDrop;
                element('.notification-dropdown').removeClass('hide');
                // update unread notification
                if (vm.unreadNotificationCount) {
                    $http.put(API_URL.concat('/notification/update/unread'), vm.unreadNotification).then(function() {
                        vm.unreadNotificationCount = 0;
                    }, function(err) {
                        console.log(err);
                    });
                }
            };

            // click handler on body for hiding the notification dropdown
            element('body').on('click', function($event) {
                var target = $event.target;
                // check if user has not clicked on bell icon or unread notification count
                if (!element(target).parent('.notification-container').length && vm.isNotificationDrop) {
                    vm.isNotificationDrop = false;
                    // start digest loop because angualr doesn't know about this callback 
                    $scope.$apply();
                }
            });

            // fetch notification data
            $http.get(API_URL.concat('/notification/all')).then(function(response) {
                vm.isNotificationLoading = true;
                response.data = response.data || [];
                vm.notifications = response.data;
                // check on page refresh, if any unread message
                vm.unreadNotification = response.data.filter(function(v) {
                    return v.unread === true;
                });
                vm.unreadNotificationCount = vm.unreadNotification.length;
            }, function(err) {
                console.log(err);
            });

            // listening socket event for getting live notification
            socket.on('notificationCreated', function(data) {
                console.log(data);
                // update new notification data 
                vm.notifications.unshift(data);
                vm.unreadNotification.unshift(data);

                /** 
                 * check if notifiaction dropdown is open
                 * then update notification unread 
                 **/
                if (vm.isNotificationDrop) {
                    $http.put(API_URL.concat('/notification/update/unread'), [data]).then((function(response) {
                        // get the updated notification index by id
                        var notificationIndex = vm.notifications.map(function(v, i) {
                            return v._id;
                        }).indexOf(response._id);
                        vm.notifications[notificationIndex]['unread'] = false;
                    })(data), function(err) {
                        console.log(err);
                    })
                } else {
                    vm.unreadNotificationCount++;
                }
                $scope.$apply();
            });
        }]);

})();
