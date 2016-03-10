/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Notification = mongoose.model('Notification');

// get all notification data read and unread both
exports.getAll = function(req, res, next) {

    Notification.find({}).exec(function(err, data) {
        if (!err) {
            res.send(data);
        } else {
            res.send(err);
        }
    });
}

// get only unread notification data
exports.getUnread = function(req, res, next) {
    Notification.find({ unread: true }).exec(function(err, data) {
        if (!err) {
            Notification.count().exec(function(err, count) {
                res.jsonp({
                    data: data,
                    total: count
                });
            });
        } else {
            res.send(err);
        }
    });
}

/**
 * update unread notification
 */
exports.update = function(req, res, next) {
    var ids = [];
    for (var i = 0; i < req.body.length; ++i) {
        ids.push(req.body[i]._id);
    }

    Notification.update({ _id: { "$in": ids } }, { unread: false }, { multi: true }, function(err, docs) {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    });
};
