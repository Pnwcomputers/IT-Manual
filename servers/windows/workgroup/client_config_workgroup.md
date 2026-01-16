# Client Configuration for Workgroup Networks

This guide covers configuring Windows 10/11 client computers to work in a workgroup environment with your Windows Server 2025.

## Part 1: Basic Client Setup

### Set Workgroup Name

Ensure all computers are in the same workgroup:

```powershell
# View current workgroup
(Get-WmiObject Win32_ComputerSystem).Workgroup

# Join workgroup (requires restart)
Add-Computer -WorkgroupName "OFFICE" -Restart

# Or change via GUI:
# Settings > System > About > Rename this PC (advanced) > Change > Workgroup
```

### Set Computer Name

```powershell
# Set meaningful computer name
Rename-Computer -NewName "PC-RECEPTION" -Restart

# Naming conventions examples:
# PC-JSMITH (by user)
# PC-SALES01 (by department)
# PC-RECEPTION (by location)
```

### Configure Network Settings

#### DHCP (Recommended)

```powershell
# Set to DHCP (automatic)
Set-NetIPInterface -InterfaceAlias "Ethernet" -Dhcp Enabled
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ResetServerAddresses
```

#### Static IP (If Needed)

```powershell
# Set static IP
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.1.50 -PrefixLength 24 -DefaultGateway 192.168.1.1

# Set DNS to your server
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 192.168.1.10, 8.8.8.8
```

### Configure DNS Suffix

```powershell
# Set DNS suffix for name resolution
Set-DnsClientGlobalSetting -SuffixSearchList @("office.local")

# Verify
Get-DnsClientGlobalSetting
```

## Part 2: User Account Setup

### Option 1: Create Matching Local Account

Create the same username on client as on server:

```powershell
# Create user with same credentials as server
$password = ConvertTo-SecureString "SameAsServerP@ss!" -AsPlainText -Force
New-LocalUser -Name "jsmith" -Password $password -FullName "John Smith"

# Add to Users group
Add-LocalGroupMember -Group "Users" -Member "jsmith"

# If user needs admin rights on their PC
Add-LocalGroupMember -Group "Administrators" -Member "jsmith"
```

### Option 2: Use Microsoft Account

For home/small office, users can sign in with Microsoft accounts. Server access requires stored credentials.

### Option 3: Shared Local Account

For shared workstations:

```powershell
# Create shared account
$password = ConvertTo-SecureString "SharedUserP@ss!" -AsPlainText -Force
New-LocalUser -Name "SharedUser" -Password $password -FullName "Shared Workstation" -PasswordNeverExpires
Add-LocalGroupMember -Group "Users" -Member "SharedUser"
```

## Part 3: Network Discovery and File Sharing

### Enable Network Discovery

```powershell
# Enable Network Discovery
Get-NetFirewallRule -DisplayGroup "Network Discovery" | Enable-NetFirewallRule

# Enable File and Printer Sharing
Get-NetFirewallRule -DisplayGroup "File and Printer Sharing" | Enable-NetFirewallRule
```

Via GUI:
1. Control Panel > Network and Sharing Center > Advanced sharing settings
2. Private profile:
   - Turn on network discovery
   - Turn on file and printer sharing
3. All Networks:
   - Turn off password protected sharing (if using Guest access) OR
   - Turn on password protected sharing (recommended)

### Configure Network Profile

Ensure you're on "Private" network profile:

```powershell
# View current profile
Get-NetConnectionProfile

# Change to Private (trusted network)
Set-NetConnectionProfile -InterfaceAlias "Ethernet" -NetworkCategory Private
```

### Test Server Connectivity

```powershell
# Ping server
Test-Connection -ComputerName SERVER01 -Count 4

# Test SMB port
Test-NetConnection -ComputerName SERVER01 -Port 445

# Test by IP if name resolution fails
Test-NetConnection -ComputerName 192.168.1.10 -Port 445

# Browse server shares
net view \\SERVER01
```

## Part 4: Accessing Server Shares

### Map Network Drive with GUI

1. Open File Explorer
2. Right-click "This PC" > "Map network drive"
3. Choose drive letter (e.g., Z:)
4. Enter path: `\\SERVER01\Public`
5. Check "Reconnect at sign-in"
6. Check "Connect using different credentials" if needed
7. Enter: `SERVER01\username` and password
8. Click Finish

### Map Network Drive with Command Line

```powershell
# Map drive (prompts for credentials if needed)
net use Z: \\SERVER01\Public /persistent:yes

# Map with explicit credentials
net use Z: \\SERVER01\Public /user:SERVER01\jsmith /persistent:yes

# Map with password included (less secure, good for scripts)
net use Z: \\SERVER01\Public /user:SERVER01\jsmith "P@ssw0rd" /persistent:yes

# View mapped drives
net use

# Disconnect drive
net use Z: /delete
```

### Map Drives with PowerShell

```powershell
# Map with credential prompt
$cred = Get-Credential -Message "Enter server credentials" -UserName "SERVER01\jsmith"
New-PSDrive -Name "Z" -PSProvider FileSystem -Root "\\SERVER01\Public" -Credential $cred -Persist

# Map without prompt (using current credentials)
New-PSDrive -Name "S" -PSProvider FileSystem -Root "\\SERVER01\Shared" -Persist
```

### Store Credentials in Windows

```powershell
# Add Windows Credential
cmdkey /add:SERVER01 /user:SERVER01\jsmith /pass:P@ssw0rd

# Add credential for different domain/server
cmdkey /add:FILESERVER /user:FILESERVER\shareuser /pass:ShareP@ss

# List stored credentials
cmdkey /list

# Delete credential
cmdkey /delete:SERVER01
```

Using GUI:
1. Open Credential Manager (search "Credential Manager")
2. Click "Windows Credentials"
3. Click "Add a Windows credential"
4. Enter: `SERVER01`, `SERVER01\username`, `password`

## Part 5: Automatic Drive Mapping at Login

### Method 1: Login Script

Create batch file (`C:\Scripts\MapDrives.bat`):

```batch
@echo off
:: Wait for network
timeout /t 5 /nobreak > nul

:: Map drives
net use Z: \\SERVER01\Public /persistent:no
net use H: \\SERVER01\Users$\%USERNAME% /persistent:no

echo Drives mapped successfully
```

Run at login via Task Scheduler:
```powershell
$action = New-ScheduledTaskAction -Execute "C:\Scripts\MapDrives.bat"
$trigger = New-ScheduledTaskTrigger -AtLogOn -User "jsmith"
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName "Map Network Drives" -Action $action -Trigger $trigger -Settings $settings -User "jsmith"
```

### Method 2: PowerShell Script at Login

Create `C:\Scripts\MapDrives.ps1`:

```powershell
# Wait for network
Start-Sleep -Seconds 5

# Remove existing mappings (optional)
Get-PSDrive -PSProvider FileSystem | Where-Object { $_.DisplayRoot -like "\\*" } | Remove-PSDrive -Force -ErrorAction SilentlyContinue

# Map drives
try {
    New-PSDrive -Name "Z" -PSProvider FileSystem -Root "\\SERVER01\Public" -Persist -ErrorAction Stop
    New-PSDrive -Name "H" -PSProvider FileSystem -Root "\\SERVER01\Users$\$env:USERNAME" -Persist -ErrorAction Stop
    Write-Host "Drives mapped successfully"
}
catch {
    Write-Host "Error mapping drives: $_"
}
```

Schedule with Task Scheduler:
```powershell
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File C:\Scripts\MapDrives.ps1"
$trigger = New-ScheduledTaskTrigger -AtLogOn
Register-ScheduledTask -TaskName "Map Network Drives PS" -Action $action -Trigger $trigger
```

### Method 3: Group Policy (Local)

1. Run `gpedit.msc`
2. Navigate to: User Configuration > Windows Settings > Scripts > Logon
3. Click "Add" and browse to your script
4. Click OK

## Part 6: Printer Configuration

### Add Network Printer

```powershell
# Add printer by IP
Add-Printer -ConnectionName "\\SERVER01\HP-LaserJet"

# Or by IP directly
Add-PrinterPort -Name "IP_192.168.1.50" -PrinterHostAddress "192.168.1.50"
Add-Printer -Name "Office Printer" -DriverName "HP Universal Printing PCL 6" -PortName "IP_192.168.1.50"

# List printers
Get-Printer
```

Via GUI:
1. Settings > Bluetooth & devices > Printers & scanners
2. Click "Add device"
3. Click "Add manually"
4. Select "Add a printer using a TCP/IP address"
5. Enter IP: `192.168.1.50`

### Install Printer Driver

```powershell
# Get available drivers
Get-PrinterDriver

# Install driver from INF
pnputil /add-driver "C:\Drivers\printer.inf" /install

# Add driver
Add-PrinterDriver -Name "HP Universal Printing PCL 6"
```

## Part 7: Time Synchronization

```powershell
# Set time server to your server or external source
w32tm /config /manualpeerlist:"SERVER01,0x1 time.windows.com,0x1" /syncfromflags:manual /update

# Force sync
w32tm /resync /force

# Check status
w32tm /query /status
```

## Part 8: Remote Desktop Configuration

### Enable Remote Desktop on Client (if needed)

```powershell
# Enable RDP
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"

# Enable NLA
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name "UserAuthentication" -Value 1
```

### Connect to Server via RDP

```powershell
# Launch RDP connection
mstsc /v:SERVER01
```

Save connection file:
1. Open Remote Desktop Connection
2. Enter: `SERVER01`
3. Click "Show Options"
4. Enter username: `SERVER01\jsmith`
5. Click "Save As" to create .rdp file

## Part 9: Troubleshooting

### Cannot See Server in Network

```powershell
# Check network discovery
Get-NetFirewallRule -DisplayGroup "Network Discovery" | Select-Object Name, Enabled

# Verify same workgroup
(Get-WmiObject Win32_ComputerSystem).Workgroup

# Try direct connection
explorer.exe \\SERVER01
explorer.exe \\192.168.1.10
```

### Cannot Access Shares - "Access Denied"

```powershell
# Clear cached credentials
net use * /delete /yes

# Remove stored credentials
cmdkey /delete:SERVER01

# Try with explicit credentials
net use \\SERVER01\Share /user:SERVER01\username

# Verify account exists on server
# (must run on server)
Get-LocalUser -Name "username"
```

### "Network Path Not Found"

```powershell
# Test connectivity
ping SERVER01
ping 192.168.1.10

# Check name resolution
nslookup SERVER01
Resolve-DnsName SERVER01

# Test SMB port
Test-NetConnection -ComputerName SERVER01 -Port 445

# Check firewall
Get-NetFirewallRule -DisplayGroup "File and Printer Sharing"
```

### Mapped Drives Disconnect

Common causes and fixes:

1. **Idle timeout** - Drives disconnect after inactivity
   ```powershell
   # Disable auto-disconnect on server
   Set-SmbServerConfiguration -AutoDisconnectTimeout 0
   ```

2. **Credentials expire** - Re-save credentials
   ```powershell
   cmdkey /delete:SERVER01
   cmdkey /add:SERVER01 /user:SERVER01\username /pass:password
   ```

3. **Network issues** - Check connectivity
   ```powershell
   Test-Connection -ComputerName SERVER01 -Continuous
   ```

### Slow Network Performance

```powershell
# Check SMB version
Get-SmbConnection

# Ensure SMB2/3 is enabled on server
Get-SmbServerConfiguration | Select-Object EnableSMB2Protocol

# Disable SMB1 on client
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol

# Check for network issues
Get-NetAdapterStatistics | Select-Object Name, ReceivedUnicastPackets, OutboundDiscardedPackets
```

## Part 10: Client Configuration Checklist

### Initial Setup
- [ ] Set meaningful computer name
- [ ] Join correct workgroup
- [ ] Configure network (DHCP or static)
- [ ] Set DNS suffix
- [ ] Enable network discovery
- [ ] Enable file and printer sharing
- [ ] Set network profile to Private

### User Setup
- [ ] Create local user account (matching server if needed)
- [ ] Store server credentials
- [ ] Map network drives
- [ ] Configure drive mapping at login
- [ ] Add network printers

### Security
- [ ] Disable SMBv1
- [ ] Enable Windows Firewall
- [ ] Configure Windows Update
- [ ] Install antivirus/use Windows Defender

### Testing
- [ ] Verify server connectivity
- [ ] Test share access
- [ ] Verify drives reconnect after reboot
- [ ] Test printer access

## Quick Reference

```powershell
# Network
Test-Connection SERVER01
Test-NetConnection SERVER01 -Port 445
Get-NetConnectionProfile

# Shares
net view \\SERVER01
net use Z: \\SERVER01\Share /persistent:yes
net use * /delete

# Credentials
cmdkey /list
cmdkey /add:SERVER01 /user:SERVER01\user /pass:pass
cmdkey /delete:SERVER01

# Drives
Get-PSDrive -PSProvider FileSystem
New-PSDrive -Name Z -PSProvider FileSystem -Root "\\SERVER01\Share" -Persist
Remove-PSDrive -Name Z

# Printers
Get-Printer
Add-Printer -ConnectionName "\\SERVER01\PrinterName"
```
