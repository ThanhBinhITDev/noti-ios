self.addEventListener('push', (event) => {
    // PushData keys structure standart https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
    let pushData = event.data.json();
    if (!pushData || !pushData.title) {
        console.error('Nhận WebPush không có tiêu đề. Nội dung nhận được: ', pushData);
    }
    self.registration.showNotification(pushData.title, pushData)
        .then(() => {
            // You can save to your analytics fact that push was shown
            // fetch('https://your_backend_server.com/track_show?message_id=' + pushData.data.message_id);
        });
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (!event.notification.data) {
        console.error('Nhấn vào thông báo nhưng dữ liệu trống (không có url). Notification: ', event.notification)
        return;
    }
    if (!event.notification.data.url) {
        console.error('Nhấn vào thông báo nhưng không có trường url. Notification: ', event.notification)
        return;
    }

    clients.openWindow(event.notification.data.url)
        .then(() => {
            // You can send fetch request to your analytics API fact that push was clicked
            // fetch('https://your_backend_server.com/track_click?message_id=' + pushData.data.message_id);
        });
});
