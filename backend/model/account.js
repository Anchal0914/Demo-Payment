const mongoose=require("mongoose");
//const User = require("./user");

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

module.exports=mongoose.model("Account",accountSchema);
// const Account = mongoose.model('Account', accountSchema);

// module.exports = {
// 	Account
// }

//another way of exporting