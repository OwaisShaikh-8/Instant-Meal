// redux/selectors/cartSelectors.js
export const selectCartByRestaurant = (restaurantId) => (state) =>
  state.cart.carts[restaurantId] || {};

export const selectTotalItems = (restaurantId) => (state) => {
  const cart = state.cart.carts[restaurantId] || {};
  return Object.values(cart).reduce((total, qty) => total + qty, 0);
};

export const selectCartItemsWithIds = (restaurantId) => (state) => {
  const cart = state.cart.carts[restaurantId] || {};
  return Object.entries(cart).map(([itemId, quantity]) => ({
    itemId,
    quantity,
  }));
};
