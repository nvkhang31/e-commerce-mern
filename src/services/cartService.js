import Cart from "../models/cart.js";

export const addToCart = async (userId, productId, quantity) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [{ productId, quantity }] });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() ===  productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
  }
  await cart.save();
  return cart;
};

export const getCart = async (userId) => {
  return await Cart.findOne({ userId }).populate("items.productId");
};

export const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");
  const item = cart.items.find(
    (item) => item.productId.toString() === productId
  );
  if (!item) throw new Error("Item not found");
  item.quantity = quantity;
  await cart.save();
  return cart;
};

export const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  await cart.save();
  return cart;
};
