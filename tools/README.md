# 🔧 Tools & Utilities

**Part of the [IT-Manual](../README.md)**
*Guides for bootable media, physical tools, and trusted online resources.*

---

## 📖 Overview
This directory acts as the inventory and instruction manual for the "Technician's Toolkit." It covers how to create the necessary boot drives (USBs) for OS installation, which physical tools to use for hardware repairs, and which websites are trusted for drivers and firmware.

## 📂 Contents

### 💾 Bootable Media (The "Rescue Drive")
*How to create and use the digital tools we carry.*

- **[Bootable USB](./Bootable-USB.md)**
  **The Most Important Tool:** Instructions for creating a multi-boot USB drive (using tools like Ventoy or Rufus). Covers loading Windows Installers (ISOs), Linux Live environments, and diagnostic tools (MemTest) onto a single stick.

### 🛠️ Hardware & Software Lists
*What to use and how to use it.*

- **[General Tools](./General_Tools.md)**
  A master list of the physical hardware (screwdrivers, spudgers, thermal paste) and software utilities (Ninite, TreeSize, etc.) recommended for the bench.
- **[Tools Usage](./Tools-Usage.md)**
  Best practices and safety guidelines for handling specific tools to avoid damaging client hardware (e.g., proper torque, ESD safety, prying techniques).

### 🌐 Web Resources
*Where to find drivers and manuals.*

- **[Websites for Diagnostics & Assistance](./Websites-Diagnostics-Assistance.md)**
  A curated list of trusted URLs. Includes official driver pages (avoiding "driver scam" sites), service manual repositories (like iFixit), and firmware lookups.

---

## ⚡ The Essential USB Drive
*Every technician's USB drive must contain the following ISOs at minimum (Ref: `Bootable-USB.md`):*

| Category | ISO / Tool | Purpose |
| :--- | :--- | :--- |
| **OS Installers** | **Windows 10 & 11** | Clean installs and "Repair your computer" environment. |
| **Live Linux** | **Ubuntu** or **Mint** | Data recovery when Windows won't boot. |
| **Diagnostics** | **MemTest86** | RAM testing (boots outside the OS). |
| **Partitioning** | **GParted Live** | Resizing partitions or wiping drives securely. |
| **Password Reset** | **Hirens BootCD** (or similar) | Resetting local Windows passwords. |

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
