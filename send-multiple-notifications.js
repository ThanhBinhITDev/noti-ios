// Script gửi 20 thông báo BIDV liên tiếp cho backend test
// Cách dùng: node send-multiple-notifications.js

const webpush = require('web-push');

// VAPID keys - bạn cần thay bằng keys của mình (giống trong backend-sender.js)
const VAPID_PUBLIC_KEY = "BF_fI7bBysNworhKwSX44eFbzUqliVsS3MPnVI62aSZTQQ5VHxC7yznuILCsE9ezUxh4P2D3mlm5faxj1YXa1b8";
const VAPID_PRIVATE_KEY = "HHn_OHOfecPLK4W6ZAsuidSAf53oSzHVo5jzUq4hMyA";

webpush.setVapidDetails(
    'https://thanhbinhitdev.github.io/noti-ios/',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

// THAY ĐỔI: Điền subscription token của bạn từ frontend
const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/YOUR_SUBSCRIPTION_TOKEN_HERE",
    "expirationTime": null,
    "keys": {
        "p256dh": "YOUR_P256DH_KEY_HERE",
        "auth": "YOUR_AUTH_KEY_HERE"
    }
};

// Danh sách dịch vụ với ID/reference
const services = [
    'naptien id' + Math.random().toString(36).substr(2, 8),
    'chuyenkhoan #98923',
    'thanhtoan #jahaksj9212vv',
    'naptien id' + Math.random().toString(36).substr(2, 8),
    'chuyenkhoan #45821',
    'thanhtoan #xvk283ksl',
    'naptien id' + Math.random().toString(36).substr(2, 8),
    'chuyenkhoan #92134',
    'thanhtoan #pqr928sku',
    'naptien id' + Math.random().toString(36).substr(2, 8),
    'chuyenkhoan #11923',
    'thanhtoan #abc832nxc',
    'naptien id' + Math.random().toString(36).substr(2, 8),
    'chuyenkhoan #54782',
    'thanhtoan #def472hxx',
    'naptien id' + Math.random().toString(36).substr(2, 8),
    'chuyenkhoan #71293',
    'thanhtoan #ghi582olk',
    'naptien id' + Math.random().toString(36).substr(2, 8),
    'chuyenkhoan #83921'
];

// Hàm gửi thông báo với delay
async function sendMultipleNotifications() {
    let balance = 47000000; // Số dư ban đầu: 47 triệu
    const millionIndex = Math.floor(Math.random() * 20) + 1; // Vị trí ngẫu nhiên cho tiền triệu (1-20)

    for (let i = 1; i <= 20; i++) {
        await new Promise(resolve => {
            setTimeout(async () => {
                let amount;
                if (i === millionIndex) {
                    // Tiền triệu chỉ 1 lần: 1,000,000 - 20,000,000 VND
                    amount = Math.floor(Math.random() * (20000000 - 1000000 + 1)) + 1000000;
                } else {
                    // Tiền trăm: 100,000 - 900,000 VND
                    amount = Math.floor(Math.random() * (900000 - 100000 + 1)) + 100000;
                }
                
                // Tăng số dư
                balance += amount;

                const pushData = JSON.stringify({
                    "title": "Thông báo BIDV",
                    "body": `Tài khoản thanh toán: 8866476102\nSố tiền GD: +${amount.toLocaleString('vi-VN')} VND\nSố dư cuối: ${balance.toLocaleString('vi-VN')} VND\nNội dung: ${services[i - 1]}`,
                    "icon": "https://thanhbinhitdev.github.io/noti-ios/images/bidv-logo.png",
                    "badge": "https://thanhbinhitdev.github.io/noti-ios/images/badge.png",
                    "data": {
                        "url": "https://thanhbinhitdev.github.io/noti-ios/?page=success",
                        "message_id": `transaction_${i}_${Date.now()}`
                    }
                });

                try {
                    await webpush.sendNotification(pushSubscription, pushData);
                    console.log(`✅ Thông báo #${i}/20 đã gửi - Số tiền: +${amount.toLocaleString('vi-VN')} VND, Số dư: ${balance.toLocaleString('vi-VN')} VND`);
                } catch (error) {
                    console.error(`❌ Lỗi gửi thông báo #${i}:`, error.message);
                }

                resolve();
            }, 3000); // Delay 3 giây
        });
    }

    console.log(`\n✅ Đã gửi xong 20 thông báo! Số dư cuối cùng: ${balance.toLocaleString('vi-VN')} VND`);
}

// Chạy script
sendMultipleNotifications().catch(console.error);
