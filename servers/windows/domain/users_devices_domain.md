# Managing Users, Groups, and Computers in Active Directory

This guide covers the day-to-day management of users, groups, and computer accounts in your Windows Server 2025 Active Directory environment.

## Active Directory Management Tools

You have several options for managing AD:

- **Active Directory Users and Computers (ADUC)** — GUI tool, most common
- **Active Directory Administrative Center (ADAC)** — Modern GUI with PowerShell history
- **PowerShell** — Scripting and automation
- **Windows Admin Center** — Web-based management

### Open Management Tools

```powershell
# Open AD Users and Computers
dsa.msc

# Open AD Administrative Center
dsac.exe

# Import AD PowerShell module (usually auto-loads)
Import-Module ActiveDirectory
```

## Part 1: Managing Users

### Create a New User (GUI)

1. Open **Active Directory Users and Computers**
2. Navigate to the target OU (e.g., Company > Users > IT)
3. Right-click > **New** > **User**
4. Fill in:
   - First name, Last name
   - User logon name (username)
5. Click **Next**
6. Set password and options:
   - User must change password at next logon (recommended)
   - Password never expires (service accounts only)
7. Click **Next** > **Finish**

### Create a New User (PowerShell)

```powershell
# Create a basic user
New-ADUser `
    -Name "John Smith" `
    -GivenName "John" `
    -Surname "Smith" `
    -SamAccountName "jsmith" `
    -UserPrincipalName "jsmith@contoso.local" `
    -Path "OU=IT,OU=Users,OU=Company,DC=contoso,DC=local" `
    -AccountPassword (ConvertTo-SecureString "TempP@ssw0rd!" -AsPlainText -Force) `
    -ChangePasswordAtLogon $true `
    -Enabled $true

# Create user with more details
New-ADUser `
    -Name "Jane Doe" `
    -GivenName "Jane" `
    -Surname "Doe" `
    -SamAccountName "jdoe" `
    -UserPrincipalName "jdoe@contoso.local" `
    -EmailAddress "jdoe@contoso.com" `
    -Title "Sales Manager" `
    -Department "Sales" `
    -Company "Contoso Ltd" `
    -Office "Building A" `
    -OfficePhone "555-1234" `
    -Path "OU=Sales,OU=Users,OU=Company,DC=contoso,DC=local" `
    -AccountPassword (ConvertTo-SecureString "TempP@ssw0rd!" -AsPlainText -Force) `
    -ChangePasswordAtLogon $true `
    -Enabled $true
```

### Bulk User Creation from CSV

Create a CSV file (`users.csv`):
```csv
FirstName,LastName,Username,Department,Title,Password
John,Smith,jsmith,IT,System Admin,TempP@ss1!
Jane,Doe,jdoe,Sales,Sales Rep,TempP@ss2!
Bob,Johnson,bjohnson,Accounting,Accountant,TempP@ss3!
```

Import users:
```powershell
# Import users from CSV
Import-Csv "C:\users.csv" | ForEach-Object {
    $password = ConvertTo-SecureString $_.Password -AsPlainText -Force
    
    New-ADUser `
        -Name "$($_.FirstName) $($_.LastName)" `
        -GivenName $_.FirstName `
        -Surname $_.LastName `
        -SamAccountName $_.Username `
        -UserPrincipalName "$($_.Username)@contoso.local" `
        -Department $_.Department `
        -Title $_.Title `
        -Path "OU=$($_.Department),OU=Users,OU=Company,DC=contoso,DC=local" `
        -AccountPassword $password `
        -ChangePasswordAtLogon $true `
        -Enabled $true
    
    Write-Host "Created user: $($_.Username)"
}
```

### Modify User Accounts

```powershell
# Change user properties
Set-ADUser -Identity "jsmith" `
    -Title "Senior System Admin" `
    -Department "IT" `
    -OfficePhone "555-9999"

# Reset password
Set-ADAccountPassword -Identity "jsmith" `
    -Reset `
    -NewPassword (ConvertTo-SecureString "NewTempP@ss!" -AsPlainText -Force)

# Force password change at next logon
Set-ADUser -Identity "jsmith" -ChangePasswordAtLogon $true

# Unlock account
Unlock-ADAccount -Identity "jsmith"

# Disable account
Disable-ADAccount -Identity "jsmith"

# Enable account
Enable-ADAccount -Identity "jsmith"

# Move user to different OU
Move-ADObject -Identity "CN=John Smith,OU=IT,OU=Users,OU=Company,DC=contoso,DC=local" `
    -TargetPath "OU=Sales,OU=Users,OU=Company,DC=contoso,DC=local"
```

### Find and Query Users

```powershell
# Get specific user
Get-ADUser -Identity "jsmith" -Properties *

# Find user by name
Get-ADUser -Filter "Name -like '*Smith*'"

# Find users in specific OU
Get-ADUser -Filter * -SearchBase "OU=IT,OU=Users,OU=Company,DC=contoso,DC=local"

# Find disabled users
Get-ADUser -Filter {Enabled -eq $false}

# Find users who haven't logged in for 90 days
$90DaysAgo = (Get-Date).AddDays(-90)
Get-ADUser -Filter {LastLogonDate -lt $90DaysAgo} -Properties LastLogonDate |
    Select-Object Name, LastLogonDate

# Find locked out users
Search-ADAccount -LockedOut

# Find users with password expired
Search-ADAccount -PasswordExpired

# Export user list to CSV
Get-ADUser -Filter * -Properties Department, Title, EmailAddress |
    Select-Object Name, SamAccountName, Department, Title, EmailAddress |
    Export-Csv "C:\ADUsers.csv" -NoTypeInformation
```

### Delete Users

```powershell
# Delete user (moves to AD Recycle Bin if enabled)
Remove-ADUser -Identity "jsmith" -Confirm:$false

# Find and delete disabled users (be careful!)
# Get-ADUser -Filter {Enabled -eq $false} | Remove-ADUser -Confirm:$false
```

## Part 2: Managing Groups

Groups are used to assign permissions and policies efficiently.

### Group Types

- **Security Groups**: Used for permissions (most common)
- **Distribution Groups**: Used for email lists (Exchange)

### Group Scopes

- **Domain Local**: Permissions within a single domain
- **Global**: Members from same domain, can be used across forest
- **Universal**: Members from any domain, can be used across forest

For most small businesses, **Global Security Groups** are the standard choice.

### Create Groups

```powershell
# Create a security group
New-ADGroup `
    -Name "IT-Admins" `
    -GroupScope Global `
    -GroupCategory Security `
    -Path "OU=Groups,OU=Company,DC=contoso,DC=local" `
    -Description "IT Department Administrators"

# Create department groups
$departments = @("IT", "Sales", "Accounting", "Management")
foreach ($dept in $departments) {
    New-ADGroup `
        -Name "GRP-$dept" `
        -GroupScope Global `
        -GroupCategory Security `
        -Path "OU=Groups,OU=Company,DC=contoso,DC=local" `
        -Description "$dept Department Members"
}

# Create resource access groups
New-ADGroup -Name "FileShare-Finance-Read" -GroupScope DomainLocal -GroupCategory Security -Path "OU=Groups,OU=Company,DC=contoso,DC=local"
New-ADGroup -Name "FileShare-Finance-Write" -GroupScope DomainLocal -GroupCategory Security -Path "OU=Groups,OU=Company,DC=contoso,DC=local"
```

### Manage Group Membership

```powershell
# Add user to group
Add-ADGroupMember -Identity "IT-Admins" -Members "jsmith"

# Add multiple users to group
Add-ADGroupMember -Identity "GRP-Sales" -Members "jdoe", "bjohnson", "mwilson"

# Remove user from group
Remove-ADGroupMember -Identity "IT-Admins" -Members "jsmith" -Confirm:$false

# Get group members
Get-ADGroupMember -Identity "IT-Admins"

# Get all groups a user belongs to
Get-ADUser -Identity "jsmith" -Properties MemberOf | Select-Object -ExpandProperty MemberOf

# Get nested group members (recursive)
Get-ADGroupMember -Identity "IT-Admins" -Recursive

# Add group to another group (nesting)
Add-ADGroupMember -Identity "Domain Admins" -Members "IT-Admins"
```

### Common Built-in Groups

Important built-in groups to know:

| Group | Purpose |
|-------|---------|
| Domain Admins | Full admin access to all domain resources |
| Domain Users | All domain user accounts |
| Domain Computers | All domain-joined computers |
| Enterprise Admins | Admin access across entire forest |
| Administrators | Local admin on domain controllers |
| Server Operators | Limited DC management |
| Backup Operators | Backup and restore permissions |
| Remote Desktop Users | RDP access to servers |

## Part 3: Managing Computers

### Pre-stage Computer Accounts

Create computer accounts before joining:

```powershell
# Create computer account
New-ADComputer `
    -Name "WKS-RECEPTION" `
    -Path "OU=Computers,OU=Company,DC=contoso,DC=local" `
    -Description "Reception desk workstation"

# Create multiple computer accounts
1..10 | ForEach-Object {
    New-ADComputer `
        -Name "WKS-$_" `
        -Path "OU=Computers,OU=Company,DC=contoso,DC=local"
}
```

### Join Computer to Domain

On the workstation (requires local admin):

**GUI Method:**
1. Right-click **This PC** > **Properties**
2. Click **Rename this PC (advanced)**
3. Click **Change**
4. Select **Domain** and enter: `contoso.local`
5. Enter domain admin credentials
6. Restart

**PowerShell Method:**
```powershell
# Join domain (run on workstation as local admin)
Add-Computer `
    -DomainName "contoso.local" `
    -OUPath "OU=Computers,OU=Company,DC=contoso,DC=local" `
    -Credential (Get-Credential) `
    -Restart
```

### Manage Computer Accounts

```powershell
# Find all computers
Get-ADComputer -Filter *

# Find computers by name
Get-ADComputer -Filter "Name -like 'WKS*'"

# Get computer details
Get-ADComputer -Identity "WKS-RECEPTION" -Properties *

# Find computers that haven't logged in for 90 days
$90DaysAgo = (Get-Date).AddDays(-90)
Get-ADComputer -Filter {LastLogonDate -lt $90DaysAgo} -Properties LastLogonDate |
    Select-Object Name, LastLogonDate

# Move computer to different OU
Move-ADObject -Identity "CN=WKS-RECEPTION,OU=Computers,OU=Company,DC=contoso,DC=local" `
    -TargetPath "OU=Reception,OU=Computers,OU=Company,DC=contoso,DC=local"

# Disable computer account
Disable-ADAccount -Identity "WKS-OLD$"

# Delete computer account
Remove-ADComputer -Identity "WKS-OLD" -Confirm:$false

# Reset computer account (fixes trust relationship issues)
Reset-ComputerMachinePassword -Credential (Get-Credential)
```

### Fix "Trust Relationship Failed"

When a computer loses domain trust:

**Option 1: On the affected computer (if you can log in locally)**
```powershell
# Reset machine password
Reset-ComputerMachinePassword -Server "DC01" -Credential (Get-Credential CONTOSO\Administrator)
```

**Option 2: From the domain controller**
```powershell
# Reset computer account on DC
Reset-ADComputerMachineAccount -Identity "WKS-PROBLEM"

# Then restart the affected computer
```

**Option 3: Rejoin domain**
```powershell
# On the workstation - remove from domain
Remove-Computer -UnjoinDomainCredential (Get-Credential CONTOSO\Administrator) -Restart

# After restart - rejoin
Add-Computer -DomainName "contoso.local" -Credential (Get-Credential) -Restart
```

## Part 4: Organizational Units (OUs)

### Create OU Structure

```powershell
# Create hierarchical OU structure
$baseOU = "DC=contoso,DC=local"

# Top level
New-ADOrganizationalUnit -Name "Company" -Path $baseOU -ProtectedFromAccidentalDeletion $true

$companyOU = "OU=Company,$baseOU"

# Second level
New-ADOrganizationalUnit -Name "Users" -Path $companyOU
New-ADOrganizationalUnit -Name "Computers" -Path $companyOU
New-ADOrganizationalUnit -Name "Servers" -Path $companyOU
New-ADOrganizationalUnit -Name "Groups" -Path $companyOU
New-ADOrganizationalUnit -Name "Service Accounts" -Path $companyOU

# Department OUs under Users
$departments = @("IT", "Sales", "Accounting", "HR", "Management")
foreach ($dept in $departments) {
    New-ADOrganizationalUnit -Name $dept -Path "OU=Users,$companyOU"
}

# Location OUs under Computers
$locations = @("Headquarters", "Branch1", "Remote")
foreach ($loc in $locations) {
    New-ADOrganizationalUnit -Name $loc -Path "OU=Computers,$companyOU"
}
```

### Manage OUs

```powershell
# List all OUs
Get-ADOrganizationalUnit -Filter *

# Get OU details
Get-ADOrganizationalUnit -Identity "OU=IT,OU=Users,OU=Company,DC=contoso,DC=local"

# Rename OU
Rename-ADObject -Identity "OU=IT,OU=Users,OU=Company,DC=contoso,DC=local" -NewName "Information Technology"

# Delete OU (must remove protection first)
Set-ADOrganizationalUnit -Identity "OU=OldOU,DC=contoso,DC=local" -ProtectedFromAccidentalDeletion $false
Remove-ADOrganizationalUnit -Identity "OU=OldOU,DC=contoso,DC=local" -Confirm:$false
```

## Part 5: Password Policies

### Default Domain Policy

View and modify the default password policy:

```powershell
# View current policy
Get-ADDefaultDomainPasswordPolicy

# Modify default policy
Set-ADDefaultDomainPasswordPolicy -Identity "contoso.local" `
    -MinPasswordLength 12 `
    -PasswordHistoryCount 24 `
    -MaxPasswordAge 90.00:00:00 `
    -MinPasswordAge 1.00:00:00 `
    -ComplexityEnabled $true `
    -LockoutThreshold 5 `
    -LockoutDuration 00:30:00 `
    -LockoutObservationWindow 00:30:00
```

### Fine-Grained Password Policies

For different password requirements per group (requires Server 2008+ functional level):

```powershell
# Create stricter policy for admins
New-ADFineGrainedPasswordPolicy `
    -Name "AdminPasswordPolicy" `
    -Precedence 10 `
    -MinPasswordLength 16 `
    -PasswordHistoryCount 30 `
    -MaxPasswordAge 60.00:00:00 `
    -MinPasswordAge 1.00:00:00 `
    -ComplexityEnabled $true `
    -LockoutThreshold 3 `
    -LockoutDuration 01:00:00 `
    -ReversibleEncryptionEnabled $false

# Apply to IT-Admins group
Add-ADFineGrainedPasswordPolicySubject -Identity "AdminPasswordPolicy" -Subjects "IT-Admins"

# View fine-grained policies
Get-ADFineGrainedPasswordPolicy -Filter *

# Check which policy applies to a user
Get-ADUserResultantPasswordPolicy -Identity "jsmith"
```

## Part 6: Useful Reports and Queries

```powershell
# === User Reports ===

# All users with details
Get-ADUser -Filter * -Properties * | 
    Select-Object Name, SamAccountName, Department, Title, Enabled, LastLogonDate |
    Export-Csv "C:\Reports\AllUsers.csv" -NoTypeInformation

# Users created in last 30 days
$30DaysAgo = (Get-Date).AddDays(-30)
Get-ADUser -Filter {Created -gt $30DaysAgo} -Properties Created |
    Select-Object Name, Created

# Users with passwords expiring in 7 days
$users = Get-ADUser -Filter {Enabled -eq $true -and PasswordNeverExpires -eq $false} -Properties PasswordLastSet, msDS-UserPasswordExpiryTimeComputed
$users | Where-Object { 
    $expiry = [datetime]::FromFileTime($_.'msDS-UserPasswordExpiryTimeComputed')
    $expiry -lt (Get-Date).AddDays(7) -and $expiry -gt (Get-Date)
} | Select-Object Name, @{N='ExpiryDate';E={[datetime]::FromFileTime($_.'msDS-UserPasswordExpiryTimeComputed')}}

# === Computer Reports ===

# All computers with OS info
Get-ADComputer -Filter * -Properties OperatingSystem, LastLogonDate |
    Select-Object Name, OperatingSystem, LastLogonDate |
    Export-Csv "C:\Reports\AllComputers.csv" -NoTypeInformation

# Stale computer accounts (90+ days)
Get-ADComputer -Filter {LastLogonDate -lt $90DaysAgo} -Properties LastLogonDate |
    Select-Object Name, LastLogonDate

# === Group Reports ===

# Empty groups
Get-ADGroup -Filter * | Where-Object {
    @(Get-ADGroupMember -Identity $_.DistinguishedName).Count -eq 0
} | Select-Object Name

# Groups with member counts
Get-ADGroup -Filter * | ForEach-Object {
    [PSCustomObject]@{
        GroupName = $_.Name
        MemberCount = @(Get-ADGroupMember -Identity $_.DistinguishedName).Count
    }
} | Sort-Object MemberCount -Descending
```

## Quick Reference

### Common PowerShell Commands

| Task | Command |
|------|---------|
| Create user | `New-ADUser -Name "Name" -SamAccountName "user" ...` |
| Delete user | `Remove-ADUser -Identity "user"` |
| Reset password | `Set-ADAccountPassword -Identity "user" -Reset -NewPassword (ConvertTo-SecureString "pass" -AsPlainText -Force)` |
| Unlock user | `Unlock-ADAccount -Identity "user"` |
| Disable user | `Disable-ADAccount -Identity "user"` |
| Find user | `Get-ADUser -Filter "Name -like '*Smith*'"` |
| Create group | `New-ADGroup -Name "Group" -GroupScope Global` |
| Add to group | `Add-ADGroupMember -Identity "Group" -Members "user"` |
| Join computer | `Add-Computer -DomainName "domain" -Credential (Get-Credential)` |
| Reset computer | `Reset-ComputerMachinePassword` |

### Naming Conventions (Recommended)

| Object | Convention | Example |
|--------|------------|---------|
| Users | first initial + lastname | jsmith |
| Computers | TYPE-LOCATION-### | WKS-HQ-001 |
| Servers | SRV-ROLE-## | SRV-DC-01 |
| Groups | GRP-Purpose or Dept | GRP-Sales, FileShare-HR-Read |
| Service Accounts | SVC-ApplicationName | SVC-Backup |
| OUs | Descriptive name | Headquarters, IT Department |
