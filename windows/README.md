# 🪟 Windows 10 & 11 Support

**Part of the [IT-Manual](../README.md)**
*Troubleshooting guides for boot failures, networking, and update errors on Microsoft OS.*

---

## 📖 Overview
This directory serves as the troubleshooting hub for Windows workstations. It focuses on resolving "Break/Fix" issues: machines that won't boot, updates that refuse to install, and computers that can't "see" each other on the local network.

## 📂 Contents

### 🚑 Boot & Recovery
*Fixing machines that won't start or need licensing help.*

- **[Windows 10/11 Failing To Boot](./Windows-10-11-Failing-To-Boot.md)**
  **Start Here for Blue Screens:** Procedures for using Automatic Repair, rebuilding the BCD (Boot Configuration Data), and fixing "Inaccessible Boot Device" errors.
- **[Windows 11 Product Key Retrieval](./Windows-11-Product-Key-Retrieval.md)**
  Methods for extracting the OEM product key embedded in the motherboard BIOS (useful when reinstalling Windows on a machine with no sticker).

### 🌐 Networking & Sharing
*Connectivity and local file sharing configuration.*

- **[Setting Network Location (Private vs Public)](./Setting-Network-Location-Private-Public-Windows-10-11.md)**
  **The #1 cause of printer/sharing failures.** How to switch a network profile from "Public" (Hidden) to "Private" (Discoverable) so the PC can talk to printers and other computers.
- **[Windows File & Print Sharing](./Windows-File-Print-Sharing.md)**
  Steps for enabling SMB protocols, turning on network discovery, and configuring folder permissions for simple workgroups.
- **[Editing Windows Host File](./Editing-Windows-Host-File.md)**
  How to manually override DNS for specific domains by editing `C:\Windows\System32\drivers\etc\hosts`.

### 🛠️ Maintenance & Updates
*Solving OS rot and update loops.*

- **[Windows Update Troubleshooting](./Windows-Update-Troubleshooting.md)**
  Scripts and commands to stop the update services, clear the `SoftwareDistribution` cache, and force a clean update check.
- **[Websites for Diagnostics & Assistance](./Websites-Diagnostics-Assistance.md)**
  A list of trusted repositories for Windows ISOs, drivers, and error code lookups.

---

## ⚡ Quick CMD Reference
*Run these in Command Prompt (Admin) for instant fixes.*

| Task | Command / Procedure |
| :--- | :--- |
| **Get BIOS Key** | `wmic path softwarelicensingservice get OA3xOriginalProductKey` |
| **Fix "Corrupt" System** | `sfc /scannow` |
| **Fix Update Image** | `dism /online /cleanup-image /restorehealth` |
| **Check Disk** | `chkdsk c: /f /r` |
| **Force GPO Update** | `gpupdate /force` |
| **Reset Network** | `netsh int ip reset` then `netsh winsock reset` |

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
