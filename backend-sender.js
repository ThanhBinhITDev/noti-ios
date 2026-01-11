// Public part of VAPID key, generation of that covered in README
// All subscription tokens associated with that key, so if you change it - you may lose old subscribers
// You MUST need generate your own VAPID keys!
// Newer share your PRIVATE_VAPID_KEY. It should be stored in a safe storage
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
    "body": "Tài khoản thanh toán: 8866476102\nSố tiền GD: +10,000 VND\nSố dư cuối: 10,852 VND\nNội dung: Chuyển tiền ting ting từ Nyxaria AI",
    "icon": "https://thanhbinhitdev.github.io/noti-ios/images/bidv-logo.png",
    "badge": "https://thanhbinhitdev.github.io/noti-ios/images/badge.png",
    "data": {
        "url": "https://thanhbinhitdev.github.io/noti-ios/?page=success",
        "message_id": "your_internal_unique_message_id_for_tracking"
    }
});
webpush.sendNotification(pushSubscription, pushData);
