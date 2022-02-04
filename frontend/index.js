let currentProductID = 0;

let products = [];
let detailProduct;


async function renderProducts() {
  await fetch("http://localhost:3000/api/all")
    .then((response) => response.json())
    .then((json) => {
      products = data = json;
      return (data = json);
    });
  // productrow = document.getElementById
  let html = "";
  data.forEach((product, i) => {
    let myId = product.id;
    const table = `<tr class="singleRow">
    <th scope="row">${i + 1}</th>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td><img src="${product.image}" width="100px" /></td>
    <td>
    <button href="${myId}" type="button" class="btn btn-primary"  onclick=myClick("${myId}") data-toggle="modal" data-target="#details_modal">
         Details  
    </button>
    </td>
    </tr>`;
    // onClick=myClick("${myId}")
    html += table;
  });

  let productsRow = document.querySelector(".products-row");
  productsRow.innerHTML = html;
}

const myClick = (id) => {
  console.log("clicked", id);
  currentProductID = id;
  detailProduct = products.filter(p => p.id == id)[0];
  console.log("dp", detailProduct );
  const dTitle = document.getElementById('detail-title');
  const productdesc = document.getElementById('product-desc');
  const productprice = document.getElementById('detail_price');
  const productimg = document.getElementById('detail_img');

  dTitle.innerText = detailProduct.name;
  productdesc.innerText = detailProduct.desc;
  productprice.innerText = detailProduct.price;
  productimg.innerHTML = `
  <img src="${detailProduct.image}" />
  `;
  
initialize();
checkStatus();

};

const stripe = Stripe(
  "pk_test_51IWQUwH8oljXErmdg6L4MhsuB6tDdmumlHFfyNaopty2U27pmRcqMX1c868zn838lGQtU1eYV6bKRSQtMFWf36VT00aNsvnTOE"
);

// The items the customer wants to buy
const items = [{ id: "xl-tshirt" }];

let elements;


document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch("http://localhost:3000/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ detailProduct }),
  });
  const { clientSecret } = await response.json();

  const appearance = {
    theme: "stripe",
  };
  elements = stripe.elements({ appearance, clientSecret });
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  // ORDER API
  await fetch("http://localhost:3000/api/all")
    .then((response) => response.json())
    .then((json) => {
      return (data = json);
    });

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "http://127.0.0.1:5500/frontend/thankyou.html",
    },
  });
  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occured.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}
