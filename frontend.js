const BANK_CONFIGS = {
    'BIDV': { name: 'BIDV', stk: '2006123456789', color: '#1E88E5' },
    'Vietcombank': { name: 'Vietcombank', stk: '101234567890', color: '#1565C0' },
    'MB': { name: 'MB Bank', stk: '123456789012', color: '#FF6F00' },
    'TPBank': { name: 'TPBank', stk: '883245678901', color: '#D81B60' },
    'VietinBank': { name: 'VietinBank', stk: '100234567890', color: '#00897B' },
    'Agribank': { name: 'Agribank', stk: '1504205209999', color: '#43A047' },
    'Sacombank': { name: 'Sacombank', stk: '070109876543', color: '#FFA000' },
    'Techcombank': { name: 'Techcombank', stk: '190234567890', color: '#FF5722' },
    'VPBank': { name: 'VPBank', stk: '123456789012', color: '#7B1FA2' },
    'Shinhan': { name: 'Shinhan Bank', stk: '880456789012', color: '#5E35B1' }
};

const TRANSACTION_TYPES = {
    'naptien': { label: 'Nạp tiền', prefix: 'naptien' },
    'chuyenkhoan': { label: 'Chuyển khoản', prefix: 'chuyenkhoan' },
    'thanhtoan': { label: 'Thanh toán', prefix: 'thanhtoan' },
    'muasam': { label: 'Mua sắm', prefix: 'muasam' },
    'ruttien': { label: 'Rút tiền', prefix: 'ruttien' },
    'baohiem': { label: 'Bảo hiểm', prefix: 'baohiem' }
};

const AMOUNT_RANGES = {
    'small': { min: 100000, max: 500000, label: 'Nhỏ' },
    'medium': { min: 500000, max: 5000000, label: 'Trung bình' },
    'large': { min: 5000000, max: 50000000, label: 'Lớn' },
    'vip': { min: 50000000, max: 500000000, label: 'VIP' }
};

function toggleSettings() {
    const toggle = document.querySelector('.settings-toggle');
    const panel = document.getElementById('settings_panel');
    toggle.classList.toggle('open');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

document.querySelectorAll('.bank-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.bank-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        option.querySelector('input').checked = true;
    });
});

document.querySelectorAll('#transaction_types .checkbox-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('checked');
        item.querySelector('input').checked = item.classList.contains('checked');
    });
});

document.querySelectorAll('#amount_ranges .checkbox-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('checked');
        item.querySelector('input').checked = item.classList.contains('checked');
    });
});

function getSelectedBank() {
    const selected = document.querySelector('.bank-option input:checked');
    return selected ? selected.value : 'BIDV';
}

function getSelectedTransactionTypes() {
    const types = [];
    document.querySelectorAll('#transaction_types .checkbox-item.checked').forEach(item => {
        types.push(item.dataset.type);
    });
    return types.length > 0 ? types : ['naptien', 'chuyenkhoan', 'thanhtoan'];
}

function getSelectedAmountRanges() {
    const ranges = [];
    document.querySelectorAll('#amount_ranges .checkbox-item.checked').forEach(item => {
        ranges.push(item.dataset.range);
    });
    return ranges.length > 0 ? ranges : ['medium', 'large'];
}

function getRandomAmount(ranges) {
    const amounts = ranges.map(r => ({
        min: AMOUNT_RANGES[r].min,
        max: AMOUNT_RANGES[r].max
    }));
    const selected = amounts[Math.floor(Math.random() * amounts.length)];
    return Math.floor(Math.random() * (selected.max - selected.min + 1)) + selected.min;
}

function getRandomTransactionType(types) {
    return types[Math.floor(Math.random() * types.length)];
}

function generateTransactionId() {
    return Math.random().toString(36).substr(2, 10).toUpperCase();
}
    let swRegistration = await navigator.serviceWorker.register('https://thanhbinhitdev.github.io/noti-ios/serviceworker.js', {scope: '/noti-ios/'})
    let pushManager = swRegistration.pushManager;

    if (!isPushManagerActive(pushManager)) {
        return;
    }

    let permissionState = await pushManager.permissionState({userVisibleOnly: true});
    switch (permissionState) {
        case 'prompt':
            document.getElementById('subscribe_btn').style.display = 'block';
            break;
        case 'granted':
            displaySubscriptionInfo(await pushManager.getSubscription())
            break;
        case 'denied':
            document.getElementById('subscribe_btn').style.display = 'none';
            document.getElementById('active_sub').style.display = 'block';
            document.getElementById('active_sub').innerHTML = 'Bạn đã tắt thông báo. Vui lòng bật lại trong Cài đặt để nhận thông báo từ BIDV.';
    }
}

function isPushManagerActive(pushManager) {
    if (!pushManager) {
        if (!window.navigator.standalone) {
            document.getElementById('add-to-home-screen').style.display = 'block';
        } else {
            throw new Error('PushManager is not active');
        }
        document.getElementById('subscribe_btn').style.display = 'none';
        return false;
    } else {
        return true;
    }
}

async function subscribeToPush() {
    // Public part of VAPID key, generation of that covered in README
    // All subscription tokens associated with that key, so if you change it - you may lose old subscribers
    const VAPID_PUBLIC_KEY = 'BF_fI7bBysNworhKwSX44eFbzUqliVsS3MPnVI62aSZTQQ5VHxC7yznuILCsE9ezUxh4P2D3mlm5faxj1YXa1b8';

    let swRegistration = await navigator.serviceWorker.getRegistration();
    let pushManager = swRegistration.pushManager;
    if (!isPushManagerActive(pushManager)) {
        return;
    }
    let subscriptionOptions = {
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
    };
    try {
        let subscription = await pushManager.subscribe(subscriptionOptions);
        displaySubscriptionInfo(subscription);
        // Here you can send fetch request with subscription data to your backend API for next push sends from there
    } catch (error) {
        document.getElementById('active_sub').style.display = 'block';
        document.getElementById('active_sub').innerHTML = 'Không thể bật thông báo. Vui lòng kiểm tra cài đặt quyền trên thiết bị.';
    }
}

function displaySubscriptionInfo(subscription) {
    document.getElementById('subscribe_btn').style.display = 'none';
    document.getElementById('active_sub').style.display = 'block';
    document.getElementById('active_sub').innerHTML = '<b>✅ Đã kích hoạt thông báo BIDV</b><br><br><small>Bạn sẽ nhận được thông báo giao dịch theo thời gian thực từ ngân hàng.</small><br><br><code>' 
        + JSON.stringify(subscription.toJSON()).substring(0, 200) + '...</code>';
    document.getElementById('test_send_btn').style.display = 'block';
    document.getElementById('settings_panel').style.display = 'block';
}

function testSend() {
    const testBtn = document.getElementById('test_send_btn');
    const originalText = testBtn.textContent;
    testBtn.disabled = true;
    
    const selectedBank = getSelectedBank();
    const bankConfig = BANK_CONFIGS[selectedBank];
    const count = parseInt(document.getElementById('notification_count').value);
    const transactionTypes = getSelectedTransactionTypes();
    const amountRanges = getSelectedAmountRanges();
    
    testBtn.textContent = `Đang gửi ${count} thông báo ${bankConfig.name}...`;

    let balance = 47000000;
    
    const hasVipRange = amountRanges.includes('vip');
    const vipIndex = hasVipRange ? Math.floor(Math.random() * count) + 1 : -1;
    
    for (let i = 1; i <= count; i++) {
        setTimeout(async () => {
            const txType = getRandomTransactionType(transactionTypes);
            const amount = getRandomAmount(amountRanges);
            
            if (i === vipIndex) {
                balance += AMOUNT_RANGES.vip.min + Math.floor(Math.random() * (AMOUNT_RANGES.vip.max - AMOUNT_RANGES.vip.min));
            } else {
                balance += amount;
            }
            
            const txId = generateTransactionId();
            const txLabel = TRANSACTION_TYPES[txType].label;
            
            const title = `Thông báo ${bankConfig.name}`;
            const options = {
                body: `Tài khoản thanh toán: ${bankConfig.stk}
Số tiền GD: +${amount.toLocaleString('vi-VN')} VND
Số dư cuối: ${balance.toLocaleString('vi-VN')} VND
Loại GD: ${txLabel} - ${txId}`,
                icon: '/images/bidv-logo.png',
                badge: '/images/badge.png',
                data: {
                    "url": "https://thanhbinhitdev.github.io/noti-ios/?page=success&bank=" + selectedBank,
                    "message_id": `transaction_${i}_${Date.now()}`
                }
            };

            navigator.serviceWorker.ready.then(async function (serviceWorker) {
                await serviceWorker.showNotification(title, options);
            });

            if (i === count) {
                testBtn.disabled = false;
                testBtn.textContent = originalText;
            }
        }, i * 3000);
    }
}

if ((new URLSearchParams(window.location.search)).get('page') === 'success') {
    document.getElementById('content').innerHTML = '✅ Bạn đã mở thông báo từ BIDV thành công!';
}

if (navigator.serviceWorker) {
    initServiceWorker();
}
