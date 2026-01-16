# Troubleshooting Guide for Workgroup Networks

This guide covers diagnosing and resolving common issues in Windows Server 2025 workgroup environments.

## Diagnostic Tools Overview

### Built-in Tools

| Tool | Purpose | Command |
|------|---------|---------|
| ping | Network connectivity | `ping server01` |
| ipconfig | IP configuration | `ipconfig /all` |
| nslookup | DNS resolution | `nslookup server01` |
| tracert | Network path | `tracert server01` |
| netstat | Network connections | `netstat -an` |
| Test-NetConnection | PowerShell connectivity test | `Test-NetConnection server01 -Port 445` |
| Get-NetAdapter | Network adapter info | `Get-NetAdapter` |
| Get-Service | Service status | `Get-Service` |

### Useful PowerShell Commands

```powershell
# Network
Test-Connection -ComputerName SERVER01 -Count 4
Test-NetConnection -ComputerName SERVER01 -Port 445
Get-NetIPConfiguration
Get-DnsClientServerAddress
Resolve-DnsName SERVER01

# Services
Get-Service | Where-Object Status -eq "Running"
Get-Service -Name "ServiceName" | Restart-Service

# Event Logs
Get-WinEvent -LogName System -MaxEvents 50
Get-WinEvent -LogName Application -MaxEvents 50
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625} -MaxEvents 20

# Shares
Get-SmbShare
Get-SmbSession
Get-SmbOpenFile

# Users
Get-LocalUser
Get-LocalGroup
Get-LocalGroupMember -Group "Administrators"
```

## Issue 1: Cannot Access Server Shares

### Symptoms
- "Network path not found"
- "Access denied"
- "Cannot connect to server"
- Shares visible but can't open

### Diagnostic Steps

```powershell
# Step 1: Test basic connectivity
ping SERVER01
ping 192.168.1.10

# Step 2: Test name resolution
nslookup SERVER01
Resolve-DnsName SERVER01

# Step 3: Test SMB port
Test-NetConnection -ComputerName SERVER01 -Port 445

# Step 4: List available shares
net view \\SERVER01

# Step 5: Check credentials
cmdkey /list
```

### Solutions

#### Problem: Network Path Not Found

```powershell
# Fix DNS - add static entry if DNS not working
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "192.168.1.10 SERVER01"

# Verify firewall allows SMB
Get-NetFirewallRule -DisplayGroup "File and Printer Sharing" | Select-Object Name, Enabled

# Enable file sharing firewall rules
Enable-NetFirewallRule -DisplayGroup "File and Printer Sharing"
```

#### Problem: Access Denied

```powershell
# Clear cached credentials
net use * /delete /yes
cmdkey /delete:SERVER01

# Reconnect with explicit credentials
net use \\SERVER01\Share /user:SERVER01\username

# Verify user account exists on server (run on server)
Get-LocalUser -Name "username"

# Verify group membership (run on server)
Get-LocalGroupMember -Group "Users"
```

#### Problem: Shares Not Visible

```powershell
# Check if shares exist (on server)
Get-SmbShare

# Check share permissions (on server)
Get-SmbShareAccess -Name "ShareName"

# Verify network discovery is enabled (on client)
Get-NetFirewallRule -DisplayGroup "Network Discovery" | Select-Object Name, Enabled
Enable-NetFirewallRule -DisplayGroup "Network Discovery"
```

## Issue 2: DHCP Not Working

### Symptoms
- Clients getting 169.254.x.x (APIPA) addresses
- No IP address assigned
- "Limited connectivity"

### Diagnostic Steps

```powershell
# On client
ipconfig /all
ipconfig /release
ipconfig /renew

# On server
Get-Service DHCPServer
Get-DhcpServerv4Scope
Get-DhcpServerv4ScopeStatistics
Get-WinEvent -LogName "Microsoft-Windows-Dhcp-Server/Operational" -MaxEvents 20
```

### Solutions

#### Problem: DHCP Service Not Running

```powershell
# Check and start service
Get-Service DHCPServer
Start-Service DHCPServer
Set-Service DHCPServer -StartupType Automatic

# Verify service is running
Get-Service DHCPServer
```

#### Problem: Scope Exhausted

```powershell
# Check available addresses
Get-DhcpServerv4ScopeStatistics

# Expand scope
Set-DhcpServerv4Scope -ScopeId 192.168.1.0 -EndRange 192.168.1.240

# Or add exclusions to free up addresses
Get-DhcpServerv4Lease -ScopeId 192.168.1.0 | Where-Object LeaseState -eq "Inactive" | Remove-DhcpServerv4Lease

# Reduce lease time for faster turnover
Set-DhcpServerv4Scope -ScopeId 192.168.1.0 -LeaseDuration 1.00:00:00
```

#### Problem: Scope Not Active

```powershell
# Activate scope
Set-DhcpServerv4Scope -ScopeId 192.168.1.0 -State Active

# Verify scope options
Get-DhcpServerv4OptionValue -ScopeId 192.168.1.0
```

#### Problem: Firewall Blocking DHCP

```powershell
# Open DHCP ports
New-NetFirewallRule -DisplayName "DHCP Server" -Direction Inbound -Protocol UDP -LocalPort 67 -Action Allow
New-NetFirewallRule -DisplayName "DHCP Client" -Direction Inbound -Protocol UDP -LocalPort 68 -Action Allow
```

## Issue 3: DNS Resolution Failures

### Symptoms
- Can ping by IP but not by name
- "Server not found" errors
- Slow name resolution

### Diagnostic Steps

```powershell
# Test DNS resolution
nslookup SERVER01
nslookup SERVER01 192.168.1.10  # Query specific DNS server
Resolve-DnsName SERVER01

# Check DNS settings
Get-DnsClientServerAddress
ipconfig /all | findstr "DNS"

# Test DNS service (on server)
Get-Service DNS
Test-DnsServer -IPAddress 192.168.1.10
```

### Solutions

#### Problem: Wrong DNS Server

```powershell
# Set correct DNS servers
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 192.168.1.10, 8.8.8.8

# Flush DNS cache
Clear-DnsClientCache
ipconfig /flushdns

# Re-register DNS
ipconfig /registerdns
```

#### Problem: DNS Service Not Running

```powershell
# Check and start DNS service
Get-Service DNS
Start-Service DNS

# Verify DNS is listening
Test-NetConnection -ComputerName localhost -Port 53
```

#### Problem: Missing DNS Records

```powershell
# Add missing A record (on DNS server)
Add-DnsServerResourceRecordA -Name "SERVER01" -ZoneName "office.local" -IPv4Address "192.168.1.10"

# Add PTR record
Add-DnsServerResourceRecordPtr -Name "10" -ZoneName "1.168.192.in-addr.arpa" -PtrDomainName "SERVER01.office.local"

# Verify records
Get-DnsServerResourceRecord -ZoneName "office.local"
```

#### Problem: Forwarders Not Configured

```powershell
# Add DNS forwarders
Add-DnsServerForwarder -IPAddress 8.8.8.8
Add-DnsServerForwarder -IPAddress 1.1.1.1

# Verify
Get-DnsServerForwarder
```

## Issue 4: Remote Desktop Connection Failures

### Symptoms
- "Remote Desktop can't connect"
- Connection timeout
- Authentication errors

### Diagnostic Steps

```powershell
# Test RDP port
Test-NetConnection -ComputerName SERVER01 -Port 3389

# Check RDP is enabled (on server)
Get-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections"

# Check firewall
Get-NetFirewallRule -DisplayName "*Remote Desktop*" | Select-Object Name, Enabled

# Check who can RDP
Get-LocalGroupMember -Group "Remote Desktop Users"
```

### Solutions

#### Problem: RDP Not Enabled

```powershell
# Enable RDP
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0

# Enable firewall rule
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"

# Restart terminal services
Restart-Service TermService -Force
```

#### Problem: NLA Blocking Connection

```powershell
# Disable NLA (less secure, but may fix compatibility issues)
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name "UserAuthentication" -Value 0
```

#### Problem: User Not Authorized

```powershell
# Add user to Remote Desktop Users
Add-LocalGroupMember -Group "Remote Desktop Users" -Member "username"
```

## Issue 5: Slow Network Performance

### Symptoms
- Slow file transfers
- Share access delays
- General sluggishness

### Diagnostic Steps

```powershell
# Check network adapter speed
Get-NetAdapter | Select-Object Name, LinkSpeed, Status

# Check for packet loss
ping SERVER01 -n 100 | findstr "loss"

# Check SMB connections
Get-SmbConnection
Get-SmbSession

# Check disk performance on server
Get-Counter '\PhysicalDisk(*)\Disk Read Bytes/sec','\PhysicalDisk(*)\Disk Write Bytes/sec'
```

### Solutions

#### Problem: SMBv1 Being Used

```powershell
# Disable SMBv1 (slow and insecure)
Set-SmbServerConfiguration -EnableSMB1Protocol $false

# Verify SMB2/3 is enabled
Get-SmbServerConfiguration | Select-Object EnableSMB1Protocol, EnableSMB2Protocol
```

#### Problem: Network Duplex Mismatch

```powershell
# Check adapter settings
Get-NetAdapterAdvancedProperty -Name "Ethernet" | Where-Object DisplayName -like "*Speed*"

# Set to auto-negotiate
Set-NetAdapterAdvancedProperty -Name "Ethernet" -DisplayName "Speed & Duplex" -DisplayValue "Auto Negotiation"
```

#### Problem: Jumbo Frames Mismatch

```powershell
# Check MTU size
netsh interface ipv4 show subinterfaces

# Reset to standard MTU
netsh interface ipv4 set subinterface "Ethernet" mtu=1500 store=persistent
```

## Issue 6: User Authentication Failures

### Symptoms
- "Username or password is incorrect"
- "Logon failure: unknown user name"
- Account lockouts

### Diagnostic Steps

```powershell
# Check user account
Get-LocalUser -Name "username" | Select-Object Name, Enabled, PasswordExpires, LastLogon

# Check for lockout
Get-LocalUser -Name "username" | Select-Object Name, AccountExpires, Enabled

# Check security log
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625} -MaxEvents 20
```

### Solutions

#### Problem: Account Disabled

```powershell
# Enable account
Enable-LocalUser -Name "username"
```

#### Problem: Password Expired

```powershell
# Reset password
$password = ConvertTo-SecureString "NewP@ssw0rd!" -AsPlainText -Force
Set-LocalUser -Name "username" -Password $password

# Don't require password change
Set-LocalUser -Name "username" -PasswordExpired $false
```

#### Problem: Account Locked

```powershell
# Note: Windows Server doesn't have Unlock-LocalUser
# Reset password to unlock, or wait for lockout duration

# Check lockout settings
net accounts
```

#### Problem: Password Mismatch (Workgroup)

When using matching accounts:
```powershell
# Ensure password matches on both server and client
# On server:
Set-LocalUser -Name "username" -Password (ConvertTo-SecureString "MatchingP@ss!" -AsPlainText -Force)

# On client:
Set-LocalUser -Name "username" -Password (ConvertTo-SecureString "MatchingP@ss!" -AsPlainText -Force)
```

## Issue 7: Mapped Drives Disconnect

### Symptoms
- Red X on mapped drives
- "Reconnecting" message
- Drives disconnect after idle

### Diagnostic Steps

```powershell
# Check current connections
net use

# Check SMB sessions on server
Get-SmbSession

# Check auto-disconnect setting
Get-SmbServerConfiguration | Select-Object AutoDisconnectTimeout
```

### Solutions

#### Problem: Auto-Disconnect Timeout

```powershell
# Disable auto-disconnect on server
Set-SmbServerConfiguration -AutoDisconnectTimeout 0 -Force
```

#### Problem: Credentials Not Saved

```powershell
# Save credentials permanently
cmdkey /add:SERVER01 /user:SERVER01\username /pass:password

# Or map with /savecred
net use Z: \\SERVER01\Share /user:SERVER01\username /persistent:yes /savecred
```

#### Problem: Group Policy Blocking

```powershell
# Check if "Do not reconnect" policy is set
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Network" -ErrorAction SilentlyContinue
```

## Issue 8: Services Not Starting

### Diagnostic Steps

```powershell
# Check service status
Get-Service -Name "ServiceName"

# Check why service failed
Get-WinEvent -LogName System | Where-Object { $_.Message -like "*ServiceName*" } | Select-Object -First 5

# Check dependencies
Get-Service -Name "ServiceName" -DependentServices
Get-Service -Name "ServiceName" -RequiredServices
```

### Solutions

```powershell
# Try starting manually
Start-Service -Name "ServiceName"

# Check for dependency issues
Get-Service -Name "ServiceName" -RequiredServices | Start-Service

# Reset service to default
Set-Service -Name "ServiceName" -StartupType Automatic
sc.exe config ServiceName start= auto

# Check service account permissions
# Service may need Log on as a service right
```

## Issue 9: Firewall Blocking Connections

### Diagnostic Steps

```powershell
# Check firewall status
Get-NetFirewallProfile | Select-Object Name, Enabled

# Check specific rules
Get-NetFirewallRule -DisplayGroup "File and Printer Sharing"
Get-NetFirewallRule | Where-Object { $_.Enabled -eq 'True' -and $_.Direction -eq 'Inbound' }

# Check blocked connections
Get-WinEvent -LogName 'Microsoft-Windows-Windows Firewall With Advanced Security/Firewall' -MaxEvents 50
```

### Solutions

```powershell
# Enable common rules
Enable-NetFirewallRule -DisplayGroup "File and Printer Sharing"
Enable-NetFirewallRule -DisplayGroup "Network Discovery"
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"

# Create custom rule
New-NetFirewallRule -DisplayName "Allow Custom App" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow

# Temporarily disable firewall for testing
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
# Remember to re-enable!
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

## System Health Check Script

```powershell
# Save as C:\Scripts\HealthCheck.ps1

Write-Host "=== Server Health Check ===" -ForegroundColor Green
$date = Get-Date

Write-Host "`n--- System Info ---"
Write-Host "Computer: $env:COMPUTERNAME"
Write-Host "Date: $date"
Write-Host "Uptime: $((Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime)"

Write-Host "`n--- Network Status ---"
Get-NetAdapter | Where-Object Status -eq "Up" | ForEach-Object {
    Write-Host "$($_.Name): $($_.LinkSpeed) - $($_.Status)"
}

Write-Host "`n--- IP Configuration ---"
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" } | ForEach-Object {
    Write-Host "$($_.InterfaceAlias): $($_.IPAddress)"
}

Write-Host "`n--- Critical Services ---"
$services = @("DHCPServer", "DNS", "LanmanServer", "LanmanWorkstation", "W32Time")
foreach ($svc in $services) {
    $service = Get-Service -Name $svc -ErrorAction SilentlyContinue
    if ($service) {
        $status = if ($service.Status -eq "Running") { "OK" } else { "STOPPED" }
        $color = if ($service.Status -eq "Running") { "Green" } else { "Red" }
        Write-Host "$($svc): $status" -ForegroundColor $color
    }
}

Write-Host "`n--- Disk Space ---"
Get-WmiObject Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
    $freeGB = [math]::Round($_.FreeSpace/1GB, 2)
    $totalGB = [math]::Round($_.Size/1GB, 2)
    $pctFree = [math]::Round(($_.FreeSpace/$_.Size)*100, 1)
    $color = if ($pctFree -lt 10) { "Red" } elseif ($pctFree -lt 20) { "Yellow" } else { "Green" }
    Write-Host "$($_.DeviceID) $freeGB GB free of $totalGB GB ($pctFree%)" -ForegroundColor $color
}

Write-Host "`n--- Recent Errors (Last 24 hours) ---"
$yesterday = (Get-Date).AddDays(-1)
$errors = Get-WinEvent -FilterHashtable @{LogName='System'; Level=2; StartTime=$yesterday} -MaxEvents 5 -ErrorAction SilentlyContinue
if ($errors) {
    $errors | ForEach-Object { Write-Host "[$($_.TimeCreated)] $($_.Message.Substring(0, [Math]::Min(100, $_.Message.Length)))..." -ForegroundColor Yellow }
} else {
    Write-Host "No critical errors" -ForegroundColor Green
}

Write-Host "`n--- Failed Logons (Last 24 hours) ---"
$failedLogons = Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625; StartTime=$yesterday} -ErrorAction SilentlyContinue
Write-Host "Count: $($failedLogons.Count)" -ForegroundColor $(if ($failedLogons.Count -gt 10) { "Red" } else { "Green" })

Write-Host "`n=== Health Check Complete ===" -ForegroundColor Green
```

## Quick Reference

### Network Troubleshooting

```powershell
ping server01                                    # Basic connectivity
Test-NetConnection server01 -Port 445           # Test specific port
nslookup server01                               # DNS resolution
tracert server01                                # Network path
ipconfig /flushdns                              # Clear DNS cache
ipconfig /release; ipconfig /renew              # Refresh DHCP
```

### Share Troubleshooting

```powershell
net view \\server01                             # List shares
net use                                         # View mapped drives
net use * /delete /yes                          # Clear all mappings
cmdkey /list                                    # View credentials
cmdkey /delete:server01                         # Remove credentials
```

### Service Troubleshooting

```powershell
Get-Service servicename                         # Check status
Start-Service servicename                       # Start service
Restart-Service servicename                     # Restart
Get-WinEvent -LogName System -MaxEvents 20     # Check logs
```

### Firewall Troubleshooting

```powershell
Get-NetFirewallProfile                          # Check status
Get-NetFirewallRule -Enabled True              # Active rules
Enable-NetFirewallRule -DisplayGroup "group"   # Enable rule group
```
