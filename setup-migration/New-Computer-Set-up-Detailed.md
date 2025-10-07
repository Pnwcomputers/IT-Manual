# ☑️ New Computer Set-up (Detailed Checklist)

This guide outlines a methodical procedure for setting up a new PC, performing necessary optimizations, and migrating user data and software. **Do everything in groups and finish each section before moving to the next unless multi-tasking.**

**Note Taking:** Keep detailed notes about everything completed (findings, test results, recommendations) in **Microsoft OneNote, Notion, or Samsung Notes**.

---

## Group 1: Initial System Clean-up and Essential Software

### 1. System Clean-up 🧹
1.  **Uninstall** all pre-existing security programs/software.
2.  **Uninstall all obvious Bloatware:**
    * "Free Trial" software.
    * Obvious junk programs & toolbars.
3.  **Adware/Malicious Programs:** Use the PNW Computers “Browser Hi-jack” blog article as a reference to find and remove malicious Adware Programs.

### 2. Install/Update Essential Programs 🌐
1.  **Ninite.com Installation:** Use Ninite to install the following (or any other requested software):
    * Chrome, Firefox, Edge
    * Java, .Net & Silverlight Runtimes
    * Sumatra PDF
    * **Malwarebytes Antimalware**
    * Zoom
    * 7Zip
    * VLC Media Player
    * MusicBee
2.  **BleachBit Installation & Clean-up:**
    * Download and Install BleachBit: `https://www.bleachbit.org/download`
    * *(Prerequisite: You may need to install C++ 2010 Runtimes if an error occurs: https://answers.microsoft.com/en-us/windows/forum/all/msvcr100-dll/826a842c-7a2f-4ebc-bb21-4cee86b234b0)*
    * **Run Clean-up:** On its opening page, enable the following cleaning options:
        * Temporary Files
        * Web Browser(s) Cache
        * System Prefetch, Recycle bin & Temporary files
        * Windows Defender Quarantine & Log files

---

## Group 2: Performance Tune-Up

### 3. Performance Tune-Up 🚀
1.  **Paging File:** Set the PC's paging file (virtual memory) to either **$1.5$ times the amount of RAM or set to $4096\text{MB}$**.
2.  **Visual Effects Optimization:** Access the Performance Options menu:
    * Right-click **'My Computer' $\rightarrow$ Properties $\rightarrow$ Advanced System Settings**.
    * Click **'Advanced' tab** $\rightarrow$ Click **'Settings'** under the "Performance" area.
    * **Un-check** all visual effects options **except for:**
        * "Use visual styles on windows and buttons"
        * “Smooth Scroll List Boxes”
        * “Smooth Edges on Screen Fonts”
        * “Show Translucent Selection Rectangle”
        * "Use drop shadows for icon labels on the desktop"
3.  **Start-up Program Entries (Task Manager):**
    * **Disable all unnecessary start-up items.**
    * Typically leave start-up programs related to:
        * OneDrive/MS Office
        * iCloud Drive
        * Printers, WIFI Software, Audio/Video Software
        * Specialty apps (Garmin, Fitbit, etc.)

---

## Group 3: Data Migration and Software Installation

### 4. Data Transfer/Software Migration 💾
* **CLIENT RESPONSIBILITY WARNING:** The client is ultimately responsible for securing and backing up their data. We are not responsible for missing or lost data. Clients should hold onto their old system for $2-4$ weeks.
1.  **Browser Data:** Use existing account synchronization services or **export/import** browser data (Passwords, Bookmarks, etc.) from the old computer.
2.  **Personal Data Migration:**
    * **Transferrable Data:** Directly transfer data such as music, documents, pictures, etc.
    * **Software:** **ALL SOFTWARE must be reinstalled.** We cannot simply transfer programs.
    * **Licensing:** The client must provide any and all needed **account/product key information** for purchased software installation and activation.
3.  **Location Check:** We backup data from/to their default locations (My Documents, Pictures, etc.). The client is responsible for informing the technician of any data saved in **"non-standard" locations**.

### 5. User Software: Installation, Setup, Activation, Etc. 🔑
1.  **Microsoft Office:**
    * Install, Activate & Test.
    * Setup **Outlook email** and **email signature** if needed.
    * Open a document, spreadsheet, etc. to make sure all components work.
2.  Install and configure other user software:
    * Quicken/QuickBooks
    * TurboTax/Tax-it Deluxe
    * Zoom, Skype, Google Meet, etc.

---

## Group 4: Peripherals and System Updates

### 6. Peripheral Installation 🖨️
Install and verify all peripheral devices:
* Printers/Scanners, Dymo Label Printers
* Webcams, Microphones/Headphones
* Bluetooth Devices (Speakers, Mouse/Keyboard, Controller, etc.)

### 7. Windows Updates & Driver Verification 🔄
1.  **Enable Microsoft Updates:** Access Windows Updates $\rightarrow$ Advanced Options. Enable the **Microsoft Update** feature to check for both Windows and Microsoft program updates. Enable **“Notify me when a restart is required”**.
2.  **Run Updates:** Allow the system to check for new updates. Download and install all available updates. *(Repeat this process until no new updates are found).*
3.  **Failed Updates:** Do not hyper fixate on failed updates; they usually resolve after a few update/restart cycles.
4.  **Verify Drivers:** Verify the installation of all device drivers. Use software like **HWiNFO** (`https://www.hwinfo.com/download/`) or **CPUZ** (`https://www.cpuid.com/cpuz.php`) to identify hardware and correct any conflicts.
5.  **Restore Data to Desktop:** If the OS was reinstalled, **Place a copy (DO NOT MOVE)** of any/all backed up user data on the PC's desktop. Parse the data as needed (My Pictures, Videos, Documents, Etc).

---

## Group 5: System Customizations and Client Review

### 8. System Customizations ✨
Try to match the look and layout of the previous system:
* Start Menu Pinned Apps
* Desktop icons and their location
* The Windows Taskbar (icons, layout, auto-hide, etc.)
* File Explorer/Folder Navigation (Quick access folder shortcuts, Favorite folders list)
* Mapped network drives
* Default Apps (Default browser, Default PDF handler, etc.)
* Default Printer

### LASTLY: GO OVER THE SYSTEM WITH THE CLIENT! ✅
1.  Have the client get online and make sure the **browser is setup** and working; make corrections as needed.
2.  Have the client check their **email** and make sure it's all working; correct whatever is needed.
3.  Have the client **test printing, scanning** and any other functionality to ensure all is working correctly/as needed.
4.  **Recommendation:** Recommend the client hold onto their old systems for **$2-4$ weeks** so we can access the old system if/as needed.
