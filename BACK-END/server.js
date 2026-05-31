const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const supabase = require("./config/supabaseClient");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(
  express.json({
    limit: "50mb",
  }),
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("BRAINRUSH Backend Running");
});

app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    return res.json({
      error: error.message,
    });
  }

  res.json(data);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(() => {
  console.log("ALIVE");
}, 5000);