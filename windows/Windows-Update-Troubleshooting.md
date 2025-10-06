# Windows Update Troubleshooting

Troubleshooting Windows Updates can involve several steps to identify and resolve issues that prevent updates from installing correctly. Below is a comprehensive guide to troubleshooting Windows Updates on Windows 10 and Windows 11.

---

## Step 1: Basic Checks

### 1. Check Internet Connection
- Ensure your computer is connected to the internet
- Test the connection by opening a web browser and visiting a few websites

### 2. Restart Your Computer
- Sometimes, a simple restart can resolve update issues

### 3. Check Disk Space
- Ensure you have enough free disk space for the update
- Go to **Settings** > **System** > **Storage** to check available space

---

## Step 2: Run Windows Update Troubleshooter

### 1. Open Settings
- Press `Windows + I` to open the Settings app

### 2. Go to Update & Security
- Click on **Update & Security**

### 3. Run Troubleshooter
- Click on **Troubleshoot** in the left sidebar
- Select **Additional troubleshooters** (Windows 10) or **Other troubleshooters** (Windows 11)
- Find and run the **Windows Update** troubleshooter

---

## Step 3: Check Date and Time Settings

### 1. Open Settings
- Press `Windows + I` to open the Settings app

### 2. Go to Time & Language
- Click on **Time & Language**

### 3. Check Date and Time Settings
- Ensure the date, time, and time zone are set correctly
- Enable **Set time automatically** and **Set time zone automatically**

---

## Step 4: Reset Windows Update Components

### 1. Open Command Prompt as Administrator
- Press `Windows + S`, type `cmd`, right-click on **Command Prompt**, and select **Run as administrator**

### 2. Stop Update Services
In the Command Prompt, type the following commands and press Enter after each:

```cmd
net stop wuauserv
net stop cryptSvc
net stop bits
net stop msiserver
```

### 3. Rename Update Folders
Type the following commands and press Enter after each to rename the SoftwareDistribution and Catroot2 folders:

```cmd
ren C:\Windows\SoftwareDistribution SoftwareDistribution.old
ren C:\Windows\System32\catroot2 catroot2.old
```

### 4. Restart Update Services
Type the following commands and press Enter after each:

```cmd
net start wuauserv
net start cryptSvc
net start bits
net start msiserver
```

### 5. Close Command Prompt
Type `exit` and press Enter

---

## Step 5: Manually Download and Install Updates

### 1. Check for Updates
- Go to **Settings** > **Update & Security** > **Windows Update**
- Note the KB (Knowledge Base) number of the failed update

### 2. Download the Update
- Visit the [Microsoft Update Catalog](https://www.catalog.update.microsoft.com/)
- Search for the KB number and download the appropriate update for your system

### 3. Install the Update
- Run the downloaded update file to install it manually

---

## Step 6: Check System Files

### 1. Open Command Prompt as Administrator
- Press `Windows + S`, type `cmd`, right-click on **Command Prompt**, and select **Run as administrator**

### 2. Run SFC (System File Checker)
In the Command Prompt, type the following command and press Enter:

```cmd
sfc /scannow
```

### 3. Run DISM (Deployment Imaging Service and Management Tool)
If SFC finds issues it cannot fix, run the following command:

```cmd
DISM /Online /Cleanup-Image /RestoreHealth
```

---

## Step 7: Check for Malware

### 1. Run Windows Defender or Third-Party Antivirus
- Ensure your antivirus software is up to date and run a full system scan to check for malware

---

## Step 8: Check Group Policy Settings (for Advanced Users)

### 1. Open Local Group Policy Editor
- Press `Windows + R`, type `gpedit.msc`, and press Enter

### 2. Navigate to Windows Update Settings
- Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Windows Update**

### 3. Review Policies
- Ensure no policies are set that might be preventing updates

---

## Step 9: Perform a Clean Boot

### 1. Open System Configuration
- Press `Windows + R`, type `msconfig`, and press Enter

### 2. Configure Selective Startup
- Go to the **General** tab and select **Selective startup**
- Uncheck **Load startup items**

### 3. Disable Startup Services
- Go to the **Services** tab
- Check **Hide all Microsoft services**
- Click **Disable all**

### 4. Restart Your Computer
- Click **Apply**, **OK**, and then restart your computer

### 5. Check for Updates
- After the computer restarts, check for Windows updates again

---

## Step 10: Perform an In-Place Upgrade (Repair Installation)

### 1. Download the Media Creation Tool
- Go to the [Microsoft website](https://www.microsoft.com/software-download/windows10) and download the Media Creation Tool

### 2. Run the Tool
- Follow the on-screen instructions to upgrade your PC. This will reinstall Windows without affecting your files and apps

---

By following these steps, you should be able to identify and resolve most issues that prevent Windows updates from installing correctly.
