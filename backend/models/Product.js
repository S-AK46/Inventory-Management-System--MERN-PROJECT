import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
});

productSchema.pre("save", function () {
  this.status = this.quantity > 0 ? "In Stock" : "Out of Stock";
});

export default mongoose.model("Product", productSchema);
