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

// Danh sách nội dung giao dịch ngân hàng
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

// Hàm gửi thông báo với delay
async function sendMultipleNotifications() {
    let balance = 10852; // Số dư ban đầu

    for (let i = 1; i <= 20; i++) {
        await new Promise(resolve => {
            setTimeout(async () => {
                // Số tiền GD ngẫu nhiên từ 5,000 tới 100,000 VND
                const amount = Math.floor(Math.random() * (100000 - 5000 + 1)) + 5000;
                
                // Tăng số dư
                balance += amount;

                const pushData = JSON.stringify({
                    "title": `Thông báo BIDV (#${i}/20)`,
                    "body": `Tài khoản thanh toán: 8866476102\nSố tiền GD: +${amount.toLocaleString('vi-VN')} VND\nSố dư cuối: ${balance.toLocaleString('vi-VN')} VND\nNội dung: ${transactions[i - 1]}`,
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
