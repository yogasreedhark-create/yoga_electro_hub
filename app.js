/* =========================================================
   ELECTROHUB JAVASCRIPT – ADMIN & CUSTOMER
========================================================= */

/* ===================== GLOBAL INIT ===================== */
if (!localStorage.getItem("cart")) localStorage.setItem("cart", JSON.stringify([]));
if (!localStorage.getItem("customers")) localStorage.setItem("customers", JSON.stringify([]));
if (!localStorage.getItem("audit_logs")) localStorage.setItem("audit_logs", JSON.stringify([]));
if (!localStorage.getItem("products")) localStorage.setItem("products", JSON.stringify([]));
if (!localStorage.getItem("orders")) localStorage.setItem("orders", JSON.stringify([]));

/* ===================== PRODUCT IMAGES ===================== */
const productImages = {
  "Smart Phone": [
    "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/h/l/a/-original-imahg2ny5htzbrjb.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/4/b/p/-original-imahgzhpc8abrthu.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/j/a/b/-original-imah83eztbdcsknu.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/j/e/d/c61-rmx3933-realme-original-imah28xeqdygzshc.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/j/t/v/-original-imahavdv28z4nrkn.jpeg?q=70"
  ],
  "Laptop": [
    "https://rukminim2.flixcart.com/image/312/312/xif0q/computer/k/t/y/-original-imahg53xspmfrsdd.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/312/312/xif0q/computer/a/g/p/-original-imahgwkqughzkwt3.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/312/312/xif0q/computer/c/g/4/-original-imahgfdyf6grkw9r.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/312/312/xif0q/computer/d/6/p/-original-imah3yhqcgjtxfhw.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/312/312/xif0q/computer/2/q/t/-original-imahg5ftjkmg4m82.jpeg?q=70"
  ],
  "PC": [
    "https://rukminim2.flixcart.com/image/612/612/xif0q/desktop-computer/z/h/c/0-ent-intelcore-i5-2400-128ssd-1tbhdd-16gb-22inch-entwino-original-imahavnnvhnkrfay.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/612/612/xif0q/desktop-computer/l/x/0/0-aura-1-entwino-original-imahbdczmfqxzhek.jpeg?q=70"
  ],
  "Smart Watch": [
    "https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/r/g/k/-original-imahf98j6ea4gkrf.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/h/u/i/-original-imah82pnswgua2vh.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/7/9/6/49-h9-t800-orange-001-android-ios-techio-yes-original-imahfjjr8jfrjnds.jpeg?q=70",
    "https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/e/o/m/-original-imahghmjmftemu54.jpeg?q=70"
  ]
};

/* ===================== HELPERS ===================== */
function randomId(len) {
  return Math.floor(Math.random() * Math.pow(10, len));
}
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function logAudit(module, operation, user) {
  const logs = JSON.parse(localStorage.getItem("audit_logs"));
  logs.push({
    module,
    operation,
    created_by: user,
    created_on: new Date().toISOString()
  });
  localStorage.setItem("audit_logs", JSON.stringify(logs));
}

/* ===================== AUTH ===================== */
function adminAuth() {
  const s = JSON.parse(localStorage.getItem("session"));
  if (!s || s.role !== "admin") location.href = "index.html";
}
function customerAuth() {
  const s = JSON.parse(localStorage.getItem("session"));
  if (!s || s.role !== "customer") location.href = "index.html";
}
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("session");
    location.href = "index.html";
  }
}

/* ===================== REGISTER / LOGIN ===================== */
function register() {
  const username = document.getElementById("r_username").value.trim();
  const email = document.getElementById("r_email").value.trim();
  const dob = new Date(document.getElementById("r_dob").value);
  const password = document.getElementById("r_password").value;
  const mobile = document.getElementById("r_mobile").value;
  const address = document.getElementById("r_address").value;

  const age = new Date().getFullYear() - dob.getFullYear();
  if (age < 18) { alert("Age must be above 18"); return; }
  if (!email.includes("@") || password.length < 6) { alert("Invalid email or weak password"); return; }

  const customers = JSON.parse(localStorage.getItem("customers"));
  customers.push({
    customerId: randomId(7),
    username,
    email,
    dob: dob.toISOString().split("T")[0],
    password,
    mobile,
    address,
    status: "active",
    created_on: new Date().toISOString()
  });

  localStorage.setItem("customers", JSON.stringify(customers));
  logAudit("Customer", "Insert", username);
  alert("Registered successfully!");
  location.href = "index.html";
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    localStorage.setItem("session", JSON.stringify({ role: "admin", user: "admin" }));
    location.href = "admin-dashboard.html";
    return;
  }

  const customers = JSON.parse(localStorage.getItem("customers"));
  const user = customers.find(c => c.username === username && c.password === password && c.status === "active");
  if (!user) { alert("Invalid credentials or inactive user"); return; }

  localStorage.setItem("session", JSON.stringify({ role: "customer", user: username }));
  location.href = "customer-dashboard.html";
}

/* ===================== PRODUCTS ===================== */
function addProduct() {
  const pname = document.getElementById("pname").value.trim();
  const pprice = parseFloat(document.getElementById("pprice").value);
  const pstock = parseInt(document.getElementById("pstock").value);
  const pcategory = document.getElementById("pcategory").value;
  let pimage = document.getElementById("pimage").value.trim();

  if (!pimage) pimage = randomFromArray(productImages[pcategory]);
  if (!pname || !pprice || !pstock) { alert("Please fill all fields"); return; }

  const products = JSON.parse(localStorage.getItem("products"));
  products.push({
    product_id: randomId(5),
    name: pname,
    price: pprice,
    stock: pstock,
    category: pcategory,
    image: pimage,
    status: "active",
    created_on: new Date().toISOString()
  });

  localStorage.setItem("products", JSON.stringify(products));
  logAudit("Product", "Insert", "admin");
  loadProducts();
}

function loadProducts(filter = "all") {
  const products = JSON.parse(localStorage.getItem("products"));
  const tbody = document.getElementById("productTable")?.getElementsByTagName('tbody')[0];
  if (!tbody) return;
  tbody.innerHTML = "";

  products.filter(p => filter === "all" || p.status === filter).forEach(p => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${p.product_id}</td>
      <td>${p.name}</td>
      <td>₹${p.price}</td>
      <td>${p.stock}</td>
      <td>${p.category}</td>
      <td><img src="${p.image}" width="50"></td>
      <td>${p.status}</td>
      <td><button onclick="toggleProduct(${p.product_id})">Toggle</button></td>
    `;
  });
}

function toggleProduct(id) {
  const products = JSON.parse(localStorage.getItem("products"));
  const p = products.find(x => x.product_id === id);
  if (!p) return;
  p.status = (p.status === "active") ? "inactive" : "active";
  logAudit("Product", "Update", "admin");
  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();
}

/* ===================== CUSTOMERS ===================== */
function loadCustomers() {
  const customers = JSON.parse(localStorage.getItem("customers"));
  const tbody = document.getElementById("customerTable")?.getElementsByTagName('tbody')[0];
  if (!tbody) return;
  tbody.innerHTML = "";
  customers.forEach(c => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${c.customerId}</td>
      <td>${c.username}</td>
      <td>${c.email}</td>
      <td>${c.status}</td>
      <td><button onclick="activateCustomer(${c.customerId})">Activate</button></td>
    `;
  });
}

function activateCustomer(id) {
  const customers = JSON.parse(localStorage.getItem("customers"));
  const c = customers.find(x => x.customerId === id);
  if (!c) return;
  c.status = "active";
  logAudit("Customer", "Update", "admin");
  localStorage.setItem("customers", JSON.stringify(customers));
  loadCustomers();
}

/* ===================== ORDERS ===================== */
function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders"));
  const tbody = document.getElementById("orderTable")?.getElementsByTagName('tbody')[0];
  if (!tbody) return;
  tbody.innerHTML = "";
  orders.forEach(o => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${o.orderId}</td>
      <td>${o.user}</td>
      <td>₹${o.final}</td>
      <td>${o.status}</td>
      <td>${o.date}</td>
    `;
  });
}

/* ===================== AUDIT LOG ===================== */
function loadAudit() {
  const logs = JSON.parse(localStorage.getItem("audit_logs"));
  const tbody = document.getElementById("auditTable")?.getElementsByTagName('tbody')[0];
  if (!tbody) return;
  tbody.innerHTML = "";
  logs.forEach(l => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${l.module}</td>
      <td>${l.operation}</td>
      <td>${l.created_by}</td>
      <td>${l.created_on}</td>
    `;
  });
}

/* ===================== CUSTOMER FUNCTIONS ===================== */
function loadProfile() {
  const session = JSON.parse(localStorage.getItem("session"));
  if (!session) return;
  const customers = JSON.parse(localStorage.getItem("customers"));
  const c = customers.find(x => x.username === session.user);
  if (!c) return;
  document.getElementById("p_email").value = c.email;
  document.getElementById("p_mobile").value = c.mobile;
  document.getElementById("p_address").value = c.address;
}

function updateProfile() {
  const session = JSON.parse(localStorage.getItem("session"));
  if (!session) return;
  const customers = JSON.parse(localStorage.getItem("customers"));
  const c = customers.find(x => x.username === session.user);
  if (!c) return;
  c.email = document.getElementById("p_email").value;
  c.mobile = document.getElementById("p_mobile").value;
  c.address = document.getElementById("p_address").value;
  localStorage.setItem("customers", JSON.stringify(customers));
  alert("Profile updated!");
}

/* ===================== CART / CHECKOUT ===================== */
function addToCart(productId) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  cart.push(productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const products = JSON.parse(localStorage.getItem("products"));
  const container = document.getElementById("cartItems");
  if (!container) return;
  container.innerHTML = "";
  let total = 0;
  cart.forEach(id => {
    const p = products.find(x => x.product_id === id);
    if (!p) return;
    container.innerHTML += `<div>${p.name} - ₹${p.price}</div>`;
    total += p.price;
  });
  const gst = total * 0.02;
  const final = total + gst;
  document.getElementById("cartTotal").innerText = `Total: ₹${total} | GST: ₹${gst.toFixed(2)} | Final: ₹${final.toFixed(2)}`;
}

/* ===================== PAYMENT ===================== */
function makePayment() {
  const cart = JSON.parse(localStorage.getItem("cart"));
  if (cart.length === 0) { alert("Cart is empty!"); return; }
  const products = JSON.parse(localStorage.getItem("products"));
  let total = 0;
  cart.forEach(id => {
    const p = products.find(x => x.product_id === id);
    if (p) total += p.price;
  });
  const orders = JSON.parse(localStorage.getItem("orders"));
  orders.push({
    orderId: randomId(6),
    user: JSON.parse(localStorage.getItem("session")).user,
    final: total,
    status: "completed",
    date: new Date().toISOString()
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("cart", JSON.stringify([]));
  logAudit("Payment", "Insert", JSON.parse(localStorage.getItem("session")).user);
  alert("Payment successful!");
  location.href = "customer-dashboard.html";
}

/* ===================== SEED SAMPLE PRODUCTS ===================== */
function seedProducts() {
  let products = JSON.parse(localStorage.getItem("products") || "[]");
  if (products.length) return;
  const categories = ["Smart Phone","Laptop","PC","Smart Watch"];
  categories.forEach(cat => {
    const count = cat === "PC" ? 5 : 10;
    for(let i=1;i<=count;i++){
      products.push({
        product_id: randomId(5),
        name:`${cat} ${i}`,
        price: 10000 + i*500,
        stock: 50,
        category: cat,
        image: randomFromArray(productImages[cat]),
        status: "active",
        created_on: new Date().toISOString()
      });
    }
  });
  localStorage.setItem("products", JSON.stringify(products));
}
