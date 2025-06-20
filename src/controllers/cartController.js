import * as cartService from "../services/cartService.js";

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    const cart = await cartService.addToCart(userId, productId, quantity);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await cartService.getCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    const cart = await cartService.updateCartItem(userId, productId, quantity);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;
  try {
    const cart = await cartService.removeCartItem(userId, productId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
