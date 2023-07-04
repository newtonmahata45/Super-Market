const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({

    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true },
    unit: String,
    catagory: String,
    subcatagory: String,
    discount: {
        type: { type: String, enum: ["percentage", "buy-get"], default: "percentage" },
        value: { type: Number, default: null },
        buy: { type: Number, default: null },
        get: { type: Number, default: null },
    },
    discountOnCatagory: {
        type: { type: String, enum: ["percentage", "buy-get"], default: "percentage" },
        value: { type: Number, default: null },
        buy: { type: Number, default: null },
        get: { type: Number, default: null }
    },
    discountOnSubcatagory: {
        type: { type: String, enum: ["percentage", "buy-get"], default: "percentage" },
        value: { type: Number, default: null },
        buy: { type: Number, default: null },
        get: { type: Number, default: null },
    }
}, { timestamps: true })

module.exports = mongoose.model("product", productSchema)