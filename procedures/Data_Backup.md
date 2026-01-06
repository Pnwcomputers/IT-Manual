# 💻 System Migration & Data Backup Procedure

This document outlines the standard operating procedure for transitioning a user from an old workstation to a new system. It ensures data integrity, software continuity, and environment familiarity.

---

## 1. Core Data Backup
* **User Profile Folders:** Backup all standard user data: `Documents`, `Desktop`, `Favorites`, `Music`, `Pictures`, `Videos`, and `Downloads`.
* **Root Directory Check:** **Check `C:\` root directory** for any data folders stored outside the user profile (e.g., `C:\Scans`, `C:\QuickBooksData`, or custom project folders).
* **Redundancy Check:** Double-check `Documents`, `Desktop`, and `Pictures` specifically to ensure they aren't being redirected to OneDrive or Dropbox; if they are, verify that files are "Always kept on this device" before backing up.

## 2. Credentials & Browser Data
* **Windows Credential Manager:** Backup Windows Credentials to preserve saved network passwords, server logins, and certificate-based identities.
* **Browser Data:** Backup bookmarks, history, and saved passwords for **ALL** browsers (Chrome, Firefox, Edge, etc.).
* **Account Synchronization:**
    * Note the user account used for **Web Browser data synchronization**.
    * Note the **Microsoft Account address** used for Windows setup, Office activation, or OneDrive.
    * Navigate to **Settings > Accounts > Email & Accounts** and document all listed accounts.

## 3. Email Configuration
* **Data Files:** Locate and backup `.PST` or `.OST` files for Outlook or the specific profile folders for Thunderbird.
* **Account Metadata:** Export or manually document:
    * Email Signatures
    * Custom Rules and Alerts
    * Auto-Complete (NK2) lists

## 4. Software & Licensing
> [!IMPORTANT]
> **Software vs. Data:** Data is easily transferable, but software is not. Most programs must be reinstalled and reactivated on the new system.

* **Installers:** If the original software installer is found on the old computer, copy it to the backup drive.
* **Product Keys:** * Locate physical media (CDs/USBs) or digital purchase receipts.
    * **Extraction:** If keys are lost, a tool will be used to attempt extraction from the registry. *Success is not guaranteed.*
* **Vendor Portals:** Check for online accounts (Adobe, Microsoft Dashboard, Intuit) to verify available "seats" and download fresh installers.

## 5. Peripherals & Environment
* **Printers:** Identify all installed printers and note which is the "Default." Pre-download the latest drivers for the new Operating System.
* **Visual Continuity:** Take a screenshot of the **Desktop icon placement** and the Taskbar.
* **Network Mapping:** Document any mapped network drives (e.g., `Z:\` drive paths) and shared folder permissions.

---

## 🛡️ Post-Transfer Data Integrity & Security
*After moving data to the new system or external storage, perform the following checks:*

### A. File System Integrity (CHKDSK)
Run a disk check to ensure no data corruption occurred during the transfer process, especially if using older external hard drives.
1. Open **Command Prompt** as Administrator.
2. Run the following command (replace `X:` with the drive letter containing the moved data):
   `chkdsk X: /f`
3. If the data is on the main OS drive, you may need to schedule the scan for the next reboot.

### B. Malware & Virus Scanning (MBAM)
Scan the transferred data to ensure no dormant threats are migrated to the new system.
1. Open **Malwarebytes (MBAM)**.
2. **Right-Click Method:** Navigate to the folder or drive where the data was moved in File Explorer, right-click it, and select **"Scan with Malwarebytes."**
3. **Custom Scan Method:** In the MBAM app, go to **Scanner > Custom Scan > Configure Scan** and select the specific drive/folders to be verified.

---

## ✅ Summary Checklist
- [ ] **Data Sweep:** All user folders + `C:\` root verified.
- [ ] **Browsers:** Bookmarks and Passwords exported/synced.
- [ ] **Credentials:** Windows Vault/Credential Manager noted.
- [ ] **Email:** PST files, Signatures, and Rules backed up.
- [ ] **Licensing:** All product keys located or extracted.
- [ ] **Integrity:** `chkdsk` and Malware scan completed on moved data.

---

> **Client Responsibility:** While we perform every due diligence to protect systems and services, the client is ultimately responsible for the safety, security, and redundancy of their own data.

---
