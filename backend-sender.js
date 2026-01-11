// Phần public của VAPID key (xem README để biết cách sinh)
// Tất cả subscription token liên kết với khóa này, nếu thay đổi bạn có thể mất các subscriber cũ
// Bạn PHẢI sinh VAPID keys riêng cho dự án của bạn
// KHÔNG chia sẻ PRIVATE_VAPID_KEY công khai; lưu nó ở nơi an toàn
const VAPID_PUBLIC_KEY = "BF_fI7bBysNworhKwSX44eFbzUqliVsS3MPnVI62aSZTQQ5VHxC7yznuILCsE9ezUxh4P2D3mlm5faxj1YXa1b8"
const VAPID_PRIVATE_KEY = "HHn_OHOfecPLK4W6ZAsuidSAf53oSzHVo5jzUq4hMyA";


// npm install web-push
const webpush = require('web-push');

webpush.setVapidDetails(
    'https://thanhbinhitdev.github.io/noti-ios/',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

// CHANGE TO YOUR TOKEN FOR TEST
const pushSubscription = {
        "endpoint": "https://fcm.googleapis.com/fcm/send/fXbyGY04zHY:APA91bE-EZI...",
        "expirationTime": null,
        "keys": {
            "p256dh": "BHqcQRz0HXwdZXZOT5GkQC_d5P1XFcevTkNPuJqh...",
            "auth": "o3SJkOwZFr7deVnT98..."
        }
    }
;

let pushData = JSON.stringify({
    "title": "Thông báo BIDV",
    "body": "Tài khoản thanh toán: 2006123456789\nSố tiền GD: +10,000 VND\nSố dư cuối: 10,852 VND\nNội dung: Chuyển tiền ting ting từ Nyxaria AI",
    "icon": "https://thanhbinhitdev.github.io/noti-ios/images/bidv-logo.png",
    "badge": "https://thanhbinhitdev.github.io/noti-ios/images/badge.png",
    "data": {
        "url": "https://thanhbinhitdev.github.io/noti-ios/?page=success",
        "message_id": "your_internal_unique_message_id_for_tracking"
    }
});
webpush.sendNotification(pushSubscription, pushData);
