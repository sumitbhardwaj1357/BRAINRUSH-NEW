/* ========================= */
/* BRAINRUSH ADMIN PANEL JS  */
/* ========================= */

/* ========================= */
/* AUTH CHECK */
/* ========================= */

console.log("FUNCTION RUNNING");

const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
  window.location.href = "login.html";
}

/* ========================= */
/* ELEMENTS */
/* ========================= */

const logoutBtn = document.getElementById("logoutBtn");

const productModal = document.getElementById("productModal");

const openProductModalBtn = document.getElementById("openProductModal");

const closeProductModalBtn = document.getElementById("closeProductModal");

const productForm = document.querySelector(".product-form");

let editingProductId = null;

/* ========================= */
/* LOAD EVERYTHING */
/* ========================= */

window.addEventListener("load", () => {
  loadAll();
});

function loadAll() {
  updateDashboardStats();
  loadOrdersTable();
  loadProductsGrid();
}

/* ========================= */
/* LOGOUT */
/* ========================= */

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    showToast("Logged Out");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  });
}

/* ========================= */
/* SIDEBAR TABS */
/* ========================= */

document.querySelectorAll(".nav-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("active-admin-tab");
    });

    button.classList.add("active-admin-tab");

    document.querySelectorAll(".admin-tab").forEach((tab) => {
      tab.classList.remove("active-tab");
    });

    const targetTab = document.getElementById(button.dataset.tab);

    if (targetTab) {
      targetTab.classList.add("active-tab");
    }
  });
});

/* ========================= */
/* DASHBOARD STATS */
/* ========================= */

async function updateDashboardStats() {
  try {
    const response = await fetch("https://brainrush-backend.onrender.com/api/products");

    const products = await response.json();

    const ordersResponse = await fetch("http://https://brainrush-backend.onrender.com/api/orders");

    const orders = await ordersResponse.json();

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (parseInt((order.total || "").replace(/\D/g, "")) || 0);
    }, 0);

    const today = new Date().toLocaleDateString("en-IN");

    const todayOrders = orders.filter((order) => order.date === today).length;

    const el = (id) => document.getElementById(id);

    if (el("totalOrders")) {
      el("totalOrders").innerText = orders.length;
    }

    if (el("totalRevenue")) {
      el("totalRevenue").innerText =
        "Rs " + totalRevenue.toLocaleString("en-IN");
    }

    if (el("productsLive")) {
      el("productsLive").innerText = products.length;
    }

    if (el("todayOrders")) {
      el("todayOrders").innerText = todayOrders;
    }

    if (el("whatsappOrders")) {
      el("whatsappOrders").innerText = orders.length;
    }

    if (el("emailOrders")) {
      el("emailOrders").innerText = 0;
    }
  } catch (err) {
    console.log(err);
  }
}

/* ========================= */
/* LOAD ORDERS */
/* ========================= */

/* ========================= */
/* LOAD ORDERS */
/* ========================= */

async function loadOrdersTable() {
  const tableBody = document.getElementById("ordersTableBody");

  if (!tableBody) return;

  tableBody.innerHTML = `

    <tr>

      <td
        colspan="9"
        style="
          text-align:center;
          padding:30px;
        "
      >

        Loading...

      </td>

    </tr>

  `;

  try {
    const response = await fetch("https://brainrush-backend.onrender.com/api/orders");

    const orders = await response.json();

    tableBody.innerHTML = "";

    if (!orders.length) {
      tableBody.innerHTML = `

        <tr>

          <td
            colspan="9"
            style="
              text-align:center;
              padding:40px;
              color:#999;
            "
          >

            No orders found

          </td>

        </tr>

      `;

      return;
    }

    orders.forEach((order) => {
      const row = document.createElement("tr");

      const itemsText =
        order.items
          ?.map(
            (item) =>
              `${item.name}
               (${item.qty || 1})`,
          )
          .join(", ") || "—";

      row.innerHTML = `

        <td>
          ${order.order_code}
        </td>

        <td>
          ${order.customer_name}
        </td>

        <td>
          ${order.phone}
        </td>

        <td>
          ${order.city}
        </td>

        <td>
          ${itemsText}
        </td>

        <td>
          ${order.total}
        </td>

        <td>
          ${new Date(order.created_at).toLocaleDateString("en-IN")}
        </td>

        <td>

          <select class="status-select">

            <option
              ${order.status === "Received" ? "selected" : ""}
            >
              Received
            </option>

            <option
              ${order.status === "Processing" ? "selected" : ""}
            >
              Processing
            </option>

            <option
              ${order.status === "Shipped" ? "selected" : ""}
            >
              Shipped
            </option>

            <option
              ${order.status === "Delivered" ? "selected" : ""}
            >
              Delivered
            </option>

          </select>

        </td>

       <td>
  <button class="delete-order-btn">
    Delete
  </button>
</td>

      `;

      tableBody.appendChild(row);
      const deleteBtn = row.querySelector(".delete-order-btn");

deleteBtn.addEventListener("click", async () => {
  if (!confirm("Delete this order?")) return;

  try {
    const response = await fetch(
      `http://https://brainrush-backend.onrender.com/api/orders/${order.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Delete failed");
    }

 row.remove();

if (!tableBody.querySelector("tr")) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="9"
          style="text-align:center;padding:40px;color:#999;">
        No orders found
      </td>
    </tr>
  `;
}

updateDashboardStats();

    alert("Order Deleted");
  } catch (err) {
    console.error(err);
    alert("Delete Failed");
  }
});
      

      const statusSelect = row.querySelector(".status-select");

      statusSelect.addEventListener(
        "change",

        async () => {
          try {
            await fetch(
              `http://https://brainrush-backend.onrender.com/api/orders/${order.id}`,

              {
                method: "PUT",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  status: statusSelect.value,
                }),
              },
            );

            showToast("Status Updated");
          } catch (err) {
            console.log(err);

            showToast("Update Failed");
          }
        },
      );
    });
  } catch (err) {
    console.log(err);

    tableBody.innerHTML = `

      <tr>

        <td
          colspan="9"
          style="
            color:red;
            text-align:center;
            padding:40px;
          "
        >

          Failed to load orders

        </td>

      </tr>

    `;
  }
}
/* ========================= */
/* LOAD PRODUCTS */
/* ========================= */

async function loadProductsGrid() {
  const grid = document.querySelector(".admin-products-grid");

  const adminProductsGrid = document.getElementById("adminProductsGrid");

  if (!grid) return;

  grid.innerHTML = `

    <p style="color:#999;">
      Loading products...
    </p>

  `;

  try {
    const response = await fetch("https://brainrush-backend.onrender.com/api/products");

    const products = await response.json();

    grid.innerHTML = "";

    if (products.length === 0) {
      grid.innerHTML = `

        <p style="color:#999;">
          No products available.
        </p>

      `;

      return;
    }

    products.forEach((product) => {
      addProductCard(product);
    });

    attachProductEvents();
  } catch (err) {
    grid.innerHTML = `

      <p style="color:red;">
        Failed to load products
      </p>

    `;
  }
}

/* ========================= */
/* ADD PRODUCT CARD */
/* ========================= */

function addProductCard(product) {
  const grid = document.querySelector(".admin-products-grid");

  const card = document.createElement("div");

  card.classList.add("admin-product-card");

  card.dataset.productId = product.id;

  card.innerHTML = `

    <img
      src="${product.image || "hero-banner_png.png"}"
      alt="${product.name}"
    >

    <h3>
      ${product.name}
    </h3>

    <p>
      Rs ${product.price}
    </p>

    <div class="admin-product-actions">

      <button class="edit-btn">
        Edit
      </button>

      <button class="delete-btn">
        Delete
      </button>

    </div>

  `;

  grid.appendChild(card);
}

/* ========================= */
/* OPEN PRODUCT MODAL */
/* ========================= */

if (openProductModalBtn) {
  openProductModalBtn.addEventListener("click", () => {
    editingProductId = null;

    productForm.reset();

    productModal.classList.remove("hidden");
  });
}

/* ========================= */
/* CLOSE PRODUCT MODAL */
/* ========================= */

if (closeProductModalBtn) {
  closeProductModalBtn.addEventListener("click", () => {
    productModal.classList.add("hidden");
  });
}
/* ========================= */
/* FORM SUBMIT */
/* ========================= */

if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = productForm.querySelectorAll("input, textarea, select");

    const fileInput = productForm.querySelector("input[type=file]");

    const product = {
      name: inputs[0].value.trim(),

      price: inputs[1].value.trim(),

      old_price: inputs[2].value.trim(),

      category: inputs[3].value,

      badge: inputs[4].value,

      flavors: inputs[5].value.trim(),

      description: inputs[6].value.trim(),

      image: null,
    };

    if (!product.name || !product.price) {
      showToast("Product name and price required");

      return;
    }

    const file = fileInput.files[0];

    /* NEW IMAGE */

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        product.image = e.target.result;

        await saveOrUpdateProduct(product);
      };

      reader.readAsDataURL(file);
    } else {
      /* KEEP OLD IMAGE */
      if (editingProductId) {
        const response = await fetch("http://https://brainrush-backend.onrender.com/api/products");

        const products = await response.json();

        const existingProduct = products.find((p) => p.id === editingProductId);

        if (existingProduct) {
          product.image = existingProduct.image;
        }
      }

      await saveOrUpdateProduct(product);
    }
  });
}

/* ========================= */
/* SAVE OR UPDATE PRODUCT */
/* ========================= */

async function saveOrUpdateProduct(product) {
  try {
    let response;

    /* KEEP OLD IMAGE */

    if (editingProductId && !product.image) {
      const existingResponse = await fetch(
        "http://https://brainrush-backend.onrender.com/api/products",
      );

      const existingProducts = await existingResponse.json();

      const existingProduct = existingProducts.find(
        (p) => p.id === editingProductId,
      );

      if (existingProduct) {
        product.image = existingProduct.image;
      }
    }

    /* UPDATE */

    if (editingProductId) {
      response = await fetch(
        `http://https://brainrush-backend.onrender.com/api/products/${editingProductId}`,

        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(product),
        },
      );
    } else {
      /* ADD */
      response = await fetch(
        "http://https://brainrush-backend.onrender.com/api/products",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(product),
        },
      );
    }

    const data = await response.json();

    if (response.ok) {
      showToast(editingProductId ? "Product Updated" : "Product Added");

      productModal.classList.add("hidden");

      productForm.reset();

      editingProductId = null;

      loadProductsGrid();

      updateDashboardStats();
    } else {
      showToast(data.message);
    }
  } catch (err) {
    console.log(err);

    showToast("Operation failed");
  }
}

/* ========================= */
/* PRODUCT EVENTS */
/* ========================= */

function attachProductEvents() {
  /* DELETE */

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.onclick = async () => {
      if (confirm("Delete this product?")) {
        const card = button.closest(".admin-product-card");

        const productId = card.dataset.productId;

        try {
          const response = await fetch(
            `http://https://brainrush-backend.onrender.com/api/products/${productId}`,

            {
              method: "DELETE",
            },
          );

          const data = await response.json();

          if (response.ok) {
            card.remove();

            updateDashboardStats();

            showToast("Product Deleted");
          } else {
            showToast(data.message);
          }
        } catch (err) {
          showToast("Delete failed");
        }
      }
    };
  });

  /* EDIT */

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.onclick = async () => {
      const card = button.closest(".admin-product-card");

      const productId = card.dataset.productId;

      try {
        const response = await fetch("http://https://brainrush-backend.onrender.com/api/products");

        const products = await response.json();

        const product = products.find((p) => p.id === productId);

        if (!product) return;

        editingProductId = product.id;

        productModal.classList.remove("hidden");

        const inputs = productForm.querySelectorAll("input, textarea, select");

        inputs[0].value = product.name || "";

        inputs[1].value = product.price || "";

        inputs[2].value = product.old_price || "";

        inputs[3].value = product.category || "";

        inputs[4].value = product.badge || "";

        inputs[5].value = product.flavors || "";

        inputs[6].value = product.description || "";
      } catch (err) {
        showToast("Failed to load product");
      }
    };
  });
}

/* ========================= */
/* TOAST */
/* ========================= */

function showToast(message) {
  const toast = document.createElement("div");

  toast.classList.add("toast");

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show-toast");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show-toast");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

const clearBtn = document.getElementById("clearAllOrders");

if (clearBtn) {
  clearBtn.addEventListener("click", async () => {
    if (!confirm("Delete ALL orders?")) return;

    try {
      const response = await fetch(
        "http://https://brainrush-backend.onrender.com/api/orders",
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        loadOrdersTable();
        updateDashboardStats();
        showToast("All Orders Deleted");
      }
    } catch (err) {
      showToast("Delete Failed");
    }
  });
}


