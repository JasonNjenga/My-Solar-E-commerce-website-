document.addEventListener('DOMContentLoaded', () => {

    // NAV SCROLL: SHADOW SHOW/HIDE
    let navElement = document.querySelector('nav');
    document.addEventListener('scroll', () => { navScrollEffect(navElement); });

    // VIEW CART
    document.querySelector('nav .cart-button').addEventListener('click', openCartView);

    // CLOSE CART
    document.querySelector('#cart-box .close-button').addEventListener('click', closeCartView);

    // CLOSE CUSTOMER DETAILS FORM
    document.querySelector('#close-customer-form').addEventListener('click', closeCustomerForm);

    // ADD TO CART
    let userCart = document.querySelector('#cart-items-container ul');

    document.querySelectorAll('.order-button').forEach((bttn) => {
        bttn.addEventListener('click', () => { addToCart(userCart, bttn); });
    });

    // CART SCROLL EFFECT
    userCart.addEventListener('scroll', () => { cartScrollEffect(userCart); });

    // REMOVE CART ITEM (event delegation)
    userCart.addEventListener('click', (e) => {
        let targetElement = e.target.closest('.remove-button');
        if (targetElement) {
            removeCartItem(targetElement);
        }
    });

    // CHECKOUT BUTTON → OPEN CUSTOMER DETAILS FORM
    document.querySelector('#checkout-button').addEventListener('click', () => { openCustomerForm(userCart); });

    // CUSTOMER DETAILS FORM SUBMIT → PAY WITH PAYSTACK
    document.querySelector('#customerDetailsForm').addEventListener('submit', (e) => {
        payWithPaystack(e);
    });

    // Show empty message on load
    emptyCartMessage();
});

// ==================== NAV SCROLL ====================
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

// ==================== CUSTOMER DETAILS FORM ====================
function openCustomerForm(userCart) {
    let itemCount = document.querySelectorAll('#cart-items-container ul li').length;
    if (itemCount === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }

    // Close cart window
    closeCartView();

    // Update order total in the form
    let totalPrice = document.querySelector('#cart-checkout .price').textContent;
    document.querySelector('#order-total-display').textContent = totalPrice;

    // Show customer details form
    document.querySelector('#customer-details-window').classList.add('active');
}

function closeCustomerForm() {
    document.querySelector('#customer-details-window').classList.remove('active');
}

// ==================== ADD TO CART ====================
function addToCart(userCart, bttn) {
    let addItem = bttn.parentElement.parentElement;
    let addItemName = addItem.querySelector('.product-text .title').textContent;
    let addItemPrice = addItem.querySelector('.product-text .price').textContent.substring(3);

    let emojiEl = addItem.querySelector('.product-emoji');
    let imgEl = addItem.querySelector('.image-container img');
    let imageHTML = '';
    if (emojiEl) {
        imageHTML = `<span class="cart-item-emoji">${emojiEl.textContent}</span>`;
    } else if (imgEl) {
        imageHTML = `<img src="${imgEl.src}" alt="${addItemName}">`;
    }

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
                    <span>KES${Number(addItemPrice).toFixed(2)}</span>
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
function cartScrollEffect(userCart) {
    let topFade = document.querySelector('.white-fade-overflow.top');
    let bottomFade = document.querySelector('.white-fade-overflow.bottom');

    topFade.style.opacity = (userCart.scrollTop !== 0) ? "1" : "0";
    bottomFade.style.opacity = ((userCart.offsetHeight + userCart.scrollTop) >= userCart.scrollHeight) ? "0" : "1";
}

// ==================== REMOVE CART ITEM ====================
function removeCartItem(el) {
    let cartItem = el.closest('li');
    let cartItemPrice = cartItem.querySelector('.cart-item-price span').textContent.substring(3);
    cartItem.remove();
    updateTotalPrice(Number(cartItemPrice), "removeItem");
    emptyCartMessage();
}

// ==================== UPDATE TOTAL PRICE ====================
function updateTotalPrice(itemPrice, operation) {
    let checkoutPrice = document.querySelector('#cart-checkout .price');
    let totalPrice = Number(checkoutPrice.textContent.substring(3));

    if (operation === "addItem") {
        totalPrice += itemPrice;
    } else if (operation === "removeItem") {
        totalPrice -= itemPrice;
    } else {
        totalPrice = 0;
    }

    checkoutPrice.textContent = `KES${totalPrice.toFixed(2)}`;
}

// ==================== EMPTY CART MESSAGE ====================
function emptyCartMessage() {
    let message = document.querySelector('#cart-items-container .empty-cart-message');
    let itemCount = document.querySelectorAll('#cart-items-container ul li').length;
    message.style.display = (itemCount === 0) ? 'block' : 'none';
}

// ==================== NEW ITEM ANIMATION ====================
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

// ==================== PAYSTACK PAYMENT ====================
function payWithPaystack(e) {
    e.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email-address").value.trim();
    const phone = document.getElementById("phone-number").value.trim();
    const deliveryAddress = document.getElementById("delivery-address").value.trim();

    // Get total amount from the order summary display
    const totalText = document.getElementById("order-total-display").textContent;
    const amount = Number(totalText.substring(3));

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
        alert('Invalid payment amount. Please check your cart.');
        return;
    }

    // Build metadata for Paystack (includes delivery info)
    const metadata = {
        custom_fields: [
            {
                display_name: "First Name",
                variable_name: "first_name",
                value: firstName
            },
            {
                display_name: "Last Name",
                variable_name: "last_name",
                value: lastName
            },
            {
                display_name: "Phone Number",
                variable_name: "phone",
                value: phone
            },
            {
                display_name: "Delivery Address",
                variable_name: "delivery_address",
                value: deliveryAddress
            }
        ]
    };

    let handler = PaystackPop.setup({
        key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx', // ← REPLACE WITH YOUR PAYSTACK PUBLIC KEY
        email: email,
        amount: Math.round(amount * 100), // Convert to kobo (cents)
        currency: 'KES',
        ref: 'MSS_' + Date.now() + '_' + Math.floor(Math.random() * 1000000),
        firstname: firstName,
        lastname: lastName,
        phone: phone,
        metadata: metadata,
        label: "MySolarShop Customer",
        
        callback: function(response) {
            console.log('Payment Complete! Reference: ' + response.reference);
            alert('Payment successful! Reference: ' + response.reference + '\n\nThank you for your order, ' + firstName + '! We will deliver to: ' + deliveryAddress);
            
            // Clear cart after successful payment
            let userCart = document.querySelector('#cart-items-container ul');
            clearAllItems(userCart);
            closeCustomerForm();
        },
        onClose: function() {
            alert('Payment window closed. You can try again when ready.');
        }
    });

    handler.openIframe();
}
}
