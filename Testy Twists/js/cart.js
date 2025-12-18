// Cart management for Testy Twists online food ordering website
// Handles adding, removing, updating cart items and persisting to localStorage

/**
 * Get cart from localStorage
 * @returns {Array} Array of cart items
 */
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart to localStorage
 * @param {Array} cart - Array of cart items to save
 */
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

/**
 * Add item to cart
 * @param {Object} item - Food item to add to cart
 */
function addToCart(item) {
  const cart = getCart();

  // Check if item already exists in cart
  const existingItem = cart.find(cartItem => cartItem.id === item.id);

  if (existingItem) {
    // Increase quantity if item exists
    existingItem.quantity += 1;
    // Update image if it wasn't stored before or if new image is provided
    if (item.image && (!existingItem.image || existingItem.image === './image/placeholder.jpg')) {
      existingItem.image = item.image;
    }
  } else {
    // Add new item with quantity 1
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || './image/placeholder.jpg',
      quantity: 1
    });
  }

  saveCart(cart);
}

/**
 * Remove item from cart
 * @param {number} itemId - ID of the item to remove
 */
function removeFromCart(itemId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== itemId);
  saveCart(cart);
}

/**
 * Update item quantity in cart
 * @param {number} itemId - ID of the item to update
 * @param {number} quantity - New quantity
 */
function updateCartItemQuantity(itemId, quantity) {
  const cart = getCart();
  const item = cart.find(cartItem => cartItem.id === itemId);

  if (item) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      removeFromCart(itemId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

/**
 * Increase item quantity by 1
 * @param {number} itemId - ID of the item
 */
function increaseQuantity(itemId) {
  const cart = getCart();
  const item = cart.find(cartItem => cartItem.id === itemId);

  if (item) {
    item.quantity += 1;
    saveCart(cart);
  }
}

/**
 * Decrease item quantity by 1
 * @param {number} itemId - ID of the item
 */
function decreaseQuantity(itemId) {
  const cart = getCart();
  const item = cart.find(cartItem => cartItem.id === itemId);

  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      saveCart(cart);
    } else {
      // Remove item if quantity would be 0
      removeFromCart(itemId);
    }
  }
}

/**
 * Clear all items from cart
 */
function clearCart() {
  localStorage.removeItem('cart');
  updateCartCount();
}

/**
 * Get total number of items in cart
 * @returns {number} Total quantity of all items
 */
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Get cart subtotal
 * @returns {number} Subtotal amount
 */
function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Update cart count badge in navigation
 */
function updateCartCount() {
  const cartCountElement = document.querySelector('.cart-count');

  if (cartCountElement) {
    const count = getCartItemCount();
    cartCountElement.textContent = count;

    // Show/hide badge based on count
    if (count > 0) {
      cartCountElement.style.display = 'flex';
    } else {
      cartCountElement.style.display = 'none';
    }
  }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
});

// Listen for storage changes (for cross-tab synchronization)
window.addEventListener('storage', function (e) {
  if (e.key === 'cart') {
    updateCartCount();
  }
});

// Update cart count when page becomes visible (for better UX)
document.addEventListener('visibilitychange', function () {
  if (!document.hidden) {
    updateCartCount();
  }
});