const express =require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const testdriveModel = require('../models/testdriveModel');
const router = express.Router();
const userModel = require('../models/userModel');
//GET USERS
router.get('/get-all-users', authMiddleware, async(req, res) =>{
    try {
        const users = await testdriveModel.find({});
      res.status(200).send({
        message: "Users fetched successfully",
        success: true,
        data: users,
      }) 
    } catch (error) {
        
        res.status(500).send({
            message: 'Error fetching users',
            success:false,
            error
        });
    }
});


router.post('/change-testdrive-status', authMiddleware, async(req, res) =>{
  try {
      const{ testdriveId, status} = req.body;
      const testdrive = await testdriveModel.findByIdAndUpdate(testdriveId,{status});
    const user =await userModel.findOne({_id: testdrive.userId});
    const unseenNotification = user.unseenNotification;
     unseenNotification.push({
        type: "new-testdrive-request-changed",
        message: `${testdrive.customer_name}  test drive status is ${status}`,
         onClickPath : "/notifications",
     })
     await userModel.findByIdAndUpdate(user._id, { unseenNotification });
      
     // Get the guard
     const guard = await userModel.findOne({ isGuard: true, isAdmin: false });
     const guardUnseenNotification = guard.unseenNotification;
     guardUnseenNotification.push({
        type: "new-testdrive-request-changed",
        message: `${testdrive.customer_name}  test drive status is ${status}`,
         onClickPath : "/notifications",
     })
     await userModel.findByIdAndUpdate(guard._id, { unseenNotification: guardUnseenNotification });




     res.status(200).send({
      message: "status updated successfully",
      success: true,
      data: testdrive,
     })
  } catch (error) {
      
      res.status(500).send({
          message: 'Status updation failed',
          success:false,
          error
      });
  }
});

module.exports = router;