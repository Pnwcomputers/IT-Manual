# Local User and Group Management for Workgroup Networks

This guide covers creating and managing local users and groups on Windows Server 2025 and Windows clients in a workgroup environment.

## Understanding Workgroup User Management

In a workgroup (non-domain) environment:
- Each computer maintains its own user database
- Users must be created on each machine they need to access
- No centralized password management
- File share access requires matching usernames/passwords OR explicit credentials

## Part 1: Managing Local Users on Server

### View Existing Users

```powershell
# List all local users
Get-LocalUser

# Get detailed info about a user
Get-LocalUser -Name "Administrator" | Select-Object *

# List users with specific properties
Get-LocalUser | Select-Object Name, Enabled, LastLogon, PasswordExpires
```

### Create Local Users

```powershell
# Create user with password prompt
$password = Read-Host -AsSecureString "Enter password"
New-LocalUser -Name "jsmith" -Password $password -FullName "John Smith" -Description "Sales Department"

# Create user with inline password (for scripting)
$password = ConvertTo-SecureString "UserP@ssw0rd123!" -AsPlainText -Force
New-LocalUser -Name "jdoe" -Password $password -FullName "Jane Doe" -Description "IT Department"

# Create user with password never expires
New-LocalUser -Name "svc-backup" -Password $password -FullName "Backup Service" -Description "Service account for backups" -PasswordNeverExpires

# Create user that must change password at first logon
New-LocalUser -Name "newuser" -Password $password -FullName "New Employee" -UserMayNotChangePassword:$false
Set-LocalUser -Name "newuser" -PasswordExpired $true
```

### Bulk Create Users

```powershell
# Create multiple users from array
$users = @(
    @{Name="jsmith"; FullName="John Smith"; Dept="Sales"},
    @{Name="jdoe"; FullName="Jane Doe"; Dept="IT"},
    @{Name="bwilson"; FullName="Bob Wilson"; Dept="Accounting"},
    @{Name="mgarcia"; FullName="Maria Garcia"; Dept="HR"}
)

$defaultPassword = ConvertTo-SecureString "TempP@ss123!" -AsPlainText -Force

foreach ($user in $users) {
    New-LocalUser -Name $user.Name -Password $defaultPassword -FullName $user.FullName -Description $user.Dept
    Set-LocalUser -Name $user.Name -PasswordExpired $true
    Write-Host "Created user: $($user.Name)"
}
```

### Bulk Create Users from CSV

Create CSV file (`users.csv`):
```csv
Username,FullName,Description
jsmith,John Smith,Sales Department
jdoe,Jane Doe,IT Department
bwilson,Bob Wilson,Accounting
mgarcia,Maria Garcia,Human Resources
```

Import and create:
```powershell
$defaultPassword = ConvertTo-SecureString "TempP@ss123!" -AsPlainText -Force

Import-Csv "C:\users.csv" | ForEach-Object {
    New-LocalUser -Name $_.Username -Password $defaultPassword -FullName $_.FullName -Description $_.Description
    Set-LocalUser -Name $_.Username -PasswordExpired $true
    Write-Host "Created: $($_.Username)"
}
```

### Modify Users

```powershell
# Change user's full name
Set-LocalUser -Name "jsmith" -FullName "Jonathan Smith"

# Change description
Set-LocalUser -Name "jsmith" -Description "Senior Sales Representative"

# Reset password
$newPassword = ConvertTo-SecureString "NewP@ssw0rd!" -AsPlainText -Force
Set-LocalUser -Name "jsmith" -Password $newPassword

# Force password change at next logon
Set-LocalUser -Name "jsmith" -PasswordExpired $true

# Disable password expiration
Set-LocalUser -Name "svc-backup" -PasswordNeverExpires $true

# Enable/Disable user
Disable-LocalUser -Name "jsmith"
Enable-LocalUser -Name "jsmith"

# Rename user
Rename-LocalUser -Name "jsmith" -NewName "jsmith-old"
```

### Delete Users

```powershell
# Remove user
Remove-LocalUser -Name "olduser"

# Remove user with confirmation
Remove-LocalUser -Name "olduser" -Confirm

# Remove multiple users
@("user1", "user2", "user3") | ForEach-Object { Remove-LocalUser -Name $_ }
```

---

## Part 2: Managing Local Groups

### View Existing Groups

```powershell
# List all groups
Get-LocalGroup

# View group members
Get-LocalGroupMember -Group "Administrators"
Get-LocalGroupMember -Group "Users"
Get-LocalGroupMember -Group "Remote Desktop Users"
```

### Built-in Groups Reference

| Group | Purpose |
|-------|---------|
| Administrators | Full system access |
| Users | Standard user access |
| Guests | Limited temporary access |
| Remote Desktop Users | Can connect via RDP |
| Backup Operators | Can backup/restore files |
| Power Users | Legacy, similar to Users |
| Network Configuration Operators | Can modify network settings |
| Performance Monitor Users | Can monitor performance |
| Event Log Readers | Can read event logs |

### Create Custom Groups

```powershell
# Create a new group
New-LocalGroup -Name "FileShareUsers" -Description "Users with access to file shares"
New-LocalGroup -Name "ITStaff" -Description "IT Department staff"
New-LocalGroup -Name "Management" -Description "Management team"
New-LocalGroup -Name "RemoteWorkers" -Description "Employees with remote access"

# Create department groups
$departments = @("Sales", "Accounting", "HR", "Marketing", "Engineering")
foreach ($dept in $departments) {
    New-LocalGroup -Name "GRP-$dept" -Description "$dept Department members"
}
```

### Manage Group Membership

```powershell
# Add user to group
Add-LocalGroupMember -Group "FileShareUsers" -Member "jsmith"

# Add multiple users to group
Add-LocalGroupMember -Group "ITStaff" -Member "jdoe", "bwilson"

# Add user to Administrators (be careful!)
Add-LocalGroupMember -Group "Administrators" -Member "itadmin"

# Add user to Remote Desktop Users
Add-LocalGroupMember -Group "Remote Desktop Users" -Member "jsmith"

# Remove user from group
Remove-LocalGroupMember -Group "FileShareUsers" -Member "jsmith"

# View all groups a user belongs to
$username = "jsmith"
Get-LocalGroup | ForEach-Object {
    $members = Get-LocalGroupMember -Group $_.Name -ErrorAction SilentlyContinue
    if ($members.Name -contains "$env:COMPUTERNAME\$username") {
        Write-Host $_.Name
    }
}
```

### Delete Groups

```powershell
# Remove a group
Remove-LocalGroup -Name "OldGroup"
```

---

## Part 3: Password Policies

### View Current Policy

```powershell
# Export current security policy
secedit /export /cfg C:\secpol.cfg
Get-Content C:\secpol.cfg | Select-String "Password|Lockout"
```

### Configure Password Policy via Local Security Policy

Using GUI:
1. Run `secpol.msc`
2. Navigate to Account Policies > Password Policy
3. Configure settings:
   - Enforce password history: 5 passwords
   - Maximum password age: 90 days
   - Minimum password age: 1 day
   - Minimum password length: 12 characters
   - Password must meet complexity requirements: Enabled

### Configure via PowerShell

```powershell
# Create security config file
$secConfig = @"
[Unicode]
Unicode=yes
[System Access]
MinimumPasswordAge = 1
MaximumPasswordAge = 90
MinimumPasswordLength = 12
PasswordComplexity = 1
PasswordHistorySize = 5
LockoutBadCount = 5
ResetLockoutCount = 30
LockoutDuration = 30
[Version]
signature="`$CHICAGO`$"
Revision=1
"@

$secConfig | Out-File "C:\passwordpolicy.inf" -Encoding Unicode

# Apply the policy
secedit /configure /db C:\Windows\Security\local.sdb /cfg C:\passwordpolicy.inf /areas SECURITYPOLICY
```

### Account Lockout Policy

Configure via secpol.msc > Account Policies > Account Lockout Policy:
- Account lockout threshold: 5 invalid attempts
- Account lockout duration: 30 minutes
- Reset account lockout counter after: 30 minutes

---

## Part 4: Workgroup User Strategy

### Option 1: Matching Accounts (Simplest)

Create identical username/password combinations on server and all clients:

**On Server:**
```powershell
$password = ConvertTo-SecureString "SharedP@ss123!" -AsPlainText -Force
New-LocalUser -Name "jsmith" -Password $password -FullName "John Smith"
```

**On Each Client:**
```powershell
$password = ConvertTo-SecureString "SharedP@ss123!" -AsPlainText -Force
New-LocalUser -Name "jsmith" -Password $password -FullName "John Smith"
```

When jsmith logs into their workstation and accesses `\\server\share`, Windows automatically uses their credentials.

### Option 2: Stored Credentials

Users save server credentials on their workstations:

```powershell
# Store credentials for server access
cmdkey /add:SERVER01 /user:SERVER01\shareuser /pass:ShareP@ss123!

# Or use Credential Manager GUI
rundll32.exe keymgr.dll,KRShowKeyMgr
```

### Option 3: Map Drives with Credentials

```powershell
# Map drive with explicit credentials (prompts for password)
net use Z: \\SERVER01\Share /user:SERVER01\jsmith /persistent:yes

# Or via PowerShell
$cred = Get-Credential
New-PSDrive -Name "Z" -PSProvider FileSystem -Root "\\SERVER01\Share" -Credential $cred -Persist
```

---

## Part 5: Managing Users on Client Computers

### Remote User Management

From server, manage users on client computers (requires admin rights):

```powershell
# First, ensure WinRM is enabled on client
# On client: Enable-PSRemoting -Force

# Manage users remotely
$computer = "CLIENT01"
$cred = Get-Credential

# List users on remote computer
Invoke-Command -ComputerName $computer -Credential $cred -ScriptBlock {
    Get-LocalUser
}

# Create user on remote computer
Invoke-Command -ComputerName $computer -Credential $cred -ScriptBlock {
    $password = ConvertTo-SecureString "TempP@ss123!" -AsPlainText -Force
    New-LocalUser -Name "jsmith" -Password $password -FullName "John Smith"
}

# Add user to local Administrators on remote computer
Invoke-Command -ComputerName $computer -Credential $cred -ScriptBlock {
    Add-LocalGroupMember -Group "Administrators" -Member "jsmith"
}
```

### Create Users on Multiple Computers

```powershell
$computers = @("CLIENT01", "CLIENT02", "CLIENT03")
$cred = Get-Credential
$userPassword = ConvertTo-SecureString "TempP@ss123!" -AsPlainText -Force

foreach ($computer in $computers) {
    try {
        Invoke-Command -ComputerName $computer -Credential $cred -ScriptBlock {
            param($pass)
            New-LocalUser -Name "shareduser" -Password $pass -FullName "Shared User Account" -ErrorAction Stop
            Add-LocalGroupMember -Group "Users" -Member "shareduser"
        } -ArgumentList $userPassword
        Write-Host "Created user on $computer" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed on $computer : $_" -ForegroundColor Red
    }
}
```

---

## Part 6: User Profile Management

### View User Profiles

```powershell
# List user profiles
Get-WmiObject Win32_UserProfile | Select-Object LocalPath, SID, LastUseTime

# Get profile path for specific user
$user = Get-LocalUser -Name "jsmith"
Get-WmiObject Win32_UserProfile | Where-Object { $_.SID -eq $user.SID.Value }
```

### Delete User Profile

```powershell
# Delete profile (user must be logged off)
$user = Get-LocalUser -Name "olduser"
$profile = Get-WmiObject Win32_UserProfile | Where-Object { $_.SID -eq $user.SID.Value }
$profile.Delete()

# Then delete the user account
Remove-LocalUser -Name "olduser"
```

---

## Part 7: User Auditing and Reporting

### Generate User Report

```powershell
# Create user report
$report = Get-LocalUser | Select-Object `
    Name,
    FullName,
    Enabled,
    @{N='PasswordLastSet';E={$_.PasswordLastSet}},
    @{N='PasswordExpires';E={$_.PasswordExpires}},
    @{N='LastLogon';E={$_.LastLogon}},
    Description

$report | Export-Csv "C:\Reports\LocalUsers.csv" -NoTypeInformation
$report | Format-Table -AutoSize
```

### Generate Group Membership Report

```powershell
# Report all groups and members
$groupReport = @()
Get-LocalGroup | ForEach-Object {
    $group = $_.Name
    $members = Get-LocalGroupMember -Group $group -ErrorAction SilentlyContinue
    foreach ($member in $members) {
        $groupReport += [PSCustomObject]@{
            Group = $group
            Member = $member.Name
            Type = $member.ObjectClass
        }
    }
}
$groupReport | Export-Csv "C:\Reports\GroupMembership.csv" -NoTypeInformation
$groupReport | Format-Table -AutoSize
```

### Find Inactive Users

```powershell
# Find users who haven't logged in for 90 days
$90DaysAgo = (Get-Date).AddDays(-90)
Get-LocalUser | Where-Object { 
    $_.Enabled -eq $true -and 
    $_.LastLogon -lt $90DaysAgo -and 
    $_.LastLogon -ne $null 
} | Select-Object Name, LastLogon
```

---

## Part 8: Service Accounts

### Create Service Account

```powershell
# Create service account with non-expiring password
$password = ConvertTo-SecureString "Str0ngServiceP@ss!" -AsPlainText -Force
New-LocalUser -Name "svc-backup" -Password $password -FullName "Backup Service Account" -Description "Service account for backup software" -PasswordNeverExpires -UserMayNotChangePassword

# Add to appropriate groups
Add-LocalGroupMember -Group "Backup Operators" -Member "svc-backup"
```

### Configure Service to Use Account

```powershell
# Change service logon account
$service = Get-WmiObject Win32_Service -Filter "Name='MyService'"
$service.Change($null, $null, $null, $null, $null, $null, ".\svc-backup", "Str0ngServiceP@ss!")

# Restart service
Restart-Service MyService
```

---

## Quick Reference Commands

```powershell
# User Management
Get-LocalUser                                    # List users
New-LocalUser -Name "user" -Password $pw        # Create user
Set-LocalUser -Name "user" -Property value      # Modify user
Remove-LocalUser -Name "user"                    # Delete user
Enable-LocalUser -Name "user"                    # Enable user
Disable-LocalUser -Name "user"                   # Disable user

# Group Management
Get-LocalGroup                                   # List groups
New-LocalGroup -Name "group"                     # Create group
Get-LocalGroupMember -Group "group"              # List members
Add-LocalGroupMember -Group "group" -Member "user"    # Add member
Remove-LocalGroupMember -Group "group" -Member "user" # Remove member
Remove-LocalGroup -Name "group"                  # Delete group

# Password Management
Set-LocalUser -Name "user" -Password $pw         # Reset password
Set-LocalUser -Name "user" -PasswordExpired $true # Force password change
```

## Best Practices for Workgroup User Management

1. **Document all accounts** - Keep a spreadsheet of all user accounts on each machine
2. **Use strong passwords** - Enforce complexity and length requirements
3. **Regular audits** - Review user accounts monthly
4. **Disable, don't delete** - Disable accounts before deletion for audit trail
5. **Service accounts** - Use dedicated accounts for services, not user accounts
6. **Limit administrators** - Only grant admin rights when absolutely necessary
7. **Consistent naming** - Use the same usernames across all machines
8. **Password sync** - If using matching accounts, keep passwords synchronized
