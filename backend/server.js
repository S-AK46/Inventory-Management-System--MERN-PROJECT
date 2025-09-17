import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productsRoute from "./routes/products.js";
import { errorHandler } from "./middleware/errorhandler.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/inventory",)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use("/products", productsRoute);
app.use(errorHandler);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
