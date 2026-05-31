const ordersContainer = document.getElementById("ordersContainer");

async function loadOrders() {
  const user = JSON.parse(localStorage.getItem("brainrushUser"));

  if (!user || !user.phone) {
    ordersContainer.innerHTML = `

      <div
        style="
          text-align:center;
          padding:100px 20px;
        "
      >

        <h1
          style="
            font-size:42px;
            color:#111;
          "
        >

          Please Login First

        </h1>

      </div>

    `;

    return;
  }

  try {
    const response = await fetch(
      `http://https://brainrush-backend.onrender.com/api/orders/user/${user.phone}`,
    );
    console.log(user.phone);
    console.log(response);

    const orders = await response.json();
    console.log("ORDERS:", orders);

    if (!orders.length) {
      ordersContainer.innerHTML = `

        <div
          style="
            text-align:center;
            padding:100px 20px;
          "
        >

          <h1
            style="
              font-size:42px;
              color:#111;
            "
          >

            No Orders Yet

          </h1>

        </div>

      `;

      return;
    }

    let activeOrders = "";

    let pastOrders = "";

    orders.forEach((order) => {
      const itemsHTML = order.items
        ?.map((item) => {
          return `

              <div
                style="
                  display:flex;
                  justify-content:space-between;
                  margin-bottom:10px;
                  color:#222;
                  font-size:15px;
                "
              >

                <span>

                  ${item.name}

                </span>

                <span>

                  × ${item.qty}

                </span>

              </div>

            `;
        })
        .join("");

      const steps = ["Received", "Processing", "Shipped", "Delivered"];

      const currentStep = steps.indexOf(order.status);

      const timelineHTML = steps
        .map((step, index) => {
          const active = index <= currentStep;

          return `

              <div
                style="
                  flex:1;
                  text-align:center;
                  position:relative;
                "
              >

                <div
                  style="
                    width:38px;
                    height:38px;
                    margin:auto;
                    border-radius:50%;
                    background:${active ? "#e10600" : "#ddd"};
                    color:white;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:14px;
                    font-weight:700;
                  "
                >

                  ${index + 1}

                </div>

                <p
                  style="
                    margin-top:10px;
                    font-size:13px;
                    color:#333;
                    font-weight:600;
                  "
                >

                  ${step}

                </p>

              </div>

            `;
        })
        .join("");

      const card = `

        <div
          style="
            background:white;
            border-radius:28px;
            padding:32px;
            margin-bottom:28px;
            box-shadow:
              0 10px 30px
              rgba(0,0,0,0.08);
          "
        >

          <div
            style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              margin-bottom:25px;
              flex-wrap:wrap;
              gap:15px;
            "
          >

            <div>

              <h2
                style="
                  margin:0;
                  color:#111;
                  font-size:30px;
                "
              >

                ${order.order_code}

              </h2>

              <p
                style="
                  margin-top:8px;
                  color:#666;
                "
              >

                ${new Date(order.created_at).toLocaleDateString("en-IN")}

              </p>

            </div>

            <div
              style="
                background:#e10600;
                color:white;
                padding:10px 18px;
                border-radius:999px;
                font-size:14px;
                font-weight:700;
              "
            >

              ${order.status}

            </div>

          </div>



          <div
            style="
              display:flex;
              gap:18px;
              margin-bottom:30px;
            "
          >

            ${timelineHTML}

          </div>



          <div
            style="
              background:#f7f7f7;
              padding:20px;
              border-radius:18px;
            "
          >

            ${itemsHTML}

          </div>



          <div
            style="
              margin-top:22px;
              display:flex;
              justify-content:space-between;
              align-items:center;
              flex-wrap:wrap;
              gap:15px;
            "
          >

            <h3
              style="
                color:#111;
                margin:0;
                font-size:28px;
              "
            >

              ${order.total}

            </h3>

          </div>

        </div>

      `;

      if (order.status === "Delivered") {
        pastOrders += card;
      } else {
        activeOrders += card;
      }
    });

    ordersContainer.innerHTML = `

      <div
        style="
          padding:50px 0;
        "
      >

        <h1
          style="
            font-size:48px;
            margin-bottom:35px;
            color:#111;
          "
        >

          Current Orders

        </h1>

        ${
          activeOrders ||
          `

            <p
              style="
                color:#777;
                font-size:18px;
              "
            >

              No Active Orders

            </p>

          `
        }

      </div>



      <div
        style="
          padding-bottom:80px;
        "
      >

        <h1
          style="
            font-size:48px;
            margin-bottom:35px;
            color:#111;
          "
        >

          Past Orders

        </h1>

        ${
          pastOrders ||
          `

            <p
              style="
                color:#777;
                font-size:18px;
              "
            >

              No Past Orders

            </p>

          `
        }

      </div>

    `;
  } catch (err) {
    console.log(err);

    ordersContainer.innerHTML = `

      <div
        style="
          text-align:center;
          padding:100px 20px;
        "
      >

        <h1
          style="
            color:red;
            font-size:42px;
          "
        >

          Failed To Load Orders

        </h1>

      </div>

    `;
  }
}

loadOrders();

setInterval(() => {
  loadOrders();
}, 3000);
