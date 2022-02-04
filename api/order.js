const express = require('express');
const db = require("../models");
const router = express.Router();

router.post("/addOrder", (req, res) => {
    try{
        db.Order.create({
            product_id: req.body.product_id,
            total:req.body.total,
            stripe_id:req.body.stripe_id,
            status:req.body.status
        }).then(AddedOrder => res.send(AddedOrder))
    }
    catch(e){
        console.log(e);
        res.status(500).send(e);
    }
})

module.exports = router;