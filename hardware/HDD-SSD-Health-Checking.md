# 💿 HDD/SSD Health Checking

This guide provides methods and tools for diagnosing the health and integrity of hard disk drives (HDDs) and solid-state drives (SSDs) on both PC (Windows/Linux) and Mac systems.

---

## 💻 PC HDD/SSD Health Checking

### System File and File System Integrity

* **BIOS/UEFI Check:** Some motherboards' BIOS/UEFI includes a **built-in NVMe health checking utility**.
* **Check Disk Utility:** Use the Windows command **`chkdsk /r /f`** to find and fix file system issues and scan for bad sectors.
* **System File Checker:** Use **`sfc /scannow`** to scan for and fix damaged Windows system files.

### Manufacturer and Advanced Diagnostics

* **Manufacturer Tools:** Run a manufacturer's HD diagnostic test (e.g., Western Digital Data Lifeguard Diagnostic, SeaTools for Seagate).
* **Verification:** Use the manufacturer's tool **and/or** the **Seagate/Ontrack HD diagnostic utility** for result verification.
* **Bootable Toolkits:** Utilize diagnostic software found on bootable environments:
    * **Hiren’s All-In-One Bootable USB**
    * **Medicat Bootable USB**
    * **USB Bootable Manufacturer Diagnostics Utility**

### SMART Data Monitoring

Use dedicated third-party software to check SSD and HDD health stats and **SMART** (Self-Monitoring, Analysis, and Reporting Technology) information:

* [**CrystalDiskInfo**](https://crystalmark.info/en/software/crystaldiskinfo/)
* [**GSmartControl**](https://gsmartcontrol.shaduri.dev/downloads)

#### Key SMART Attributes to Look For:

* **Reallocated Sector Count** (Indicates bad sectors replaced with spares.)
* **Current Pending Sector Count** (Sectors waiting to be reallocated.)
* **Errors in the logs or SMART testing.**

---

## 🍏 Mac HDD/SSD Health Checking

### 1. [Disk Utility](https://support.apple.com/guide/disk-utility/welcome/mac) (Built-in macOS Tool)

Disk Utility is the native macOS tool for managing and diagnosing drives.

#### Steps to Check Drive Health in Disk Utility:

1.  **Open Disk Utility:** Press $\text{Command}$ ($\text{⌘}$) + $\text{Space}$ and type `Disk Utility`, or go to **Applications $\rightarrow$ Utilities $\rightarrow$ Disk Utility**.
2.  **Select Your Drive:** In the left-hand panel, click on the **top-level drive** (e.g., "APPLE SSD..." or "Macintosh HD"), not the volume.
3.  **Check SMART Status (Internal Drives Only):** Look at the bottom of the window for the **SMART Status** indicator:
    * **"Verified"** $\rightarrow$ The drive is healthy.
    * **"Failing"** $\rightarrow$ The drive is in poor condition and should be replaced soon.
4.  **Run First Aid:** Click **First Aid** in the top menu, then click **Run** to check for file system errors and attempt repairs.

### 2. [SMART Utility via Terminal](https://www.liquidweb.com/blog/smartctl-utility-in-smartmontools-for-linux/) (Built-in)

You can check the basic SMART status directly using the Terminal application.

1.  **Open Terminal:** **Finder $\rightarrow$ Applications $\rightarrow$ Utilities $\rightarrow$ Terminal**.
2.  **Run the Command:**
    ```bash
    diskutil info disk0 | grep SMART
    ```
3.  **Output:** "SMART Status: Verified" indicates good health; "SMART Status: Failing" indicates imminent failure.

### 3. Third-Party macOS Tools

| Tool | Type | Key Features | Notes |
| :--- | :--- | :--- | :--- |
| [**DriveDx**](https://binaryfruit.com/drivedx) | Free Trial (Paid Full) | **Best Mac monitor.** Detailed SMART attributes, failure prediction, works with internal and external drives. | `https://binaryfruit.com/drivedx` |
| [**SMARTReporter**](https://www.corecode.io/smartreporter/) | Free | Monitors SMART status from the menu bar and alerts you before a potential failure. | `https://www.corecode.io/smartreporter/` |
| [**Blackmagic Disk Speed Test**](https://apps.apple.com/us/app/blackmagic-disk-speed-test/id425264550?mt=12) | Free | **Performance Testing.** Checks read/write speeds, which can indicate drive degradation. | Download from the Mac App Store. |
