# 💾 Bootable USB Drive (How-To)

Booting a system using a USB bootable drive involves creating the drive and then configuring the target system to boot from it.

---

## Step 1: Create a Bootable USB Drive

### Using Windows

1.  **Download a bootable ISO file:**
    * **Windows:** Download the ISO from Microsoft's official website.
    * **Linux:** Download the ISO from the respective distribution's website.
2.  **Download and Install Rufus:**
    * Download Rufus from `https://rufus.ie/`.
    * Install and run Rufus.
3.  **Create the Bootable USB Drive:**
    * Insert a USB drive (at least **$8\text{GB}$**).
    * Open Rufus and select the USB drive under **"Device"**.
    * Click on **SELECT** and choose the downloaded ISO file.
    * Leave other settings as default and click **START**.
    * Wait for Rufus to complete the process.

### Using macOS (Terminal)

1.  **Download the bootable ISO file.**
2.  **Open Terminal.**
3.  **Create the Bootable USB Drive:**
    * Insert a USB drive.
    * Use the command `diskutil list` to find the USB drive's identifier (e.g., `disk2`).
    * **Format the USB drive:**
        ```bash
        diskutil eraseDisk MS-DOS "BOOTABLE" MBR <USBIdentifier>
        ```
    * **Create the bootable drive using `dd`:**
        ```bash
        sudo dd if=/path/to/iso of=/dev/r<USBIdentifier> bs=1m
        ```
    * *(Note: Use `r<USBIdentifier>` for raw access, e.g., `/dev/rdisk2`, for faster writing. Use `bs=1m` for the block size.)*

### Using Linux (Terminal)

1.  **Download the bootable ISO file.**
2.  **Open Terminal.**
3.  **Create the Bootable USB Drive:**
    * Insert a USB drive.
    * Use the command `lsblk` to find the USB drive's identifier (e.g., `sdb`).
    * **Create the bootable drive using `dd`:**
        ```bash
        sudo dd if=/path/to/iso of=/dev/<USBIdentifier> bs=4M status=progress
        sync
        ```
    * *(Note: Use `bs=4M` for the block size and include `status=progress` to monitor the operation.)*

---

## Step 2: Configure the Target System to Boot from USB

1.  **Insert the Bootable USB Drive:**
    * Insert the USB drive into a USB port on the system you want to boot.
2.  **Access BIOS/UEFI Settings:**
    * **Restart** the computer.
    * During the boot process, press the key to enter **BIOS/UEFI setup**. This key varies but is commonly **F2**, **F12**, **Del**, **Esc**, or **F10**. The key is usually displayed briefly during startup.
3.  **Change Boot Order:**
    * Navigate to the **Boot** menu within the BIOS/UEFI.
    * Set the **USB drive** as the **first boot device**.
    * **Save the changes and exit** the settings (usually **F10**).

---

## Step 3: Boot from the USB Drive

1.  **Restart the Computer:**
    * The system should now boot from the USB drive.
    * If prompted (e.g., "Press any key to boot from USB..."), press a key.
2.  **Follow Installation Instructions:**
    * The system will boot into the installation or live environment for the operating system.
    * Follow the on-screen instructions to proceed.

---

## Troubleshooting

### USB Drive Not Recognized

* Ensure the USB drive is properly inserted and recognized by the BIOS/UEFI.
* Try using a **different USB port**.

### Boot Option Not Available

* Ensure the USB drive was correctly created as a bootable drive (Step 1).
* Check the BIOS/UEFI settings for any options related to **Secure Boot** or **Legacy Boot** modes, as these can interfere with booting from a USB.
