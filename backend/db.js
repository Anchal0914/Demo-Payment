const mongoose = require("mongoose");
const db = () => {
    mongoose.connect("mongodb+srv://anchalg140903:6KiwMH5kjvEML7qK@cluster0.9wqb94s.mongodb.net/myPaytm")
    .then (() => console.log("db connected"))
    .catch((e)=> console.log(e));   

}

module.exports = db;

