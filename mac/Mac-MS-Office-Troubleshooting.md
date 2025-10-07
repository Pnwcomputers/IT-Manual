# 💽 Mac - MS Office Troubleshooting

If Microsoft Office apps (Word, Excel, Outlook, PowerPoint, etc.) are crashing, not opening, or behaving incorrectly on your Mac, try these troubleshooting steps.

---

## Basic & Software Updates

1.  **Restart Your Mac:**
    * Close all Office apps.
    * Click the Apple menu () $\rightarrow$ **Restart**.
    * Try reopening Office after the reboot.

2.  **Check for Office Updates:**
    * Keeping Office updated fixes bugs and improves performance.
    * **How to Update:**
        1. Open any Office app (Word, Excel, etc.).
        2. Click **Help** in the top menu bar.
        3. Select **Check for Updates** (this opens the Microsoft AutoUpdate tool).
        4. Click **Update All** if updates are available.
    * *If AutoUpdate isn’t working, download the latest version from the Microsoft Office website.*

3.  **Check for macOS Updates:**
    * Some Office issues occur due to macOS incompatibility.
    * **How to Update macOS:**
        1. Click the Apple menu () $\rightarrow$ **System Settings** $\rightarrow$ **General** $\rightarrow$ **Software Update**.
        2. Install any available updates and restart your Mac.

---

## Advanced Troubleshooting & Resetting

4.  **Run Microsoft Office in Safe Mode (For Crashes):**
    * Safe Mode disables extensions and may help diagnose crashes.
    * **How to Open:** Hold down the **Option ($\text{⌥}$) key** while opening Word, Excel, or another Office app. If prompted, click **Yes** to start in Safe Mode.
    * *If Office works in Safe Mode, an add-in or corrupted preference file may be causing issues.*

5.  **Reset Microsoft Office Preferences:**
    * If an Office app won’t open or keeps crashing, resetting its preferences may help.
    * **How to Reset (Word, Excel, or PowerPoint):**
        1. Close all Office apps.
        2. Open Finder and click **Go $\rightarrow$ Go to Folder**.
        3. Type the path, replacing `Word` with the affected app:
           ```bash
           ~/Library/Containers/com.microsoft.Word
           ```
        4. **Move the entire folder to the Trash.**
        5. Restart your Mac and try opening Office again.

6.  **Repair Microsoft Office:**
    * **How to Repair:**
        1. Open Finder $\rightarrow$ **Applications**.
        2. Find the problematic app (Word, Excel, etc.).
        3. Hold **Command ($\text{⌘}$) + Option ($\text{⌥}$)** while clicking on the app.
        4. Select **Run in Repair Mode** (if available).
    * *If no repair option appears, proceed to reinstall Office (Step 7).*

---

## Last Resort & Outlook-Specific Fixes

7.  **Reinstall Microsoft Office (If Issues Persist):**
    * **How to Uninstall:**
        1. Close all Office apps.
        2. Open Finder $\rightarrow$ **Applications**.
        3. Move the Microsoft Office folder (or individual app icons) to the **Trash**.
        4. Empty the Trash and **Restart your Mac**.
    * **How to Reinstall:**
        1. Go to the **Microsoft 365 website**.
        2. Sign in with your Microsoft account.
        3. Download and install Office.

8.  **Fix Outlook-Specific Issues:**
    * **Sync/Send Issues:** Open Outlook $\rightarrow$ **Preferences** $\rightarrow$ **Accounts** and verify your email settings. Remove and re-add your account if emails won't sync.
    * **Rebuild Outlook Database (For Corruption):**
        1. Close Outlook.
        2. Hold **Option ($\text{⌥}$) key** and reopen Outlook.
        3. Click **Rebuild** when prompted.
