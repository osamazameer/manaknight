const express = require('express');
const router = express.Router();
const db = require('../models');
// const products = require('../models/products');

router.get("/all", (req, res) =>{
    try{
        db.Product.findAll().then(
            products => res.send(products)
        );
    }
    catch(e){
        console.log(e);
        res.status(500).send(e);
    }
});

router.get("/product/:id", (req, res) =>{
    try{
        db.Product.findAll({
            where:{
                id: req.params.id,
            }
        }).then(
            product => res.send(product)
            )
    }
    catch(e){
        console.log(e);
        res.status(500).send(e);
    }
});

router.post("/add", (req,res) =>{
    try{
        db.Product.create({
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            image: req.body.image,
        }).then(AddedProduct => res.send(AddedProduct))
    }   
    catch(e){
        console.log(e);
        res.status(500).send(e);
    }
})
module.exports = router;

