# 🍎 Apple macOS Support

**Part of the [IT-Manual](../README.md)**
*Troubleshooting, optimization, and repair guides for Apple computers.*

---

## 📖 Overview
This directory contains standard operating procedures for servicing macOS devices (MacBook, iMac, Mac mini). It covers startup failures, software conflicts (specifically Microsoft Office on Mac), and routine maintenance/cleanup.

## 📂 Contents

### 🚑 System Recovery & Startup
*Diagnosing boot failures and cleaning up the OS.*

- **[Mac Computer Start-up Repairs](./Mac-Computer-Start-up-Repairs.md)**
  Procedures for resolving boot loops, "Folder with Question Mark" errors, and using Disk Utility in Recovery Mode.
- **[Mac & Apple System Log Diagnostics](./Mac-Apple-System-Log-Diagnostics.md)**
  How to use Console.app to read Kernel Panics and crash reports to identify hardware vs. software faults.
- **[System Clean Up (MBAM & Onyx)](./Mac-System-Clean-Up-MBAM-Free-Onyx.md)**
  The standard "Tune-Up" procedure: Using Malwarebytes (MBAM) for removal and Onyx for clearing system caches/font databases.
- **[Data Backup & Restore](./Data-Backup-Restore-Mac.md)**
  Methods for using Time Machine, Carbon Copy Cloner, and manual user profile migration.

### 💿 Software & Accounts
*Solving application and identity issues.*

- **[Apple ID Login Troubleshooting](./Apple-ID-Login-Troubleshooting.md)**
  Resolving iCloud sync issues, App Store lockouts, and password loops.
- **[Mac MS Office Troubleshooting](./Mac-MS-Office-Troubleshooting.md)**
  Fixing Word/Excel crashes, license activation errors, and corrupted preferences.
- **[Mac Outlook Troubleshooting](./Mac-Outlook-Troubleshooting.md)**
  Specific fixes for Outlook profile corruption, database rebuilding, and sync errors on macOS.

### 🖨️ Peripherals
*Connectivity for external devices.*

- **[New Printer Setup (Mac)](./New-Printer-Setup-Mac.md)**
  Standard installation using AirPrint vs. Manufacturer Drivers.
- **[Printer Troubleshooting (OSX)](./Printer-Troubleshooting-OSX.md)**
  Resolving "Filter Failed" errors, paused print queues, and communication issues.

---

## ⚡ Quick Reference: Boot Modes
*The method to access Recovery Mode depends on the processor architecture.*

[Image of Apple Silicon M1 chip versus Intel Processor logo]

| Mode | Intel Macs | Apple Silicon (M1/M2/M3) |
| :--- | :--- | :--- |
| **Recovery Mode** | Hold `Cmd + R` immediately after power on. | Hold **Power Button** until "Loading Startup Options" appears. |
| **Boot Menu** | Hold `Option` (Alt). | Hold **Power Button** (same as above). |
| **Safe Mode** | Hold `Shift`. | Select disk in Boot Menu, hold `Shift`, click "Continue in Safe Mode". |
| **Diagnostics** | Hold `D`. | Hold `Cmd + D` at the Boot Menu screen. |
| **Reset NVRAM** | Hold `Cmd + Opt + P + R`. | *N/A (Reset automatically on restart).* |

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
