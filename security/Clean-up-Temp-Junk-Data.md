# 🧹 Clean-up Temp & Junk Data: Windows (BleachBit) & Mac (OnyX) Guide

This guide details the use of two essential, free tools for technicians to perform deep cleaning and system maintenance on both Windows and macOS systems.

---

## I. Windows: Junk File Clean-up - BleachBit (Windows 10/11)

**BleachBit** is a free, open-source application used to quickly clean system junk, temporary files, and application caches on Windows.

### 1. Download and Installation

* **Download BleachBit:** Get the installer from the official website: `https://www.bleachbit.org/download`
* **Prerequisites (Troubleshooting):** If you receive an error during installation (e.g., related to `MSVCR100.dll`), you may need to install the **C++ 2010 Runtimes** from Microsoft's website.

### 2. Recommended Cleaning Options

On BleachBit's opening screen, enable the following cleaning options for a thorough junk file removal. **Always review options before selecting 'Clean'.**

* **System (Windows):**
    * `Temporary Files`
    * `Recycle bin`
    * `Prefetch` (Speeds up boot/app launch, but accumulated files can be old junk)
    * `Temporary files`
    * `Windows Defender` (Quarantine & Log files)
* **Web Browser(s) Cache:**
    * Enable **Cache** and **Cookies** for all installed browsers (Chrome, Firefox, Edge, etc.)
* **Applications:**
    * Review and select `Cache` and `Temporary files` for other applications (e.g., Adobe Reader, VLC media player).

---

## II. macOS: System Maintenance & Cleaning - OnyX (Mac)

**OnyX** is a multifunction utility for macOS used to verify system structure, rebuild databases, and perform cleaning and maintenance tasks, including clearing caches and temporary files. **Ensure you download the correct version for the Mac's specific macOS release (e.g., OnyX for Sequoia, OnyX for Sonoma, etc.).**

### 1. Download and Installation

* **Download OnyX:** Obtain the correct version for the target macOS from the official Titanium Software website: `https://www.titanium-software.fr/en/onyx.html`
* **Installation:**
    1.  Download the `.dmg` file.
    2.  Open the `.dmg` and drag the OnyX application to the **Applications** folder.
    3.  The first time it runs, OnyX will request the **administrator password** for full system access and may perform an initial **Verification of the startup disk structure**.

### 2. Essential Cleaning Procedures (Maintenance Tab)

The primary area for junk file removal is under the **Maintenance** tab.

* **Initial Step: Verification & Maintenance Scripts:**
    * Navigate to the **Maintenance** tab.
    * It is generally recommended to allow OnyX to run the **Maintenance Scripts** (Daily, Weekly, Monthly) if they haven't been run recently.
    * You may also choose to run a **Smart Scan** or **Verify the structure of the system files** if the system has been unstable.
* **Cleaning Cache and Junk Data:**
    * Navigate to the **Cleaning** tab (often a sub-tab under Maintenance).
    * Select the items for removal. Recommended options for clearing junk:
        * **System:** Enable options like `System Cache` and `Diagnostic Reports`.
        * **Applications:** Enable options like `Application Caches` and `Logs`.
        * **Internet:** Enable `Browser Caches` (Safari, Chrome, etc.) and `History`.
        * **Users:** Enable `User Cache` and `Logs`.
        * **Trash:** Enable `Trash` (Empties the Recycle Bin).
* **Execution:**
    * Once selections are made, click the **Run Tasks** button.
    * OnyX will typically require a **system restart** after a deep cleaning/maintenance procedure to fully apply changes and clear certain locked caches.
