const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("node-course", "root", "1195", {
  dialect: "mysql",
  host: "localhost",
})

module.exports = sequelize
