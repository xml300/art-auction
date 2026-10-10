// Native Artsyl Service Worker for W3C Web Push Notifications

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch (err) {
    payload = {
      title: "Artsyl Notification",
      body: event.data.text(),
    };
  }

  const title = payload.title || "Artsyl";
  const options = {
    body: payload.body || "New auction update",
    icon: payload.icon || "/logo.png",
    badge: payload.badge || "/logo.png",
    data: payload.data || {},
    vibrate: [100, 50, 100],
    actions: [
      {
        action: "open",
        title: "View Details",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const targetUrl = data.targetUrl || data.url || "/dashboard";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Focus existing Artsyl tab if available
      for (const client of clientList) {
        if ("focus" in client) {
          if (client.url.includes(self.location.origin)) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
