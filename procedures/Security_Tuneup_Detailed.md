# Security Tune-up/Clean-up (Detailed)

**General Instructions:**

* Do everything in **‘Groups’** and **FINISH each section** before moving onto the next **UNLESS multi-tasking.**
* Take notes about everything that was done, all findings, test results, etc., as well as record any/all recommendations, notes about work completed, etc.
* Keep detailed notes in **Microsoft OneNote, Notion, or Samsung Notes.**

---

## Uninstall/Reinstall Software

### 1. Uninstall Obvious Bloatware

* Uninstall **“Free Trial”** software.
* Uninstall **Obvious junk programs & toolbars** (One Search, Driver Support, One Bar, etc.).
* Reference the organization’s approved “Browser Hi-jack” guide or equivalent resource to identify and remove malicious adware programs.
* Computers that are heavily infected should be checked with **‘TDSKiller’** to rule out the presence of a **Rootkit BEFORE** any cleaning procedures begin. (*Unless cleaning is needed to run the utility.*)

### 2. Install/Update Essential Programs

Use **Ninite.com** for installing most apps on the Security Clean-up Software List:

* **Chrome, Firefox, Edge** - Update
* **Java, .Net & Silverlight Runtimes** - Update/Install
* **Malwarebytes Antimalware**
* **Malwarebytes ADWCleaner**
* **BleachBit**

---

## Security Scanning & Virus/Malware Removal

### 1. Virus and Malware Scanning

* Run full Virus Scans with **Local AV** as well as **Malwarebytes** and **ADW Cleaner**.
    * *ADWCleaner Download Link:* `https://adwcleaner.malwarebytes.com/adwcleaner?channel=release`
* Take note of any/all detections found and also the number of detections found.
    * Note any specifics on any malware/virus files found, and copy the data if wanted/needed for further research.
    * If any banking viruses, key-loggers, data miners, etc. are found, **let the client know IMMEDIATELY** and advise that any compromised accounts need to have their log information updated/changed.

### 2. Web Browser Clean-up

* Check all Installed Web Browsers’ **Extensions/Add-ons** for anything unwanted/needed.
* Check the general browser settings (**Start Page, Default Search Engine, Etc.**) for any tampering or modifications and **reset to defaults if needed.**
* **ADWCleaner** is an excellent tool for finding and removing browser hijack apps.

---

## Performance Tune-Up

### 1. Junk File Clean-up - BleachBit

* Download and Install BleachBit: `https://www.bleachbit.org/download`
    * *You may need to install C++ 2010 Runtimes if you receive an error during installation.* `https://answers.microsoft.com/en-us/windows/forum/all/msvcr100-dll/826a842c-7a2f-4ebc-bb21-4cee86b234b0`
* On its opening turn on the following cleaning options:
    * **Temporary Files**
    * **Web Browser(s) Cache**
    * **System Prefetch, Recycle bin & Temporary files**
    * **Windows Defender Quarantine & Log files**

### 2. Paging File Optimization

* Set the PC's paging file to either **1.5 the amount of RAM or set to 4096MB.**
    * **Settings** > **System** > **About** > **Advanced System Settings**
        1.  Select the **“Advanced”** tab at the top.
        2.  In the **“Performance”** section click on **“Settings”**.
        3.  Click on the **“Advanced”** tab.
        4.  Under **“Virtual Memory”** click on **“Change”**.
        5.  Set the paging file accordingly.

### 3. Optimize System Performance Options

* Right click **‘My Computer’** > **Properties** > **Advanced System Settings** > Click **‘Advanced’** tab > Click **‘Settings’** under the **“Performance”** area.
* Un-check all of the PC's visual effects performance options except for:
    * "Use visual styles on windows and buttons"
    * “Smooth Scroll List Boxes”
    * “Smooth Edges on Screen Fonts”
    * “Show Translucent Selection Rectangle”
    * "Use drop shadows for icon labels on the desktop"
* **Start-up Program Entries** can also be managed using the **Task Manager**.
    * **Disable all unnecessary start-up items.**
        * Typically leave start-up programs related to:
            * OneDrive/MS Office
            * iCloud Drive
            * Printers
            * WIFI Software
            * Audio/Video Software
            * Specialty apps such as Garmin, Fitbit, etc.

---

## Windows Updates

1.  Access **Windows Updates** through System Settings.
2.  If the **Microsoft Update** feature is not/has not been enabled, enable **Microsoft Updates** in the Windows Updates “Advanced Options”. You can also enable **“Notify me when a restart is required”** option too as well.
3.  After the Microsoft Update feature has been enabled, Windows Updates will now check for both **Windows and Microsoft Updates**.
4.  Allow the computer to check for new updates.
5.  Once checking for updates is finished, **download and install all available updates.**
    * You may need to do this process more than a few times to make sure the system is fully updated.
6.  Some Windows Updates may fail. Do not hyper fixate on failed updates, as they will likely resolve on their own after a few update/restart cycles.
7.  Verify Installation of all currently available **Windows Updates AND Upgrades**.

---

## Final Steps & Client Review

* Once everything is said and done, **double-check system start-up apps and optimize as needed ONE MORE TIME** and also **RUN ONE LAST CLEANING with BleachBit.**
* **LASTLY; GO OVER THE SYSTEM, FINDINGS AND WORK COMPLETED WITH THE CLIENT!**
