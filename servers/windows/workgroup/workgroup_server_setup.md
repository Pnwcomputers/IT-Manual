# Windows Server 2025 Basic Setup
## *(Workgroup / Non-Domain)*

This guide covers setting up Windows Server 2025 as a standalone server in a workgroup environment without Active Directory.

## When to Use Workgroup vs. Domain

**Use a Workgroup when:**
- Small office with fewer than 10-15 computers
- Home lab or test environment
- Simple file/print sharing needs
- No need for centralized user management
- Budget constraints (no CALs needed for basic features)

**Use a Domain when:**
- More than 10-15 computers
- Need centralized user/password management
- Require Group Policy for configuration
- Multiple servers that need to share authentication

## Part 1: Initial Server Configuration

### Set Server Name

```powershell
# Check current name
hostname

# Rename server (requires restart)
Rename-Computer -NewName "SERVER01" -Restart

# Or rename without immediate restart
Rename-Computer -NewName "SERVER01"
Restart-Computer
```

Via GUI: Server Manager > Local Server > Click computer name

### Configure Network Settings

#### Set Static IP Address

```powershell
# View network adapters
Get-NetAdapter

# View current IP configuration
Get-NetIPConfiguration

# Remove existing IP (if DHCP)
Remove-NetIPAddress -InterfaceAlias "Ethernet" -Confirm:$false
Remove-NetRoute -InterfaceAlias "Ethernet" -Confirm:$false

# Set static IP
New-NetIPAddress `
    -InterfaceAlias "Ethernet" `
    -IPAddress 192.168.1.10 `
    -PrefixLength 24 `
    -DefaultGateway 192.168.1.1

# Set DNS servers
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 192.168.1.1, 8.8.8.8
```

Via GUI: Settings > Network & Internet > Ethernet > Edit IP assignment

#### Verify Network Configuration

```powershell
# Test connectivity
Test-NetConnection -ComputerName 8.8.8.8
Test-NetConnection -ComputerName google.com

# View full IP config
ipconfig /all
```

### Configure Workgroup

By default, Windows uses "WORKGROUP". You can change it:

```powershell
# View current workgroup
(Get-WmiObject Win32_ComputerSystem).Workgroup

# Change workgroup name
Add-Computer -WorkgroupName "OFFICE" -Restart

# Or without restart
Add-Computer -WorkgroupName "OFFICE"
Restart-Computer
```

Via GUI: 
1. Server Manager > Local Server > Workgroup
2. Click "Change" 
3. Enter new workgroup name
4. Restart

### Enable Remote Desktop

```powershell
# Enable RDP
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0

# Enable firewall rule
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"

# Allow RDP through firewall (if needed)
New-NetFirewallRule -DisplayName "Allow RDP" -Direction Inbound -Protocol TCP -LocalPort 3389 -Action Allow
```

Via GUI: Server Manager > Local Server > Remote Desktop > Enabled

### Enable Remote Management

```powershell
# Enable WinRM
Enable-PSRemoting -Force

# Configure trusted hosts (for workgroup, since no Kerberos)
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "192.168.1.*" -Force

# Or trust specific computers
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "PC1,PC2,SERVER02" -Force

# Verify
Get-Item WSMan:\localhost\Client\TrustedHosts
```

### Configure Windows Firewall

```powershell
# View firewall status
Get-NetFirewallProfile

# Enable firewall on all profiles
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True

# Allow ping (ICMP)
New-NetFirewallRule -DisplayName "Allow ICMPv4" -Protocol ICMPv4 -IcmpType 8 -Direction Inbound -Action Allow

# Allow file sharing
Enable-NetFirewallRule -DisplayGroup "File and Printer Sharing"
```

### Configure Time Settings

```powershell
# Set timezone
Set-TimeZone -Name "Pacific Standard Time"

# View available timezones
Get-TimeZone -ListAvailable | Where-Object { $_.DisplayName -like "*Pacific*" }

# Configure NTP server
w32tm /config /manualpeerlist:"time.windows.com,0x1 time.nist.gov,0x1" /syncfromflags:manual /reliable:yes /update

# Restart time service
Restart-Service w32time

# Force sync
w32tm /resync /force

# Check status
w32tm /query /status
```

### Install Windows Updates

```powershell
# Install PSWindowsUpdate module
Install-Module PSWindowsUpdate -Force

# Check for updates
Get-WindowsUpdate

# Install all updates
Install-WindowsUpdate -AcceptAll -AutoReboot

# Or use built-in commands
# Check for updates
usoclient StartScan

# Download updates
usoclient StartDownload

# Install updates
usoclient StartInstall
```

## Part 2: Install Common Roles and Features

### View Available Roles

```powershell
# List all available roles and features
Get-WindowsFeature

# List only roles
Get-WindowsFeature | Where-Object { $_.FeatureType -eq "Role" }
```

### Install File Server Role

```powershell
Install-WindowsFeature -Name FS-FileServer -IncludeManagementTools
```

### Install Web Server (IIS) - Optional

```powershell
Install-WindowsFeature -Name Web-Server -IncludeManagementTools
```

### Install DHCP Server - Optional

```powershell
Install-WindowsFeature -Name DHCP -IncludeManagementTools
```

### Install DNS Server - Optional

```powershell
Install-WindowsFeature -Name DNS -IncludeManagementTools
```

### Install Hyper-V - Optional

```powershell
Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart
```

## Part 3: Server Manager Configuration

### Disable IE Enhanced Security (for administration)

```powershell
# Disable for Administrators
$AdminKey = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A7-37EF-4b3f-8CFC-4F3A74704073}"
Set-ItemProperty -Path $AdminKey -Name "IsInstalled" -Value 0

# Disable for Users
$UserKey = "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A8-37EF-4b3f-8CFC-4F3A74704073}"
Set-ItemProperty -Path $UserKey -Name "IsInstalled" -Value 0

# Restart Explorer to apply
Stop-Process -Name Explorer -Force
```

### Configure Server Manager Startup

```powershell
# Disable Server Manager at logon
Get-ScheduledTask -TaskName ServerManager | Disable-ScheduledTask
```

## Part 4: Basic Security Configuration

### Rename Administrator Account

```powershell
# Rename local Administrator
Rename-LocalUser -Name "Administrator" -NewName "ServerAdmin"

# Set strong password
$password = ConvertTo-SecureString "YourStrongP@ssw0rd!" -AsPlainText -Force
Set-LocalUser -Name "ServerAdmin" -Password $password
```

### Create Admin Account (Recommended)

```powershell
# Create new admin account (don't use built-in Administrator)
$password = ConvertTo-SecureString "YourStrongP@ssw0rd!" -AsPlainText -Force
New-LocalUser -Name "ITAdmin" -Password $password -FullName "IT Administrator" -Description "Server administration account" -PasswordNeverExpires

# Add to Administrators group
Add-LocalGroupMember -Group "Administrators" -Member "ITAdmin"
```

### Disable Guest Account

```powershell
Disable-LocalUser -Name "Guest"
```

### Configure Account Lockout Policy

```powershell
# Set via local security policy
# Or use secedit
secedit /export /cfg C:\secpol.cfg

# Edit the file to change:
# LockoutBadCount = 5
# ResetLockoutCount = 30
# LockoutDuration = 30

secedit /configure /db C:\Windows\Security\local.sdb /cfg C:\secpol.cfg /areas SECURITYPOLICY
```

## Part 5: Performance and Maintenance

### Configure Power Settings

```powershell
# Set to High Performance
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

# Disable sleep/hibernate
powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
powercfg /change monitor-timeout-ac 0
```

### Configure Virtual Memory

```powershell
# Set pagefile to automatic
$cs = Get-WmiObject Win32_ComputerSystem
$cs.AutomaticManagedPagefile = $true
$cs.Put()

# Or set specific size (e.g., 8GB)
$pagefile = Get-WmiObject Win32_PageFileSetting
$pagefile.InitialSize = 8192
$pagefile.MaximumSize = 8192
$pagefile.Put()
```

### Enable Event Log Size

```powershell
# Increase Security log size to 512MB
Limit-EventLog -LogName Security -MaximumSize 512MB

# Increase Application log
Limit-EventLog -LogName Application -MaximumSize 256MB

# Increase System log
Limit-EventLog -LogName System -MaximumSize 256MB
```

## Part 6: Documentation

Create a server documentation file:

```powershell
# Generate server info report
$report = @"
Server Documentation
====================
Generated: $(Get-Date)

Computer Name: $(hostname)
Workgroup: $((Get-WmiObject Win32_ComputerSystem).Workgroup)
OS: $((Get-WmiObject Win32_OperatingSystem).Caption)
OS Version: $((Get-WmiObject Win32_OperatingSystem).Version)

IP Configuration:
$(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" } | Format-Table InterfaceAlias, IPAddress, PrefixLength | Out-String)

DNS Servers:
$(Get-DnsClientServerAddress | Where-Object { $_.ServerAddresses } | Format-Table InterfaceAlias, ServerAddresses | Out-String)

Installed Roles:
$(Get-WindowsFeature | Where-Object { $_.Installed -eq $true } | Select-Object Name, DisplayName | Format-Table | Out-String)

Local Administrators:
$(Get-LocalGroupMember -Group "Administrators" | Format-Table Name, PrincipalSource | Out-String)

Disk Space:
$(Get-WmiObject Win32_LogicalDisk | Where-Object { $_.DriveType -eq 3 } | Select-Object DeviceID, @{N='SizeGB';E={[math]::Round($_.Size/1GB,2)}}, @{N='FreeGB';E={[math]::Round($_.FreeSpace/1GB,2)}} | Format-Table | Out-String)
"@

$report | Out-File "C:\ServerDocumentation.txt"
Write-Host "Documentation saved to C:\ServerDocumentation.txt"
```

## Quick Reference Commands

```powershell
# System Info
systeminfo
hostname
Get-ComputerInfo

# Network
ipconfig /all
Get-NetIPConfiguration
Test-NetConnection

# Services
Get-Service | Where-Object {$_.Status -eq "Running"}
Start-Service <name>
Stop-Service <name>
Restart-Service <name>

# Firewall
Get-NetFirewallProfile
Get-NetFirewallRule -Enabled True

# Users
Get-LocalUser
Get-LocalGroup
Get-LocalGroupMember -Group "Administrators"

# Disk
Get-Disk
Get-Volume
Get-Partition

# Updates
Get-HotFix
wmic qfe list

# Performance
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
Get-Counter '\Processor(_Total)\% Processor Time'
```

## Next Steps

After basic setup, proceed to:
1. Configure DNS and DHCP services
2. Create local users and groups
3. Set up file shares
4. Configure backup
5. Implement security hardening
