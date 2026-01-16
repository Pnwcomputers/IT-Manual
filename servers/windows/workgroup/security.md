# Security Hardening for Workgroup Servers

This guide covers essential security configurations for Windows Server 2025 in a workgroup (non-domain) environment.

## Part 1: Account Security

### Rename Default Accounts

```powershell
# Rename Administrator account
Rename-LocalUser -Name "Administrator" -NewName "SrvAdmin"

# Rename Guest account (also disable it)
Rename-LocalUser -Name "Guest" -NewName "NoAccess"
Disable-LocalUser -Name "NoAccess"
```

### Create Separate Admin Account

Don't use the built-in Administrator for daily tasks:

```powershell
# Create dedicated admin account
$password = ConvertTo-SecureString "StrongAdminP@ss123!" -AsPlainText -Force
New-LocalUser -Name "ITAdmin" -Password $password -FullName "IT Administrator" -Description "Primary admin account"
Add-LocalGroupMember -Group "Administrators" -Member "ITAdmin"

# Disable built-in Administrator (optional, keep for emergencies)
# Disable-LocalUser -Name "SrvAdmin"
```

### Secure Service Accounts

```powershell
# Create service account with strong password and restrictions
$password = ConvertTo-SecureString "V3ryStr0ngServ!ceP@ss" -AsPlainText -Force
New-LocalUser -Name "svc-backup" -Password $password -Description "Backup service account" -PasswordNeverExpires -UserMayNotChangePassword

# Prevent interactive logon (via Local Security Policy)
# Or add to "Deny log on locally" user right
```

### Password Policy Configuration

Create and apply password policy:

```powershell
# Create security configuration file
$securityConfig = @"
[Unicode]
Unicode=yes
[System Access]
MinimumPasswordAge = 1
MaximumPasswordAge = 90
MinimumPasswordLength = 14
PasswordComplexity = 1
PasswordHistorySize = 12
ClearTextPassword = 0
LockoutBadCount = 5
ResetLockoutCount = 30
LockoutDuration = 30
RequireLogonToChangePassword = 1
ForceLogoffWhenHourExpire = 1
[Version]
signature="`$CHICAGO`$"
Revision=1
"@

$securityConfig | Out-File "C:\SecurityPolicy.inf" -Encoding Unicode
secedit /configure /db C:\Windows\Security\local.sdb /cfg C:\SecurityPolicy.inf /areas SECURITYPOLICY
Remove-Item "C:\SecurityPolicy.inf"

Write-Host "Password policy applied"
```

### Account Lockout

```powershell
# View current lockout settings
net accounts

# Configure via net accounts
net accounts /lockoutthreshold:5
net accounts /lockoutduration:30
net accounts /lockoutwindow:30
```

## Part 2: Firewall Configuration

### Enable and Configure Windows Firewall

```powershell
# Enable firewall on all profiles
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True

# Set default actions
Set-NetFirewallProfile -Profile Domain,Public,Private -DefaultInboundAction Block -DefaultOutboundAction Allow

# Log dropped packets
Set-NetFirewallProfile -Profile Domain,Public,Private -LogBlocked True -LogAllowed False -LogFileName "C:\Windows\System32\LogFiles\Firewall\pfirewall.log"
```

### Create Firewall Rules

```powershell
# Allow RDP from specific subnet only
New-NetFirewallRule -DisplayName "RDP - Internal Only" -Direction Inbound -Protocol TCP -LocalPort 3389 -RemoteAddress 192.168.1.0/24 -Action Allow

# Allow File Sharing from internal network only
New-NetFirewallRule -DisplayName "SMB - Internal Only" -Direction Inbound -Protocol TCP -LocalPort 445 -RemoteAddress 192.168.1.0/24 -Action Allow

# Allow ICMP (ping) from internal only
New-NetFirewallRule -DisplayName "ICMP - Internal Only" -Direction Inbound -Protocol ICMPv4 -RemoteAddress 192.168.1.0/24 -Action Allow

# Block SMB from internet
New-NetFirewallRule -DisplayName "Block SMB Internet" -Direction Inbound -Protocol TCP -LocalPort 445 -RemoteAddress Internet -Action Block

# View firewall rules
Get-NetFirewallRule -Enabled True | Format-Table Name, DisplayName, Direction, Action
```

### Disable Unnecessary Rules

```powershell
# Disable risky rules
Disable-NetFirewallRule -DisplayName "File and Printer Sharing (Echo Request - ICMPv4-In)"
Disable-NetFirewallRule -DisplayName "Network Discovery*"

# Review and disable unnecessary rules
Get-NetFirewallRule -Enabled True | Where-Object { $_.Direction -eq "Inbound" } | Format-Table DisplayName, Profile, Action
```

## Part 3: Remote Access Security

### Secure Remote Desktop

```powershell
# Enable Network Level Authentication (NLA)
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name "UserAuthentication" -Value 1

# Set encryption level to High
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name "MinEncryptionLevel" -Value 3

# Require secure RPC
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name "SecurityLayer" -Value 2

# Limit users who can RDP
# Only add specific users to "Remote Desktop Users" group
Get-LocalGroupMember -Group "Remote Desktop Users"
```

### Configure RDP Timeout

```powershell
# Set idle session limit (in milliseconds, 30 minutes = 1800000)
Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -Name "MaxIdleTime" -Value 1800000 -Type DWord

# Set disconnected session limit
Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -Name "MaxDisconnectionTime" -Value 3600000 -Type DWord
```

### Secure WinRM (PowerShell Remoting)

```powershell
# Enable WinRM
Enable-PSRemoting -Force

# Use HTTPS instead of HTTP (requires certificate)
$cert = New-SelfSignedCertificate -DnsName $env:COMPUTERNAME -CertStoreLocation Cert:\LocalMachine\My
New-WSManInstance -ResourceURI winrm/config/Listener -SelectorSet @{Address="*";Transport="HTTPS"} -ValueSet @{CertificateThumbprint=$cert.Thumbprint}

# Disable HTTP listener
Remove-WSManInstance -ResourceURI winrm/config/Listener -SelectorSet @{Address="*";Transport="HTTP"}

# Configure trusted hosts (for workgroup)
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "192.168.1.*" -Force
```

## Part 4: Audit Policy Configuration

### Enable Auditing

```powershell
# Enable basic audit policies
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
auditpol /set /subcategory:"Logoff" /success:enable
auditpol /set /subcategory:"Account Lockout" /success:enable /failure:enable
auditpol /set /subcategory:"Special Logon" /success:enable
auditpol /set /subcategory:"Other Logon/Logoff Events" /success:enable /failure:enable
auditpol /set /subcategory:"User Account Management" /success:enable /failure:enable
auditpol /set /subcategory:"Security Group Management" /success:enable
auditpol /set /subcategory:"Process Creation" /success:enable
auditpol /set /subcategory:"Audit Policy Change" /success:enable
auditpol /set /subcategory:"Authentication Policy Change" /success:enable
auditpol /set /subcategory:"System Integrity" /success:enable /failure:enable

# View current audit policy
auditpol /get /category:*
```

### Configure Event Log Size

```powershell
# Increase Security log size
wevtutil sl Security /ms:524288000  # 500MB

# Increase Application log
wevtutil sl Application /ms:268435456  # 256MB

# Increase System log
wevtutil sl System /ms:268435456  # 256MB

# Set retention to overwrite as needed
wevtutil sl Security /rt:false
```

### Monitor Important Events

Key Event IDs to monitor:

| Event ID | Description |
|----------|-------------|
| 4624 | Successful logon |
| 4625 | Failed logon |
| 4634 | Logoff |
| 4648 | Logon with explicit credentials |
| 4720 | User account created |
| 4722 | User account enabled |
| 4725 | User account disabled |
| 4726 | User account deleted |
| 4732 | Member added to local group |
| 4740 | Account locked out |
| 4756 | Member added to security group |

```powershell
# Query failed logon attempts
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625} -MaxEvents 50 | Format-Table TimeCreated, Message -Wrap

# Query account lockouts
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4740} -MaxEvents 20

# Query new user creation
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4720} -MaxEvents 20
```

## Part 5: Service Hardening

### Disable Unnecessary Services

```powershell
# Services to consider disabling (evaluate based on your needs)
$servicesToDisable = @(
    "XblAuthManager",        # Xbox Live Auth Manager
    "XblGameSave",           # Xbox Live Game Save
    "WMPNetworkSvc",         # Windows Media Player Network Sharing
    "icssvc",                # Windows Mobile Hotspot Service
    "WerSvc",                # Windows Error Reporting (optional)
    "DiagTrack",             # Connected User Experiences and Telemetry
    "RemoteRegistry"         # Remote Registry (security risk)
)

foreach ($service in $servicesToDisable) {
    $svc = Get-Service -Name $service -ErrorAction SilentlyContinue
    if ($svc) {
        Stop-Service -Name $service -Force -ErrorAction SilentlyContinue
        Set-Service -Name $service -StartupType Disabled
        Write-Host "Disabled: $service"
    }
}
```

### Secure Print Spooler (if not needed)

```powershell
# Disable Print Spooler (common attack vector)
Stop-Service -Name "Spooler" -Force
Set-Service -Name "Spooler" -StartupType Disabled
```

### Review Running Services

```powershell
# List all running services
Get-Service | Where-Object { $_.Status -eq "Running" } | Sort-Object DisplayName | Format-Table DisplayName, Name, StartType

# List non-Microsoft services
Get-WmiObject Win32_Service | Where-Object { $_.PathName -notlike "*Windows*" -and $_.PathName -notlike "*Microsoft*" } | Select-Object Name, DisplayName, StartMode, PathName
```

## Part 6: Additional Security Settings

### Disable SMBv1 (Critical)

```powershell
# Disable SMBv1 (outdated, vulnerable)
Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force

# Verify
Get-SmbServerConfiguration | Select-Object EnableSMB1Protocol, EnableSMB2Protocol
```

### Disable LLMNR and NetBIOS

```powershell
# Disable LLMNR via registry
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT" -Name "DNSClient" -Force
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" -Name "EnableMulticast" -Value 0 -Type DWord

# Disable NetBIOS over TCP/IP (per adapter)
$adapters = Get-WmiObject Win32_NetworkAdapterConfiguration | Where-Object { $_.IPEnabled -eq $true }
foreach ($adapter in $adapters) {
    $adapter.SetTcpipNetbios(2)  # 2 = Disable
}
```

### Configure UAC

```powershell
# Ensure UAC is enabled
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" -Name "EnableLUA" -Value 1

# Configure UAC to always prompt for elevation
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" -Name "ConsentPromptBehaviorAdmin" -Value 2
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" -Name "PromptOnSecureDesktop" -Value 1
```

### Restrict Anonymous Access

```powershell
# Restrict anonymous enumeration of SAM accounts
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "RestrictAnonymousSAM" -Value 1

# Restrict anonymous enumeration of shares
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "RestrictAnonymous" -Value 1

# Don't allow anonymous SID/Name translation
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "TurnOffAnonymousBlock" -Value 1
```

### Configure Session Security

```powershell
# Require NTLMv2 (disable LM and NTLMv1)
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "LmCompatibilityLevel" -Value 5

# Note: Value 5 = Send NTLMv2 response only, refuse LM & NTLM
```

## Part 7: Windows Defender Configuration

### Verify Defender is Active

```powershell
# Check Defender status
Get-MpComputerStatus | Select-Object AntivirusEnabled, AntispywareEnabled, RealTimeProtectionEnabled, IoavProtectionEnabled

# Check last scan
Get-MpComputerStatus | Select-Object FullScanAge, QuickScanAge
```

### Configure Defender

```powershell
# Enable real-time protection
Set-MpPreference -DisableRealtimeMonitoring $false

# Enable cloud-delivered protection
Set-MpPreference -MAPSReporting Advanced
Set-MpPreference -SubmitSamplesConsent SendAllSamples

# Enable PUA (Potentially Unwanted Application) detection
Set-MpPreference -PUAProtection Enabled

# Configure scheduled scan
Set-MpPreference -ScanScheduleDay 0  # 0 = Daily
Set-MpPreference -ScanScheduleTime 02:00:00

# Add exclusions if needed (be careful)
Add-MpPreference -ExclusionPath "D:\Shares"
Add-MpPreference -ExclusionProcess "backup.exe"

# Run full scan
Start-MpScan -ScanType FullScan
```

### Update Definitions

```powershell
# Update signatures
Update-MpSignature

# Schedule automatic updates (usually automatic)
```

## Part 8: Security Monitoring Script

Create a daily security report:

```powershell
# Save as C:\Scripts\Security-Report.ps1
$reportDate = Get-Date -Format "yyyy-MM-dd"
$reportPath = "C:\Reports\Security-$reportDate.txt"

$report = @"
===================================
SECURITY REPORT - $reportDate
===================================

--- FAILED LOGON ATTEMPTS (Last 24 Hours) ---
"@

$yesterday = (Get-Date).AddDays(-1)
$failedLogons = Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625; StartTime=$yesterday} -ErrorAction SilentlyContinue
$report += "`nTotal Failed Logons: $($failedLogons.Count)`n"

if ($failedLogons.Count -gt 0) {
    $failedLogons | Select-Object TimeCreated, @{N='User';E={$_.Properties[5].Value}}, @{N='Source';E={$_.Properties[19].Value}} | ForEach-Object {
        $report += "$($_.TimeCreated) - User: $($_.User) - Source: $($_.Source)`n"
    }
}

$report += @"

--- ACCOUNT LOCKOUTS (Last 24 Hours) ---
"@

$lockouts = Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4740; StartTime=$yesterday} -ErrorAction SilentlyContinue
$report += "`nTotal Lockouts: $($lockouts.Count)`n"

$report += @"

--- NEW USER ACCOUNTS (Last 24 Hours) ---
"@

$newUsers = Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4720; StartTime=$yesterday} -ErrorAction SilentlyContinue
$report += "`nNew Accounts Created: $($newUsers.Count)`n"

$report += @"

--- LOCAL ADMINISTRATORS ---
"@

$admins = Get-LocalGroupMember -Group "Administrators"
foreach ($admin in $admins) {
    $report += "$($admin.Name) - $($admin.ObjectClass)`n"
}

$report += @"

--- SERVICE ACCOUNT STATUS ---
"@

$svcAccounts = Get-LocalUser | Where-Object { $_.Name -like "svc-*" }
foreach ($svc in $svcAccounts) {
    $report += "$($svc.Name) - Enabled: $($svc.Enabled) - Password Expires: $($svc.PasswordExpires)`n"
}

$report += @"

--- OPEN NETWORK CONNECTIONS ---
"@

$connections = Get-NetTCPConnection -State Established | Where-Object { $_.LocalPort -in @(445, 3389, 5985) }
$report += "`nActive SMB/RDP/WinRM Connections: $($connections.Count)`n"

$report += @"

===================================
END OF REPORT
===================================
"@

# Save report
New-Item -Path "C:\Reports" -ItemType Directory -Force -ErrorAction SilentlyContinue
$report | Out-File $reportPath

# Output summary
Write-Host "Security report saved to $reportPath"
Write-Host "Failed Logons: $($failedLogons.Count)"
Write-Host "Lockouts: $($lockouts.Count)"
Write-Host "New Accounts: $($newUsers.Count)"

# Schedule this script
# $action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File C:\Scripts\Security-Report.ps1"
# $trigger = New-ScheduledTaskTrigger -Daily -At 6am
# Register-ScheduledTask -TaskName "Daily Security Report" -Action $action -Trigger $trigger -User "SYSTEM"
```

## Part 9: Security Checklist

### Initial Setup
- [ ] Rename Administrator account
- [ ] Create dedicated admin account
- [ ] Disable Guest account
- [ ] Set strong password policy
- [ ] Configure account lockout
- [ ] Enable Windows Firewall
- [ ] Disable SMBv1
- [ ] Disable unnecessary services
- [ ] Enable auditing

### Ongoing Maintenance
- [ ] Review security logs weekly
- [ ] Update Windows monthly
- [ ] Review user accounts monthly
- [ ] Verify Defender is current
- [ ] Test backups
- [ ] Review firewall rules quarterly
- [ ] Change service account passwords annually

## Quick Reference

```powershell
# Account Security
Get-LocalUser | Select-Object Name, Enabled, PasswordExpires
Get-LocalGroupMember -Group "Administrators"

# Firewall
Get-NetFirewallProfile
Get-NetFirewallRule -Enabled True | Where-Object Direction -eq "Inbound"

# Auditing
auditpol /get /category:*
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625} -MaxEvents 20

# Services
Get-Service | Where-Object Status -eq "Running"
Get-SmbServerConfiguration | Select-Object EnableSMB1Protocol

# Windows Defender
Get-MpComputerStatus
Update-MpSignature
```
