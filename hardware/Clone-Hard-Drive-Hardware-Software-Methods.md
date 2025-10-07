# 💾 Clone a Hard Drive: Hardware & Software Methods

## ⚠️ FIRST AND FOREMOST: Drive Size Requirement

The **Target drive MUST be the same size as, or larger than, the Source drive!**
* The Target drive **CAN'T be smaller** than the Source drive.

---

## Option 1: Using a Hardware Disk Cloner (Dock)

This method requires no computer connection for the cloning process.

### ✅ What You Need
* A disk cloning dock (e.g., Sabrent EC-HD2B).
* **Source drive** (with data to clone).
* **Target drive** (equal to or larger than the source drive).

### 🔧 Steps (Standalone Clone)
1.  **Power Off the Dock:** Ensure the dock is unplugged before inserting drives.
2.  **Insert the Drives:** Plug the source drive into the **Source (A)** bay and the target drive into the **Target (B)** bay.
3.  **Plug In and Power On:** Turn on the dock and wait for both drive LEDs to light up.
4.  **Initiate the Clone:**
    * Press and hold the **"Clone"** button for about $3-5$ seconds until the LEDs flash.
    * Press the **"Clone"** button again (short press) to confirm and start the process.
5.  **Monitor Progress:** LEDs will show percentage progress ($25\%$, $50\%$, $75\%$, $100\%$). **Do not remove or power off drives.**
6.  **Completion & Removal:** When all four LEDs are lit solid, the cloning is complete. Power off and safely remove both drives.

**📝 Important:** Target drive data will be **overwritten**. Ensure it is backed up or blank before cloning.

---

## Option 2: Using Clonezilla (Software-Based Cloning)

Clonezilla is a free, open-source utility ideal for advanced users.

### ✅ What You Need
* A **USB drive ($\text{min } 2\text{GB}$)** with Clonezilla Live installed (created via Rufus or BalenaEtcher).
* Source and target drives connected (internal or via USB adapters).

### 🔧 Steps
1.  **Download & Create Bootable USB:** Download the Clonezilla Live ISO from `https://clonezilla.org/downloads.php` and use Rufus or BalenaEtcher to create the bootable USB.
2.  **Boot from USB:** Insert the USB and enter **BIOS/UEFI** settings to change the boot order to start from the USB drive.
3.  **Select Boot Option:** Choose: **`Clonezilla live (Default settings)`**.
4.  **Choose Cloning Mode:** Select: **`device-device`** (for disk to disk cloning).
5.  **Select Beginner Mode:** Choose **`Beginner`** for guided cloning, then select **`disk_to_local_disk`**.
6.  **Choose Disks:** Select your **source disk** (FROM) and then your **target disk** (TO).
7.  **Confirm & Start:** Confirm the warning that the target drive will be overwritten and proceed.
8.  **Finish & Reboot:** Once complete, remove the USB drive. Swap the old drive with the new/cloned drive and boot to test.

---

## Option 3: Using Macrium Reflect (Windows-Based Cloning)

Macrium Reflect Free is a reliable tool for cloning and imaging within Windows.

### ✅ What You Need
* A Windows PC with both **source and target drives connected**.
* **Macrium Reflect Free** installed.
* Target drive with **equal or larger capacity** than the source drive.

### 🧰 Step-by-Step Instructions
1.  **Download & Install:** Download the Free version from `https://www.macrium.com/reflectfree` and install (choose "Home Use").
2.  **Connect Both Drives:** Ensure both the source and target drives are connected and visible in Windows Disk Management. **Backup any data on the target drive.**
3.  **Select Source Drive:** Open Macrium Reflect, find your source disk in the list, and click **"Clone this disk…"** below it.
4.  **Select the Target Drive:** Click **"Select a disk to clone to…"** and choose your destination drive.
    * *Note: If the target contains partitions, Macrium will prompt you to delete them.*
5.  **Configure Partitions (Optional):** Drag and drop partitions from source to target. Use **"Cloned Partition Properties"** to resize partitions if cloning to a larger disk.
6.  **Start the Cloning Process:** Click **"Next"**, then **"Finish"**. Check the box **"Run this backup now"**, and click **"OK"** to begin.
7.  **Verify the Clone:** After completion, shut down your computer. **Boot from the newly cloned drive** to verify success.

---

## ⚠️ Common Issues & Fixes

| Issue | Potential Fixes |
| :--- | :--- |
| **Drive not recognized in dock?** | Try swapping ports, re-seating the drive, or testing each drive separately. |
| **Clonezilla won’t boot?** | Double-check the USB creation process and BIOS boot order. |
| **Different drive sizes?** | Target must be **equal or larger**. If not, resize partitions or use advanced options in Clonezilla. |
| **Boot failure after clone?** | Make sure your BIOS is set to boot from the correct drive (check **UEFI vs Legacy** settings). |
| **Target drive not shown?** | Initialize the drive in Windows **Disk Management** (Right-click Start $\rightarrow$ Disk Management). |
| **Clone fails midway?** | Try cloning without resizing partitions, or check the source disk for errors using **`chkdsk`**. |

### 🧠 Pro Tips
* **Backup Image:** Use the **"Image this disk…"** option in Macrium Reflect to create a compressed, restorable backup image instead of a $1:1$ clone.
* **Recovery Media:** Create **rescue media** (bootable USB) within Macrium Reflect for offline recovery and repair.
