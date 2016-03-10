/**
 * Module dependencies.
 */
var notification = require('./../controller/notification');

module.exports = function(router) {

    // user routes
    router.get('/notification/all', notification.getAll);
    router.get('/notification/unread', notification.getUnread);
    router.put('/notification/update/unread', notification.update);
}
