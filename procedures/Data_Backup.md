# 💻 Data Backup & System Migration Procedures

This document outlines the standard operating procedure for backing up data for archiving or migrating to a new system. It ensures data integrity, software continuity, and environment familiarity.

---

## 1. Core Data Backup
* **User Profile Folders:** Backup all standard user data: `Documents`, `Desktop`, `Favorites`, `Music`, `Pictures`, `Videos`, and `Downloads`.
* **Root Directory Check:** **Check `C:\` root directory** for any data folders stored outside the user profile (e.g., `C:\Scans`, `C:\QuickBooksData`, or custom project folders).
* **Cloud Redundancy Check:** Double-check `Documents`, `Desktop`, and `Pictures` to ensure they aren't being redirected to **OneDrive** or **Dropbox**. 
    * *Note:* If redirected, verify files are set to "Always kept on this device" before copying to physical backup media.

## 2. Browser Data & Account Sync
### A. Built-in Sync (Cloud-Based / Preferred)
* **Google Chrome:** Sign in > **Settings > Sync and Google services > Manage sync**. Enable "Sync everything."
* **Mozilla Firefox:** Sign in > **Settings > Sync**. Ensure Bookmarks, Passwords, History, and Add-ons are selected.
* **Microsoft Edge:** Sign in > **Settings > Profiles > Sync**. Enable all data toggles.

### B. Manual Backup (Offline / Local Transfer)
* **Bookmarks (HTML Export):** Access Bookmark Manager (`Ctrl+Shift+O`) > Export as **HTML file**.
* **Chromium-based (Chrome, Edge, Brave):** * **Manual:** Copy the `User Data` folder from `%LocalAppData%\Google\Chrome\User Data`.
    * **Tools:** Use **B4C All-in-One Browser Backup** for automated local migration.
* **Firefox-based:** Use **Hekasoft Backup & Restore** to migrate profiles between Firefox-engine browsers.
* **Opera:** Save open tabs to Speed Dial folders, then perform the HTML Bookmark export.

### C. System Credentials & Identity
* [**Windows Credential Manager:**](https://support.microsoft.com/en-us/windows/credential-manager-in-windows-1b5c916a-6a16-889f-8581-fc16e8165ac0) Backup Windows Credentials to preserve saved network passwords and server logins.
* **Microsoft Account:** Note the [**Microsoft Account address**](https://account.microsoft.com/account) used for Windows setup, Office activation, or OneDrive.
* **Account Review:** Navigate to **Settings > Accounts > Email & Accounts** and document all listed work or school accounts.

## 3. Email Configuration
### A. Microsoft Outlook
* **Data Files:** Locate and backup `.PST` files (POP3) or check for `.OST` files (IMAP/Exchange).
* **Metadata:** Export or manually document **Signatures**, **Custom Rules**, and **Auto-Complete (NK2) lists**.

### B. Mozilla Thunderbird
* **Built-in Export:** **Menu > Tools > Export**. Creates a single `.zip` containing the entire profile.
* **Manual Profile:** Copy the `%AppData%\Thunderbird\Profiles\` folder (e.g., `xxxxxxxx.default`).
    * **Note:** You must also copy the `profiles.ini` file located one level up to maintain profile mapping.
* **Local Folders:** Specifically verify if the user has "Local Folders" archives that exist outside of the mail server sync.

## 4. Software & Licensing
> [!IMPORTANT]
> **Software vs. Data:** Data is easily transferable; software is not. Most programs must be reinstalled and reactivated on the new system.

* **Installers:** If the original software installer is found on the old computer, copy it to the backup drive.
* **Product Keys:** * Locate physical media or digital receipts.
    * **Extraction:** If keys are lost, use a tool to attempt extraction from the registry. *Success is not guaranteed for modern versions.*
* **Vendor Portals:** Log in to vendor accounts (Adobe, Microsoft, Intuit) to verify available "seats" and download fresh installers.

---

## 🛡️ Post-Transfer Data Integrity & Security
*After moving data to the new system or external storage, perform these verification steps:*

### A. File System Integrity (CHKDSK)
1. Open **Command Prompt** as Administrator.
2. Run: `chkdsk X: /f` (Replace `X:` with the backup/data drive letter).

### B. Malware & Virus Scanning (MBAM)
1. Open **Malwarebytes (MBAM)**.
2. Right-click the backup folder/drive and select **"Scan with Malwarebytes"** to ensure no dormant threats are migrated.

---

## ✅ Summary Checklist
- [ ] **Data Sweep:** All user folders + `C:\` root verified.
- [ ] **Browsers:** Cloud Sync enabled OR HTML/Profile folders exported.
- [ ] **Credentials:** Windows Vault/Credential Manager noted/backed up.
- [ ] **Email:** PST files (Outlook) or Profile Zip (Thunderbird) captured.
- [ ] **Licensing:** All product keys located or extraction attempted.
- [ ] **Integrity:** `chkdsk` and Malware scan completed on moved data.

---

> **Client Responsibility:** While we perform every due diligence to protect systems and services, the client is ultimately responsible for the safety, security, and redundancy of their own data.

---
