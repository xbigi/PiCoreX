<p align="center">
  <img src="assets/logo.png" width="140" alt="PiCoreX Logo">
</p>

<h1 align="center">PiCoreX</h1>

<p align="center">
  Lightweight self-hosted monitoring dashboard for Raspberry Pi and Linux servers.
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/xbigi/PiCoreX?style=for-the-badge&color=7c3aed">
  <img src="https://img.shields.io/github/license/xbigi/PiCoreX?style=for-the-badge&color=22d3ee">
  <img src="https://img.shields.io/github/last-commit/xbigi/PiCoreX?style=for-the-badge&color=22c55e">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 📸 Preview

![PiCoreX Dashboard](assets/dashboard.png)

---

## ✨ Overview

**PiCoreX** is a clean, modern monitoring dashboard built for Raspberry Pi and Linux systems. It gives you real-time system stats directly in your browser — no terminal commands, no bloated monitoring stacks.

Originally built for my own Raspberry Pi 5 homelab, it's now open-source and designed to be as simple to deploy as it is to use.

---

## 🚀 Features

### 🖥️ System Monitoring
- Real-time CPU, RAM, and disk usage
- CPU temperature & system uptime
- Hostname, local IP, kernel and OS info

### 🐳 Services & Containers
- Running system services detection
- Docker container monitoring (running/stopped status, image, ports)

### 🌐 Network
- Live upload/download speed
- Auto-refreshing every few seconds

### 🎨 Interface
- Modern responsive dark UI
- Mobile-friendly layout
- Animated progress bars and charts
- Fast and lightweight — runs happily on a Pi

---

## 🛠️ Tech Stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Backend   | Python, Flask, psutil        |
| Frontend  | HTML5, CSS3, Vanilla JS      |

---

## 📦 Installation

> **Requirements:** Python 3.7+, pip, (optional) Docker for container monitoring.

### 1. Clone the repository

```bash
git clone https://github.com/xbigi/PiCoreX.git
cd PiCoreX
```

### 2. Create a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start PiCoreX

```bash
python3 app.py
```

You should see:

```
* Running on http://0.0.0.0:5050
```

### 5. Open the dashboard

Visit in your browser:

```
http://YOUR_LOCAL_IP:5050
```

> **Example:** `http://192.168.1.5:5050`

---

## 📁 Project Structure

```
PiCoreX/
│
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
│
├── static/
│   ├── style.css           # Dashboard styles
│   └── script.js           # Frontend logic
│
├── templates/
│   └── index.html          # Dashboard template
│
└── assets/
    ├── logo.png
    └── dashboard.png
```

---

## 🗺️ Roadmap

Here's what's planned. Contributions are welcome on any of these!

#### 📊 Monitoring
- [ ] Historical resource charts
- [ ] Per-core CPU monitoring
- [ ] Disk temperature support
- [ ] GPU monitoring
- [ ] Network speed graphs

#### 🐳 Docker
- [ ] Live container resource usage
- [ ] Container restart controls
- [ ] Docker logs viewer
- [ ] Docker Compose detection

#### ⚙️ System
- [ ] Service management (start/stop)
- [ ] Reboot / shutdown controls
- [ ] Notifications and alerts
- [ ] Multi-server support

#### 🔒 Security
- [ ] Authentication system
- [ ] User accounts
- [ ] HTTPS support
- [ ] Access tokens

#### 🎨 Interface
- [ ] Theme customization
- [ ] Real-time WebSocket updates
- [ ] Improved animations and charts


## 📄 License

Distributed under the [MIT License](LICENSE).
