# 🛠️ Windows 10/11 Failing to Boot: Technician's Troubleshooting Guide

This guide provides a structured, tiered approach for technicians to diagnose and resolve Windows 10/11 boot failures, moving from basic checks to advanced recovery procedures.

---

## I. Initial Hardware & Power Checks (Start Here)

**Objective:** Rule out simple physical and power-related issues before focusing on the OS.

* **1.1 Remove Peripherals:**
    * **Action:** Disconnect all unnecessary peripherals (external drives, USB hubs, printers, etc.). Only the monitor, keyboard, and power cable should remain.
    * **Reason:** External devices can interfere with the boot sequence (e.g., incorrect boot order) or cause power conflicts.
* **1.2 Verify Power & Display:**
    * **Action:** Confirm the power supply unit (PSU) fan is spinning, lights are on, and the monitor cable is secure. If a desktop, check if the power indicator LED on the motherboard is lit.
    * **Reason:** A faulty power supply or simple display issue can mimic a boot failure.
* **1.3 Check for POST Errors/Beep Codes:**
    * **Action:** Listen for **Beep Codes** or look for on-screen **POST (Power-On Self-Test) errors** (e.g., "No boot device found," "CPU Fan Not Detected").
    * **Reason:** These codes indicate a hardware failure (RAM, CPU, GPU, storage) that must be addressed first.
* **1.4 Reseat Internal Components:**
    * **Action:** Power off, unplug the system, and reseat the **RAM sticks** and the **primary storage drive** (HDD/SSD) data and power cables. 
    * **Reason:** Loose connections are a common cause of boot failure, particularly after physical movement or internal modifications.

---

## II. BIOS/UEFI Configuration & Boot Order
**Objective:** Ensure the system is attempting to boot from the correct device.

* **2.1 Access BIOS/UEFI:**
    * **Action:** Restart the system and repeatedly press the key specified by the manufacturer (**DEL**, **F2**, **F10**, or **F12**) to enter the BIOS/UEFI setup.
* **2.2 Verify Boot Order:**
    * **Action:** Navigate to the **Boot** or **Boot Order/Priority** section. Ensure the primary OS drive (HDD/SSD) is set as the **first boot device**.
    * **Note:** If the drive is not listed, the hardware check (I.4) needs re-evaluation or the drive may be faulty.
* **2.3 Check Drive Recognition:**
    * **Action:** In the BIOS/UEFI, check the main screen or **Storage** section to confirm the primary OS drive is detected and correctly identified by model and capacity.
* **2.4 Reset CMOS (If Necessary):**
    * **Action:** If all else fails, reset the BIOS/UEFI settings to their defaults or remove and replace the **CMOS battery** (CR2032 coin cell) to clear persistent configuration issues.

---

## III. Windows Recovery Environment (WinRE)

**Objective:** Utilize built-in Windows tools to repair OS files, configuration data, and boot sectors. This requires a **Windows Installation/Recovery Media USB/DVD**.

* **3.1 Access WinRE:**
    * **Method A (If system enters Automatic Repair loop):** Select **Advanced options** when prompted.
    * **Method B (Force Entry - Power Cycling):** Power on the PC, and as the Windows logo appears, press and hold the power button to force a shutdown. Repeat this step two more times (three total power interruptions). On the fourth boot, the system should enter WinRE.
    * **Method C (Using Installation Media):** Boot from the USB/DVD. On the setup screen, select **Next** $\rightarrow$ **Repair your computer** $\rightarrow$ **Troubleshoot**.
* **3.2 Startup Repair:**
    * **Action:** Select **Troubleshoot** $\rightarrow$ **Advanced options** $\rightarrow$ **Startup Repair**.
    * **Reason:** This tool automatically attempts to fix common boot problems like corrupted **Boot Configuration Data (BCD)** or missing system files.
* **3.3 System Restore/Uninstall Updates:**
    * **Action (System Restore):** Select **Advanced options** $\rightarrow$ **System Restore**. Choose a restore point from before the boot issue began.
    * **Action (Uninstall Updates):** Select **Advanced options** $\rightarrow$ **Uninstall Updates**. Remove the latest **Quality** or **Feature** update if the problem started immediately after an update.

---

## IV. Advanced Command Prompt Recovery

**Objective:** Manually repair critical boot components (MBR, Boot Sector, BCD) and check for system file/disk corruption.

* **4.1 Access Command Prompt:**
    * **Action:** In WinRE, select **Troubleshoot** $\rightarrow$ **Advanced options** $\rightarrow$ **Command Prompt**.
* **4.2 Repair Boot Records:**
    * **Action:** Execute the following commands, pressing Enter after each:
        ```
        bootrec /fixmbr
        bootrec /fixboot
        bootrec /scanos
        bootrec /rebuildbcd
        ```
    * **Reason:** These commands repair the **Master Boot Record (MBR)**, create a new boot sector, scan for Windows installations, and rebuild the BCD store.
* **4.3 System File Checker (Offline):**
    * **Action:** Run the System File Checker to repair corrupted or missing critical Windows files. (The drive letters might be different in WinRE; use `diskpart` to confirm the Windows drive, typically $C:$ or $D:$).
        ```
        sfc /scannow /offbootdir=C:\ /offwindir=C:\Windows
        ```
* **4.4 Check Disk for File System Errors:**
    * **Action:** Run the Check Disk utility to scan and fix errors on the system volume.
        ```
        chkdsk /r C:
        ```
    * **Reason:** The `/r` flag locates bad sectors and recovers readable information, often requiring a system restart to complete.

---

## V. Data Recovery and Reinstallation (Last Resort)

**Objective:** If all repairs fail, prioritize data preservation before attempting a full OS reset or clean install.

* **5.1 Data Backup:**
    * **Action:** Use Command Prompt in WinRE or a third-party bootable environment (like a Linux Live USB) to copy user data to an external drive.
* **5.2 Reset this PC (WinRE):**
    * **Action:** Select **Troubleshoot** $\rightarrow$ **Reset this PC**. Choose **Keep my files** (if possible) or **Remove everything** (if necessary).
    * **Reason:** This reinstalls Windows while preserving or removing personal files, often fixing deep-seated OS corruption.
* **5.3 Clean Windows Reinstallation:**
    * **Action:** Boot from the Windows Installation Media and choose to perform a **Custom** installation, formatting the existing Windows partition.
    * **Reason:** The final step to guarantee a clean, working OS.
* **5.4 Hardware Diagnostics:**
    * **Action:** If a clean install also fails or the problem immediately returns, the issue is almost certainly **hardware**. Run thorough manufacturer diagnostics (often available via the BIOS/UEFI) on the **RAM** and **SSD/HDD** to detect a failing component.
