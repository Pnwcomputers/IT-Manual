# File Sharing in a Workgroup Environment (Without Active Directory)

This guide covers setting up and managing file shares on Windows Server 2025 in a workgroup environment without Active Directory.

## Understanding Workgroup File Sharing

In a workgroup environment:
- Authentication uses local accounts on each machine
- Users need accounts on the server to access shares
- Share and NTFS permissions work the same as in domain environments
- Password synchronization between machines is manual

## Part 1: Install File Server Role

```powershell
# Install File Server role
Install-WindowsFeature -Name FS-FileServer -IncludeManagementTools

# Optional: Install additional features
Install-WindowsFeature -Name FS-Resource-Manager -IncludeManagementTools  # Quotas, file screening
```

## Part 2: Create Folder Structure

```powershell
# Create base folders
New-Item -Path "D:\Shares" -ItemType Directory
New-Item -Path "D:\Shares\Public" -ItemType Directory
New-Item -Path "D:\Shares\Departments" -ItemType Directory
New-Item -Path "D:\Shares\Departments\Sales" -ItemType Directory
New-Item -Path "D:\Shares\Departments\Accounting" -ItemType Directory
New-Item -Path "D:\Shares\Departments\IT" -ItemType Directory
New-Item -Path "D:\Shares\Users" -ItemType Directory
New-Item -Path "D:\Shares\Software" -ItemType Directory
```

## Part 3: Create Local Groups for Access Control

Create groups on the server to manage permissions:

```powershell
# Create access groups
New-LocalGroup -Name "FS-Public-Read" -Description "Read access to Public share"
New-LocalGroup -Name "FS-Public-Write" -Description "Write access to Public share"
New-LocalGroup -Name "FS-Sales-Access" -Description "Access to Sales folder"
New-LocalGroup -Name "FS-Accounting-Access" -Description "Access to Accounting folder"
New-LocalGroup -Name "FS-IT-Access" -Description "Access to IT folder"
New-LocalGroup -Name "FS-AllStaff" -Description "All staff members"

# Add users to groups
Add-LocalGroupMember -Group "FS-AllStaff" -Member "jsmith", "jdoe", "bwilson"
Add-LocalGroupMember -Group "FS-Sales-Access" -Member "jsmith"
Add-LocalGroupMember -Group "FS-Accounting-Access" -Member "bwilson"
Add-LocalGroupMember -Group "FS-IT-Access" -Member "jdoe"
Add-LocalGroupMember -Group "FS-Public-Read" -Member "FS-AllStaff"
```

## Part 4: Set NTFS Permissions

### Understanding NTFS Permissions

| Permission | Description |
|------------|-------------|
| Full Control | Complete control including changing permissions |
| Modify | Read, write, delete files and subfolders |
| Read & Execute | View and run files |
| List Folder Contents | View folder contents |
| Read | View files only |
| Write | Create files and folders |

### Set Permissions via PowerShell

```powershell
# Function to set NTFS permissions
function Set-FolderPermission {
    param (
        [string]$Path,
        [string]$Identity,
        [string]$Permission,  # FullControl, Modify, ReadAndExecute, Read, Write
        [switch]$RemoveInheritance
    )
    
    $acl = Get-Acl -Path $Path
    
    if ($RemoveInheritance) {
        # Disable inheritance and remove inherited permissions
        $acl.SetAccessRuleProtection($true, $false)
        
        # Add SYSTEM with Full Control
        $systemRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            "SYSTEM", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
        $acl.AddAccessRule($systemRule)
        
        # Add Administrators with Full Control
        $adminRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            "BUILTIN\Administrators", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
        $acl.AddAccessRule($adminRule)
    }
    
    # Add the specified permission
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        $Identity,
        $Permission,
        "ContainerInherit,ObjectInherit",
        "None",
        "Allow"
    )
    $acl.AddAccessRule($accessRule)
    
    Set-Acl -Path $Path -AclObject $acl
    Write-Host "Set $Permission for $Identity on $Path"
}

# Configure Public folder - everyone can read, specific group can write
Set-FolderPermission -Path "D:\Shares\Public" -Identity "FS-Public-Read" -Permission "ReadAndExecute" -RemoveInheritance
Set-FolderPermission -Path "D:\Shares\Public" -Identity "FS-Public-Write" -Permission "Modify"

# Configure Sales folder
Set-FolderPermission -Path "D:\Shares\Departments\Sales" -Identity "FS-Sales-Access" -Permission "Modify" -RemoveInheritance

# Configure Accounting folder
Set-FolderPermission -Path "D:\Shares\Departments\Accounting" -Identity "FS-Accounting-Access" -Permission "Modify" -RemoveInheritance

# Configure IT folder
Set-FolderPermission -Path "D:\Shares\Departments\IT" -Identity "FS-IT-Access" -Permission "Modify" -RemoveInheritance
```

### Set Permissions via GUI

1. Right-click folder > Properties > Security tab
2. Click "Advanced"
3. Click "Disable inheritance" > "Remove all inherited permissions"
4. Click "Add" > "Select a principal"
5. Add SYSTEM and Administrators with Full Control
6. Add your access groups with appropriate permissions
7. Click OK

### View Current Permissions

```powershell
# View NTFS permissions
Get-Acl "D:\Shares\Public" | Format-List

# View in readable format
(Get-Acl "D:\Shares\Public").Access | Format-Table IdentityReference, FileSystemRights, AccessControlType

# Using icacls
icacls "D:\Shares\Public"
```

## Part 5: Create SMB Shares

### Create Shares via PowerShell

```powershell
# Create Public share - accessible to all authenticated users
New-SmbShare `
    -Name "Public" `
    -Path "D:\Shares\Public" `
    -Description "Public shared files" `
    -FullAccess "Administrators" `
    -ChangeAccess "Authenticated Users" `
    -FolderEnumerationMode AccessBased

# Create Departments share
New-SmbShare `
    -Name "Departments" `
    -Path "D:\Shares\Departments" `
    -Description "Department folders" `
    -FullAccess "Administrators" `
    -ChangeAccess "Authenticated Users" `
    -FolderEnumerationMode AccessBased

# Create Software share (hidden with $)
New-SmbShare `
    -Name "Software$" `
    -Path "D:\Shares\Software" `
    -Description "Software installation files" `
    -FullAccess "Administrators"

# Create Users share for personal folders
New-SmbShare `
    -Name "Users$" `
    -Path "D:\Shares\Users" `
    -Description "User home folders" `
    -FullAccess "Administrators" `
    -ChangeAccess "Authenticated Users"

# View shares
Get-SmbShare
```

### Create Shares via GUI

1. Open Server Manager > File and Storage Services > Shares
2. Click Tasks > New Share
3. Select "SMB Share - Quick"
4. Select folder path
5. Enter share name
6. Enable "Access-based enumeration" (optional but recommended)
7. Configure share permissions
8. Complete wizard

### Share Permissions vs NTFS Permissions

**Best Practice**: Set share permissions broadly (Authenticated Users: Change) and control access with NTFS permissions.

| Share Permission | Effect |
|-----------------|--------|
| Read | Can view files and folders |
| Change | Can read, write, delete |
| Full Control | Change + modify permissions |

## Part 6: Enable Access-Based Enumeration

ABE hides folders users don't have permission to access:

```powershell
# Enable ABE on share
Set-SmbShare -Name "Departments" -FolderEnumerationMode AccessBased

# Verify
Get-SmbShare -Name "Departments" | Select-Object Name, FolderEnumerationMode
```

## Part 7: Configure User Home Folders

Create personal folders for each user:

```powershell
# Create home folder function
function New-HomeFolder {
    param (
        [string]$Username,
        [string]$BasePath = "D:\Shares\Users"
    )
    
    $homePath = Join-Path $BasePath $Username
    
    # Create folder
    New-Item -Path $homePath -ItemType Directory -Force
    
    # Set permissions - only user and admins
    $acl = Get-Acl $homePath
    $acl.SetAccessRuleProtection($true, $false)
    
    # SYSTEM
    $systemRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        "SYSTEM", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
    $acl.AddAccessRule($systemRule)
    
    # Administrators
    $adminRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        "BUILTIN\Administrators", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
    $acl.AddAccessRule($adminRule)
    
    # User
    $userRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        $Username, "Modify", "ContainerInherit,ObjectInherit", "None", "Allow")
    $acl.AddAccessRule($userRule)
    
    Set-Acl -Path $homePath -AclObject $acl
    
    Write-Host "Created home folder for $Username at $homePath"
}

# Create home folders for all local users
Get-LocalUser | Where-Object { $_.Enabled -eq $true -and $_.Name -notlike "*$" } | ForEach-Object {
    New-HomeFolder -Username $_.Name
}
```

## Part 8: Client Access Configuration

### Option 1: Matching Credentials (Recommended for Small Offices)

Create the same username and password on both server and client:

**On Server:**
```powershell
$password = ConvertTo-SecureString "UserP@ss123!" -AsPlainText -Force
New-LocalUser -Name "jsmith" -Password $password -FullName "John Smith"
Add-LocalGroupMember -Group "FS-Sales-Access" -Member "jsmith"
```

**On Client:**
```powershell
$password = ConvertTo-SecureString "UserP@ss123!" -AsPlainText -Force
New-LocalUser -Name "jsmith" -Password $password -FullName "John Smith"
```

When jsmith logs into their PC and accesses `\\SERVER\Share`, it works automatically.

### Option 2: Stored Credentials

Save credentials on client machines:

```powershell
# Add Windows Credential
cmdkey /add:SERVER01 /user:SERVER01\jsmith /pass:UserP@ss123!

# View stored credentials
cmdkey /list

# Delete credential
cmdkey /delete:SERVER01
```

Or use Credential Manager GUI: `rundll32.exe keymgr.dll,KRShowKeyMgr`

### Option 3: Map Network Drive with Credentials

```powershell
# Map drive with credentials (persistent)
net use Z: \\SERVER01\Public /user:SERVER01\jsmith /persistent:yes

# Map drive via PowerShell
$cred = Get-Credential
New-PSDrive -Name "Z" -PSProvider FileSystem -Root "\\SERVER01\Public" -Credential $cred -Persist
```

### Option 4: Guest Access (Not Recommended)

Enable if you need anonymous access:

```powershell
# Enable Guest account
Enable-LocalUser -Name "Guest"

# Grant access to share
Grant-SmbShareAccess -Name "Public" -AccountName "Everyone" -AccessRight Read

# Note: This is a security risk - use only for truly public data
```

## Part 9: Map Drives Automatically at Login

### Using Login Script

Create batch file (`\\SERVER01\netlogon\login.bat`):
```batch
@echo off
net use Z: \\SERVER01\Public /persistent:yes
net use H: \\SERVER01\Users$\%USERNAME% /persistent:yes
```

Set as login script via Local Group Policy (`gpedit.msc`):
User Configuration > Windows Settings > Scripts > Logon

### Using Task Scheduler

```powershell
# Create scheduled task to map drives at login
$action = New-ScheduledTaskAction -Execute "net.exe" -Argument "use Z: \\SERVER01\Public /persistent:yes"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$principal = New-ScheduledTaskPrincipal -UserId "BUILTIN\Users" -LogonType Interactive
Register-ScheduledTask -TaskName "Map Network Drives" -Action $action -Trigger $trigger -Principal $principal
```

## Part 10: Shadow Copies (Previous Versions)

Enable shadow copies for easy file recovery:

```powershell
# Enable shadow copies on D: drive
vssadmin add shadowstorage /for=D: /on=D: /maxsize=10%

# Create initial shadow copy
vssadmin create shadow /for=D:

# Schedule shadow copies
$action = New-ScheduledTaskAction -Execute "vssadmin.exe" -Argument "create shadow /for=D:"
$trigger1 = New-ScheduledTaskTrigger -Daily -At 7am
$trigger2 = New-ScheduledTaskTrigger -Daily -At 12pm
Register-ScheduledTask -TaskName "Shadow Copy D" -Action $action -Trigger $trigger1, $trigger2 -User "SYSTEM"

# View shadow copies
vssadmin list shadows
```

Users access via: Right-click file/folder > Properties > Previous Versions

## Part 11: Monitoring and Management

### View Open Files

```powershell
# View open files
Get-SmbOpenFile

# View by user
Get-SmbOpenFile | Where-Object { $_.ClientUserName -like "*jsmith*" }

# Close open file
Close-SmbOpenFile -FileId <ID> -Force
```

### View Active Sessions

```powershell
# View active sessions
Get-SmbSession

# View by computer
Get-SmbSession | Where-Object { $_.ClientComputerName -like "*PC*" }

# Disconnect session
Close-SmbSession -SessionId <ID> -Force
```

### View Share Access

```powershell
# View share permissions
Get-SmbShareAccess -Name "Public"

# Modify share permissions
Grant-SmbShareAccess -Name "Public" -AccountName "jsmith" -AccessRight Change
Revoke-SmbShareAccess -Name "Public" -AccountName "Guest"
```

## Part 12: Troubleshooting

### Common Issues

**"Access Denied" when accessing share:**
1. Verify user account exists on server
2. Check username/password match (if using matching accounts)
3. Verify group membership
4. Check both share AND NTFS permissions
5. Try accessing with explicit credentials

```powershell
# Test share access
Test-Path "\\SERVER01\Public"

# Clear cached credentials
net use * /delete /yes
```

**"Network path not found":**
1. Verify server is reachable: `ping SERVER01`
2. Check share exists: `Get-SmbShare`
3. Verify firewall allows file sharing
4. Check server name resolution

```powershell
# Check if port 445 is open
Test-NetConnection -ComputerName SERVER01 -Port 445
```

**User can see folders they shouldn't:**
1. Enable Access-Based Enumeration
2. Verify NTFS permissions are set correctly

### Firewall Configuration

```powershell
# Enable file sharing rules
Enable-NetFirewallRule -DisplayGroup "File and Printer Sharing"

# Or manually open ports
New-NetFirewallRule -DisplayName "SMB" -Direction Inbound -Protocol TCP -LocalPort 445 -Action Allow
New-NetFirewallRule -DisplayName "NetBIOS" -Direction Inbound -Protocol TCP -LocalPort 139 -Action Allow
New-NetFirewallRule -DisplayName "NetBIOS UDP" -Direction Inbound -Protocol UDP -LocalPort 137,138 -Action Allow
```

## Quick Reference

```powershell
# Share Management
Get-SmbShare                                    # List shares
New-SmbShare -Name "Share" -Path "D:\Folder"   # Create share
Remove-SmbShare -Name "Share"                   # Delete share
Set-SmbShare -Name "Share" -FolderEnumerationMode AccessBased  # Enable ABE

# Permissions
Get-SmbShareAccess -Name "Share"               # View share permissions
Grant-SmbShareAccess -Name "Share" -AccountName "User" -AccessRight Change
Get-Acl "D:\Folder"                            # View NTFS permissions
icacls "D:\Folder" /grant "User:(OI)(CI)M"     # Grant NTFS permissions

# Monitoring
Get-SmbOpenFile                                 # View open files
Get-SmbSession                                  # View sessions
Close-SmbOpenFile -FileId <ID>                 # Close file
Close-SmbSession -SessionId <ID>               # Close session
```
