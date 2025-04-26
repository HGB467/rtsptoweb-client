# RTSP to Web Client (React)

A modern **React** frontend for connecting to the [RTSP to Web (Rust Server)](https://github.com/HGB467/rtsptoweb-server), enabling **live RTSP streaming** in the browser via **WebRTC** and **HLS**.

Includes optional **Object Detection** powered by [ml5.js](https://ml5js.org/) for real-time stream analysis.

---

## ✨ Features

- Connect to the RTSP to Web backend and stream RTSP feeds directly in the browser.
- Supports both **WebRTC** (low latency) and **HLS** (rewindable, adaptive) streaming modes.
- **Object Detection** available using **ml5.js**.
- UI built with **React** and **Tailwind CSS**.
- User-selectable stream types and qualities (if available).
- Displays basic stream metadata and connection status.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

Make sure the [rtsptoweb-server](https://github.com/HGB467/rtsptoweb-server) is already running.

---

### Installation

Clone the repository:

```bash
git clone https://github.com/your-org/rtsptoweb-client.git
cd rtsptoweb-client
```

Install dependencies:

```bash
npm install
```

or if you use yarn:

```bash
yarn install
```

---

### Running the Client

Start the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

By default, the app will be available at:

```
http://localhost:5173
```

Make sure it is properly configured to connect to your running RTSP to Web backend server.

---

## 🧠 Object Detection (Optional)

- Real-time object detection can be enabled on incoming video streams.
- Implemented using **ml5.js**, a user-friendly library built on top of TensorFlow.js.
- Detection results are overlaid directly on the video in real time.

---

## ⚡ Notes

- Object detection is optional and may consume additional CPU/GPU resources.
- Detection models are loaded dynamically when enabled.

