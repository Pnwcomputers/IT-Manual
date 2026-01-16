# Setting Up File Shares in a Windows Server 2025 Domain Environment

This guide covers creating and managing file shares with proper security using NTFS and Share permissions in an Active Directory environment.

## Understanding Permissions

Windows file sharing uses two layers of permissions:

1. **Share Permissions**: Apply when accessing over the network
2. **NTFS Permissions**: Apply always (local and network)

**Best Practice**: Set Share permissions to "Everyone: Full Control" or use only "Authenticated Users: Change" and control access entirely through NTFS permissions. This simplifies management.

## Part 1: Basic File Share Setup

### Create Folder Structure

Before sharing, create a logical folder structure:

```powershell
# Create base share folders
New-Item -Path "D:\Shares" -ItemType Directory
New-Item -Path "D:\Shares\Company" -ItemType Directory
New-Item -Path "D:\Shares\Company\Finance" -ItemType Directory
New-Item -Path "D:\Shares\Company\HR" -ItemType Directory
New-Item -Path "D:\Shares\Company\IT" -ItemType Directory
New-Item -Path "D:\Shares\Company\Sales" -ItemType Directory
New-Item -Path "D:\Shares\Company\Public" -ItemType Directory
New-Item -Path "D:\Shares\Users" -ItemType Directory  # For home folders
New-Item -Path "D:\Shares\Profiles" -ItemType Directory  # For roaming profiles
```

### Create SMB Share (PowerShell)

```powershell
# Create basic share
New-SmbShare `
    -Name "Company" `
    -Path "D:\Shares\Company" `
    -Description "Company shared files" `
    -FullAccess "CONTOSO\Domain Admins" `
    -ChangeAccess "CONTOSO\Domain Users" `
    -ReadAccess "CONTOSO\Domain Guests"

# Create share with Authenticated Users only (recommended)
New-SmbShare `
    -Name "CompanyData" `
    -Path "D:\Shares\Company" `
    -Description "Company data share" `
    -FullAccess "Authenticated Users"

# Create hidden share (add $ to name)
New-SmbShare `
    -Name "IT$" `
    -Path "D:\Shares\Company\IT" `
    -Description "IT Department - Hidden" `
    -FullAccess "CONTOSO\IT-Admins"
```

### Create SMB Share (GUI)

1. Open **Server Manager**
2. Go to **File and Storage Services** > **Shares**
3. Click **Tasks** > **New Share**
4. Select **SMB Share - Quick** (or Advanced for more options)
5. Select the server and path
6. Enter share name and description
7. Configure permissions
8. Click **Create**

Or using File Explorer:
1. Right-click folder > **Properties**
2. Go to **Sharing** tab
3. Click **Advanced Sharing**
4. Check **Share this folder**
5. Set share name and permissions

## Part 2: NTFS Permissions

### Understanding NTFS Permission Levels

| Permission | Files | Folders |
|------------|-------|---------|
| Full Control | All permissions | All permissions |
| Modify | Read, write, delete | Read, write, delete, create subfolders |
| Read & Execute | Read and run | Read and traverse |
| List Folder Contents | N/A | View contents |
| Read | View content and attributes | View contents |
| Write | Create and modify | Create files and subfolders |

### Set NTFS Permissions (PowerShell)

```powershell
# Get current permissions
Get-Acl "D:\Shares\Company" | Format-List

# Remove inheritance and convert to explicit permissions
$acl = Get-Acl "D:\Shares\Company"
$acl.SetAccessRuleProtection($true, $true)  # Disable inheritance, keep existing
Set-Acl "D:\Shares\Company" $acl

# Add permission for a group
$acl = Get-Acl "D:\Shares\Company\Finance"
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "CONTOSO\GRP-Finance",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.AddAccessRule($rule)
Set-Acl "D:\Shares\Company\Finance" $acl

# Remove a permission
$acl = Get-Acl "D:\Shares\Company\Finance"
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "CONTOSO\Domain Users",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.RemoveAccessRule($rule)
Set-Acl "D:\Shares\Company\Finance" $acl
```

### Set NTFS Permissions (GUI)

1. Right-click folder > **Properties**
2. Go to **Security** tab
3. Click **Edit** to modify permissions
4. Click **Add** to add users/groups
5. Select permissions (Read, Modify, Full Control, etc.)
6. Click **OK**

For advanced options, click **Advanced**:
- Disable inheritance
- Set special permissions
- View effective permissions

## Part 3: Recommended Permission Structure

### AGDLP Model

The recommended approach for enterprise environments:

- **A**ccounts → **G**lobal Groups → **D**omain **L**ocal Groups → **P**ermissions

1. Users are members of Global Groups (by department/role)
2. Global Groups are members of Domain Local Groups (by resource access)
3. Domain Local Groups are assigned NTFS permissions

Example:
```
User: jsmith → GRP-Finance (Global) → FileShare-Finance-Modify (Domain Local) → NTFS Modify on D:\Shares\Finance
```

### Create Access Groups

```powershell
# Create Domain Local groups for file share access
$shares = @("Finance", "HR", "IT", "Sales", "Public")

foreach ($share in $shares) {
    # Read access group
    New-ADGroup `
        -Name "FS-$share-Read" `
        -GroupScope DomainLocal `
        -GroupCategory Security `
        -Path "OU=Groups,OU=Company,DC=contoso,DC=local" `
        -Description "Read access to $share share"
    
    # Modify access group
    New-ADGroup `
        -Name "FS-$share-Modify" `
        -GroupScope DomainLocal `
        -GroupCategory Security `
        -Path "OU=Groups,OU=Company,DC=contoso,DC=local" `
        -Description "Modify access to $share share"
    
    # Full control group (admins)
    New-ADGroup `
        -Name "FS-$share-FullControl" `
        -GroupScope DomainLocal `
        -GroupCategory Security `
        -Path "OU=Groups,OU=Company,DC=contoso,DC=local" `
        -Description "Full control of $share share"
}

# Add department groups to access groups
Add-ADGroupMember -Identity "FS-Finance-Modify" -Members "GRP-Finance"
Add-ADGroupMember -Identity "FS-HR-Modify" -Members "GRP-HR"
Add-ADGroupMember -Identity "FS-IT-FullControl" -Members "IT-Admins"
```

### Apply Permissions Script

```powershell
# Function to set standard share permissions
function Set-SharePermissions {
    param (
        [string]$Path,
        [string]$ShareName,
        [string]$ReadGroup,
        [string]$ModifyGroup,
        [string]$FullControlGroup
    )
    
    # Create share with Everyone Full Control (control via NTFS)
    New-SmbShare -Name $ShareName -Path $Path -FullAccess "Everyone" -ErrorAction SilentlyContinue
    
    # Reset NTFS permissions
    $acl = Get-Acl $Path
    $acl.SetAccessRuleProtection($true, $false)  # Remove inheritance, don't keep existing
    
    # Add SYSTEM - Full Control
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        "SYSTEM", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
    $acl.AddAccessRule($rule)
    
    # Add Administrators - Full Control
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        "BUILTIN\Administrators", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
    $acl.AddAccessRule($rule)
    
    # Add Read Group
    if ($ReadGroup) {
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            $ReadGroup, "ReadAndExecute", "ContainerInherit,ObjectInherit", "None", "Allow")
        $acl.AddAccessRule($rule)
    }
    
    # Add Modify Group
    if ($ModifyGroup) {
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            $ModifyGroup, "Modify", "ContainerInherit,ObjectInherit", "None", "Allow")
        $acl.AddAccessRule($rule)
    }
    
    # Add Full Control Group
    if ($FullControlGroup) {
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            $FullControlGroup, "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
        $acl.AddAccessRule($rule)
    }
    
    Set-Acl $Path $acl
    Write-Host "Configured permissions for $Path"
}

# Apply to department shares
Set-SharePermissions -Path "D:\Shares\Company\Finance" -ShareName "Finance" `
    -ReadGroup "CONTOSO\FS-Finance-Read" `
    -ModifyGroup "CONTOSO\FS-Finance-Modify" `
    -FullControlGroup "CONTOSO\FS-Finance-FullControl"

Set-SharePermissions -Path "D:\Shares\Company\HR" -ShareName "HR" `
    -ReadGroup "CONTOSO\FS-HR-Read" `
    -ModifyGroup "CONTOSO\FS-HR-Modify" `
    -FullControlGroup "CONTOSO\FS-HR-FullControl"
```

## Part 4: Home Folders

Home folders give each user a private network folder.

### Create Home Folder Share

```powershell
# Create home folder root
New-Item -Path "D:\Shares\Users" -ItemType Directory

# Create share with special permissions
New-SmbShare `
    -Name "Users$" `
    -Path "D:\Shares\Users" `
    -FullAccess "CONTOSO\Domain Admins" `
    -ChangeAccess "CONTOSO\Domain Users"

# Set NTFS permissions on root
$acl = Get-Acl "D:\Shares\Users"
$acl.SetAccessRuleProtection($true, $false)

# SYSTEM - Full Control
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "SYSTEM", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
$acl.AddAccessRule($rule)

# Administrators - Full Control
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "BUILTIN\Administrators", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
$acl.AddAccessRule($rule)

# CREATOR OWNER - Full Control (for subfolders only)
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "CREATOR OWNER", "FullControl", "ContainerInherit,ObjectInherit", "InheritOnly", "Allow")
$acl.AddAccessRule($rule)

# Domain Users - Create Folders (this folder only)
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "CONTOSO\Domain Users", "CreateDirectories", "None", "None", "Allow")
$acl.AddAccessRule($rule)

Set-Acl "D:\Shares\Users" $acl
```

### Configure Home Folders in AD

Set home folder path in user properties:

```powershell
# Set home folder for single user
Set-ADUser -Identity "jsmith" `
    -HomeDirectory "\\SRV-FILE01\Users$\jsmith" `
    -HomeDrive "H:"

# Set home folders for all users in an OU
Get-ADUser -Filter * -SearchBase "OU=Users,OU=Company,DC=contoso,DC=local" | ForEach-Object {
    $homePath = "\\SRV-FILE01\Users$\$($_.SamAccountName)"
    
    # Create folder if it doesn't exist
    if (!(Test-Path $homePath)) {
        New-Item -Path $homePath -ItemType Directory
        
        # Set permissions for user
        $acl = Get-Acl $homePath
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            $_.SamAccountName, "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
        $acl.AddAccessRule($rule)
        Set-Acl $homePath $acl
    }
    
    # Set AD attributes
    Set-ADUser -Identity $_.SamAccountName -HomeDirectory $homePath -HomeDrive "H:"
    Write-Host "Configured home folder for $($_.SamAccountName)"
}
```

## Part 5: DFS (Distributed File System)

DFS provides a unified namespace and can replicate data between servers.

### Install DFS

```powershell
# Install DFS Namespaces and Replication
Install-WindowsFeature FS-DFS-Namespace, FS-DFS-Replication, RSAT-DFS-Mgmt-Con
```

### Create DFS Namespace

```powershell
# Create domain-based namespace
New-DfsnRoot `
    -Path "\\contoso.local\files" `
    -TargetPath "\\SRV-FILE01\Company" `
    -Type DomainV2 `
    -Description "Company file share namespace"

# Add folders to namespace
New-DfsnFolder `
    -Path "\\contoso.local\files\Finance" `
    -TargetPath "\\SRV-FILE01\Finance"

New-DfsnFolder `
    -Path "\\contoso.local\files\HR" `
    -TargetPath "\\SRV-FILE01\HR"

# Users access: \\contoso.local\files\Finance instead of \\SRV-FILE01\Finance
```

### DFS Benefits

- **Single namespace**: Users access `\\domain\files` instead of remembering server names
- **Location transparency**: Move data between servers without changing paths
- **Replication**: Keep copies on multiple servers for redundancy
- **Failover**: Automatic failover if a server goes down

## Part 6: Access-Based Enumeration (ABE)

ABE hides folders users don't have permission to see.

```powershell
# Enable ABE on a share
Set-SmbShare -Name "Company" -FolderEnumerationMode AccessBased

# Check ABE status
Get-SmbShare -Name "Company" | Select-Object Name, FolderEnumerationMode

# Enable ABE on all shares
Get-SmbShare | Where-Object { $_.Special -eq $false } | 
    Set-SmbShare -FolderEnumerationMode AccessBased -Confirm:$false
```

## Part 7: Shadow Copies (Previous Versions)

Enable shadow copies for easy file recovery:

### Enable via GUI

1. Open **Server Manager**
2. Go to **File and Storage Services** > **Volumes**
3. Right-click volume > **Configure Shadow Copies**
4. Select the volume and click **Enable**
5. Configure schedule (default: 7 AM and 12 PM)

### Enable via PowerShell

```powershell
# Enable shadow copies on D: drive
vssadmin add shadowstorage /for=D: /on=D: /maxsize=10%

# Create a shadow copy manually
vssadmin create shadow /for=D:

# Create scheduled task for shadow copies
$trigger1 = New-ScheduledTaskTrigger -Daily -At 7am
$trigger2 = New-ScheduledTaskTrigger -Daily -At 12pm
$action = New-ScheduledTaskAction -Execute "vssadmin.exe" -Argument "create shadow /for=D:"
Register-ScheduledTask -TaskName "Shadow Copy D" -Trigger $trigger1,$trigger2 -Action $action -User "SYSTEM"

# List existing shadow copies
vssadmin list shadows

# Delete old shadow copies
vssadmin delete shadows /for=D: /oldest
```

## Part 8: Quotas

### Install File Server Resource Manager

```powershell
Install-WindowsFeature FS-Resource-Manager -IncludeManagementTools
```

### Configure Quotas

```powershell
# Create quota template
New-FsrmQuotaTemplate `
    -Name "500MB User Limit" `
    -Size 500MB `
    -SoftLimit `
    -Threshold (New-FsrmQuotaThreshold -Percentage 85 -Action (
        New-FsrmAction -Type Email -MailTo "[Admin Email]" -Subject "Quota Warning" -Body "User approaching quota limit"
    ))

# Apply quota to folder
New-FsrmQuota `
    -Path "D:\Shares\Users" `
    -Template "500MB User Limit"

# Create auto-apply quota (applies to all subfolders)
New-FsrmAutoQuota `
    -Path "D:\Shares\Users" `
    -Template "500MB User Limit"

# View quota usage
Get-FsrmQuota -Path "D:\Shares\Users\*" | Select-Object Path, Size, Usage
```

## Part 9: Auditing File Access

### Enable Auditing Policy

```powershell
# Enable via Group Policy (recommended) or local policy
# Computer Configuration > Windows Settings > Security Settings > Local Policies > Audit Policy
# Enable "Audit object access" for Success and Failure
```

### Configure Folder Auditing

```powershell
# Add auditing to folder
$acl = Get-Acl "D:\Shares\Company\Finance"
$auditRule = New-Object System.Security.AccessControl.FileSystemAuditRule(
    "Everyone",
    "Delete,DeleteSubdirectoriesAndFiles,Write",
    "ContainerInherit,ObjectInherit",
    "None",
    "Success,Failure"
)
$acl.AddAuditRule($auditRule)
Set-Acl "D:\Shares\Company\Finance" $acl
```

Events are logged to Security log (Event ID 4663 for file access).

## Part 10: Mapping Drives via GPO

See the Group Policy guide for detailed instructions on mapping network drives automatically at logon.

Quick reference:
1. Create GPO linked to Users OU
2. Navigate to: User Configuration > Preferences > Windows Settings > Drive Maps
3. Create new mapped drive
4. Set action: Create or Update
5. Location: `\\SRV-FILE01\Company`
6. Drive letter: S:

## Troubleshooting

### User Can't Access Share

1. **Verify share exists**: `Get-SmbShare`
2. **Check share permissions**: `Get-SmbShareAccess -Name "ShareName"`
3. **Check NTFS permissions**: Right-click folder > Security
4. **Test from server**: `Test-Path "\\localhost\ShareName"`
5. **Check effective permissions**: Security tab > Advanced > Effective Access

### Common Issues

**"Access Denied" errors:**
- Check both Share AND NTFS permissions
- User may need to log off/on after group membership changes
- Run `gpupdate /force` on client

**Share not visible in network browse:**
- Hidden shares (ending in $) won't show
- Check firewall: File and Printer Sharing must be allowed
- Verify Computer Browser service

**Slow file access:**
- Check network speed and congestion
- Disable SMB1 if not needed: `Set-SmbServerConfiguration -EnableSMB1Protocol $false`
- Enable SMB Multichannel if multiple NICs

### Useful Commands

```powershell
# List all shares
Get-SmbShare

# View share permissions
Get-SmbShareAccess -Name "Company"

# View active sessions
Get-SmbSession

# View open files
Get-SmbOpenFile

# Close all files for a user
Close-SmbSession -ClientUserName "CONTOSO\jsmith"

# Test share access
Test-Path "\\SRV-FILE01\Company"

# View effective NTFS permissions
Get-Acl "D:\Shares\Company" | Format-List
```

## Quick Setup Checklist

1. ☐ Create folder structure on dedicated drive
2. ☐ Create AD security groups for access control
3. ☐ Create SMB shares
4. ☐ Set NTFS permissions using groups
5. ☐ Enable Access-Based Enumeration
6. ☐ Enable Shadow Copies
7. ☐ Configure quotas if needed
8. ☐ Set up DFS namespace (optional but recommended)
9. ☐ Create GPO for drive mapping
10. ☐ Test access with different user accounts
11. ☐ Document share structure and permissions
