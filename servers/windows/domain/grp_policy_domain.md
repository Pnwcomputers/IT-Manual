# Group Policy Configuration for Windows Server 2025 Active Directory

This guide covers setting up and managing Group Policy Objects (GPOs) to configure and control users and computers in your domain, including mapping drives, deploying applications, configuring settings, and enforcing security policies.

## Understanding Group Policy

Group Policy allows centralized management of:

- **Computer settings**: Applied at startup, run as SYSTEM
- **User settings**: Applied at logon, run as the user
- **Security settings**: Passwords, account lockout, audit policies
- **Software deployment**: Install/remove applications
- **Preferences**: Drive maps, printers, registry, environment variables

### GPO Processing Order (LSDOU)

Policies apply in this order (later policies override earlier ones):

1. **L**ocal Policy
2. **S**ite Policy
3. **D**omain Policy
4. **O**rganizational **U**nit (OU) Policy (parent to child)

### Key Concepts

- **GPO Link**: Where a GPO is attached (Site, Domain, or OU)
- **Inheritance**: Child OUs inherit parent policies
- **Enforcement**: Forces a GPO to apply even if blocked
- **Block Inheritance**: Prevents parent policies from applying
- **Security Filtering**: Limits which users/computers a GPO affects
- **WMI Filtering**: Applies GPO based on system criteria

## Part 1: Group Policy Management Tools

### Access Group Policy Management Console

```powershell
# Open GPMC
gpmc.msc

# Or via Server Manager > Tools > Group Policy Management
```

### PowerShell Module

```powershell
# Import the GroupPolicy module
Import-Module GroupPolicy

# List all GPOs
Get-GPO -All

# Get GPO details
Get-GPO -Name "Default Domain Policy"

# Create new GPO
New-GPO -Name "My New Policy" -Comment "Description here"

# Link GPO to OU
New-GPLink -Name "My New Policy" -Target "OU=Users,OU=Company,DC=contoso,DC=local"

# Generate GPO report
Get-GPOReport -Name "Default Domain Policy" -ReportType HTML -Path "C:\GPOReport.html"
```

## Part 2: Creating and Managing GPOs

### Create a New GPO (GUI)

1. Open **Group Policy Management Console (GPMC)**
2. Expand your domain
3. Right-click **Group Policy Objects** > **New**
4. Name the GPO descriptively (e.g., "User - Drive Mappings")
5. Click **OK**
6. Right-click the new GPO > **Edit** to configure settings
7. Right-click the target OU > **Link an Existing GPO**
8. Select your GPO

### GPO Naming Convention

Use a clear naming convention:

- `Computer - [Purpose]` for computer policies
- `User - [Purpose]` for user policies
- `Security - [Purpose]` for security settings
- Example: `User - Sales Drive Mappings`, `Computer - Windows Update Settings`

### Edit GPO Settings

Right-click GPO > **Edit** opens the Group Policy Management Editor:

- **Computer Configuration**: Settings that apply to computers
- **User Configuration**: Settings that apply to users
- **Policies**: Traditional policies (mandatory)
- **Preferences**: Flexible settings (can be overridden by users)

## Part 3: Map Network Drives Automatically

### Using Group Policy Preferences (Recommended)

1. Create or edit a GPO
2. Navigate to: **User Configuration > Preferences > Windows Settings > Drive Maps**
3. Right-click > **New > Mapped Drive**

Configure:
- **Action**: Create (first time) or Update (refresh each logon)
- **Location**: `\\SRV-FILE01\Company`
- **Reconnect**: Checked
- **Label as**: Company Share
- **Drive Letter**: Use first available, starting at: S:
- **Show this drive** / **Show all drives**: As needed

4. Click **Common** tab:
   - **Run in logged-on user's security context**: Checked
   - **Item-level targeting**: Click to add conditions

### Item-Level Targeting

Control which users/computers get the drive map:

1. Click **Common** tab > **Item-level targeting** > **Targeting**
2. Click **New Item** and select condition type:
   - **Security Group**: Only members of specific group
   - **Organizational Unit**: Only users in specific OU
   - **Operating System**: Only specific Windows versions
   - **Computer Name**: Only specific computers

Example: Map Finance drive only for Finance group:
- New Item > Security Group > Add > `CONTOSO\GRP-Finance`

### PowerShell Alternative

Create drive mappings script deployed via GPO:

```powershell
# login-script.ps1
# Map department drives based on group membership

$user = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

# Company share for everyone
New-PSDrive -Name "S" -PSProvider FileSystem -Root "\\SRV-FILE01\Company" -Persist -ErrorAction SilentlyContinue

# Check group membership and map accordingly
$groups = (New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=User)(samAccountName=$($env:USERNAME)))")).FindOne().GetDirectoryEntry().memberOf

if ($groups -match "GRP-Finance") {
    New-PSDrive -Name "F" -PSProvider FileSystem -Root "\\SRV-FILE01\Finance" -Persist -ErrorAction SilentlyContinue
}

if ($groups -match "GRP-HR") {
    New-PSDrive -Name "H" -PSProvider FileSystem -Root "\\SRV-FILE01\HR" -Persist -ErrorAction SilentlyContinue
}
```

Deploy via:
**User Configuration > Policies > Windows Settings > Scripts > Logon**

## Part 4: Deploy Applications Automatically

### Method 1: MSI Deployment via Group Policy

Best for simple MSI installations.

1. Place MSI file on network share accessible to all computers
   - Example: `\\SRV-FILE01\Software\7zip.msi`
   - Share must have Read access for Domain Computers

2. Create GPO for software deployment

3. Navigate to:
   - **Computer Configuration > Policies > Software Settings > Software Installation**
   - (Use Computer config for all users of a machine)
   - OR **User Configuration** for per-user installs

4. Right-click > **New > Package**

5. Enter UNC path to MSI: `\\SRV-FILE01\Software\7zip.msi`

6. Select deployment method:
   - **Assigned**: Mandatory installation (recommended for computers)
   - **Published**: Available in Control Panel (user config only)

7. Click **OK**

Software installs at next computer restart (computer-assigned) or user logon.

### Method 2: PowerShell Script Deployment

For EXE installers or complex deployments:

```powershell
# install-software.ps1
# Silent software installation script

$softwarePath = "\\SRV-FILE01\Software"

# Install 7-Zip (MSI)
$7zipInstalled = Get-WmiObject Win32_Product | Where-Object { $_.Name -like "*7-Zip*" }
if (-not $7zipInstalled) {
    Start-Process msiexec.exe -ArgumentList "/i `"$softwarePath\7zip.msi`" /qn" -Wait
    Write-Host "7-Zip installed"
}

# Install Chrome (EXE with switches)
$chromeInstalled = Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not $chromeInstalled) {
    Start-Process "$softwarePath\ChromeSetup.exe" -ArgumentList "/silent /install" -Wait
    Write-Host "Chrome installed"
}

# Install using winget (Windows 11/newer)
# winget install --id Google.Chrome --silent --accept-package-agreements

# Log installation
Add-Content "C:\Windows\Logs\SoftwareInstall.log" "$(Get-Date): Software installation script completed"
```

Deploy via:
**Computer Configuration > Policies > Windows Settings > Scripts > Startup**

### Method 3: Scheduled Task via Preferences

1. Navigate to: **Computer Configuration > Preferences > Control Panel Settings > Scheduled Tasks**
2. Right-click > **New > Scheduled Task (At least Windows 7)**

Configure:
- **Action**: Create
- **Name**: Software Installation
- **User account**: SYSTEM
- **Run with highest privileges**: Checked
- **Trigger**: At startup
- **Action**: Start a program
- **Program**: `powershell.exe`
- **Arguments**: `-ExecutionPolicy Bypass -File "\\SRV-FILE01\Scripts\install-software.ps1"`

## Part 5: Common GPO Configurations

### Configure Desktop Wallpaper

**User Configuration > Policies > Administrative Templates > Desktop > Desktop**
- **Desktop Wallpaper**: Enabled
- Wallpaper Name: `\\SRV-FILE01\Company\Wallpaper\corporate.jpg`
- Wallpaper Style: Fill

### Configure Start Menu / Taskbar

**User Configuration > Policies > Administrative Templates > Start Menu and Taskbar**
- Remove Run from Start Menu
- Remove access to context menus
- Pin specific apps to taskbar

### Set Homepage and Browser Settings

**Computer/User Configuration > Policies > Administrative Templates > Google Chrome** (requires ADMX)
- Or **Windows Components > Microsoft Edge**
- Set homepage URL
- Configure bookmarks
- Block certain sites

### Folder Redirection

Redirect user folders to network:

**User Configuration > Policies > Windows Settings > Folder Redirection**

1. Right-click **Documents** > **Properties**
2. Setting: **Basic - Redirect everyone's folder to the same location**
3. Target folder location: **Create a folder for each user under the root path**
4. Root Path: `\\SRV-FILE01\Users$`

Repeat for Desktop, Pictures, etc. as needed.

### Power Settings

**Computer Configuration > Policies > Administrative Templates > System > Power Management**
- Sleep settings
- Hibernate settings
- Lid close action (laptops)

### Windows Update Settings

**Computer Configuration > Policies > Administrative Templates > Windows Components > Windows Update**

For WSUS:
- **Specify intranet Microsoft update service location**: Enabled
- Set intranet update service: `http://wsus-server:8530`
- Set intranet statistics server: `http://wsus-server:8530`

For direct updates:
- **Configure Automatic Updates**: Enabled
- Configure auto update: 4 - Auto download and schedule install
- Schedule install day: 0 - Every day
- Schedule install time: 03:00

### Screen Lock / Screensaver

**User Configuration > Policies > Administrative Templates > Control Panel > Personalization**
- **Enable screen saver**: Enabled
- **Screen saver timeout**: Enabled (900 seconds = 15 min)
- **Password protect the screen saver**: Enabled

### Disable USB Storage

**Computer Configuration > Policies > Administrative Templates > System > Removable Storage Access**
- **All Removable Storage classes: Deny all access**: Enabled

Or selectively:
- **Removable Disks: Deny read access**: Enabled
- **Removable Disks: Deny write access**: Enabled

### Map Printers

**User Configuration > Preferences > Control Panel Settings > Printers**
1. Right-click > **New > Shared Printer**
2. Action: Create
3. Share path: `\\PRINT-SERVER\HP-LaserJet`
4. Set as default: As needed
5. Common tab: Use item-level targeting for location-based deployment

## Part 6: Security Policies

### Password Policy

**Computer Configuration > Policies > Windows Settings > Security Settings > Account Policies > Password Policy**

| Setting | Recommended Value |
|---------|------------------|
| Enforce password history | 24 passwords |
| Maximum password age | 90 days |
| Minimum password age | 1 day |
| Minimum password length | 12 characters |
| Password must meet complexity | Enabled |

Note: Password policies must be set at the domain level (Default Domain Policy) or use Fine-Grained Password Policies.

### Account Lockout Policy

**Computer Configuration > Policies > Windows Settings > Security Settings > Account Policies > Account Lockout Policy**

| Setting | Recommended Value |
|---------|------------------|
| Account lockout threshold | 5 invalid attempts |
| Account lockout duration | 30 minutes |
| Reset account lockout counter after | 30 minutes |

### User Rights Assignment

**Computer Configuration > Policies > Windows Settings > Security Settings > Local Policies > User Rights Assignment**

- **Allow log on locally**: Add specific groups
- **Deny log on locally**: Service accounts
- **Allow log on through RDP**: Administrators, Remote Desktop Users
- **Shut down the system**: Administrators

### Audit Policies

**Computer Configuration > Policies > Windows Settings > Security Settings > Advanced Audit Policy Configuration**

Recommended auditing:
- **Logon/Logoff > Audit Logon**: Success, Failure
- **Account Logon > Audit Credential Validation**: Success, Failure
- **Account Management > Audit User Account Management**: Success
- **Object Access > Audit File System**: Success, Failure (for sensitive shares)
- **Policy Change > Audit Policy Change**: Success

### Windows Firewall

**Computer Configuration > Policies > Windows Settings > Security Settings > Windows Defender Firewall**

- Configure profiles (Domain, Private, Public)
- Enable firewall for all profiles
- Configure inbound/outbound rules

## Part 7: Loopback Processing

Use when you want computer-based GPOs to apply user settings (e.g., kiosks, shared workstations).

**Computer Configuration > Policies > Administrative Templates > System > Group Policy**
- **Configure user Group Policy loopback processing mode**: Enabled
- Mode: **Replace** (only computer GPOs) or **Merge** (combine both)

## Part 8: GPO Troubleshooting

### Force GPO Update

```powershell
# Force immediate GPO update on local machine
gpupdate /force

# Force update on remote computer
Invoke-GPUpdate -Computer "WKS-001" -Force

# Force update for all computers in OU
Get-ADComputer -Filter * -SearchBase "OU=Computers,OU=Company,DC=contoso,DC=local" | 
    ForEach-Object { Invoke-GPUpdate -Computer $_.Name -Force }
```

### View Applied GPOs

```powershell
# On client machine - show applied GPOs
gpresult /r

# Detailed report to HTML
gpresult /h C:\GPOReport.html

# For specific user
gpresult /user CONTOSO\jsmith /h C:\GPOReport.html

# On domain controller - RSoP for remote computer
Get-GPResultantSetOfPolicy -Computer "WKS-001" -ReportType HTML -Path "C:\RSoP.html"
```

### Common Issues

**GPO not applying:**
1. Check GPO is linked to correct OU
2. Verify security filtering (Authenticated Users by default)
3. Check WMI filters
4. Verify inheritance isn't blocked
5. Run `gpresult /r` to see which GPOs applied/denied

**Software not installing:**
1. Verify network path is accessible by COMPUTER account (not just user)
2. Check MSI is not corrupted
3. Review Application Event Log for MSI errors
4. Ensure sufficient disk space

**Drive maps not appearing:**
1. Check item-level targeting conditions
2. Verify share path is correct and accessible
3. Ensure "Run in logged-on user's security context" is set
4. Check for conflicting drive letters

### GPO Logging

Enable verbose logging:

```powershell
# Enable GP Preferences logging
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Group Policy\{35378EAC-683F-11D2-A89A-00C04FBBCFA2}" /v TraceLevel /t REG_DWORD /d 2 /f

# Logs go to: %SYSTEMROOT%\Debug\UserMode\
```

## Part 9: Import Administrative Templates (ADMX)

### Install Central Store

Create a central store for ADMX files:

```powershell
# Create PolicyDefinitions folder in SYSVOL
New-Item -Path "\\contoso.local\SYSVOL\contoso.local\Policies\PolicyDefinitions" -ItemType Directory

# Copy ADMX files from local machine
Copy-Item "C:\Windows\PolicyDefinitions\*" "\\contoso.local\SYSVOL\contoso.local\Policies\PolicyDefinitions\" -Recurse
```

### Add Third-Party ADMX (Chrome, Office, etc.)

1. Download ADMX templates from vendor
2. Copy `.admx` files to `\\domain\SYSVOL\domain\Policies\PolicyDefinitions\`
3. Copy language folders (en-US, etc.) to same location
4. Refresh GPMC - new settings appear automatically

Example for Chrome:
- Download from: https://chromeenterprise.google/browser/download/
- Extract and copy `chrome.admx` and `chrome.adml` to appropriate folders

## Part 10: Backup and Restore GPOs

```powershell
# Backup all GPOs
$backupPath = "C:\GPOBackup\$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -Path $backupPath -ItemType Directory
Get-GPO -All | ForEach-Object {
    Backup-GPO -Name $_.DisplayName -Path $backupPath
}

# Backup specific GPO
Backup-GPO -Name "User - Drive Mappings" -Path "C:\GPOBackup"

# Restore GPO
Restore-GPO -Name "User - Drive Mappings" -Path "C:\GPOBackup"

# Import GPO to new name
Import-GPO -BackupGpoName "User - Drive Mappings" -TargetName "User - Drive Mappings v2" -Path "C:\GPOBackup" -CreateIfNeeded
```

## Quick Reference: Common GPO Paths

| Purpose | Path |
|---------|------|
| Drive mappings | User Config > Preferences > Windows Settings > Drive Maps |
| Software install | Computer Config > Policies > Software Settings > Software Installation |
| Startup scripts | Computer Config > Policies > Windows Settings > Scripts > Startup |
| Logon scripts | User Config > Policies > Windows Settings > Scripts > Logon |
| Password policy | Computer Config > Policies > Windows Settings > Security Settings > Account Policies |
| Folder redirection | User Config > Policies > Windows Settings > Folder Redirection |
| Printers | User Config > Preferences > Control Panel Settings > Printers |
| Registry | Computer/User Config > Preferences > Windows Settings > Registry |
| Scheduled tasks | Computer Config > Preferences > Control Panel Settings > Scheduled Tasks |
| Desktop settings | User Config > Policies > Administrative Templates > Desktop |
| Windows Update | Computer Config > Policies > Administrative Templates > Windows Components > Windows Update |
