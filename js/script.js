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
  document.addEventListener("DOMContentLoaded", initializeCart);
} else {
  initializeCart();
}

// Menu Modal Functionality
function initializeMenuModal() {
  const menuModal = document.getElementById("menu-modal");
  const menuModalClose = document.getElementById("menu-modal-close");
  const modalMenuImage = document.getElementById("modal-menu-image");
  const modalMenuTitle = document.getElementById("modal-menu-title");
  const modalMenuDescription = document.getElementById("modal-menu-description");
  const modalMenuPrice = document.getElementById("modal-menu-price");
  const btnAddToCart = document.getElementById("btn-add-to-cart");

  // Menu card click handlers
  const menuCards = document.querySelectorAll(".menu-card-image");

  menuCards.forEach(card => {
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

      // Show modal
      menuModal.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent background scroll
    });
  });

  // Close modal handlers
  menuModalClose.addEventListener("click", () => {
    menuModal.classList.remove("active");
    document.body.style.overflow = ""; // Restore scroll
  });

  // Close modal when clicking outside
  menuModal.addEventListener("click", (e) => {
    if (e.target === menuModal) {
      menuModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Add to cart from modal
  btnAddToCart.addEventListener("click", () => {
    const menuName = modalMenuTitle.textContent;
    const menuPrice = modalMenuPrice.textContent.replace("IDR ", "").replace("K", "000");
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
      menuModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// Initialize menu modal when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMenuModal);
} else {
  initializeMenuModal();
}
