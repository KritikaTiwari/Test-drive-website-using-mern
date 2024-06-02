const mongoose = require('mongoose');

const testdriveSchema = new mongoose.Schema(
    {
        userId: {
            type:String,
            required:true
        },
       customer_name: {
            type:String,
            required: true
        },
        date:{
            type:String,
            required: true
        },
        time: {
            type: Array,
            required: true
        },
        vehicle_name:{
            type:String,
            required: true
        },
        vehicle_no:{
            type:String,
            required: true
        },
        chassis_no:{
            type:String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        kms_out: {
            type: Number,
            required: true
        },
        kms_in: {
            type: Number,
            required:true
        },
        company_name: {
            type: String,
            required: true
        },
        brand_name: {
            type: String,
            required: true
        },
        purpose: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: "pending",
        }
    },
    {timestamps: true }
);

const testdriveModel = mongoose.model("testdrive",testdriveSchema );

module.exports = testdriveModel;