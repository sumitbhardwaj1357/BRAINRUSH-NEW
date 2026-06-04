let cart = JSON.parse(localStorage.getItem("brainrushCart")) || [];

/* ========================= */
/* UPDATE CART COUNT */
/* ========================= */

function updateCartCount() {
  document.querySelectorAll("#cartCount").forEach((el) => {
    el.innerText = cart.reduce(
      (sum, item) => sum + (item.qty || 1),

      0,
    );
  });
}

updateCartCount();

/* ========================= */
/* FLAVOR BUTTONS */
/* ========================= */

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("flavor-btn")) {
    const parent = e.target.closest(".flavor-options");

    if (!parent) return;

    parent.querySelectorAll(".flavor-btn").forEach((btn) => {
      btn.classList.remove("active-flavor");
    });

    e.target.classList.add("active-flavor");
  }
});

/* ========================= */
/* QUANTITY */
/* ========================= */

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("qty-btn")) return;

  const section = e.target.closest(".product-card, .bestseller");

  if (!section) return;

  const qtyEl = section.querySelector(".qty-number");

  let qty = parseInt(qtyEl.innerText) || 1;

  if (e.target.dataset.action === "plus") {
    qty++;
  }

  if (e.target.dataset.action === "minus") {
    qty = Math.max(1, qty - 1);
  }

  qtyEl.innerText = qty;
});

/* ========================= */
/* ADD TO CART */
/* ========================= */

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("add-cart-btn")) return;

  const card = e.target.closest(".product-card, .bestseller");

  if (!card) return;

  const name = card.querySelector("h2")?.innerText || "BRAINRUSH";

  const price = card.querySelector(".new-price")?.innerText || "Rs 1600";

  const flavor = card.querySelector(".active-flavor")?.innerText || "Default";

  const qty = parseInt(card.querySelector(".qty-number")?.innerText) || 1;

  const existing = cart.find(
    (item) => item.name === name && item.flavor === flavor,
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      name,
      price,
      flavor,
      qty,
    });
  }

  localStorage.setItem(
    "brainrushCart",

    JSON.stringify(cart),
  );

  updateCartCount();

  showToast("Added To Cart");
});

/* ========================= */
/* CART BUTTON */
/* ========================= */

const cartBtn = document.getElementById("cartBtn");

if (cartBtn) {
  cartBtn.addEventListener("click", openCartModal);
}

/* ========================= */
/* CART MODAL */
/* ========================= */

function openCartModal() {
  if (cart.length === 0) {
    showToast("Cart Is Empty");

    return;
  }

  document.querySelector(".cart-modal")?.remove();

  const total = cart.reduce(
    (sum, item) => {
      const price = parseInt(item.price.replace(/\D/g, "")) || 0;

      return sum + price * item.qty;
    },

    0,
  );

  let itemsHTML = "";

  cart.forEach((item, index) => {
    const itemPrice = parseInt(item.price.replace(/\D/g, "")) || 0;

    const itemTotal = itemPrice * item.qty;

    itemsHTML += `

      <div
        class="cart-item"
        style="
          background:#101010;
          border-radius:18px;
          padding:18px 20px;
          margin-bottom:16px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
        "
      >

        <div>

          <h3
            style="
              color:#fff;
              margin-bottom:6px;
              font-size:24px;
              font-weight:700;
            "
          >

            ${item.name}

          </h3>

          <p
            style="
              color:#888;
              font-size:15px;
              margin-bottom:8px;
            "
          >

            Flavor:
            ${item.flavor}

          </p>

          <p
            style="
              color:#ff2b2b;
              font-weight:700;
              font-size:17px;
            "
          >

            Rs ${itemPrice}
            ×
            ${item.qty}
            =
            Rs ${itemTotal}

          </p>

        </div>

        <button
          class="remove-cart-item"
          data-index="${index}"
          style="
            background:none;
            border:none;
            color:#ff2b2b;
            font-size:17px;
            cursor:pointer;
            font-weight:700;
          "
        >

          Remove

        </button>

      </div>

    `;
  });

  const modal = document.createElement("div");

  modal.classList.add("cart-modal");

  modal.innerHTML = `

    <div
      class="cart-content"
      style="
        width:100%;
        max-width:520px;
        background:#050505;
        border-radius:26px;
        padding:28px;
        border:1px solid #1b1b1b;
      "
    >

      <div
        class="cart-header"
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:22px;
        "
      >

        <h2
          style="
            color:#fff;
            font-size:34px;
            font-family:'Oswald',sans-serif;
            margin:0;
          "
        >

          My Cart

        </h2>

        <button
          class="close-cart"
          style="
            width:54px;
            height:54px;
            border:none;
            border-radius:50%;
            background:#ff2020;
            color:#fff;
            font-size:24px;
            cursor:pointer;
          "
        >

          ✕

        </button>

      </div>

      <div
        style="
          border-top:1px solid #222;
          padding-top:24px;
        "
      >

        ${itemsHTML}

      </div>

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-top:24px;
          margin-bottom:20px;
        "
      >

        <h3
          style="
            color:#fff;
            font-size:34px;
            margin:0;
          "
        >

          Total:
          Rs ${total}

        </h3>

      </div>

     <button
  type="button"
  class="checkout-btn"
  id="proceedToCheckout"
        style="
          width:100%;
          padding:15px;
          border:none;
          border-radius:18px;
          background:#ff1a1a;
          color:#fff;
          font-size:20px;
          font-weight:700;
          cursor:pointer;
        "
      >

        Proceed To Pay

      </button>

    </div>

  `;

  document.body.appendChild(modal);

  modal.querySelectorAll(".remove-cart-item").forEach((btn) => {
    btn.addEventListener(
      "click",

      () => {
        const index = parseInt(btn.dataset.index);

        cart.splice(index, 1);

        localStorage.setItem(
          "brainrushCart",

          JSON.stringify(cart),
        );

        modal.remove();

        updateCartCount();

        openCartModal();
      },
    );
  });
  const proceedBtn = modal.querySelector("#proceedToCheckout");

  if (proceedBtn) {
    proceedBtn.addEventListener(
      "click",

      (e) => {
        e.preventDefault();

        modal.remove();

        openCheckoutModal();
      },
    );
  }

  modal.querySelector(".close-cart").addEventListener(
    "click",

    () => modal.remove(),
  );
}

/* ========================= */
/* CHECKOUT MODAL */
/* ========================= */

function openCheckoutModal() {
  const overlay = document.createElement("div");

  overlay.classList.add("cart-modal");

  overlay.innerHTML = `

  <div
    class="cart-content"
    style="
      width:100%;
      max-width:520px;
      background:#0d0d0d;
      border:1px solid #222;
      border-radius:28px;
      padding:40px 35px;
      display:flex;
      flex-direction:column;
      gap:18px;
      box-shadow:0 0 40px rgba(255,0,0,0.15);
      max-height:90vh;
      overflow-y:auto;
    "
  >

    <div
      style="
        display:flex;
        justify-content:space-between;
        align-items:center;
      "
    >

      <h2
        style="
          color:#fff;
          font-size:34px;
          font-family:'Oswald',sans-serif;
          margin:0;
        "
      >

        Checkout

      </h2>

      <button
        id="closeCheckoutModal"
        style="
          width:42px;
          height:42px;
          border:none;
          border-radius:50%;
          background:#1a1a1a;
          color:#fff;
          font-size:18px;
          cursor:pointer;
        "
      >

        ✕

      </button>

    </div>

    <p
      style="
        color:#888;
        margin-top:-8px;
        font-size:14px;
      "
    >

      Enter delivery details below

    </p>

    <input
      id="ckName"
      placeholder="Full Name"
      style="
        width:100%;
        padding:18px;
        border:none;
        border-radius:16px;
        background:#161616;
        color:#fff;
        font-size:15px;
        outline:none;
      "
    >

    <input
      id="ckPhone"
      placeholder="Phone Number"
      style="
        width:100%;
        padding:18px;
        border:none;
        border-radius:16px;
        background:#161616;
        color:#fff;
        font-size:15px;
        outline:none;
      "
    >

    <input
      id="ckCity"
      placeholder="City"
      style="
        width:100%;
        padding:18px;
        border:none;
        border-radius:16px;
        background:#161616;
        color:#fff;
        font-size:15px;
        outline:none;
      "
    >

    <textarea
      id="ckAddress"
      placeholder="Full Address"
      rows="4"
      style="
        width:100%;
        padding:18px;
        border:none;
        border-radius:16px;
        background:#161616;
        color:#fff;
        font-size:15px;
        outline:none;
        resize:none;
      "
    ></textarea>

    <!-- PAYMENT METHOD SELECTION -->
    <p style="color:#aaa; font-size:14px; margin-bottom:-8px;">Select Payment Method</p>

    <div style="display:flex; gap:12px;">

      <button
        id="btnCOD"
        style="
          flex:1;
          padding:16px;
          border:2px solid #ff1010;
          border-radius:16px;
          background:#ff1010;
          color:#fff;
          font-size:16px;
          font-weight:700;
          cursor:pointer;
        "
      >
        Cash on Delivery
      </button>

      <button
        id="btnUPI"
        style="
          flex:1;
          padding:16px;
          border:2px solid #333;
          border-radius:16px;
          background:#161616;
          color:#aaa;
          font-size:16px;
          font-weight:700;
          cursor:pointer;
        "
      >
        UPI / QR Pay
      </button>

    </div>

    <!-- UPI QR SECTION (hidden by default) -->
    <div
      id="upiSection"
      style="
        display:none;
        flex-direction:column;
        align-items:center;
        gap:14px;
        background:#111;
        border:1px solid #2a2a2a;
        border-radius:18px;
        padding:24px;
        text-align:center;
      "
    >

      <p style="color:#fff; font-size:15px; font-weight:600; margin:0;">
        Scan QR Code to Pay
      </p>

      <!-- REPLACE src below with your actual QR image path e.g. "upi-qr.png" -->
      <img
        src="QR.jpeg"
        alt="UPI QR Code"
        style="
          width:200px;
          height:200px;
          border-radius:12px;
          border:2px solid #333;
          object-fit:contain;
          background:#fff;
          padding:8px;
        "
        onerror="this.style.background='#1a1a1a'; this.alt='QR Code Placeholder'; this.src=''; this.style.display='flex';"
      />

      <p style="color:#aaa; font-size:13px; margin:0; line-height:1.6;">
        After payment, send your <strong style="color:#fff;">Transaction ID</strong> + Screenshot to WhatsApp
      </p>

      <a
        id="upiWhatsappBtn"
        href="#"
        target="_blank"
        style="
          display:inline-block;
          background:#25D366;
          color:#fff;
          font-weight:700;
          font-size:15px;
          padding:14px 28px;
          border-radius:14px;
          text-decoration:none;
          width:100%;
          box-sizing:border-box;
        "
      >
        Share Transaction ID on WhatsApp
      </a>

    </div>

    <button
      class="checkout-btn"
      id="placeOrderBtn"
      style="
        width:100%;
        margin-top:4px;
        padding:18px;
        border:none;
        border-radius:18px;
        background:#ff1010;
        color:#fff;
        font-size:20px;
        font-weight:700;
        cursor:pointer;
      "
    >
      Place Order
    </button>

  </div>

`;

  document.body.appendChild(overlay);

  /* ---- PAYMENT METHOD TOGGLE ---- */
  let selectedPayment = "COD";

  const btnCOD = overlay.querySelector("#btnCOD");
  const btnUPI = overlay.querySelector("#btnUPI");
  const upiSection = overlay.querySelector("#upiSection");

  function selectCOD() {
    selectedPayment = "COD";
    btnCOD.style.background = "#ff1010";
    btnCOD.style.borderColor = "#ff1010";
    btnCOD.style.color = "#fff";
    btnUPI.style.background = "#161616";
    btnUPI.style.borderColor = "#333";
    btnUPI.style.color = "#aaa";
    upiSection.style.display = "none";
  }

  function selectUPI() {
    selectedPayment = "UPI";
    btnUPI.style.background = "#ff1010";
    btnUPI.style.borderColor = "#ff1010";
    btnUPI.style.color = "#fff";
    btnCOD.style.background = "#161616";
    btnCOD.style.borderColor = "#333";
    btnCOD.style.color = "#aaa";
    upiSection.style.display = "flex";

    // Build WhatsApp message with order total
    const total = "Rs " + cart.reduce((sum, item) => {
      return sum + (parseInt(item.price.replace(/\D/g, "")) || 0) * item.qty;
    }, 0);

    const upiMsg = `Hi, I completed UPI payment for my BRAINRUSH order.\n\nOrder Total: ${total}\n\nTransaction ID: [PASTE HERE]\n\n[Please attach screenshot]`;

    // TODO: Replace 91XXXXXXXXXX with your actual UPI WhatsApp number
    overlay.querySelector("#upiWhatsappBtn").href =
      `https://api.whatsapp.com/send?phone=917888309962&text=${encodeURIComponent(upiMsg)}`;
  }

  btnCOD.addEventListener("click", selectCOD);
  btnUPI.addEventListener("click", selectUPI);

  /* ---- CLOSE BUTTON ---- */
  overlay.querySelector("#closeCheckoutModal").addEventListener("click", () => overlay.remove());

  /* ---- UPI WAITING SCREEN ---- */
  function showUPIWaitingScreen(orderId) {
    overlay.remove();

    const waitOverlay = document.createElement("div");
    waitOverlay.classList.add("cart-modal");
    waitOverlay.id = "upiWaitOverlay";

    waitOverlay.innerHTML = `
      <div style="
        width:100%;
        max-width:420px;
        background:#0d0d0d;
        border:1px solid #222;
        border-radius:28px;
        padding:40px 32px;
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:20px;
        text-align:center;
        box-shadow:0 0 40px rgba(255,0,0,0.15);
      ">

        <div id="upiWaitIcon" style="font-size:52px;">⏳</div>

        <h2 id="upiWaitTitle" style="
          color:#fff;
          font-family:'Oswald',sans-serif;
          font-size:28px;
          margin:0;
        ">Waiting for Confirmation...</h2>

        <p id="upiWaitMsg" style="
          color:#888;
          font-size:14px;
          line-height:1.7;
          margin:0;
        ">
          Share your Transaction ID + Screenshot on WhatsApp.<br>
          We'll confirm your payment shortly.
        </p>

        <div id="upiCountdownWrap" style="color:#555; font-size:13px;">
          Auto-closing in <span id="upiCountdown">60</span>s
        </div>

      </div>
    `;

    document.body.appendChild(waitOverlay);

    let seconds = 60;
    let confirmed = false;

    // Poll backend every 5s to check if admin confirmed
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`https://brainrush-backend.onrender.com/api/orders`);
        const orders = await res.json();
        const thisOrder = orders.find(o => String(o.id) === String(orderId));

        if (thisOrder && (thisOrder.status === "Processing" || thisOrder.status === "Shipped" || thisOrder.status === "Delivered")) {
          confirmed = true;
          clearInterval(pollInterval);
          clearInterval(countdownInterval);

          document.getElementById("upiWaitIcon").innerText = "✅";
          document.getElementById("upiWaitTitle").innerText = "Payment Confirmed!";
          document.getElementById("upiWaitTitle").style.color = "#25D366";
          document.getElementById("upiWaitMsg").innerText = "Your order has been placed successfully. Thank you! 😊";
          document.getElementById("upiCountdownWrap").style.display = "none";

          setTimeout(() => {
            waitOverlay.remove();
          }, 3000);
        }
      } catch (err) {
        console.log("Polling error:", err);
      }
    }, 5000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      seconds--;
      const el = document.getElementById("upiCountdown");
      if (el) el.innerText = seconds;

      if (seconds <= 0) {
        clearInterval(countdownInterval);
        clearInterval(pollInterval);

        if (!confirmed) {
          document.getElementById("upiWaitIcon").innerText = "🎉";
          document.getElementById("upiWaitTitle").innerText = "Order Placed!";
          document.getElementById("upiWaitTitle").style.color = "#fff";
          document.getElementById("upiWaitMsg").innerText = "We'll verify your UPI payment and process your order shortly.";
          document.getElementById("upiCountdownWrap").style.display = "none";

          setTimeout(() => {
            waitOverlay.remove();
          }, 2500);
        }
      }
    }, 1000);
  }

  /* ---- PLACE ORDER ---- */
  document.getElementById("placeOrderBtn").addEventListener(
    "click",

    async () => {
      const name = document.getElementById("ckName").value.trim();

      const phone = document.getElementById("ckPhone").value.trim();

      const city = document.getElementById("ckCity").value.trim();

      const address = document.getElementById("ckAddress").value.trim();

      /* VALIDATION */

      if (!name || !phone || !city || !address) {
        showToast("Please fill all details");

        return;
      }

      /* PHONE VALIDATION */

      if (phone.length < 10) {
        showToast("Enter valid phone number");

        return;
      }

      const orderData = {
        customer_name: name,

        phone: phone,

        city: city,

        address: address,

        items: cart,

        total:
          "Rs " +
          cart.reduce(
            (sum, item) => {
              return (
                sum + (parseInt(item.price.replace(/\D/g, "")) || 0) * item.qty
              );
            },

            0,
          ),

        payment_method: selectedPayment,
      };

      try {
        const response = await fetch(
          "https://brainrush-backend.onrender.com/api/orders",

          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(orderData),
          },
        );

        const data = await response.json();

        if (response.ok) {
          localStorage.removeItem("brainrushCart");

          cart = [];

          updateCartCount();

          if (selectedPayment === "UPI") {
            // Open WhatsApp then show waiting screen
            const orderId = data.id || data.order?.id || data.orderId || "";
            const total = orderData.total;
            const upiMsg = `Hi, I completed UPI payment for my BRAINRUSH order.\n\nOrder Total: ${total}\nOrder ID: ${orderId}\n\nTransaction ID: [PASTE HERE]\n\n[Please attach screenshot]`;
            // TODO: Replace 91XXXXXXXXXX with your actual UPI WhatsApp number
            window.open(`https://api.whatsapp.com/send?phone=917888309962&text=${encodeURIComponent(upiMsg)}`, "_blank");
            showUPIWaitingScreen(orderId);
          } else {
            showToast("Order placed! Thank you 😊");
            overlay.remove();
          }
        } else {
          showToast(data.message);
        }
      } catch (err) {
        console.log(err);

        showToast("Order Failed");
      }
    },
  );
}

/* ========================= */
/* TOAST */
/* ========================= */

function showToast(message) {
  const toast = document.createElement("div");

  toast.className = "toast";

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}
/* ========================= */
/* WHATSAPP ORDER */
/* ========================= */

document.addEventListener("click", (e) => {
  if (e.target.id === "whatsappOrderBtn") {
    const flavor =
      document.querySelector(".active-flavor")?.innerText || "Default";

    const qty = document.querySelector(".qty-number")?.innerText || "1";

    const message = `Hi, I want to place an order.

Product: BRAINRUSH PRE-WORKOUT
Flavor: ${flavor}
Quantity: ${qty}`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=917888309962&text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  }
});

/* CLOSE CHECKOUT MODAL */

document.addEventListener(
  "click",

  (e) => {
    if (e.target.id === "closeCheckoutBtn") {
      const checkoutModal = document.querySelector(".checkout-modal");

      if (checkoutModal) {
        checkoutModal.classList.remove("active");
      }
    }
  },
);


emailjs.init("J9619UMm5AxAg8gqh");

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const params = {
    customer_name: document.getElementById("contactName").value,
    customer_phone: document.getElementById("contactPhone").value,
    customer_email: document.getElementById("contactEmail").value,
    customer_address: document.getElementById("contactSubject").value + " - " + document.getElementById("contactMessage").value,
  };

  emailjs.send("service_licl3s4", "template_4q5wtdy", params)
    .then(() => {
      alert("Message sent! We'll get back to you soon.");
      document.getElementById("contactForm").reset();
    })
    .catch((err) => {
      console.error(err);
      alert("Something went wrong. Please try again.");
    });
});

// QUICK VIEW
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("quick-view-btn")) {
    document.getElementById("productModal").style.display = "flex";
  }
});

// CLOSE MODAL
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("close-modal") ||
    e.target.id === "productModal"
  ) {
    document.getElementById("productModal").style.display = "none";
  }
});

// QUICK VIEW OPEN
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("quick-view-btn")) {
    document.getElementById("productModal").style.display = "flex";
  }
});

// QUICK VIEW CLOSE
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("close-modal") ||
    e.target.id === "productModal"
  ) {
    document.getElementById("productModal").style.display = "none";
  }
});
