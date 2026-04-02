import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/storefleet/user", userRoutes);
app.use("/api/storefleet/products", productRoutes);
app.use("/api/storefleet/cart", cartRoutes);
app.use("/api/storefleet/order", orderRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
