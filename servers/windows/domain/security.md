# Basic Security Hardening for Windows Server 2025 Active Directory

This guide covers essential security configurations for a new Active Directory environment. These are practical, foundational security measures suitable for small to medium business deployments.

## Security Philosophy

Security is about layers. No single measure is sufficient. This guide focuses on:

1. **Principle of Least Privilege** - Users get minimum permissions needed
2. **Defense in Depth** - Multiple security layers
3. **Monitoring and Auditing** - Know what's happening
4. **Secure Defaults** - Start locked down, open as needed

## Part 1: Account Security

### Rename and Disable Default Accounts

```powershell
# Rename built-in Administrator account
Rename-LocalUser -Name "Administrator" -NewName "SrvAdmin"

# Or via GPO (recommended):
# Computer Config > Windows Settings > Security Settings > Local Policies > Security Options
# Accounts: Rename administrator account

# Disable Guest account (usually disabled by default)
Disable-LocalUser -Name "Guest"

# On domain controller - rename domain Administrator
# Best done via GPO as above
```

### Create Separate Admin Accounts

Never use Domain Admin for daily tasks:

```powershell
# Create tiered admin accounts
# Tier 0 - Domain Controllers (most privileged)
New-ADUser -Name "AdminT0-JSmith" -SamAccountName "admint0-jsmith" -UserPrincipalName "admint0-jsmith@contoso.local" -Path "OU=Tier0,OU=Admin Accounts,DC=contoso,DC=local" -Enabled $true -AccountPassword (ConvertTo-SecureString "ComplexP@ss1!" -AsPlainText -Force)
Add-ADGroupMember -Identity "Domain Admins" -Members "admint0-jsmith"

# Tier 1 - Servers
New-ADUser -Name "AdminT1-JSmith" -SamAccountName "admint1-jsmith" -UserPrincipalName "admint1-jsmith@contoso.local" -Path "OU=Tier1,OU=Admin Accounts,DC=contoso,DC=local" -Enabled $true -AccountPassword (ConvertTo-SecureString "ComplexP@ss2!" -AsPlainText -Force)

# Tier 2 - Workstations
New-ADUser -Name "AdminT2-JSmith" -SamAccountName "admint2-jsmith" -UserPrincipalName "admint2-jsmith@contoso.local" -Path "OU=Tier2,OU=Admin Accounts,DC=contoso,DC=local" -Enabled $true -AccountPassword (ConvertTo-SecureString "ComplexP@ss3!" -AsPlainText -Force)

# Standard daily user account (no admin rights)
New-ADUser -Name "John Smith" -SamAccountName "jsmith" -UserPrincipalName "jsmith@contoso.local" -Path "OU=Users,OU=Company,DC=contoso,DC=local" -Enabled $true -AccountPassword (ConvertTo-SecureString "UserP@ss1!" -AsPlainText -Force) -ChangePasswordAtLogon $true
```

### Service Account Security

Don't use user accounts for services:

```powershell
# Create Group Managed Service Account (gMSA) - preferred
# First, create KDS root key (one-time, requires 10 hours to replicate)
Add-KdsRootKey -EffectiveImmediately  # Lab only
# Production: Add-KdsRootKey -EffectiveTime ((Get-Date).AddHours(-10))

# Create gMSA
New-ADServiceAccount -Name "gMSA-SQL" -DNSHostName "gmsa-sql.contoso.local" -PrincipalsAllowedToRetrieveManagedPassword "SQL-Servers" -Path "OU=Service Accounts,OU=Company,DC=contoso,DC=local"

# Install on target server
Install-ADServiceAccount -Identity "gMSA-SQL"

# Test the account
Test-ADServiceAccount -Identity "gMSA-SQL"

# For legacy applications - create standard service account with strong password
New-ADUser -Name "SVC-Backup" -SamAccountName "svc-backup" -UserPrincipalName "svc-backup@contoso.local" -Path "OU=Service Accounts,OU=Company,DC=contoso,DC=local" -Enabled $true -PasswordNeverExpires $true -CannotChangePassword $true -AccountPassword (ConvertTo-SecureString "VeryComplexServiceP@ss123!" -AsPlainText -Force)
```

### Password Policies

Set strong password requirements:

```powershell
# View current policy
Get-ADDefaultDomainPasswordPolicy

# Set stronger policy
Set-ADDefaultDomainPasswordPolicy -Identity "contoso.local" `
    -MinPasswordLength 14 `
    -PasswordHistoryCount 24 `
    -MaxPasswordAge 90.00:00:00 `
    -MinPasswordAge 1.00:00:00 `
    -ComplexityEnabled $true `
    -LockoutThreshold 5 `
    -LockoutDuration 00:30:00 `
    -LockoutObservationWindow 00:30:00 `
    -ReversibleEncryptionEnabled $false

# Create Fine-Grained Password Policy for admins
New-ADFineGrainedPasswordPolicy -Name "Admin-PasswordPolicy" `
    -Precedence 10 `
    -MinPasswordLength 20 `
    -PasswordHistoryCount 30 `
    -MaxPasswordAge 60.00:00:00 `
    -MinPasswordAge 1.00:00:00 `
    -ComplexityEnabled $true `
    -LockoutThreshold 3 `
    -LockoutDuration 01:00:00 `
    -LockoutObservationWindow 01:00:00

# Apply to Domain Admins group
Add-ADFineGrainedPasswordPolicySubject -Identity "Admin-PasswordPolicy" -Subjects "Domain Admins"
```

## Part 2: Group Policy Security Settings

### Create Security Baseline GPO

```powershell
# Create new GPO
New-GPO -Name "Security - Baseline" -Comment "Security baseline settings"
New-GPLink -Name "Security - Baseline" -Target "DC=contoso,DC=local"
```

### Key Security Settings

Apply these via Group Policy:

**Computer Configuration > Policies > Windows Settings > Security Settings**

#### Account Policies > Password Policy
| Setting | Value |
|---------|-------|
| Minimum password length | 14 characters |
| Password must meet complexity | Enabled |
| Maximum password age | 90 days |
| Minimum password age | 1 day |
| Enforce password history | 24 passwords |

#### Account Policies > Account Lockout
| Setting | Value |
|---------|-------|
| Account lockout threshold | 5 attempts |
| Account lockout duration | 30 minutes |
| Reset lockout counter | 30 minutes |

#### Local Policies > Security Options
| Setting | Value |
|---------|-------|
| Accounts: Rename administrator account | Custom name |
| Accounts: Rename guest account | Custom name |
| Interactive logon: Don't display last signed-in | Enabled |
| Network access: Do not allow anonymous enumeration of SAM accounts | Enabled |
| Network security: LAN Manager authentication level | Send NTLMv2 response only. Refuse LM & NTLM |
| Network security: Minimum session security for NTLM | Require NTLMv2 session security, Require 128-bit encryption |

#### Local Policies > Audit Policy (Basic) or Advanced Audit Policy Configuration
| Category | Setting |
|----------|---------|
| Account Logon > Credential Validation | Success, Failure |
| Account Management > User Account Management | Success |
| Logon/Logoff > Logon | Success, Failure |
| Logon/Logoff > Logoff | Success |
| Object Access > File System | Success, Failure (on sensitive shares) |
| Policy Change > Audit Policy Change | Success |
| Privilege Use > Sensitive Privilege Use | Failure |
| System > Security State Change | Success |

### Restrict Administrative Access

**Computer Configuration > Policies > Windows Settings > Security Settings > User Rights Assignment**

| Setting | Recommended Groups |
|---------|-------------------|
| Access this computer from the network | Administrators, Authenticated Users |
| Allow log on locally | Administrators |
| Allow log on through RDP | Administrators, Remote Desktop Users |
| Deny access to this computer from the network | Guests, Local account (on DCs) |
| Deny log on locally | Guests |

### Disable SMBv1 (Legacy Protocol)

```powershell
# Disable SMBv1 (security risk)
Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force

# Via GPO:
# Computer Config > Admin Templates > MS Defender Antivirus > Network Inspection System
# Or registry:
# HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters
# SMB1 = 0
```

### Windows Firewall

Ensure firewall is enabled via GPO:

**Computer Configuration > Policies > Windows Settings > Security Settings > Windows Defender Firewall with Advanced Security**

- Domain Profile: On
- Private Profile: On
- Public Profile: On

## Part 3: Local Administrator Password Solution (LAPS)

LAPS automatically manages local admin passwords on domain-joined computers.

### Install LAPS (Legacy)

```powershell
# Download LAPS from Microsoft and install on management workstation
# Extend AD schema (run once, from DC)
Import-Module AdmPwd.PS
Update-AdmPwdADSchema

# Grant computers permission to update their password
Set-AdmPwdComputerSelfPermission -Identity "OU=Computers,OU=Company,DC=contoso,DC=local"

# Grant IT admins permission to read passwords
Set-AdmPwdReadPasswordPermission -Identity "OU=Computers,OU=Company,DC=contoso,DC=local" -AllowedPrincipals "CONTOSO\IT-Admins"

# Grant IT admins permission to reset passwords
Set-AdmPwdResetPasswordPermission -Identity "OU=Computers,OU=Company,DC=contoso,DC=local" -AllowedPrincipals "CONTOSO\IT-Admins"
```

### Deploy LAPS via GPO

1. Copy LAPS MSI to network share
2. Create GPO for software deployment
3. Deploy `LAPS.x64.msi` to all workstations
4. Configure LAPS settings:

**Computer Configuration > Policies > Administrative Templates > LAPS**
- Enable local admin password management: Enabled
- Password Settings: Complexity, length, age
- Name of administrator account to manage: (leave blank for built-in, or specify custom name)

### Windows LAPS (Built-in to Server 2025)

Server 2025 includes Windows LAPS natively:

```powershell
# Update AD schema for Windows LAPS
Update-LapsADSchema

# Grant self-permission
Set-LapsADComputerSelfPermission -Identity "OU=Computers,OU=Company,DC=contoso,DC=local"

# Grant read permission
Set-LapsADReadPasswordPermission -Identity "OU=Computers,OU=Company,DC=contoso,DC=local" -AllowedPrincipals "CONTOSO\IT-Admins"

# Get computer password
Get-LapsADPassword -Identity "WKS-001" -AsPlainText
```

Configure via GPO:
**Computer Configuration > Policies > Administrative Templates > System > LAPS**

## Part 4: Protected Users Group

Add sensitive accounts to Protected Users group for enhanced security:

```powershell
# Add admin to Protected Users (prevents credential caching, enforces Kerberos)
Add-ADGroupMember -Identity "Protected Users" -Members "admint0-jsmith"

# Note: Protected Users cannot use NTLM, cached credentials, or DES/RC4
# Test thoroughly before adding accounts
```

## Part 5: Secure Domain Controllers

### DC-Specific Hardening

```powershell
# Block internet access from DCs (via firewall rule or network ACL)
# DCs should not browse the internet

# Disable unnecessary services
Set-Service -Name "Spooler" -StartupType Disabled  # Print spooler (CVE risk)
Stop-Service -Name "Spooler"

# Remove unnecessary roles
# DCs should only run AD DS, DNS, and optionally DHCP
```

### Restrict DC Logon

Via GPO linked to Domain Controllers OU:

**Computer Configuration > Policies > Windows Settings > Security Settings > Local Policies > User Rights Assignment**

| Setting | Recommended |
|---------|-------------|
| Allow log on locally | Domain Admins, Enterprise Admins |
| Allow log on through RDP | Domain Admins |
| Deny log on locally | Guests, all non-admin accounts |

### Protect AdminSDHolder

Critical AD accounts are protected by AdminSDHolder. Monitor for changes:

```powershell
# View AdminSDHolder permissions
Get-Acl "AD:CN=AdminSDHolder,CN=System,DC=contoso,DC=local" | Format-List

# Monitor for changes (set up alerting)
```

## Part 6: Auditing and Monitoring

### Enable Critical Event Logging

Key events to monitor:

| Event ID | Description | Action |
|----------|-------------|--------|
| 4624 | Successful logon | Monitor admin logons |
| 4625 | Failed logon | Alert on multiple failures |
| 4648 | Explicit credential logon | Monitor for pass-the-hash |
| 4720 | User account created | Alert |
| 4722 | User account enabled | Alert |
| 4723 | Password change attempt | Monitor |
| 4724 | Password reset attempt | Alert on admin resets |
| 4728 | Member added to security group | Alert for privileged groups |
| 4732 | Member added to local group | Monitor |
| 4740 | Account locked out | Investigate |
| 4756 | Member added to universal group | Alert |
| 4768 | Kerberos TGT requested | Monitor |
| 4769 | Kerberos service ticket requested | Monitor |
| 4776 | NTLM authentication | Should be decreasing |

### Create Audit Policy GPO

```powershell
# View current audit settings
auditpol /get /category:*

# Export current settings
auditpol /backup /file:C:\AuditPolicy-Backup.csv

# Configure via GPO - Computer Configuration > Policies > Windows Settings > Security Settings > Advanced Audit Policy Configuration

# Or via PowerShell
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
auditpol /set /subcategory:"Credential Validation" /success:enable /failure:enable
auditpol /set /subcategory:"User Account Management" /success:enable
auditpol /set /subcategory:"Security Group Management" /success:enable
auditpol /set /subcategory:"Audit Policy Change" /success:enable
```

### Basic Event Log Monitoring Script

```powershell
# Check for suspicious activity
$startTime = (Get-Date).AddHours(-24)

# Failed logons
$failedLogons = Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625; StartTime=$startTime} -ErrorAction SilentlyContinue
Write-Host "Failed logons in last 24h: $($failedLogons.Count)"

# Account lockouts
$lockouts = Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4740; StartTime=$startTime} -ErrorAction SilentlyContinue
Write-Host "Account lockouts in last 24h: $($lockouts.Count)"

# User created
$newUsers = Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4720; StartTime=$startTime} -ErrorAction SilentlyContinue
Write-Host "New users created in last 24h: $($newUsers.Count)"

# Group membership changes
$groupChanges = Get-WinEvent -FilterHashtable @{LogName='Security'; ID=@(4728,4732,4756); StartTime=$startTime} -ErrorAction SilentlyContinue
Write-Host "Group membership changes in last 24h: $($groupChanges.Count)"
```

## Part 7: Network Security

### Firewall Rules for DCs

Minimum ports required for AD:

| Port | Protocol | Service |
|------|----------|---------|
| 53 | TCP/UDP | DNS |
| 88 | TCP/UDP | Kerberos |
| 135 | TCP | RPC |
| 389 | TCP/UDP | LDAP |
| 445 | TCP | SMB |
| 464 | TCP/UDP | Kerberos password |
| 636 | TCP | LDAPS |
| 3268-3269 | TCP | Global Catalog |
| 49152-65535 | TCP | RPC dynamic |

### Require LDAP Signing and Channel Binding

```powershell
# Via GPO - Computer Configuration > Policies > Windows Settings > Security Settings > Local Policies > Security Options

# Domain controller: LDAP server signing requirements = Require signing
# Domain controller: LDAP server channel binding token requirements = Always

# Or via registry (on DCs)
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Services\NTDS\Parameters" -Name "LDAPServerIntegrity" -Value 2
```

### Consider IPsec for DC Traffic

For high-security environments, require IPsec between DCs and member servers.

## Part 8: Security Checklist

### Initial Setup
- [ ] Rename default Administrator account
- [ ] Create separate admin accounts (tiered)
- [ ] Enable AD Recycle Bin
- [ ] Set strong password policy
- [ ] Configure account lockout policy
- [ ] Deploy LAPS

### Ongoing Security
- [ ] Disable SMBv1
- [ ] Enable Windows Firewall on all systems
- [ ] Configure audit policies
- [ ] Monitor security event logs
- [ ] Review privileged group membership monthly
- [ ] Remove inactive accounts
- [ ] Patch systems regularly
- [ ] Backup AD regularly
- [ ] Test restores quarterly

### Administrative Practices
- [ ] Don't use Domain Admin for daily tasks
- [ ] Don't log into workstations with Domain Admin
- [ ] Use PAWs (Privileged Access Workstations) for admin tasks
- [ ] Document all administrative actions
- [ ] Review audit logs weekly

## Additional Resources

- Microsoft Security Baselines: https://www.microsoft.com/en-us/download/details.aspx?id=55319
- CIS Benchmarks: https://www.cisecurity.org/benchmark/microsoft_windows_server
- AD Security Best Practices: https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory
