export const validateProduct = (req, res, next) => {
  const { name, quantity, price } = req.body;
  if (!name || quantity == null || price == null)
    return res.status(400).json({ message: "All fields are required" });
  if (quantity < 0 || price < 0)
    return res.status(400).json({ message: "Quantity and price must be >= 0" });
  next();
};
