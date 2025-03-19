# react-speedy-toast
![React Speedy Toast Preview](https://res-console.cloudinary.com/dhlslqwwl/media_explorer_thumbnails/0d46a5db5b37e29be80a9fa7e746cec5/detailed)

A lightweight and customizable React toast notification library for elegant and user-friendly alerts.

## 🚀 Features

- 🎨 **Customizable** – Supports different statuses like success, error, warning, and info.
- ⏳ **Auto-dismiss** – Configurable duration with smooth animations.
- 📌 **Positioning** – Supports various positions (top-left, top-right, bottom-center, etc.).
- ⚡ **Easy to Use** – Simple API for adding and removing toasts.

---

## 📦 Installation

Install the package via npm or yarn:

```sh
npm install react-speedy-toast
# OR
yarn add react-speedy-toast
```

---

## 🛠 Usage

### 1️⃣ Wrap Your App with `ToastProvider`

```tsx
import { ToastProvider } from "react-speedy-toast";
import App from "./App";

const Root = () => (
  <ToastProvider>
    <App />
  </ToastProvider>
);

export default Root;
```

### 2️⃣ Use the `useToast` Hook to Trigger Notifications

```tsx
import { useToast } from "react-speedy-toast";

const MyComponent = () => {
  const { addToast } = useToast();

  return (
    <button
      onClick={() => addToast("toast-1", "This is a success message!", "success", 3000)}
    >
      Show Toast
    </button>
  );
};

export default MyComponent;
```

---

## ⚙️ API Reference

### `addToast(id, message, status, duration?, position?)`

| Parameter  | Type   | Description                               | Default        |
| ---------- | ------ | ----------------------------------------- | -------------- |
| `id`       | string | Unique ID for the toast                   | Required       |
| `message`  | string | Toast message text                        | Required       |
| `status`   | string | "success", "error", "warning", "info"     | Required       |
| `duration` | number | Auto-dismiss time in milliseconds         | `3000`         |
| `position` | string | Position of the toast (e.g., "top-right") | `bottom-right` |

### `removeToast(id)`

Removes a toast manually.

```tsx
const { removeToast } = useToast();
removeToast("toast-1");
```

