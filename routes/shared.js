exports.addAlert = function (req, type, message) {
    req.flash(type === 'success' ? 'success_msg' : 'error_msg', message);
}