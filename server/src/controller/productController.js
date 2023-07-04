const productModel = require("../model/productModel");

const createProduct = async (req, res) => {
    try {
        let data = req.body;

        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: "Please enter data" });
        const { name, price, unit, catagory, subcatagory, discountOnCatagory, discountOnSubcatagory, discount } = data

        const refDataOnSubcatagory = await productModel.findOne({ subcatagory: subcatagory, catagory: catagory })
        let isNewCatagory = false;
        let isNewSubcatagory = false;
        if (refDataOnSubcatagory) {
            data.discountOnCatagory = refDataOnSubcatagory.discountOnCatagory
            data.discountOnSubcatagory = refDataOnSubcatagory.discountOnSubcatagory
        } else {
            isNewSubcatagory = true;
            if (discountOnSubcatagory && discountOnSubcatagory.value) {
                data.discountOnSubcatagory.type = "percentage";
                data.discountOnSubcatagory.buy = null;
                data.discountOnSubcatagory.get = null
            }
            else if (discountOnSubcatagory && discountOnSubcatagory.get) {
                data.discountOnSubcatagory.type = "buy-get";
                data.discountOnSubcatagory.value = null;
            }
            else { data.discountOnSubcatagory == null }

            const refDataOnCatagory = await productModel.findOne({ catagory: catagory });

            if (refDataOnCatagory) {
                data.discountOnCatagory = refDataOnCatagory.discountOnCatagory
            } else {
                isNewCatagory = true;
                if (discountOnCatagory && discountOnCatagory.value) {
                    data.discountOnCatagory.type = "percentage";
                    data.discountOnCatagory.buy = null;
                    data.discountOnCatagory.get = null;
                }
                else if (discountOnCatagory && discountOnCatagory.get) {
                    data.discountOnCatagory.type = "buy-get";
                    data.discountOnCatagory.value = null;
                }
                else {
                    data.discountOnCatagory = null;
                }
            }



        }
        data.unit = unit == 1 ? "piece" : unit > 1 ? `${unit} pieces` : unit;
        if (discount && discount.get) {
            data.discount.type = "buy-get";
            data.discount.value = null;
        }
        else if (discount) {
            data.discount.type = "percentage";
            if (!discount.value) data.discount.value = 0;
            data.discount.buy = null;
            data.discount.get = null;
        } else {
            data.discount = null;
        }

        const createdproduct = await productModel.create(data)
        return res.status(201).send({ status: true, message: `${createdproduct.name} Created successfully`, isNewCatagory, isNewSubcatagory, data: createdproduct })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


const updateProducts = async (req, res) => {
    try {
        let query = req.query;
        let data = req.body;
        let keys = Object.keys(data);
        if (!keys.length) return res.status(400).send({ status: false, message: "Please enter data to update" });

        if(data.unit) data.unit = unit == 1 ? "piece" : unit > 1 ? `${unit} pieces` : unit;
        
        if (data.discount && data.discount.get) {
            data.discount.type = "buy-get";
            data.discount.value = null;
        }
        else if (data.discount) {
            data.discount.type = "percentage";
            if (!data.discount.value) data.discount.value = 0;
            data.discount.buy = null;
            data.discount.get = null;
        }
        const updated = await productModel.updateMany({ ...query }, { ...data })

        const count = updated.modifiedCount;

        if (count == 0) return res.status(404).send({ status: false, message: "No document found to update" });

        let message = `${keys[0]} is Upadated Successfully in ${count} document${count > 1 ? "s" : ""}`;

        if (keys.length > 1) { message = `${keys} fields are Upadated Successfully in ${count} document${count > 1 ? "s" : ""}` }

        return res.status(200).send({ status: true, message: message })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


let getproducts = async function (req, res) {
    try {
        const filters = req.query
        const finalFilters = {};

        const { name, price, unit, catagory, subcatagory, priceGreaterThan, priceLessThan, priceSort } = filters
        if (name) {
            finalFilters.name = { $regex: `.*${name.trim()}.*`, $options: "i" }
        }
        if (price) {
            finalFilters.price = price
        }
        if (unit) {
            finalFilters.unit = unit
        }
        if (catagory) {
            finalFilters.catagory = catagory
        }
        if (subcatagory) {
            finalFilters.subcatagory = subcatagory
        }
        if (priceLessThan) {
            finalFilters.price = { $lte: priceLessThan }
        }
        if (priceGreaterThan) {
            finalFilters.price = { $gte: priceGreaterThan }
        }
        if (priceLessThan && priceGreaterThan) {
            finalFilters.price = { $lte: priceLessThan, $gte: priceGreaterThan }
        }

        let allProducts = [];

        if (priceSort) {
            allProducts = await productModel.find(finalFilters).select({ __v: 0 }).sort({ price: +priceSort })
        }
        else {
            allProducts = await productModel.find(finalFilters).select({ __v: 0 })
        }
        if (allProducts.length == 0) return res.status(404).send({ status: false, message: "Product not Found with this query" })

        return res.status(200).send({ status: true, message: `${allProducts.length} document${allProducts.length > 1 ? "s" : ""} found`, data: allProducts })
    }

    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


const getBills = async (req, res) => {
    try {
        let customerName = req.params.customerName;
        let items = req.query
        // items = { apple: 5, cowMilk: 2 }
        let itemNames = Object.keys(items);

        const result = await productModel.find({ name: { $in: itemNames } });

        // Process the fetched data and generate the invoice
        let totalAmount = 0;
        let savedAmount = 0;
        let invoice = `Customer: ${customerName}\n\nItem       Qty  Amount\n---------------------------------\n`;

        for (const item of result) {
            const quantity = items[item.name];
            const amount = item.price * quantity;
            const itemDiscount = calculateDiscount(item.discount, quantity, item.price);
            const catagoryDiscount = calculateDiscount(item.discountOnCatagory, quantity, item.price);
            const subcatagoryDiscount = calculateDiscount(item.discountOnSubcatagory, quantity, item.price);
            const discount = Math.max(itemDiscount, catagoryDiscount, subcatagoryDiscount);
            const discountedAmount = amount - discount;

            totalAmount += discountedAmount;
            savedAmount += discount;

            invoice += `${item.name} ${quantity}${item.unit} ${discountedAmount.toFixed(2)}\n`;
        }

        invoice += '---------------------------------\n';
        invoice += `Total Amount:    ${totalAmount.toFixed(2)} Rs\n\n`;
        invoice += `You saved: ${savedAmount.toFixed(2)} Rs`;

        function calculateDiscount(discountObj, quantity, itemPrice) {
            let discount = 0;

            if (discountObj) {
                if (discountObj.type === 'percentage') {
                    discount = (itemPrice * quantity * discountObj.value) / 100;
                } else if (discountObj.type === 'buy-get') {
                    const buyQuantity = discountObj.buy;
                    const getQuantity = discountObj.get;
                    const sets = Math.floor(quantity / (buyQuantity + getQuantity));
                    discount = itemPrice * sets * getQuantity;
                }
            }
            return discount;
        }
        console.log(invoice)
        // Send the invoice as the response
        return res.status(200).send(invoice);

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createProduct, updateProducts, getproducts, getBills }