const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
   {
       name: {
             type:String,
             required: true
           },
       email: {
              type:String,
              required: true
           },
   password: {
             type:String,
             required: true
        },
        isGuard: {
          type:Boolean,
          default: true,
    },
     isAdmin:{
          type:Boolean,
          default: false,
        },

       isSalesExecutive: {
         type:Boolean,
         default: true,
        },

        seenNotification:{
            type:Array,
            default:[]
        },
        unseenNotification:{
          type:Array,
          default:[]
      }
      
         },
        { 
          timestamps: true
        }
       
);

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;