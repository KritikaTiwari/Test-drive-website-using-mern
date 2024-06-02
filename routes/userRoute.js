const express = require('express');
const router = express.Router();
const User = require("../models/userModel");
const TestDrive = require("../models/testdriveModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
router.post('/register', async(req, res) => {
    try {
       const userExists = await User.findOne({email: req.body.email});
        if(userExists)
            {
                return res.status(200).send({message: "User already exists", success:false});
            }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body);
        await newuser.save();
        res.status(200).send({message: "User created successfully" , success: true});
        
    } catch (error) {
        res.status(500).send({ message: "Error in  creating user", success: false, error});
    }
})

router.post('/login', async(req, res) =>{
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(200).send({message: "User does not exist", success: false});
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch){
            return res.status(200).send({message: "Password is incorrect", success: false});

        } else{
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET ,{
                expiresIn:"7d"
            })
            res.status(200).send({message: "Login successful", success : true, data:token });
        }
    } catch (error) {
        
        res.status(500).send({message:"Error in loggin", success: false, error});
    }
})
router.post('/get-user-info-by-id' , authMiddleware , async(req, res) =>{
    try {
       const user = await User.findOne({ _id: req.body.userId}); 
       user.password=undefined;
       if (!user){
        return res.status(200).send({ message: "User dones not exist", success: false });
       } else{
        res.status(200).send({ success: true, 
            data: user , 
    });
       }
    } catch (error) {
        return res.status(500).send({ message: "error in getting user info", success: false , error });
        
    }})
router.post('/testdrive-permission', authMiddleware , async(req, res) => {
        try {
         const newtestdrive = new TestDrive({ ...req.body, status:"pending"}); 
         await newtestdrive.save();
         const adminUser = await User.findOne({ isAdmin: true});
         const unseenNotification = adminUser.unseenNotification;
         unseenNotification.push({
            type: "new-testdrive-request",
            message: `${newtestdrive.customer_name} has requested for test drive`,
            data:{
            testdriveId : newtestdrive._id,
            name : newtestdrive.name,
        },
        onClickPath : "/admin/userslist"
         })
         await User.findByIdAndUpdate(adminUser._id, { unseenNotification });
        
        res.status(200).send({
            success: true,
            message: "Test Drive Request Sent Successfully"
        })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Error in applying for test drive", success: false, error});
        }
    })
router.post('/mark-all-notifications-as-seen', authMiddleware , async(req, res) => {
        try {
        const user = await User.findOne({_id: req.body.userId});
        const unseenNotification = user.unseenNotification;
        const seenNotification = user.seenNotification;
       // const unseenNotification = user.unseenNotification;
        seenNotification.push(...unseenNotification);
        user.unseenNotification = [];
        //user.seenNotification = unseenNotification;
         user.seenNotification = seenNotification;
        const updatedUser = await user.save();
       // const updatedUser = await User.findByIdAndUpdate(user._id, user);
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "All notifications marked as seen",
            date: updatedUser,
        });
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Error in notification", success: false, error});
        }
    });
router.post('/delete-all-notification', authMiddleware , async(req, res) => {
        try {
        const user = await User.findOne({_id: req.body.userId});
        user.seenNotification = [];
        user.unseenNotification = [];
        const updatedUser = await user.save();
        //const updatedUser = await User.findByIdAndUpdate(user._id,user);
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "All notifications deleted successsfully",
            date: updatedUser,
        });
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Error in deleting message", success: false, error});
        }
    });


    module.exports= router;