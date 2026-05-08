// FIX: DOMContentLoaded syntax was broken — moved closing paren to correct position
document.addEventListener('DOMContentLoaded', () => {

    // NAV SCROLL: SHADOW SHOW/HIDE
    let navElement = document.querySelector('nav');
    // FIX: 'scroll,() =>' had a comma instead of proper syntax
    document.addEventListener('scroll', () => { navScrollEffect(navElement); });

    // VIEW CART
    document.querySelector('nav .cart-button').addEventListener('click', openCartView);

    // CLOSE CART
    document.querySelector('#cart-box .close-button').addEventListener('click', closeCartView);

    // ADD TO CART
    // FIX: consistent variable name — was "usercart" and "userCart" mixed
    let userCart = document.querySelector('#cart-items-container ul');

    // FIX: class was "order-bitton" (typo) — now "order-button"
    // FIX: forEach syntax had mismatched parentheses and brackets
    document.querySelectorAll('.order-button').forEach((bttn) => {
        bttn.addEventListener('click', () => { addToCart(userCart, bttn); });
    });

    // CART SCROLL EFFECT
    // FIX: Mixed quotes ' and " were causing syntax errors
    userCart.addEventListener('scroll', () => { cartScrollEffect(userCart); });

    // REMOVE CART ITEM (event delegation)
    userCart.addEventListener('click', (e) => {
        let targetElement = e.target.closest('.remove-button');
        if (targetElement) {
            removeCartItem(targetElement);
        }
    });

    // CLEAR ALL ITEMS / CHECKOUT
    document.querySelector('#checkout-button').addEventListener('click', () => { clearAllItems(userCart); });

    // Show empty message on load
    emptyCartMessage();
});

// ==================== NAV SCROLL ====================
// FIX: Function name was "navScrolleffect" — inconsistent casing
function navScrollEffect(navElement) {
    if (window.scrollY > 0) {
        navElement.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        navElement.style.paddingTop = '12px';
        navElement.style.paddingBottom = '12px';
    } else {
        navElement.style.boxShadow = 'none';
        navElement.style.paddingTop = '18px';
        navElement.style.paddingBottom = '18px';
    }
}

// ==================== CART OPEN / CLOSE ====================
function openCartView() {
    document.querySelector('#cart-window').classList.add('active');
}

function closeCartView() {
    document.querySelector('#cart-window').classList.remove('active');
}

// ==================== ADD TO CART ====================
function addToCart(userCart, bttn) {
    let addItem = bttn.parentElement.parentElement;
    let addItemName = addItem.querySelector('.product-text .title').textContent;
    let addItemPrice = addItem.querySelector('.product-text .price').textContent.substring(1);

    // Get emoji if no image
    let emojiEl = addItem.querySelector('.product-emoji');
    let imgEl = addItem.querySelector('.image-container img');
    let imageHTML = '';
    if (emojiEl) {
        imageHTML = `<span class="cart-item-emoji">${emojiEl.textContent}</span>`;
    } else if (imgEl) {
        imageHTML = `<img src="${imgEl.src}" alt="${addItemName}">`;
    }

    // FIX: innerHTML was "innerHtml" (wrong casing)
    // FIX: Template literal syntax and SVG were malformed
    let newItemHTML = `
        <li>
            <div class="cart-item">
                <div class="item-1">
                    <div class="cart-item-image">
                        ${imageHTML}
                        <button class="remove-button">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="cart-item-desc">
                        <span>${addItemName}</span>
                        <span>Qty. 1</span>
                    </div>
                </div>
                <div class="cart-item-price">
                    <span>$${Number(addItemPrice).toFixed(2)}</span>
                </div>
            </div>
        </li>
    `;

    userCart.innerHTML += newItemHTML;
    updateTotalPrice(Number(addItemPrice), "addItem");
    emptyCartMessage();
    newCartItemEffect();
    openCartView();
}

// ==================== CART SCROLL EFFECT ====================
// FIX: Function was "cartscrollEffect" — renamed for consistency
function cartScrollEffect(userCart) {
    let topFade = document.querySelector('.white-fade-overflow.top');
    let bottomFade = document.querySelector('.white-fade-overflow.bottom');

    // FIX: "userCart.offsetHeght" was a typo — "offsetHeight"
    topFade.style.opacity = (userCart.scrollTop !== 0) ? "1" : "0";
    bottomFade.style.opacity = ((userCart.offsetHeight + userCart.scrollTop) >= userCart.scrollHeight) ? "0" : "1";
}

// ==================== REMOVE CART ITEM ====================
function removeCartItem(el) {
    let cartItem = el.closest('li');
    let cartItemPrice = cartItem.querySelector('.cart-item-price span').textContent.substring(1);
    cartItem.remove();
    updateTotalPrice(Number(cartItemPrice), "removeItem");
    emptyCartMessage();
}

// ==================== UPDATE TOTAL PRICE ====================
function updateTotalPrice(itemPrice, operation) {
    let checkoutPrice = document.querySelector('#cart-checkout .price');
    // FIX: Missing closing parenthesis on Number() call
    let totalPrice = Number(checkoutPrice.textContent.substring(1));

    // FIX: Price was being added TWICE — had duplicate logic
    if (operation === "addItem") {
        totalPrice += itemPrice;
    } else if (operation === "removeItem") {
        totalPrice -= itemPrice;
    } else {
        totalPrice = 0;
    }

    // FIX: '$${...}' was wrong — should be `$${...}` with backtick template literal
    checkoutPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

// ==================== EMPTY CART MESSAGE ====================
// FIX: Function was incomplete — missing closing brace and proper logic
function emptyCartMessage() {
    let message = document.querySelector('#cart-items-container .empty-cart-message');
    let itemCount = document.querySelectorAll('#cart-items-container ul li').length;
    message.style.display = (itemCount === 0) ? 'block' : 'none';
}

// ==================== NEW ITEM ANIMATION ====================
// FIX: "keyFrames" variable was used but "keyFrame" was defined
function newCartItemEffect() {
    const keyframes = [
        { transform: "translateY(0)" },
        { transform: "translateY(-10px)" },
        { transform: "translateY(0)" },
    ];

    const animationOptions = {
        duration: 500,
        iterations: 2,
        easing: 'ease-in-out'
    };

    let cartButton = document.querySelector('nav .cart-button');
    if (cartButton) {
        cartButton.animate(keyframes, animationOptions);
    }
}

// ==================== CLEAR ALL ITEMS ====================
function clearAllItems(userCart) {
    userCart.innerHTML = '';
    updateTotalPrice(0, "clearAllItems");
    emptyCartMessage();
}
