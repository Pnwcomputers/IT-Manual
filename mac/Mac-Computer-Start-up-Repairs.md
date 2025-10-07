# 💻 Mac Computer Start-up Repair Procedures

If your Mac won’t start properly, follow these step-by-step troubleshooting procedures to diagnose and fix the issue.

---

## 1. Check Power & Basic Connections 🔌

* Ensure the power cable is securely connected and the outlet works.
* Try a **different power adapter** (for MacBooks) or a different power outlet.
* **Drained Battery:** If the battery is completely drained, leave it plugged in for at least $10-15$ minutes before attempting to power it on.

---

## 2. Perform a Force Restart

If your Mac is frozen or won’t boot:

1.  Press and hold the **power button** for $10$ seconds until the Mac turns off.
2.  Wait a few seconds, then press the power button again to restart.

---

## 3. Check for Display Issues

If the Mac turns on but the screen is black:

* Adjust the **brightness** using the keyboard ($\text{F2}$ key).
* Disconnect external monitors.
* Try a different monitor or cable.
* *If you hear startup chimes or fan noise but see no display, it may indicate a severe hardware issue (GPU, logic board, or display failure).*

---

## 4. Boot Into Safe Mode (Basic Troubleshooting Mode)

Safe Mode checks and repairs disk issues and disables unnecessary startup software.

### How to Start in Safe Mode:

1.  Turn off your Mac completely.
2.  Turn it back on and immediately press and hold the **Shift** key.
3.  Release **Shift** when the Apple logo appears.
4.  If it successfully boots, restart normally to see if the issue is resolved.

---

## 5. Reset NVRAM/PRAM (Fixes Startup & Display Issues)

NVRAM (Non-Volatile Random Access Memory) stores critical settings like boot disk selection, screen resolution, and volume.

### How to Reset NVRAM/PRAM:

1.  Shut down your Mac.
2.  Turn it on and immediately press and hold: **$\text{Option} (\text{⌥}) + \text{Command} (\text{⌘}) + \text{P} + \text{R}$**.
3.  Hold the keys for about $20$ seconds, then release them. Your Mac will restart automatically.

---

## 6. Reset SMC (Fixes Power & Charging Issues)

The System Management Controller (SMC) handles power management, battery, and thermal settings.

### How to Reset SMC:

#### For Intel-based MacBooks (Non-Removable Battery):
1.  Shut down your Mac.
2.  Hold $\text{Shift} + \text{Control} + \text{Option} (\text{⌥}) + \text{Power}$ for $10$ seconds.
3.  Release all keys and power on the Mac.

#### For Intel-based Mac Desktops (iMac, Mac Mini, Mac Pro):
1.  Shut down the Mac and **unplug the power cable**.
2.  Wait $15$ seconds.
3.  Plug the power cable back in and wait $5$ more seconds.
4.  Turn on the Mac.

#### 🛑 Apple Silicon Macs (M1/M2/M3 chips)
* SMC resets are **not necessary**—simply **restart the Mac**.

---

## 7. Boot Into macOS Recovery Mode

If Safe Mode doesn’t work, use Recovery Mode to repair or reinstall macOS.

### How to Enter macOS Recovery:

| Mac Type | Key Combination (Press and Hold) |
| :--- | :--- |
| **Intel Macs** | $\text{Command} (\text{⌘}) + \text{R}$ |
| **Apple Silicon Macs (M1/M2/M3)** | The **power button** (until "Loading startup options" appears) |

Once in **macOS Utilities**, you can:
* Run **Disk Utility** to check and repair the startup disk.
* **Reinstall macOS** without losing user data.

---

## 8. Use Disk Utility to Repair Startup Disk

If your Mac has a corrupt or failing drive, you can use Disk Utility to attempt a repair.

### How to Use Disk Utility:

1.  Boot into **macOS Recovery** (using the method above).
2.  Select **Disk Utility** and click Continue.
3.  Choose **Macintosh HD** (or your startup disk).
4.  Click **First Aid**, then **Run** to repair disk errors.
5.  Restart the Mac after the process completes.
