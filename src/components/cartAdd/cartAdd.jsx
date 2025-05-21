export const addToCart = (product) => {
  const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existingProductIndex = existingCart.findIndex(
    (item) => item.id === product.id
  );

  if (existingProductIndex !== -1) {
    existingCart[existingProductIndex].quantity += 1;
  } else {
    existingCart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(existingCart));
  window.dispatchEvent(new Event("cart-update"));
};
