
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
    );

    const element = document.getElementById("cart-count");
    if (element) element.textContent = count;
}

function renderCart() {
    const cart = getCart();

    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");
    const summary = document.getElementById("cart-summary");

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>YOUR CART IS EMPTY</h2>
                <p>There is nothing here yet.</p>
                <a href="index.html" class="view-btn">EXPLORE ITEMS</a>
            </div>
        `;

        summary.hidden = true;
        updateCartCount();
        return;
    }

    summary.hidden = false;

    let total = 0;

    cart.forEach((item, index) => {
        const price = Number(item.price) || 0;
        const quantity = Math.max(1, Number(item.quantity) || 1);

        total += price * quantity;

        const row = document.createElement("article");
        row.className = "cart-item";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const size = document.createElement("p");
        size.textContent = "SIZE: " + item.size;

        const priceText = document.createElement("p");
        priceText.textContent = "$" + price;

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.setAttribute("aria-label", "Decrease quantity");
        minus.addEventListener("click", () => changeQuantity(index, -1));

        const count = document.createElement("span");
        count.textContent = quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.setAttribute("aria-label", "Increase quantity");
        plus.addEventListener("click", () => changeQuantity(index, 1));

        const remove = document.createElement("button");
        remove.className = "remove-item";
        remove.textContent = "REMOVE";
        remove.addEventListener("click", () => removeItem(index));

        controls.append(minus, count, plus);
        info.append(name, size, priceText, controls, remove);

        row.append(image, info);
        container.appendChild(row);
    });

    totalElement.textContent =
        "$" + total.toLocaleString("en-US");

    updateCartCount();
}

function changeQuantity(index, amount) {
    const cart = getCart();

    if (!cart[index]) return;

    cart[index].quantity =
        (Number(cart[index].quantity) || 1) + amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}

function removeItem(index) {
    const cart = getCart();

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart(cart);
    renderCart();
}

function checkout() {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    alert("Checkout is not connected yet. Online payments are not available.");
}

document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("checkout-button")
        .addEventListener("click", checkout);

    renderCart();
});
