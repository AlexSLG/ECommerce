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
function addProduct(e){
    e.preventDefault();
    if (e.target.classList.contains('btn-add-cart')) {
        const selectProduct = e.target.parentElement;
        readTheContent(selectProduct);
    }
}

// Función para borrar un producto
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


// Función para leer contenido del producto
function readTheContent(product) {
    const productId = product.querySelector('a').getAttribute('data-id');
    const priceText = product.querySelector('div p span[data-original-price]').getAttribute('data-original-price');

    const infoProduct = {
        image: product.querySelector('div img').src,
        title: product.querySelector('.title').textContent,
        price: parseFloat(priceText), // Convertir el precio a número
        id: productId,
        amount: 1
    }

    // Comprobar si el precio es válido
    if (isNaN(infoProduct.price)) {
        console.error(`El precio no es un número: ${priceText}`);
        return; // Salir si hay un problema con el precio
    }

    totalCard = parseFloat(totalCard) + infoProduct.price;
    totalCard = totalCard.toFixed(2);

    const exist = buyThings.some(product => product.id === infoProduct.id);
    if (exist) {
        const pro = buyThings.map(product => {
            if (product.id === infoProduct.id) {
                product.amount++;
                return product;
            } else {
                return product;
            }
        });
        buyThings = [...pro];
    } else {
        buyThings = [...buyThings, infoProduct];
        countProduct++;
    }
    loadHtml();
}


// Función para cargar el HTML del carrito
function loadHtml() {
    clearHtml();
    buyThings.forEach(product => {
        const {image, title, price, amount, id} = product;
        const row = document.createElement('div');
        row.classList.add('item');
        row.innerHTML = `
            <img src="${image}" alt="">
            <div class="item-content">
                <h5>${title}</h5>
                <h5 class="cart-price">${formatPrice(price)} ${currentCurrency === 'PEN' ? 'S/.' : '$'}</h5>
                <div class="amount-container">
                    <h6>Amount: ${amount}</h6>
                    <div class="quantity-controls">
                        <button class="decrease-btn" data-id="${id}">-</button>
                        <input type="text" class="quantity-input" value="${amount}" data-id="${id}" readonly>
                        <button class="increase-btn" data-id="${id}">+</button>
                    </div>
                </div>
            </div>
            <span class="delete-product" data-id="${id}">X</span>
        `;

        containerBuyCart.appendChild(row);
    });

    priceTotal.innerHTML = `${currentCurrency === 'PEN' ? 'S/.' : '$'} ${formatPrice(totalCard)}`;
    amountProduct.innerHTML = countProduct;
    
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

// Función para actualizar la cantidad de un producto
function updateProductQuantity(productId, change) {
    const product = buyThings.find(product => product.id === productId);

    if (product) {
        product.amount += change;
        if (product.amount < 1) product.amount = 1; // Asegurar que la cantidad mínima sea 1

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

// ALERTA 
document.querySelector('.btn-comprar').addEventListener('click', function() {
    Swal.fire({
        title: '¡Compra realizada!',
        text: 'Gracias por tu compra. Procesaremos tu pedido.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        // Vaciar el carrito después de la compra
        buyThings = [];
        totalCard = 0;
        countProduct = 0;
        loadHtml();
    });
});
