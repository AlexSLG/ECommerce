// Variables y elementos
let allContainerCart = document.querySelector('.products');
let containerBuyCart = document.querySelector('.card-items');
let priceTotal = document.querySelector('.price-total');
let amountProduct = document.querySelector('.count-product');

let buyThings = [];
let totalCard = 0;
let countProduct = 0;
let currentCurrency = 'PEN'; // Moneda actual, por defecto en PEN
const exchangeRate = 3.74; // Tipo de cambio PEN a USD

// Información de productos en ambos idiomas
const productData = {
    '1': {
        'title': {'es': 'Minecraft Edición Java & Bedrock', 'en': 'Minecraft Java & Bedrock Edition'},
        
        'price': 80.00
    },
    '2': {
        'title': {'es': 'God of War', 'en': 'God of War'},
        
        'price': 125.00
    },
    '3': {
        'title': {'es': 'Grand Theft Auto V', 'en': 'Grand Theft Auto V'},
        
        'price': 135.00
    },
    '4': {
        'title': {'es': 'Doom Eternal', 'en': 'Doom Eternal'},
        
        'price': 85.00
    },
    '5': {
        'title': {'es': 'Days Gone', 'en': 'Days Gone'},
        
        'price': 78.00
    },
    '6': {
        'title': {'es': 'Mortal Kombat 11', 'en': 'Mortal Kombat 11'},
        
        'price': 110.00
    },
    '7': {
        'title': {'es': 'Silent Hill 2 Remasterizado', 'en': 'Silent Hill 2 Remastered'},
        
        'price': 180.00
    },
    '8': {
        'title': {'es': 'Overcooked! 2', 'en': 'Overcooked! 2'},
        
        'price': 80.00
    },
    '9': {
        'title': {'es': 'Half Life', 'en': 'Half Life'},
        
        'price': 20.00
    },
    '10': {
        'title': {'es': 'Left4Dead2', 'en': 'Left4Dead2'},
        
        'price': 15.00
    },
    '11': {
        'title': {'es': 'Resident Evil 2 Remasterizado', 'en': 'Resident Evil 2 Remastered'},
        
        'price': 130.00
    },
    '12': {
        'title': {'es': 'World of Warcraft', 'en': 'World of Warcraft'},
        
        'price': 50.00
    },
};

// Función para cargar eventos
loadEventListeners();

function loadEventListeners(){
    allContainerCart.addEventListener('click', addProduct);
    containerBuyCart.addEventListener('click', deleteProduct);
    document.getElementById('currency-select').addEventListener('change', changeCurrency);
    document.getElementById('language-select').addEventListener('change', () => {
        changeLanguage(document.getElementById('language-select').value);
    });
}

// Función para agregar producto al carrito
function addProduct(e) {
    e.preventDefault();
    if (e.target.classList.contains('btn-add-cart')) {
        const selectProduct = e.target.parentElement;
        readTheContent(selectProduct);
    }
}

function deleteProduct(e) {
    // Verificar si se hizo clic en el botón de eliminar (X)
    if (e.target.classList.contains('delete-product')) {
        const productId = e.target.getAttribute('data-id');
        
        // Buscar el producto en el array buyThings
        const productIndex = buyThings.findIndex(product => product.id === productId);
        
        // Si se encuentra el producto, eliminarlo del array y actualizar el total y cantidad
        if (productIndex !== -1) {
            const product = buyThings[productIndex];
            // Restar el total del precio del producto y la cantidad
            totalCard -= product.price * product.amount;
            countProduct -= product.amount;

            // Restaurar el stock del producto
            productData[productId].stock += product.amount;

            // Eliminar el producto del array buyThings
            buyThings.splice(productIndex, 1);
            
            // Actualizar el HTML del carrito
            loadHtml();
        }
    }
}



// Función para actualizar el total y el conteo
function updateTotalAndCount() {
    totalCard = buyThings.reduce((sum, item) => sum + (item.price * item.amount), 0).toFixed(2);
    countProduct = buyThings.reduce((sum, item) => sum + item.amount, 0);
    priceTotal.innerHTML = formatPrice(totalCard);
    amountProduct.innerHTML = countProduct;
}


function readTheContent(product) {
    const productId = product.querySelector('a').getAttribute('data-id');
    const priceText = product.querySelector('div p span[data-original-price]').getAttribute('data-original-price');

    const infoProduct = {
        image: product.querySelector('div img').src,
        title: product.querySelector('.title').textContent,
        price: parseFloat(priceText),
        id: productId,
        amount: 1,
        stock: parseInt(product.querySelector('.stock').getAttribute('data-stock'))
    };

    const exist = buyThings.find(product => product.id === infoProduct.id);
    if (exist) {
        if (exist.amount < infoProduct.stock) {
            exist.amount++; 
            infoProduct.stock--; // Reducir el stock
            updateStockDisplay(infoProduct.id, infoProduct.stock);
        } else {
            alert('No hay suficiente stock disponible'); 
            return;
        }
    } else {
        if (infoProduct.stock > 0) {
            infoProduct.stock--; // Reducir el stock disponible al añadir el producto por primera vez
            buyThings.push(infoProduct); 
            countProduct++; 
            updateStockDisplay(infoProduct.id, infoProduct.stock);
        } else {
            alert('Producto agotado'); 
            return;
        }
    }

    totalCard = parseFloat(totalCard) + infoProduct.price; 
    totalCard = totalCard.toFixed(2); 

    loadHtml(); 
}


function updateStockDisplay(productId, newStock) {
    const productElement = document.querySelector(`.carts[data-id="${productId}"] .stock`);
    if (productElement) {
        productElement.textContent = `Stock: ${newStock}`;
        productElement.setAttribute('data-stock', newStock);
    }
}


// Función para cargar el HTML del carrito
function loadHtml() {
    clearHtml(); // Limpiar el HTML del carrito
    buyThings.forEach(product => { // Iterar sobre los productos en el carrito
        const {image, title, price, amount, id, stock} = product; // Desestructurar el objeto del producto
        const row = document.createElement('div'); // Crear un nuevo div para el producto
        row.classList.add('item'); // Añadir clase 'item' al div
        row.innerHTML = `
            <img src="${image}" alt="">
            <div class="item-content">
                <h5>${title}</h5>
                <h5 class="cart-price">S/. ${formatPrice(price)}</h5>
                <div class="amount-container">
                    <h6>Cantidad: ${amount}</h6>
                    <h6>Stock disponible: ${stock}</h6> <!-- Mostrar el stock disponible -->
                    <div class="quantity-controls">
                        <button class="decrease-btn" data-id="${id}">-</button>
                        <input type="text" class="quantity-input" value="${amount}" data-id="${id}" readonly>
                        <button class="increase-btn" data-id="${id}">+</button>
                    </div>
                </div>
            </div>
            <span class="delete-product" data-id="${id}">X</span>
        `;

        containerBuyCart.appendChild(row); // Añadir el producto al contenedor del carrito
    });

    priceTotal.innerHTML = `S/. ${formatPrice(totalCard)}`; // Actualizar el total en el carrito
    amountProduct.innerHTML = countProduct; // Actualizar la cantidad de productos en el carrito
    
    // Añadir eventos a los botones de aumentar y disminuir cantidad
    addQuantityButtonListeners();
}



// Función para añadir eventos a los botones de cantidad
function addQuantityButtonListeners() {
    const increaseButtons = document.querySelectorAll('.increase-btn');
    const decreaseButtons = document.querySelectorAll('.decrease-btn');

    increaseButtons.forEach(button => {
        button.addEventListener('click', handleIncreaseQuantity);
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', handleDecreaseQuantity);
    });
}


// Función para manejar el aumento de cantidad
function handleIncreaseQuantity(event) {
    const productId = event.target.getAttribute('data-id');
    updateProductQuantity(productId, 1);
}

// Función para manejar la disminución de cantidad
function handleDecreaseQuantity(event) {
    const productId = event.target.getAttribute('data-id');
    updateProductQuantity(productId, -1);
}

function updateProductQuantity(productId, change) {
    const product = buyThings.find(product => product.id === productId); // Buscar el producto en el carrito

    if (product) {
        const newAmount = product.amount + change;

        // Verificar si la cantidad deseada está dentro del rango permitido por el stock
        if (newAmount > product.stock + product.amount) {
            alert('No hay suficiente stock disponible');
            return;
        } else if (newAmount < 1) {
            alert('La cantidad mínima es 1');
            return; // Asegurarse de que la cantidad mínima sea 1
        } else {
            product.amount = newAmount; // Actualizar la cantidad
            product.stock -= change; // Ajustar el stock al aumentar/disminuir cantidad
            updateStockDisplay(productId, product.stock); // Actualizar la visualización del stock
        }

        // Actualizar el total del carrito
        totalCard = buyThings.reduce((sum, item) => sum + (parseFloat(item.price) * item.amount), 0).toFixed(2);

        loadHtml(); // Recargar el carrito con las cantidades actualizadas
    }
}




// Función para formatear el precio
function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}


// Función para limpiar el HTML
function clearHtml(){
    containerBuyCart.innerHTML = '';
}

let currentLanguage = 'es'; // Idioma actual, por defecto en español

// Función para cambiar el idioma y actualizar descripciones
function changeLanguage(lang){
    let elements = {
        'es': {
            'search-placeholder': 'Buscar productos...',
            'welcome': '¡Bienvenido!',
            'cart': 'Cesta',
            'add-to-cart': 'Añadir al carrito'
        },
        'en': {
            'search-placeholder': 'Search products...',
            'welcome': 'Welcome!',
            'cart': 'Cart',
            'add-to-cart': 'Add to cart'
        }
    };

    let language = elements[lang];
    document.getElementById('search-input').placeholder = language['search-placeholder'];
    document.getElementById('welcome-text').textContent = language['welcome'];
    document.getElementById('cart-text').textContent = language['cart'];

    // Cambiar textos de botones y descripciones
    let addToCartButtons = document.querySelectorAll('.btn-add-cart');
    let productTitles = document.querySelectorAll('.products .title');

    addToCartButtons.forEach(button => {
        button.textContent = language['add-to-cart'];
    });

    productTitles.forEach((titleElement, index) => {
        let productId = titleElement.parentElement.querySelector('a').getAttribute('data-id');
        titleElement.textContent = productData[productId]['title'][lang];
    });

    // Actualiza los textos del carrito
    loadHtml();
}


// Función para cambiar moneda
function changeCurrency(event){
    let currency = event.target.value;
    if (currentCurrency === currency) return;

    currentCurrency = currency;

    // Actualizar precios en la lista de productos
    updateProductPrices(currency);

    // Actualizar precios en el carrito
    updateCartPrices(currency);
    loadHtml(); // Recargar el carrito para mostrar precios actualizados
}

// Función para actualizar precios en la lista de productos
function updateProductPrices(currency) {
    let productPrices = document.querySelectorAll('.products .carts div p span');
    productPrices.forEach(priceElement => {
        let price = parseFloat(priceElement.getAttribute('data-original-price'));
        if (currency === 'USD') {
            priceElement.textContent = (price / exchangeRate).toFixed(2);
        } else if (currency === 'PEN') {
            priceElement.textContent = (price).toFixed(2);
        }
    });

    // Actualizar símbolos de moneda
    let priceSymbols = document.querySelectorAll('.products .carts div p .currency-symbol');
    priceSymbols.forEach(symbol => {
        symbol.textContent = currency === 'USD' ? '$' : 'S/.';
    });
}

// Actualizar los precios del carrito al cambiar la moneda
function updateCartPrices(currency) {
    totalCard = buyThings.reduce((sum, item) => {
        let price = parseFloat(item.price);
        if (currency === 'USD') {
            price = (price / exchangeRate).toFixed(2);
        } else if (currency === 'PEN') {
            price = (price * exchangeRate).toFixed(2);
        }
        item.price = price;
        return sum + parseFloat(price) * item.amount;
    }, 0).toFixed(2);
}


// Función de búsqueda
function searchProducts(){
    let input = document.getElementById('search-input').value.toLowerCase();
    let productList = document.querySelectorAll('.products .carts');
    productList.forEach(function(product){
        let title = product.querySelector('.title').textContent.toLowerCase();
        if(title.includes(input)){
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}
