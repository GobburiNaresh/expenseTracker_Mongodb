const Razorpay = require("razorpay");
const Order = require("../models/orders");


const purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,

        });
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            console.log(order);
            if (err) {
                console.error("Razorpay Error:", err);
                return res.status(500).json({ message: "Razorpay Error", error: err });
            }

            try {
                console.log('user===>>',req.user);
                await Order.create({ orderDetailid: order.id,userDetailId:req.user.id, status: 'pending' });
                console.log('Order created:', order);

                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: "Database Error", error: err });
            }
        });
    } catch (err) {
        console.error("General Error:", err);
        res.status(500).json({ message: "Something Went Wrong", error: err });
    }
}

const updateTransactionStatus = async (req, res) => {
   console.log(" In updatepurchasePremium")
    try {
        const userId = req.user.id;
        console.log('1--->id',userId)
        const { payment_id, order_id } = req.body;
        console.log('2',{ payment_id, order_id });
        const order =await Order.findOne({where: {orderDetailid: order_id}});
        const p1 = order.update({
            paymentid: payment_id,
            status: "SuccesFul"
        },{
            where:{
                orderid: order_id
            }
        });
        const p2 = req.user.update({
            ispremimuser: true
        })

        Promise.all([p1, p2]).then(() => {
            return res.status(202).json({
                succes: true,
                message: "Transtaion Succes"
            })
        }).catch((err) => {
            console.log(err);
            throw new Error
        })
    } catch (err) {
        console.log(err)
        console.log("updatepurchasePremium error");
        res.status(403).json({
            err: err,
            message: "Something Went wrong"
        })
    }

}


module.exports = {
      purchasePremium,
      updateTransactionStatus
}
