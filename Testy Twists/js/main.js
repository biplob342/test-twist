/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
  // Update navigation with user status
  updateNavigationWithUserStatus();

  // Highlight active navigation item
  highlightActiveNavItem();

  // Initialize "Order Now" button on home page
  initializeOrderNowButton();

  // Initialize menu page if on menu page
  if (document.querySelector('.category-filter-section')) {
    initializeMenuPage();
  }

  // Initialize cart page if on cart page
  if (document.querySelector('.cart-page-header') || document.querySelector('.cart-main-wrapper')) {
    initializeCartPage();
  }

  // Initialize checkout page if on checkout page
  if (document.getElementById('checkoutForm')) {
    initializeCheckoutPage();
  }

  // Initialize contact form if on contact page
  if (document.getElementById('contactForm')) {
    initializeContactForm();
  }
}

);

/**
 * Update navigation to show user status (logged in/out)
 */
function updateNavigationWithUserStatus() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const navList = document.querySelector('.main-navigation ul');

  if (!navList) return;

  // Find the login button
  const loginButton = navList.querySelector('a[href="login.html"]');

  if (currentUser && loginButton) {
    // User is logged in - update the login button to show user name and add logout option
    const loginListItem = loginButton.parentElement;

    // Update the login button to show user icon and name
    loginButton.innerHTML = `<i class="fas fa-user-circle"></i><span class="nav-text">${currentUser.name}</span>`;
    loginButton.setAttribute('href', '#');
    loginButton.setAttribute('title', 'Account');

    // Add logout button
    const logoutListItem = document.createElement('li');
    const logoutButton = document.createElement('a');
    logoutButton.href = '#';
    logoutButton.className = 'nav-button';
    logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i><span class="nav-text">Logout</span>';

    logoutButton.addEventListener('click', function (e) {
      e.preventDefault();

      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
      }
    }

    );

    logoutListItem.appendChild(logoutButton);
    loginListItem.after(logoutListItem);

    // Make account button go to a profile or settings page (for now, show info)
    loginButton.addEventListener('click', function (e) {
      e.preventDefault();
      showUserInfo(currentUser);
    }

    );
  }
}

/**
 * Show user information in an alert (placeholder for profile page)
 */
function showUserInfo(user) {
  alert(`Account Information:\n\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone || 'Not provided'}`);
}

/**
 * Highlight the active navigation item based on current page
 */
function highlightActiveNavItem() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navButtons = document.querySelectorAll('.nav-button');

  navButtons.forEach(button => {
    const href = button.getAttribute('href');

    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      button.classList.add('active');
      button.setAttribute('aria-current', 'page');
    }
  }

  );
}

/**
 * Initialize "Order Now" button on home page
 */
function initializeOrderNowButton() {
  const orderNowBtn = document.querySelector('.order-now-button');

  if (orderNowBtn) {
    orderNowBtn.addEventListener('click', function () {
      window.location.href = 'menu.html';
    }

    );
  }
}

/**
 * Initialize menu page functionality
 */
function initializeMenuPage() {
  // Set up category filter event listeners
  setupCategoryFilters();

  // Set up Add to Cart buttons
  setupAddToCartButtons();
}

/**
 * Set up event listeners for category filters
 */
function setupCategoryFilters() {
  const filterButtons = document.querySelectorAll('.filter-button');
  const foodCards = document.querySelectorAll('.food-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Get selected category
      const category = this.getAttribute('data-category');

      // Filter food items
      foodCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (category === 'all' || cardCategory === category) {
          card.style.display = 'block';
        }

        else {
          card.style.display = 'none';
        }
      }

      );
    }

    );
  }

  );
}

/**
 * Set up Add to Cart buttons
 */
function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
      const foodCard = this.closest('.food-card');
      const itemId = parseInt(foodCard.getAttribute('data-id'));
      const itemName = foodCard.querySelector('h3').textContent.trim();

      // Get price text and clean it properly
      const priceText = foodCard.querySelector('.price').textContent;
      const itemPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));

      const itemImage = foodCard.querySelector('img') ? foodCard.querySelector('img').getAttribute('src') : './image/placeholder.jpg';

      const item = {
        id: itemId,
        name: itemName,
        price: itemPrice,
        image: itemImage
      };

      // Debug log to check if item is being added
      console.log('Adding to cart:', item);
      addToCart(item);
      showNotification(`${itemName} added to cart!`);
    });
  });
}


/**
 * Show notification message
 * @param {string} message - Message to display
 */
function showNotification(message) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background-color: #ffffff;
    color: #d32f2f;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 600;
    border: 2px solid #d32f2f;
  `;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Initialize cart page functionality
 */
function initializeCartPage() {
  renderCartItems();
  updateCartSummary();

  // Set up checkout button
  const checkoutBtn = document.getElementById('checkoutButton');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckoutNavigation);
  }

  // Set up quick add functionality
  setupQuickAdd();
}

/**
 * Render cart items on cart page
 */
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartEmptyMessage = document.getElementById('cartEmptyMessage');
  const cartSummarySidebar = document.getElementById('cartSummarySidebar');
  const continueShoppingSection = document.getElementById('continueShoppingSection');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const trustIndicators = document.getElementById('trustIndicators');

  if (!cartItemsContainer) {
    console.log('Cart items container not found');
    return;
  }

  const cart = getCart();
  console.log('Cart contents:', cart);
  console.log('Cart length:', cart.length);

  if (cart.length === 0) {
    cartItemsContainer.style.display = 'none';
    if (cartEmptyMessage) {
      cartEmptyMessage.style.display = 'flex';
    }
    if (cartSummarySidebar) {
      cartSummarySidebar.style.display = 'none';
    }
    if (continueShoppingSection) {
      continueShoppingSection.style.display = 'none';
    }
    if (clearCartBtn) {
      clearCartBtn.style.display = 'none';
    }
    if (trustIndicators) {
      trustIndicators.style.display = 'none';
    }
    return;
  }

  cartItemsContainer.style.display = 'block';
  if (cartEmptyMessage) {
    cartEmptyMessage.style.display = 'none';
  }
  if (cartSummarySidebar) {
    cartSummarySidebar.style.display = 'block';
  }
  if (continueShoppingSection) {
    continueShoppingSection.style.display = 'block';
  }
  if (clearCartBtn) {
    clearCartBtn.style.display = 'flex';
  }
  if (trustIndicators) {
    trustIndicators.style.display = 'block';
  }

  cartItemsContainer.innerHTML = cart.map((item, index) => {
    // Get item image with multiple fallback options
    let itemImage = item.image;

    // If no image stored in cart, try to get from data.js
    if (!itemImage || itemImage === './image/placeholder.jpg') {
      if (typeof getFoodById === 'function') {
        const fullItem = getFoodById(item.id);
        if (fullItem && fullItem.image) {
          itemImage = fullItem.image;
        }
      }
    }

    // If still no image, use default placeholder
    if (!itemImage) {
      itemImage = './image/placeholder.jpg';
    }

    // Create a nice SVG placeholder for fallback
    const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Crect fill="%23fff3e0" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" font-size="40" text-anchor="middle" dy=".3em"%3E🍴%3C/text%3E%3C/svg%3E';

    return `
      <div class="cart-item-card" data-id="${item.id}" style="--item-index: ${index}">
        <div class="cart-item-image">
          <img src="${itemImage}" alt="${item.name}" onerror="this.src='${placeholderImage}'">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-price"><strong>৳</strong> ${item.price.toFixed(0)} <span class="price-label">per item</span></p>
          <div class="cart-item-actions">
            <div class="quantity-selector">
              <button class="qty-btn qty-decrease" data-id="${item.id}" aria-label="Decrease quantity">
                <i class="fas fa-minus"></i>
              </button>
              <input type="number" class="qty-input" value="${item.quantity}" min="1" readonly>
              <button class="qty-btn qty-increase" data-id="${item.id}" aria-label="Increase quantity">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}" title="Remove item">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
        <div class="cart-item-total">
          <p class="item-total-label">Total</p>
          <p class="item-total-price"><strong>৳</strong> ${(item.price * item.quantity).toFixed(0)}</p>
        </div>
      </div>
    `;
  }).join('');

  // Add event listeners to buttons
  setupCartItemControls();
  setupClearCartButton();
}

/**
 * Set up cart item controls (increase, decrease, remove)
 */
function setupCartItemControls() {
  // Increase quantity buttons
  const increaseButtons = document.querySelectorAll('.qty-btn.qty-increase');
  increaseButtons.forEach(button => {
    button.addEventListener('click', function () {
      const itemId = parseInt(this.getAttribute('data-id'));
      increaseQuantity(itemId);
      renderCartItems();
      updateCartSummary();
    });
  });

  // Decrease quantity buttons
  const decreaseButtons = document.querySelectorAll('.qty-btn.qty-decrease');
  decreaseButtons.forEach(button => {
    button.addEventListener('click', function () {
      const itemId = parseInt(this.getAttribute('data-id'));
      decreaseQuantity(itemId);
      renderCartItems();
      updateCartSummary();
    });
  });

  // Remove buttons
  const removeButtons = document.querySelectorAll('.remove-item-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const itemId = parseInt(this.getAttribute('data-id'));
      const itemName = this.closest('.cart-item-card').querySelector('.cart-item-name').textContent;

      if (confirm(`Remove "${itemName}" from cart?`)) {
        removeFromCart(itemId);
        renderCartItems();
        updateCartSummary();
        showNotification('Item removed from cart');
      }
    });
  });
}

/**
 * Set up clear cart button
 */
function setupClearCartButton() {
  const clearCartBtn = document.getElementById('clearCartBtn');
  if (clearCartBtn) {
    clearCartBtn.onclick = function () {
      if (confirm('Are you sure you want to clear your entire cart?')) {
        clearCart();
        renderCartItems();
        updateCartSummary();
        showNotification('Cart cleared');
      }
    };
  }
}

/**
 * Update cart summary (subtotal, tax, total)
 */
function updateCartSummary() {
  const cart = getCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = getCartSubtotal();
  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = subtotal >= 500 ? 0 : 50; // Free delivery over ৳500
  const total = subtotal + tax + deliveryFee;

  const itemsCountElement = document.getElementById('itemsCount');
  const subtotalElement = document.getElementById('cartSubtotal');
  const taxElement = document.getElementById('cartTax');
  const deliveryFeeElement = document.getElementById('deliveryFee');
  const totalElement = document.getElementById('cartTotal');

  if (itemsCountElement) {
    itemsCountElement.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
  }
  if (subtotalElement) {
    subtotalElement.innerHTML = `<strong>৳</strong> ${subtotal.toFixed(0)}`;
  }
  if (taxElement) {
    taxElement.innerHTML = `<strong>৳</strong> ${tax.toFixed(0)}`;
  }

  if (deliveryFeeElement) {
    if (deliveryFee === 0) {
      deliveryFeeElement.innerHTML = '<span class="free-tag">FREE</span>';
      deliveryFeeElement.classList.add('free-delivery');
    } else {
      deliveryFeeElement.innerHTML = `<strong>৳</strong> ${deliveryFee}`;
      deliveryFeeElement.classList.remove('free-delivery');
    }
  }
  if (totalElement) {
    totalElement.innerHTML = `<strong>৳</strong> ${total.toFixed(0)}`;
  }
}

/**
 * Handle navigation to checkout page
 */
function handleCheckoutNavigation() {
  const cart = getCart();

  if (cart.length === 0) {
    showNotification('Your cart is empty!');
    return;
  }

  window.location.href = 'checkout.html';
}

/**
 * Set up quick add functionality for empty cart
 */
function setupQuickAdd() {
  const quickAddCards = document.querySelectorAll('.quick-add-card');
  quickAddCards.forEach(card => {
    card.addEventListener('click', function () {
      const itemId = parseInt(this.getAttribute('data-quick-id'));
      // This would normally fetch item data, but we'll redirect to menu
      showNotification('Redirecting to menu...');
      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 500);
    });
  });
}

/**
 * Initialize checkout page functionality
 */
function initializeCheckoutPage() {
  // Render order items
  renderOrderItems();

  // Update order totals
  updateOrderTotals();

  // Set up form submission
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleOrderSubmission);
  }
}

/**
 * Render order items on checkout page
 */
function renderOrderItems() {
  const orderItemsContainer = document.getElementById('orderItems');
  if (!orderItemsContainer) return;

  const cart = getCart();
  if (cart.length === 0) {
    orderItemsContainer.innerHTML = '<p>No items in cart</p>';
    return;
  }

  orderItemsContainer.innerHTML = cart.map(item => {
    // Get item image with fallback
    let itemImage = item.image;
    if (!itemImage) {
      if (typeof getFoodById === 'function') {
        const fullItem = getFoodById(item.id);
        if (fullItem && fullItem.image) {
          itemImage = fullItem.image;
        }
      }
    }
    if (!itemImage) {
      itemImage = './image/placeholder.jpg';
    }

    return `
      <div class="order-item" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0;">
        <img src="${itemImage}" alt="${item.name}" 
             style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"
             onerror="this.style.display='none'">
        <span class="item-name" style="flex: 1;">${item.name} x${item.quantity}</span>
        <span class="item-price"><strong>৳</strong> ${(item.price * item.quantity).toFixed(0)}</span>
      </div>
    `;
  }).join('');
}

/**
 * Update order totals on checkout page
 */
function updateOrderTotals() {
  const subtotal = getCartSubtotal();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const subtotalElement = document.getElementById('orderSubtotal');
  const taxElement = document.getElementById('orderTax');
  const totalElement = document.getElementById('orderTotal');

  if (subtotalElement) {
    subtotalElement.innerHTML = `<strong>৳</strong> ${subtotal.toFixed(0)}`;
  }
  if (taxElement) {
    taxElement.innerHTML = `<strong>৳</strong> ${tax.toFixed(0)}`;
  }
  if (totalElement) {
    totalElement.innerHTML = `<strong>৳</strong> ${total.toFixed(0)}`;
  }
}

/**
 * Handle order submission
 */
function handleOrderSubmission(e) {
  e.preventDefault();

  const cart = getCart();
  if (cart.length === 0) {
    showNotification('Your cart is empty!');
    return;
  }

  // Get form data
  const formData = {
    name: document.getElementById('fullName').value,
    phone: document.getElementById('phoneNumber').value,
    address: document.getElementById('deliveryAddress').value,
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
  };

  // Calculate totals
  const subtotal = getCartSubtotal();
  const deliveryFee = 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  // Create order object
  const order = {
    orderNumber: '#ORD-' + Math.floor(10000 + Math.random() * 90000),
    orderDate: new Date().toISOString(),
    items: cart,
    customerInfo: formData,
    pricing: {
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      total: total
    },
    status: 'pending'
  };

  // Save order to history
  saveOrderToHistory(order);

  // In a real application, this would send data to a server
  console.log('Order submitted:', order);

  // Clear cart
  clearCart();

  // Redirect to summary page with new order parameter
  window.location.href = 'summary.html?new=true';
}

/**
 * Save order to order history
 * @param {Object} order - Order object to save
 */
function saveOrderToHistory(order) {
  let orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  orderHistory.unshift(order); // Add to beginning of array (most recent first)

  // Keep only last 50 orders
  if (orderHistory.length > 50) {
    orderHistory = orderHistory.slice(0, 50);
  }

  localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  localStorage.setItem('lastOrder', JSON.stringify(order));
}

/**
 * Initialize contact form functionality
 */
function initializeContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };

      // In a real application, this would send data to a server
      console.log('Contact form submitted:', formData);

      // Show success message
      alert('Thank you for your message, ' + formData.name + '!\n\nWe have received your inquiry about: ' + formData.subject + '\n\nWe will get back to you soon at ' + formData.email);

      // Reset form
      this.reset();
    });
  }
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}
`;
document.head.appendChild(style);