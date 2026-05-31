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

    <button
      class="checkout-btn"
      id="placeOrderBtn"
      style="
        width:100%;
        margin-top:10px;
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

        payment_method: "COD",
      };

      try {
        const response = await fetch(
          "http://https://brainrush-backend.onrender.com/api/orders",

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
          showToast("Order placed! Thank you 😊");

          localStorage.removeItem("brainrushCart");

          cart = [];

          updateCartCount();

          overlay.remove();
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

    const whatsappURL = `https://api.whatsapp.com/send?phone=917814296292&text=${encodeURIComponent(message)}`;

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