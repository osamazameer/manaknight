const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = 3000 || process.env.port;

const Product = require("./api/product");
app.use("/api", Product);

const stripe = require("stripe")(
  "sk_test_51IWQUwH8oljXErmds28KftkL6o6jYIcPgYbBdfEmCPSuAlIh0fgoS4NADcCmsIZbdQ3p5nbAeCOcGkSmo38U9BIe00BdOenrqo"
);

const calculateOrderAmount = (items) => {
  // Replace this  with a calculation of the order's amount
  // Calculate the ordeconstantr total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { detailProduct } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount:1000,
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  // SAVE ORDER
  await  db.Order.create({
            product_id: detailProduct.id,
            total:1000,
            stripe_id:paymentIntent.id,
            status: paymentIntent.status || false
        })

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("Successful Connection");
  });
});
