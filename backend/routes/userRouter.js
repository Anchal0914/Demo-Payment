const express = require("express")
const router = express.Router();
const zod = require("zod")
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config")
const Account = require("../model/account");

const {authMiddleware} = require("../middleware");

const signupSchema = zod.object({
    username:zod.string(),
    password:zod.string(),
    firstName: zod.string(),
    lastName: zod.string()

})

router.post("/signup", async(req,res) => {
    const body= req.body;
    const {success} = signupSchema.safeParse(body);
    if (!success) {
        return res.json({
            message : "Incorrect input"
        })
    }

    const existingUser = await User.findOne({
        username: body.username
    })
    if(existingUser) {
        return res.json({
            message: " user already exists"
        })
    }

    const user = await User.create(body);

    await Account.create({ // giving random amount for now to users
        userId:user._id,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({userId: user._id}, JWT_SECRET);

    res.json({
        message:"User created",
        token:token
    })
} )



const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})



const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;