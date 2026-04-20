//  Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
// Ketika hambuger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// Klik di luar sidebar untuk menghilangkan nav
const hamburger = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// Toggle class active Untuk Search form
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");

document.querySelector("#search-button").onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

//Klik diluar elemen
const hm = document.querySelector("#hamburger-menu");
const sb = document.querySelector("#search-button");

document.addEventListener("click", function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
});

// Shopping Cart Functionality
let cart = [];

// Add to cart function
function addToCart(productId, productName, productPrice) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1,
    });
  }

  updateCart();
  showNotification(productName + " ditambahkan ke keranjang");
}

// Update cart display
function updateCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotalSpan = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="empty-cart">Keranjang Anda kosong</p>';
    cartTotalSpan.textContent = "IDR 0";
    return;
  }

  let html = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="cart-item">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>IDR ${item.price.toLocaleString("id-ID")}</p>
        </div>
        <div class="item-quantity">
          <button class="qty-btn" onclick="decreaseQty(${item.id})">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
        </div>
        <div class="item-total">
          <p>IDR ${itemTotal.toLocaleString("id-ID")}</p>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
        </div>
      </div>
    `;
  });

  cartItemsDiv.innerHTML = html;
  cartTotalSpan.textContent = "IDR " + total.toLocaleString("id-ID");
}

// Increase quantity
function increaseQty(productId) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += 1;
    updateCart();
  }
}

// Decrease quantity
function decreaseQty(productId) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      removeFromCart(productId);
    }
    updateCart();
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Initialize when DOM is ready
function initializeCart() {
  const shoppingCartButton = document.querySelector("#shopping-cart");
  const cartModal = document.getElementById("cart-modal");
  const closeCartButton = document.getElementById("close-cart");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  // Add to cart buttons
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const productCard = button.closest(".product-card");
      const productId = productCard.dataset.id;
      const productName = productCard.dataset.name;
      const productPrice = parseInt(productCard.dataset.price);
      addToCart(productId, productName, productPrice);
    });
  });

  // Shopping cart modal
  if (shoppingCartButton && cartModal && closeCartButton) {
    shoppingCartButton.addEventListener("click", (e) => {
      e.preventDefault();
      cartModal.classList.toggle("active");
    });

    closeCartButton.addEventListener("click", () => {
      cartModal.classList.remove("active");
    });

    // Close cart when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !cartModal.contains(e.target) &&
        e.target !== shoppingCartButton &&
        !e.target.closest("#shopping-cart")
      ) {
        cartModal.classList.remove("active");
      }
    });
  }
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    initializeCart();
    updateCartCount();
  });
} else {
  initializeCart();
  updateCartCount();
}

// Checkout Functionality
function initializeCheckout() {
  // Load cart items if on checkout page
  if (document.getElementById("checkout-items")) {
    loadCheckoutItems();
    updateCheckoutTotal();
  }

  // Handle payment method change
  const paymentMethod = document.getElementById("payment-method");
  if (paymentMethod) {
    paymentMethod.addEventListener("change", function () {
      const paymentDetails = document.getElementById("payment-details");
      const bankInfo = document.getElementById("bank-info");
      const ewalletInfo = document.getElementById("ewallet-info");

      // Hide all payment details first
      bankInfo.style.display = "none";
      ewalletInfo.style.display = "none";

      if (this.value === "transfer") {
        paymentDetails.style.display = "block";
        bankInfo.style.display = "block";
      } else if (this.value === "ewallet") {
        paymentDetails.style.display = "block";
        ewalletInfo.style.display = "block";
      } else if (this.value === "cash") {
        paymentDetails.style.display = "none";
      } else {
        paymentDetails.style.display = "none";
      }
    });
  }

  // Handle checkout form submission
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();
      processOrder();
    });
  }
}

function loadCheckoutItems() {
  const checkoutItemsDiv = document.getElementById("checkout-items");
  const cart = JSON.parse(localStorage.getItem("kopiKenanganSenja_cart")) || [];

  if (cart.length === 0) {
    checkoutItemsDiv.innerHTML =
      '<p class="empty-checkout">Keranjang Anda kosong. <a href="index.html">Kembali ke menu</a></p>';
    return;
  }

  let html = "";
  cart.forEach((item) => {
    html += `
      <div class="checkout-item">
        <img src="img/menu/${item.id}.jpg" alt="${item.name}" onerror="this.src='img/menu/default.jpg'">
        <div class="checkout-item-details">
          <h4>${item.name}</h4>
          <p>${item.quantity}x @ IDR ${item.price.toLocaleString("id-ID")}</p>
        </div>
        <div class="checkout-item-price">
          IDR ${(item.price * item.quantity).toLocaleString("id-ID")}
        </div>
      </div>
    `;
  });

  checkoutItemsDiv.innerHTML = html;
}

function updateCheckoutTotal() {
  const cart = JSON.parse(localStorage.getItem("kopiKenanganSenja_cart")) || [];
  const shippingCost = 10000; // Fixed shipping cost

  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const total = subtotal + shippingCost;

  document.getElementById("checkout-subtotal").textContent =
    `IDR ${subtotal.toLocaleString("id-ID")}`;
  document.getElementById("checkout-total").textContent =
    `IDR ${total.toLocaleString("id-ID")}`;
}

function processOrder() {
  const cart = JSON.parse(localStorage.getItem("kopiKenanganSenja_cart")) || [];

  if (cart.length === 0) {
    alert("Keranjang Anda kosong!");
    return;
  }

  // Get form data
  const formData = {
    customerName: document.getElementById("customer-name").value,
    customerPhone: document.getElementById("customer-phone").value,
    customerEmail: document.getElementById("customer-email").value,
    deliveryAddress: document.getElementById("delivery-address").value,
    deliveryNotes: document.getElementById("delivery-notes").value,
    paymentMethod: document.getElementById("payment-method").value,
    orderItems: cart,
    orderDate: new Date().toISOString(),
    orderNumber: generateOrderNumber(),
  };

  // Calculate total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = 10000;
  const total = subtotal + shippingCost;

  // Show success modal
  showOrderSuccess(formData.orderNumber, total);

  // Clear cart
  localStorage.removeItem("kopiKenanganSenja_cart");

  // Reset cart count in navbar
  updateCartCount();
}

function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `KS${timestamp}${random}`;
}

function showOrderSuccess(orderNumber, total) {
  const successModal = document.getElementById("success-modal");
  const orderNumberSpan = document.getElementById("order-number");
  const orderTotalSpan = document.getElementById("order-total");

  orderNumberSpan.textContent = orderNumber;
  orderTotalSpan.textContent = `IDR ${total.toLocaleString("id-ID")}`;

  successModal.classList.add("active");
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("kopiKenanganSenja_cart")) || [];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update cart count in navbar if element exists
  const cartBadge = document.querySelector(".cart-count");
  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.style.display = cartCount > 0 ? "inline" : "none";
  }
}

// Modify addToCart to redirect to checkout
function addToCart(productId, productName, productPrice) {
  const cart = JSON.parse(localStorage.getItem("kopiKenanganSenja_cart")) || [];

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1,
    });
  }

  localStorage.setItem("kopiKenanganSenja_cart", JSON.stringify(cart));
  updateCartCount();
  showNotification(productName + " ditambahkan ke keranjang");

  // Redirect to checkout page after adding to cart
  setTimeout(() => {
    window.location.href = "checkout.html";
  }, 1500);
}

// Initialize checkout when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCheckout);
} else {
  initializeCheckout();
}

// Menu Modal Functionality
function initializeMenuModal() {
  const menuModal = document.getElementById("menu-modal");
  const menuModalClose = document.getElementById("menu-modal-close");
  const modalMenuImage = document.getElementById("modal-menu-image");
  const modalMenuTitle = document.getElementById("modal-menu-title");
  const modalMenuDescription = document.getElementById(
    "modal-menu-description",
  );
  const modalMenuPrice = document.getElementById("modal-menu-price");
  const btnAddToCart = document.getElementById("btn-add-to-cart");

  // Menu card click handlers
  const menuCards = document.querySelectorAll(".menu-card-image");

  menuCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const img = card.querySelector("img");
      const menuName = img.dataset.menu;
      const menuPrice = img.dataset.price;
      const menuDescription = img.dataset.description;
      const menuImage = img.src;

      // Update modal content
      modalMenuImage.src = menuImage;
      modalMenuTitle.textContent = menuName;
      modalMenuDescription.textContent = menuDescription;
      modalMenuPrice.textContent = menuPrice;

      // Show modal with smooth animation
      menuModal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Trigger reflow for animation
      menuModal.offsetHeight;
    });
  });

  // Smooth close modal function
  function closeModal() {
    menuModal.classList.add("closing");

    // Wait for animation to complete before hiding
    setTimeout(() => {
      menuModal.classList.remove("active", "closing");
      document.body.style.overflow = "";
    }, 400);
  }

  // Close modal handlers
  menuModalClose.addEventListener("click", closeModal);

  // Close modal when clicking outside
  menuModal.addEventListener("click", (e) => {
    if (e.target === menuModal) {
      closeModal();
    }
  });

  // Add to cart from modal
  btnAddToCart.addEventListener("click", () => {
    const menuName = modalMenuTitle.textContent;
    const menuPrice = modalMenuPrice.textContent
      .replace("IDR ", "")
      .replace("K", "000");
    const price = parseInt(menuPrice);

    // Find the menu card to get the ID
    const menuCards = document.querySelectorAll(".menu-card");
    let menuId = null;

    menuCards.forEach((card, index) => {
      const img = card.querySelector("img");
      if (img.dataset.menu === menuName) {
        menuId = index + 1; // Simple ID based on position
      }
    });

    if (menuId) {
      addToCart(menuId, menuName, price);
      closeModal();
    }
  });
}

// Initialize menu modal when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMenuModal);
} else {
  initializeMenuModal();
}
