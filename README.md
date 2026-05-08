<p align="center">
  <img src="assets/logo.png" width="150">
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

---

## Overview

PiCoreX is a lightweight monitoring dashboard designed for Raspberry Pi and Linux systems.

It provides real-time system information through a modern web interface, making it easy to monitor your server directly from your browser.

Originally built for my own Raspberry Pi 5 homelab setup, PiCoreX is now evolving into an open-source project that anyone can self-host.

---

## Preview

![PiCoreX Dashboard](assets/dashboard.png)

---

## Features

### System Monitoring
- Real-time CPU usage
- RAM usage and memory details
- Disk usage
- CPU temperature monitoring
- System uptime
- Hostname and local IP address
- Kernel and system information

### Services & Containers
- Running system services detection
- Docker containers monitoring
- Running / stopped container status
- Container image and ports overview

### Network
- Live upload and download usage
- Automatic refresh every few seconds

### Interface
- Modern responsive dark UI
- Mobile-friendly dashboard
- Animated progress bars and charts
- Lightweight and fast

---

## Tech Stack

- Python
- Flask
- psutil
- HTML5
- CSS3
- Vanilla JavaScript

---

## Installation

Clone the repository:

```bash
git clone https://github.com/xbigi/PiCoreX.git
cd PiCoreX
