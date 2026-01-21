# 🖨️ Printer Setup & Troubleshooting

**Part of the [IT-Manual](../README.md)**
*Guides for installing, configuring, and fixing printers for macOS and Windows clients.*

---

## 📖 Overview
Printers are the most common source of frustration for clients. This directory contains the standard operating procedures for installing local/network printers, troubleshooting connectivity drop-outs, and locating official drivers.

## 📂 Contents

### 📦 Installation & Setup
*Procedures for new deployments or reinstallations.*

- **[Printer New Printer Setup (PC & Mac)](./Printer-New-Printer-Setup-PC-Mac.md)**
  General workflow for unboxing, removing shipping tape, installing ink/toner, and performing the initial network handshake.
- **[Printer Installation (OSX)](./Printer-Installation-OSX.md)**
  Specific steps for adding printers on macOS, including AirPrint vs. Driver decisions.
- **[Static IP & Hostname Setup](./Static-IP-Hostname-Setup.md)**
  **Critical for Stability:** How to assign a persistent IP address to a printer to prevent it from going "Offline" when the router reboots.

### 🛠️ Troubleshooting
*Platform-specific fixes for common errors.*

- **[Printer Troubleshooting (Windows OS)](./Printer-Troubleshooting-Windows-OS.md)**
  Fixes for "Print Spooler" errors, stuck queues, and the dreaded "Driver Unavailable" status.
- **[Printer Troubleshooting (OSX)](./Printer-Troubleshooting-OSX.md)**
  Resolving "Filter Failed" errors, communication blocks, and resetting the macOS printing system.

### 🔗 Resources
*Driver downloads and manuals.*

- **[Printer & Scanner Support Sites](./Printer-Scanner-Support-Sites.md)**
  A curated list of official driver download pages (HP, Brother, Epson, Canon) to avoid "driver scams" and bloatware sites.

---

## ⚡ Quick Tip: WSD vs. TCP/IP
*The #1 cause of "Printer Offline" issues on Windows.*

[Image of Windows Printer Port Selection screen showing TCP/IP vs WSD]

When installing a network printer on Windows, the OS often defaults to **WSD (Web Services for Devices)** ports. These are unstable and often cause the printer to show as "Offline" after a reboot.

**The Golden Rule:**
Always force the installation to use a **Standard TCP/IP Port**.

1.  **Find the IP:** Print a Network Configuration page from the printer.
2.  **Lock the IP:** Follow the **[Static IP Setup](./Static-IP-Hostname-Setup.md)** guide.
3.  **Install Port:** On Windows, go to *Printer Properties -> Ports -> Add Port -> Standard TCP/IP Port* and enter the static IP.

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
