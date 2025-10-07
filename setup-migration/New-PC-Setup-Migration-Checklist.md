# ☑️ New PC Set Up/Migration Check List

This checklist details the steps necessary to back up data from an old PC and properly set up and migrate that data to a new PC, ensuring a seamless user experience.

---

## 1. OLD PC TO-DO (Pre-Migration)

### Backup and Documentation:

* **Backup all user data:** (Documents, Desktop, Favorites, Music, Pictures, etc.)
    * *Note: Check the `C:\` root directory as well for any stray data.*
* **Backup Windows Credentials:** Use the **Windows Credential Manager** to export saved passwords.
* **Backup browser data:** Export bookmarks, passwords, and history from Chrome, Firefox, Edge, etc.
* **Document Setup:** Take a picture of the old **Desktop icons and their placement**, quick access folders, network shares, and favorited folders.
* **Printer Assessment:** Assess what printer(s) is being used and which printer is the default; download necessary drivers.
* **Outlook Backup:** Backup email rules and signatures for Outlook (if/as needed).

---

## 2. NEW PC TO-DO (Initial Setup & Configuration)

### Initial Windows Setup

1.  **OOBE/BYPASSNRO:** Use the bypass command (`Shift + F10`, then `OOBE\BYPASSNRO` or select "I don't have internet") at the start of the Windows 11 setup to bypass the network requirement and accept the limited experience warning.
2.  **User Account:** Set the new user account name to match the old system's setup.

### Cleanup and Updates

1.  **Remove Bloatware:** Uninstall bloatware (LinkedIn, Instagram, Clipchamp, Free Trial Software, Express VPN, etc.) and perform general clean-up and optimization (startup apps, etc.).
2.  **Windows Updates:** Set up and run **Windows Updates**; activate **Microsoft Updates** (for Office, etc.).
3.  **Microsoft Store:** Run **Microsoft Store Updates**.

### Network Configuration

1.  **Set Network Profile:** Set the Network connection to **Private** (vs being Public).
2.  **Advanced Sharing:** Update **Advanced Share Settings** in Networking settings after setting the profile to Private.
3.  **Install SMB 1 (If needed):** Required for older NAS or server connections.
    * *Via "Control Panel" $\rightarrow$ "Programs & Features" $\rightarrow$ "Turn Windows features on or off" (Add/Remove Windows Components).*

### System & App Installation

1.  **Desktop Icons:** Re-create desktop shortcuts, pinned taskbar items, and quick access folders (e.g., My Computer, User Folder).
2.  **Basic Application Installation:** Install core apps (Security Apps, BleachBit, Java, Chrome, etc.).
3.  **Install Adobe Reader:** Set Adobe Reader (or alternative) as the default PDF handler.
4.  **Install Other Apps:** Install any other 3rd party apps (Paint.net, Zoom, Skype, LibreOffice, Signal, etc.).
5.  **Peripherals:** Install Printer, Scanner, Webcam, USB hubs (check all devices are working), etc.
6.  **Microsoft Office:** Install Microsoft Office; set up/purchase through the user’s Microsoft account (if/as needed).
7.  **Set User Password:** Set up the user account password; use the previously used password (if/as needed).

---

## 3. NEW PC TO-DO (Data Migration & Verification)

* **Migrate Previous System Data:** Restore user data (Documents, Pictures, etc.).
* **Import Browser Data:** Import browser bookmarks and passwords.
* **Import Windows Credentials:** Restore saved passwords via Windows Credentials.
* **Email Setup:** Set up Outlook or Windows Mail/Outlook New (if/as needed).
* **Outlook Migration:**
    * Migrate email rules and signature (if/as needed).
    * Migrate email data (if/as needed).
    * Make sure Outlook contacts are migrated (if/as needed).
* **Remap Drives:** Remap any needed network drives (if/as needed).
* **Remap Favorites:** Remap any needed quick access folders/favorites (if/as needed).
