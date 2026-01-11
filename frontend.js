async function initServiceWorker() {
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
            document.getElementById('active_sub').innerHTML = 'Người dùng đã từ chối quyền nhận thông báo';
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
        document.getElementById('active_sub').innerHTML = 'Người dùng đã từ chối quyền nhận thông báo';
    }
}

function displaySubscriptionInfo(subscription) {
    document.getElementById('subscribe_btn').style.display = 'none';
    document.getElementById('active_sub').style.display = 'block';
    document.getElementById('active_sub').innerHTML = '<b>Đăng ký đang hoạt động:</b><br><br>'
        + JSON.stringify(subscription.toJSON());
    document.getElementById('test_send_btn').style.display = 'block';
}

function testSend() {
    // Giới hạn nút click khi quá trình gửi 20 thông báo đang chạy
    const testBtn = document.getElementById('test_send_btn');
    const originalText = testBtn.textContent;
    testBtn.disabled = true;
    testBtn.textContent = 'Đang gửi 20 thông báo...';

    // Danh sách nội dung giao dịch ngân hàng mẫu
    const transactions = [
        'Chuyển tiền ting ting từ Nyxaria AI',
        'Thanh toán hóa đơn điện tháng 1',
        'Rút tiền tại ATM Techcombank',
        'Chuyển tiền lương từ công ty',
        'Mua hàng tại Lazada',
        'Nạp tiền điện thoại Viettel',
        'Thanh toán hóa đơn nước',
        'Chuyển tiền cho bạn bè',
        'Mua vé xem phim online',
        'Đóng phí BHYT',
        'Nhận tiền hoàn lại từ shop',
        'Thanh toán hóa đơn internet',
        'Mua bảo hiểm trực tuyến',
        'Rút tiền qua ứng dụng ngân hàng',
        'Chuyển tiền quốc tế',
        'Mua sắm trên Shopee',
        'Thanh toán học phí',
        'Tiền lãi tiết kiệm',
        'Chuyển tiền cho gia đình',
        'Thanh toán thẻ tín dụng'
    ];

    let balance = 10852; // Số dư ban đầu
    
    // Gửi 20 thông báo, mỗi thông báo cách nhau 3 giây
    for (let i = 1; i <= 20; i++) {
        setTimeout(async () => {
            // Số tiền GD ngẫu nhiên từ 5,000 tới 100,000 VND
            const amount = Math.floor(Math.random() * (100000 - 5000 + 1)) + 5000;
            
            // Tăng số dư
            balance += amount;
            
            const title = `Thông báo BIDV (#${i}/20)`;
            const options = {
                body: `Tài khoản thanh toán: 8866476102
Số tiền GD: +${amount.toLocaleString('vi-VN')} VND
Số dư cuối: ${balance.toLocaleString('vi-VN')} VND
Nội dung: ${transactions[i - 1]}`,
                icon: '/images/bidv-logo.png',
                badge: '/images/badge.png',
                data: {
                    "url": "https://thanhbinhitdev.github.io/noti-ios/?page=success",
                    "message_id": `transaction_${i}_${Date.now()}`
                }
            };

            navigator.serviceWorker.ready.then(async function (serviceWorker) {
                await serviceWorker.showNotification(title, options);
            });

            // Cập nhật nút khi hoàn tất lần gửi cuối cùng
            if (i === 20) {
                testBtn.disabled = false;
                testBtn.textContent = originalText;
            }
        }, i * 3000); // Delay 3s × số thứ tự
    }
}

if ((new URLSearchParams(window.location.search)).get('page') === 'success') {
    document.getElementById('content').innerHTML = 'Bạn đã mở trang thành công từ WebPush! (đây là URL được đặt trong tham số data của thông báo)';
}

if (navigator.serviceWorker) {
    initServiceWorker();
}
