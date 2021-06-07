exports.login = (req, res, next) => {
    res.render('auth/login');
};

exports.register = (req, res, next) => {
    res.render('auth/register');
};