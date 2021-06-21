exports.addAlert = function (req, type, message) {
    console.log('add alert');
    req.flash(type === 'success' ? 'success_msg' : 'error_msg', message);
}