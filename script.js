let cart = [];
const products = {
    'product1': {
        name: '比个耶',
        price: 0.01
    },
    'product2': {
        name: '吃饭饭',
        price: 0.01
    },
    'product3': {
        name: '打游戏',
        price: 0.01
    },
    'product4': {
        name: '回家!',
        price: 0.01
    },
    'product5': {
        name: '拍美美照',
        price: 0.01
    },
    'product6': {
        name: '亲亲',
        price: 0.01
    },
    'product7': {
        name: '睡觉觉',
        price: 0.01
    },
    'product8': {
        name: '洗澡澡',
        price: 0.01
    }
};

// 添加到购物车
function addToCart(productId) {
    const product = products[productId];
    const existingItem = cart.find(item => item.id === productId);
    
    // 添加动画效果
    const button = event.target;
    button.classList.add('adding');
    
    // 显示添加成功提示
    showAddToCartFeedback(button);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    // 更新购物车UI
    updateCartUI();
    updateCartPanel();
    
    // 移除动画类
    setTimeout(() => {
        button.classList.remove('adding');
    }, 300);
}

// 添加成功反馈
function showAddToCartFeedback(button) {
    // 创建提示元素
    const feedback = document.createElement('div');
    feedback.className = 'add-feedback';
    feedback.textContent = '+1';
    
    // 获取按钮位置
    const rect = button.getBoundingClientRect();
    
    // 设置提示位置
    feedback.style.left = `${rect.left}px`;
    feedback.style.top = `${rect.top}px`;
    
    // 添加到页面
    document.body.appendChild(feedback);
    
    // 开始动画
    requestAnimationFrame(() => {
        feedback.style.transform = 'translateY(-20px)';
        feedback.style.opacity = '0';
    });
    
    // 移除元素
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 500);
}

// 更新购物车UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalPrice = document.getElementById('totalPrice');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCount.textContent = count;
    totalPrice.textContent = `¥${total.toFixed(2)}`;
}

// 显示结算模态框
function showCheckout() {
    if (cart.length === 0) {
        alert('购物车是空的');
        return;
    }
    
    const modal = document.getElementById('checkoutModal');
    const orderItems = document.getElementById('orderItems');
    const modalTotalPrice = document.getElementById('modalTotalPrice');
    
    // 清空之前的订单项
    orderItems.innerHTML = '';
    
    // 添加新的订单项
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>¥${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderItems.appendChild(itemElement);
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalTotalPrice.textContent = `¥${total.toFixed(2)}`;
    
    modal.style.display = 'block';
}

// 隐藏结算模态框
function hideCheckout() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'none';
}

// 支付处理函数
function goToPay() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 显示支付二维码
    const qrContainer = document.getElementById('qrCodeContainer');
    qrContainer.style.display = 'block';
    
    if (paymentMethod === 'weixin') {
        // 显示带金额的微信收款码
        document.getElementById('wechatQR').src = `images/wechat_qr.jpg?amount=${total}`;
        document.getElementById('wechatQR').style.display = 'block';
        document.getElementById('alipayQR').style.display = 'none';
        
        // 更新支付提示
        document.querySelector('.payment-tips').innerHTML = `
            <p>请使用微信扫码支付</p>
            <p style="color: #e4393c; font-size: 18px; font-weight: bold; margin: 10px 0;">
                ¥${total.toFixed(2)}
            </p>
        `;
    } else {
        // 显示带金额的支付宝收款码
        document.getElementById('alipayQR').src = `images/alipay_qr.jpg?amount=${total}`;
        document.getElementById('wechatQR').style.display = 'none';
        document.getElementById('alipayQR').style.display = 'block';
        
        // 更新支付提示
        document.querySelector('.payment-tips').innerHTML = `
            <p>请使用支付宝扫码支付</p>
            <p style="color: #e4393c; font-size: 18px; font-weight: bold; margin: 10px 0;">
                ¥${total.toFixed(2)}
            </p>
        `;
    }

    // 显示支付完成按钮
    document.getElementById('paymentComplete').style.display = 'block';
}

// 添加支付完成处理函数
function completePayment() {
    alert('支付成功！');
    cart = []; // 清空购物车
    updateCartUI();
    hideCheckout();
}

// 切换购物车面板显示
function toggleCart() {
    const cartPanel = document.getElementById('cartPanel');
    cartPanel.style.display = cartPanel.style.display === 'none' ? 'block' : 'none';
    updateCartPanel();
}

// 更新购物车面板
function updateCartPanel() {
    const cartItems = document.getElementById('cartItems');
    const cartPanelTotal = document.getElementById('cartPanelTotal');
    
    // 清空现有内容
    cartItems.innerHTML = '';
    
    // 添加购物车商品
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
    
    // 更新总价
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartPanelTotal.textContent = `¥${total.toFixed(2)}`;
}

// 更新商品数量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            // 如果数量为0，从购物车中移除
            cart = cart.filter(i => i.id !== productId);
        }
        updateCartUI();
        updateCartPanel();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
}); 