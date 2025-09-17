import express from "express";
import Product from "../models/product.js";
import { adminOnly } from "../middleware/auth.js";
import { validateProduct } from "../middleware/validate.js";

const router = express.Router();
// GET
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST
router.post("/", adminOnly, validateProduct, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// PUT 
router.put("/:id", adminOnly, validateProduct, async (req, res) => {
  const { name, quantity, price } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.name = name;
  product.quantity = quantity;
  product.price = price;
  product.status = quantity > 0 ? "In Stock" : "Out of Stock";

  await product.save();
  res.json(product);
});

// DELETE
router.delete("/:id", adminOnly, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

// SELL
router.post("/:id/sell", adminOnly, async (req, res) => {
  const { quantityToSell } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (quantityToSell > product.quantity)
    return res.status(400).json({ message: "Sorry,There is no enough stock" });

  product.quantity -= quantityToSell;
  product.status = product.quantity > 0 ? "In Stock" : "Out of Stock";
  await product.save();
  res.json(product);
});

export default router;
