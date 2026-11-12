
const products = {
    1: {
        name: "Comme des Garçons Comme des Garçons Black Satin Pan Collar Ruffled Blouse",
        price: 500,
        image: "img/pr1.jpg",
        description: "A sophisticated Japanese avant-garde blouse featuring a distinctive ruffled design.",
        material: "Material: Satin",
        condition: "Condition: Excellent",
        origin: "Origin: Japan",
        type: "clothing"
    },

    2: {
        name: "alice auaa Mesh Cutsew",
        price: 200,
        image: "img/pr2.jpg",
        description: "An experimental Japanese underground fashion piece featuring mesh construction.",
        material: "Material: Mesh",
        condition: "Condition: Excellent",
        origin: "Origin: Japan",
        type: "clothing"
    },

    3: {
        name: "The Old Curiosity Shop x Kids Love Gaite Black Croc-Embossed Hog Toe Boots",
        price: 1100,
        image: "img/pr3.jpg",
        description: "A distinctive collaboration featuring crocodile-embossed leather.",
        material: "Material: Leather",
        condition: "Condition: Excellent",
        origin: "Origin: Japan",
        type: "shoes"
    },

    4: {
        name: "Japanese Vintage Jacket",
        price: 350,
        image: "img/pr4.jpg",
        description: "A vintage Japanese jacket with a unique silhouette.",
        material: "Material: Not specified",
        condition: "Condition: Vintage",
        origin: "Origin: Japan",
        type: "clothing"
    },

    5: {
        name: "Black Avant-Garde Trousers",
        price: 280,
        image: "img/pr5.jpg",
        description: "Avant-garde black trousers with an experimental silhouette.",
        material: "Material: Not specified",
        condition: "Condition: Excellent",
        origin: "Origin: Japan",
        type: "clothing"
    }
};

const shoeSizes = [
    { eu: 39, uk: "5.5", usMen: "6.5", usWomen: "8", jp: "24.5" },
    { eu: 40, uk: "6.5", usMen: "7", usWomen: "8.5", jp: "25" },
    { eu: 41, uk: "7", usMen: "8", usWomen: "9.5", jp: "26" },
    { eu: 42, uk: "8", usMen: "8.5", usWomen: "10", jp: "27" },
    { eu: 43, uk: "9", usMen: "9.5", usWomen: "11", jp: "28" },
    { eu: 44, uk: "9.5", usMen: "10", usWomen: "11.5", jp: "28.5" },
    { eu: 45, uk: "10.5", usMen: "11", usWomen: "12.5", jp: "29" },
    { eu: 46, uk: "11", usMen: "12", usWomen: "13", jp: "30" }
];

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = products[productId];

const productDetails = document.getElementById("product-details");
const addButton = document.getElementById("add-to-cart");
const message = document.getElementById("product-message");

let selectedSize = "";
let selectedShoeSystem = "";

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
}

function updateCartCount() {
    const cart = getCart();

    const count = cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
    );

    const element = document.getElementById("cart-count");

    if (element) {
        element.textContent = count;
    }
}

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "#c0392b" : "#39734b";
}

function displayProduct() {
    if (!product) {
        productDetails.innerHTML = `
            <div>
                <h1>PRODUCT NOT FOUND</h1>
                <a href="index.html">BACK TO ITEMS</a>
            </div>
        `;
        return;
    }

    document.title = product.name + " — SIROKITOGOMU";

    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-price").textContent = "$" + product.price;

    const image = document.getElementById("product-image");
    image.src = product.image;
    image.alt = product.name;

    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-material").textContent = product.material;
    document.getElementById("product-condition").textContent = product.condition;
    document.getElementById("product-origin").textContent = product.origin;

    if (product.type === "shoes") {
        document.getElementById("clothing-size-container").hidden = true;
        document.getElementById("shoe-size-container").hidden = false;

        setupShoeSizes();
    } else {
        document.getElementById("clothing-size-container").hidden = false;
        document.getElementById("shoe-size-container").hidden = true;
    }
}

function setupShoeSizes() {
    const systemSelect = document.getElementById("shoe-system");
    const sizeSelect = document.getElementById("shoe-size");
    const conversion = document.getElementById("shoe-conversion");

    function fillSizes() {
        const system = systemSelect.value;

        selectedShoeSystem = system;
        selectedSize = "";

        sizeSelect.innerHTML = '<option value="">Choose size</option>';

        if (!system) {
            conversion.textContent = "First select a size system.";
            return;
        }

        shoeSizes.forEach(size => {
            const option = document.createElement("option");

            option.value = String(size.eu);

            option.textContent = system === "jp"
                ? size.jp + " cm"
                : size[system];

            sizeSelect.appendChild(option);
        });

        conversion.textContent = "Select a size to see international equivalents.";
    }

    function updateConversion() {
        const size = shoeSizes.find(
            item => String(item.eu) === sizeSelect.value
        );

        if (!size) {
            selectedSize = "";
            conversion.textContent = "Select a size to see international equivalents.";
            return;
        }

        selectedSize =
            `EU ${size.eu} / UK ${size.uk} / US Men ${size.usMen} / US Women ${size.usWomen} / JP ${size.jp} cm`;

        conversion.textContent = selectedSize;
    }

    systemSelect.addEventListener("change", () => {
        fillSizes();
        showMessage("");
    });

    sizeSelect.addEventListener("change", () => {
        updateConversion();
        showMessage("");
    });

    fillSizes();
}

function addToCart() {
    if (!product) return;

    // Проверка размера одежды
    if (product.type === "clothing") {
        selectedSize = document.getElementById("clothing-size").value;

        if (!selectedSize) {
            showMessage("PLEASE SELECT A CLOTHING SIZE FIRST.", true);
            document.getElementById("clothing-size").focus();
            return;
        }
    }

    // Проверка размера обуви
    if (product.type === "shoes") {
        const systemSelect = document.getElementById("shoe-system");
        const sizeSelect = document.getElementById("shoe-size");

        if (!systemSelect.value) {
            showMessage("PLEASE SELECT A SIZE SYSTEM FIRST.", true);
            systemSelect.focus();
            return;
        }

        if (!sizeSelect.value || !selectedSize) {
            showMessage("PLEASE SELECT A SHOE SIZE FIRST.", true);
            sizeSelect.focus();
            return;
        }
    }

    const cart = getCart();

    const existingItem = cart.find(item =>
        String(item.id) === String(productId) &&
        item.size === selectedSize
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: String(productId),
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    showMessage("PRODUCT SUCCESSFULLY ADDED TO CART.");
}

if (product) {
    displayProduct();

    addButton.addEventListener("click", addToCart);

    updateCartCount();
} else {
    displayProduct();
}
