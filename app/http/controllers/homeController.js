const Menu = require("../../models/menu");

const homeController = async (req, res, next) => {
    const pizzas = await Menu.find();
    res.render("home", { pizzas });
};

module.exports = homeController;
