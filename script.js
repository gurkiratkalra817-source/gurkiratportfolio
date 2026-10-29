
const foods = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 199,
    rating: 4.8,
    description: "Classic cheese pizza with fresh tomato sauce.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700"
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    category: "Pizza",
    price: 299,
    rating: 4.7,
    description: "Loaded with vegetables, cheese and herbs.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700"
  },
  {
    id: 3,
    name: "Classic Burger",
    category: "Burger",
    price: 149,
    rating: 4.6,
    description: "Crispy patty with fresh lettuce and sauces.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700"
  },
  {
    id: 4,
    name: "Cheese Burger",
    category: "Burger",
    price: 179,
    rating: 4.8,
    description: "Juicy burger topped with melted cheese.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=700"
  },
  {
    id: 5,
    name: "Masala Dosa",
    category: "Indian",
    price: 120,
    rating: 4.7,
    description: "Crispy dosa served with chutney and sambar.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=700"
  },
  {
    id: 6,
    name: "Paneer Butter Masala",
    category: "Indian",
    price: 240,
    rating: 4.9,
    description: "Soft paneer in a creamy tomato gravy.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=700"
  },
  {
    id: 7,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 110,
    rating: 4.8,
    description: "Rich chocolate cake for your sweet cravings.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700"
  },
  {
    id: 8,
    name: "Ice Cream",
    category: "Dessert",
    price: 80,
    rating: 4.5,
    description: "A delicious and creamy frozen treat.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700"
  },
  {
    id: 9,
    name: "Cold Coffee",
    category: "Drinks",
    price: 99,
    rating: 4.6,
    description: "Chilled coffee blended until smooth.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700"
  },
  {
    id: 10,
    name: "Fresh Lemonade",
    category: "Drinks",
    price: 60,
    rating: 4.4,
    description: "Refreshing lemonade served chilled.",

    image: "https://anerdcooks.com/wp-content/uploads/2019/06/homemade_lemonade4.jpg"
  },
  
  ,
  {
    id: 11,
    name: "Veg Momos",
    category: "Junk Food",
    price: 99,
    rating: 4.7,
    description: "Soft steamed momos served with spicy chutney.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700"
  },
  {
    id: 12,
    name: "French Fries",
    category: "Junk Food",
    price: 89,
    rating: 4.6,
    description: "Golden crispy fries with delicious seasoning.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700"
  },
  {
    id: 13,
    name: "Chicken Nuggets",
    category: "Junk Food",
    price: 149,
    rating: 4.5,
    description: "Crunchy nuggets served with a tasty dip.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=700"
  },
  {
    id: 14,
    name: "Veg Sandwich",
    category: "Junk Food",
    price: 79,
    rating: 4.4,
    description: "Toasted sandwich with fresh vegetables and sauce.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700"
  },
  {
    id: 15,
    name: "Cheese Pasta",
    category: "Junk Food",
    price: 159,
    rating: 4.8,
    description: "Creamy pasta with cheese and Italian herbs.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700"
  },
  {
    id: 16,
    name: "Spring Rolls",
    category: "Junk Food",
    price: 119,
    rating: 4.5,
    description: "Crispy rolls filled with delicious vegetables.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700"
  },
  
  ,
  {
    id: 17,
    name: "Tandoori Momos",
    category: "Junk Food",
    price: 139,
    rating: 4.8,
    description: "Smoky tandoori momos with spicy chutney.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700"
  },
  {
    id: 18,
    name: "White Sauce Pasta",
    category: "Junk Food",
    price: 179,
    rating: 4.7,
    description: "Creamy white sauce pasta with herbs.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700"
  },
  {
    id: 19,
    name: "Garlic Bread",
    category: "Junk Food",
    price: 99,
    rating: 4.5,
    description: "Toasted garlic bread with buttery flavour.",
    image: "https://www.kuchpakrahahai.in/wp-content/uploads/2025/09/Dominos-style-cheesy-garlic-bread-recipe.webp"
  },
  {
    id: 20,
    name: "Loaded Nachos",
    category: "Junk Food",
    price: 149,
    rating: 4.6,
    description: "Crunchy nachos topped with cheese and salsa.",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=700"
  },
  {
    id: 21,
    name: "Hot Dog",
    category: "Junk Food",
    price: 129,
    rating: 4.4,
    description: "Classic hot dog with sauces and toppings.",
    image: "https://www.licious.in/blog/wp-content/uploads/2016/07/Hot-Dogs.jpg"
  },
  {
    id: 22,
    name: "Cheese Garlic Bread",
    category: "Junk Food",
    price: 129,
    rating: 4.7,
    description: "Warm garlic bread loaded with melted cheese.",
    image: "https://www.modernfarmhouseeats.com/wp-content/uploads/2022/11/cheesy-roasted-garlic-pull-apart-bread-1.jpg" },
  {
    id: 23,
    name: "Crispy Onion Rings",
    category: "Junk Food",
    price: 89,
    rating: 4.3,
    description: "Crunchy golden onion rings with dip.",
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=700"
  },
  {
    id: 24,
    name: "Chicken Shawarma",
    category: "Junk Food",
    price: 169,
    rating: 4.7,
    description: "Wrap filled with seasoned chicken and sauces.",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=700"
  },
  {
    id: 25,
    name: "Cheese Quesadilla",
    category: "Junk Food",
    price: 159,
    rating: 4.6,
    description: "Toasted tortilla filled with melted cheese.",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=700"
  },
  {
    id: 26,
    name: "Chilli Potato",
    category: "Junk Food",
    price: 119,
    rating: 4.5,
    description: "Crispy potatoes tossed in spicy chilli sauce.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700"
  },
  {
    id: 27,
    name: "Cheese Corn Balls",
    category: "Junk Food",
    price: 129,
    rating: 4.5,
    description: "Crispy bites filled with corn and cheese.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=700"
  },
  {
    id: 28,
    name: "Peri Peri Fries",
    category: "Junk Food",
    price: 109,
    rating: 4.6,
    description: "Crispy fries coated with peri peri seasoning.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700"
  },
  {
    id: 29,
    name: "Veg Spring Roll",
    category: "Junk Food",
    price: 119,
    rating: 4.4,
    description: "Crunchy rolls stuffed with seasoned vegetables.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700"
  },
  {
    id: 30,
    name: "Cheese Sandwich",
    category: "Junk Food",
    price: 109,
    rating: 4.6,
    description: "Grilled sandwich with melted cheese.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700"
  },
  {
    id: 31,
    name: "Chocolate Brownie",
    category: "Junk Food",
    price: 99,
    rating: 4.8,
    description: "Rich chocolate brownie for a sweet treat.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700"
  }




];

let cart = [];
let discountApplied = false;
let orders = loadData("foodieOrders", []);

const $ = (id) => document.getElementById(id);

function loadData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // The page can still work if browser storage is unavailable.
  }
}

function money(amount) {
  return "₹" + Math.round(amount);
}

function renderFoods() {
  const search = $("searchInput").value.trim().toLowerCase();
  const category = $("categoryFilter").value;
  const sort = $("sortFilter").value;

  let filtered = foods.filter(food => {
    const matchesSearch =
      food.name.toLowerCase().includes(search) ||
      food.description.toLowerCase().includes(search) ||
      food.category.toLowerCase().includes(search);

    const matchesCategory =
      category === "All" || food.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (filtered.length === 0) {
    $("foodGrid").innerHTML =
      '<p class="empty-message">No food found. Try another search! 🍽️</p>';
    return;
  }

  $("foodGrid").innerHTML = filtered.map(food => `
    <article class="food-card">
      <div class="food-image">
        <img
          src="${food.image}"
          alt="${food.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        >
        <span class="food-category">${food.category}</span>
      </div>

      <div class="food-info">
        <div class="food-title-row">
          <h3>${food.name}</h3>
          <span class="food-rating">★ ${food.rating}</span>
        </div>

        <p class="food-description">${food.description}</p>

        <div class="food-bottom">
          <span class="food-price">${money(food.price)}</span>
          <button class="add-button" data-add="${food.id}">
            + Add to cart
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(foodId) {
  const existing = cart.find(item => item.id === foodId);

  if (existing) {
    existing.quantity++;
  } else {
    const food = foods.find(item => item.id === foodId);

    if (!food) return;

    cart.push({
      id: food.id,
      name: food.name,
      price: food.price,
      quantity: 1
    });
  }

  renderCart();
}

function changeQuantity(foodId, change) {
  const item = cart.find(item => item.id === foodId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== foodId);
  }

  renderCart();
}

function removeFromCart(foodId) {
  cart = cart.filter(item => item.id !== foodId);
  renderCart();
}

function getSubtotal() {
  return cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function getDeliveryFee(subtotal) {
  if (subtotal === 0 || subtotal >= 499) return 0;
  return 30;
}

function getDiscount(subtotal) {
  return discountApplied ? Math.round(subtotal * 0.10) : 0;
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotal();
  const delivery = getDeliveryFee(subtotal);
  const discount = getDiscount(subtotal);
  const total = Math.max(0, subtotal + delivery - discount);

  $("cartCount").textContent = count;

  if (cart.length === 0) {
    $("cartItems").innerHTML =
      '<p class="empty-message">Your cart is empty. Add something tasty! 🍕</p>';
  } else {
    $("cartItems").innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <small>${money(item.price)} each</small>

          <div class="quantity-control">
            <button data-minus="${item.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-plus="${item.id}" aria-label="Increase quantity">+</button>
          </div>

          <button class="remove-button" data-remove="${item.id}">
            Remove item
          </button>
        </div>

        <div class="cart-item-price">
          ${money(item.price * item.quantity)}
        </div>
      </div>
    `).join("");
  }

  $("subtotal").textContent = money(subtotal);
  $("deliveryFee").textContent = money(delivery);
  $("discount").textContent = money(discount);
  $("total").textContent = money(total);

  $("applyCoupon").disabled = subtotal === 0;

  if (subtotal === 0) {
    discountApplied = false;
    $("couponMessage").textContent = "";
  }
}

function openCart() {
  $("cartDrawer").classList.add("active");
  $("overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  $("cartDrawer").classList.remove("active");

  if (
    !$("checkoutModal").classList.contains("active") &&
    !$("successModal").classList.contains("active")
  ) {
    $("overlay").classList.remove("active");
    document.body.style.overflow = "";
  }
}

function openCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Please add some food first.");
    return;
  }

  closeCart();
  $("checkoutModal").classList.add("active");
  $("overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  $("checkoutModal").classList.remove("active");
  $("overlay").classList.remove("active");
  document.body.style.overflow = "";
}

function renderOrders() {
  if (orders.length === 0) {
    $("orderHistory").innerHTML =
      '<p class="empty-message">Your orders will appear here.</p>';
    return;
  }

  $("orderHistory").innerHTML = orders.map(order => `
    <article class="order-card">
      <div class="order-card-top">
        <div>
          <h3>Order #${order.id}</h3>
          <p>${order.date}</p>
        </div>

        <span class="order-status ${order.status === "Cancelled" ? "cancelled" : ""}">
          ${order.status}
        </span>
      </div>

      <p>${order.items.map(item =>
        `${item.name} × ${item.quantity}`
      ).join(", ")}</p>

      <p><strong>Total: ${money(order.total)}</strong></p>
      <p>Payment: ${order.payment}</p>

      ${order.status === "Placed" ? `
        <button class="cancel-order" data-cancel="${order.id}">
          Cancel order
        </button>
      ` : ""}
    </article>
  `).join("");
}

function placeOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    closeCheckout();
    return;
  }

  const name = $("customerName").value.trim();
  const phone = $("customerPhone").value.trim();
  const address = $("customerAddress").value.trim();
  const payment = $("paymentMethod").value;

  if (!name || !address || !/^[0-9]{10}$/.test(phone)) {
    alert("Please enter valid delivery details.");
    return;
  }

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee(subtotal);
  const discount = getDiscount(subtotal);
  const total = subtotal + delivery - discount;

  const order = {
    id: Date.now().toString().slice(-8),
    name,
    phone,
    address,
    payment,
    items: cart.map(item => ({ ...item })),
    subtotal,
    delivery,
    discount,
    total,
    date: new Date().toLocaleString(),
    status: "Placed"
  };

  orders.unshift(order);
  saveData("foodieOrders", orders);

  $("orderMessage").textContent =
    `Thank you, ${name}! Your demo order #${order.id} has been placed.`;

  cart = [];
  discountApplied = false;

  $("checkoutForm").reset();
  $("couponInput").value = "";
  $("couponMessage").textContent = "";

  renderCart();
  renderOrders();
  closeCheckout();

  $("successModal").classList.add("active");
  $("overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function finishOrder() {
  $("successModal").classList.remove("active");
  $("overlay").classList.remove("active");
  document.body.style.overflow = "";

  $("menu").scrollIntoView({ behavior: "smooth" });
}

function cancelOrder(orderId) {
  const order = orders.find(item => item.id === orderId);

  if (!order || order.status !== "Placed") return;

  const confirmed = confirm("Are you sure you want to cancel this order?");

  if (!confirmed) return;

  order.status = "Cancelled";
  saveData("foodieOrders", orders);
  renderOrders();
}

// Search and filters
$("searchInput").addEventListener("input", renderFoods);
$("categoryFilter").addEventListener("change", renderFoods);
$("sortFilter").addEventListener("change", renderFoods);

// Add food and manage cart with event delegation
$("foodGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

$("cartItems").addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");

  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
  if (remove) removeFromCart(Number(remove.dataset.remove));
});

// Cart controls
$("cartButton").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);

$("overlay").addEventListener("click", () => {
  closeCart();
  closeCheckout();
  finishOrder();
});

// Coupon: FOOD10 gives 10% off
$("applyCoupon").addEventListener("click", () => {
  const code = $("couponInput").value.trim().toUpperCase();

  if (getSubtotal() === 0) {
    $("couponMessage").textContent = "Add food to your cart first.";
    return;
  }

  if (code === "FOOD10") {
    discountApplied = true;
    $("couponMessage").textContent = "Success! 10% discount applied.";
  } else {
    discountApplied = false;
    $("couponMessage").textContent = "Invalid code. Try FOOD10.";
  }

  renderCart();
});

// Checkout and orders
$("checkoutButton").addEventListener("click", openCheckout);
$("closeCheckout").addEventListener("click", closeCheckout);
$("checkoutForm").addEventListener("submit", placeOrder);
$("finishOrder").addEventListener("click", finishOrder);

$("orderHistory").addEventListener("click", event => {
  const button = event.target.closest("[data-cancel]");
  if (button) cancelOrder(button.dataset.cancel);
});

// Close popups with Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeCheckout();
    finishOrder();
  }
});

// Start the application
renderFoods();
renderCart();
renderOrders();
