# DNS and DHCP Configuration for Workgroup Networks

This guide covers setting up DNS and DHCP services on Windows Server 2025 in a non-domain (workgroup) environment.

## Overview

In a workgroup environment without Active Directory:
- DNS provides name resolution for local devices
- DHCP automatically assigns IP addresses
- No AD-integrated zones (use standard primary zones)
- No automatic DHCP authorization required

## Part 1: DHCP Server Setup

### Install DHCP Role

```powershell
# Install DHCP Server
Install-WindowsFeature -Name DHCP -IncludeManagementTools

# Verify installation
Get-WindowsFeature -Name DHCP
```

### Configure DHCP Server

In workgroup mode, no AD authorization is needed, but you should configure security groups:

```powershell
# Create DHCP security groups (optional but recommended)
netsh dhcp add securitygroups

# Restart DHCP service
Restart-Service DHCPServer

# Set service to auto-start
Set-Service DHCPServer -StartupType Automatic
```

### Create DHCP Scope

```powershell
# Create main scope
Add-DhcpServerv4Scope `
    -Name "Office Network" `
    -StartRange 192.168.1.100 `
    -EndRange 192.168.1.200 `
    -SubnetMask 255.255.255.0 `
    -State Active `
    -LeaseDuration 8.00:00:00

# Set default gateway
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -Router 192.168.1.1

# Set DNS servers (your server + external fallback)
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -DnsServer 192.168.1.10, 8.8.8.8

# Set DNS domain name (optional for workgroup)
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -DnsDomain "office.local"

# View scope configuration
Get-DhcpServerv4Scope
Get-DhcpServerv4OptionValue -ScopeId 192.168.1.0
```

### Add Exclusions

Exclude static IP ranges from DHCP:

```powershell
# Exclude server range (1-20)
Add-DhcpServerv4ExclusionRange -ScopeId 192.168.1.0 -StartRange 192.168.1.1 -EndRange 192.168.1.20

# Exclude printer/device range (240-254)
Add-DhcpServerv4ExclusionRange -ScopeId 192.168.1.0 -StartRange 192.168.1.240 -EndRange 192.168.1.254

# View exclusions
Get-DhcpServerv4ExclusionRange -ScopeId 192.168.1.0
```

### Create Reservations

Give specific devices consistent IP addresses:

```powershell
# Add reservation for a device
Add-DhcpServerv4Reservation `
    -ScopeId 192.168.1.0 `
    -IPAddress 192.168.1.50 `
    -ClientId "AA-BB-CC-DD-EE-FF" `
    -Name "NetworkPrinter" `
    -Description "Main office printer"

# Add reservation for server (backup NIC, etc.)
Add-DhcpServerv4Reservation `
    -ScopeId 192.168.1.0 `
    -IPAddress 192.168.1.51 `
    -ClientId "11-22-33-44-55-66" `
    -Name "NAS-Storage" `
    -Description "Network storage device"

# View reservations
Get-DhcpServerv4Reservation -ScopeId 192.168.1.0

# Find MAC address on Windows client
Get-NetAdapter | Select-Object Name, MacAddress
```

### DHCP Options Reference

Common options to configure:

```powershell
# Option 3: Router (Gateway)
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -OptionId 3 -Value 192.168.1.1

# Option 6: DNS Servers
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -OptionId 6 -Value 192.168.1.10, 8.8.8.8

# Option 15: DNS Domain Name
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -OptionId 15 -Value "office.local"

# Option 42: NTP Servers
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -OptionId 42 -Value 192.168.1.10

# Option 44: WINS Servers (if needed for legacy)
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -OptionId 44 -Value 192.168.1.10

# View all options
Get-DhcpServerv4OptionValue -ScopeId 192.168.1.0
Get-DhcpServerv4OptionDefinition
```

### Multiple Subnets / VLANs

For networks with multiple subnets:

```powershell
# Create second scope
Add-DhcpServerv4Scope `
    -Name "Guest Network" `
    -StartRange 192.168.2.100 `
    -EndRange 192.168.2.200 `
    -SubnetMask 255.255.255.0 `
    -State Active

Set-DhcpServerv4OptionValue -ScopeId 192.168.2.0 -Router 192.168.2.1
Set-DhcpServerv4OptionValue -ScopeId 192.168.2.0 -DnsServer 8.8.8.8, 8.8.4.4
```

Note: For DHCP to serve other subnets, configure IP Helper/DHCP Relay on your router.

### Monitor DHCP

```powershell
# View scope statistics
Get-DhcpServerv4ScopeStatistics

# View active leases
Get-DhcpServerv4Lease -ScopeId 192.168.1.0

# View all leases including expired
Get-DhcpServerv4Lease -ScopeId 192.168.1.0 -AllLeases

# Export lease info
Get-DhcpServerv4Lease -ScopeId 192.168.1.0 | Export-Csv "C:\DHCP-Leases.csv" -NoTypeInformation
```

---

## Part 2: DNS Server Setup

### Install DNS Role

```powershell
# Install DNS Server
Install-WindowsFeature -Name DNS -IncludeManagementTools

# Verify installation
Get-WindowsFeature -Name DNS
```

### Configure DNS Server

```powershell
# Check DNS service
Get-Service DNS

# View DNS server settings
Get-DnsServer
```

### Create Forward Lookup Zone

For workgroup, use a standard primary zone (not AD-integrated):

```powershell
# Create primary forward lookup zone
Add-DnsServerPrimaryZone `
    -Name "office.local" `
    -ZoneFile "office.local.dns" `
    -DynamicUpdate None

# Or allow nonsecure updates (use cautiously)
Add-DnsServerPrimaryZone `
    -Name "office.local" `
    -ZoneFile "office.local.dns" `
    -DynamicUpdate NonsecureAndSecure

# View zones
Get-DnsServerZone
```

### Create Reverse Lookup Zone

```powershell
# Create reverse lookup zone
Add-DnsServerPrimaryZone `
    -NetworkID "192.168.1.0/24" `
    -ZoneFile "1.168.192.in-addr.arpa.dns" `
    -DynamicUpdate None

# Verify
Get-DnsServerZone
```

### Configure Forwarders

Forwarders resolve external DNS queries:

```powershell
# Add forwarders
Add-DnsServerForwarder -IPAddress 8.8.8.8
Add-DnsServerForwarder -IPAddress 8.8.4.4
Add-DnsServerForwarder -IPAddress 1.1.1.1

# View forwarders
Get-DnsServerForwarder

# Remove a forwarder
Remove-DnsServerForwarder -IPAddress 8.8.8.8
```

### Add DNS Records

```powershell
# Add A record (name to IP)
Add-DnsServerResourceRecordA -Name "server01" -ZoneName "office.local" -IPv4Address "192.168.1.10" -CreatePtr

# Add A record for printer
Add-DnsServerResourceRecordA -Name "printer" -ZoneName "office.local" -IPv4Address "192.168.1.50" -CreatePtr

# Add A record for NAS
Add-DnsServerResourceRecordA -Name "nas" -ZoneName "office.local" -IPv4Address "192.168.1.51" -CreatePtr

# Add CNAME (alias)
Add-DnsServerResourceRecordCName -Name "files" -ZoneName "office.local" -HostNameAlias "server01.office.local"
Add-DnsServerResourceRecordCName -Name "intranet" -ZoneName "office.local" -HostNameAlias "server01.office.local"

# Add MX record (if running mail)
Add-DnsServerResourceRecordMX -Name "." -ZoneName "office.local" -MailExchange "mail.office.local" -Preference 10

# Add TXT record
Add-DnsServerResourceRecordTxt -Name "." -ZoneName "office.local" -DescriptiveText "Office Local Network"

# View all records in zone
Get-DnsServerResourceRecord -ZoneName "office.local"
```

### Add PTR Records (Reverse Lookup)

```powershell
# Add PTR record (IP to name)
Add-DnsServerResourceRecordPtr -Name "10" -ZoneName "1.168.192.in-addr.arpa" -PtrDomainName "server01.office.local"
Add-DnsServerResourceRecordPtr -Name "50" -ZoneName "1.168.192.in-addr.arpa" -PtrDomainName "printer.office.local"
Add-DnsServerResourceRecordPtr -Name "51" -ZoneName "1.168.192.in-addr.arpa" -PtrDomainName "nas.office.local"

# View PTR records
Get-DnsServerResourceRecord -ZoneName "1.168.192.in-addr.arpa"
```

### Configure DNS Scavenging

Remove stale records (if using dynamic updates):

```powershell
# Enable scavenging on server
Set-DnsServerScavenging -ScavengingState $true -ScavengingInterval 7.00:00:00

# Enable aging on zone
Set-DnsServerZoneAging -Name "office.local" -Aging $true -NoRefreshInterval 7.00:00:00 -RefreshInterval 7.00:00:00
```

### Point Server to Itself for DNS

```powershell
# Server should use itself as primary DNS
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 127.0.0.1, 8.8.8.8
```

---

## Part 3: Configure DHCP to Update DNS

In workgroup mode, you can configure DHCP to update DNS records:

```powershell
# Configure DHCP to update DNS
Set-DhcpServerv4DnsSetting `
    -DynamicUpdates "Always" `
    -DeleteDnsRROnLeaseExpiry $true

# Configure per scope
Set-DhcpServerv4DnsSetting -ScopeId 192.168.1.0 `
    -DynamicUpdates "Always" `
    -DeleteDnsRROnLeaseExpiry $true `
    -UpdateDnsRRForOlderClients $true

# Set DNS credentials (for secure updates)
# In workgroup, you may need to allow nonsecure updates or configure credentials
$cred = Get-Credential
Set-DhcpServerDnsCredential -Credential $cred
```

---

## Part 4: Client Configuration

### Configure Clients to Use DHCP

Clients should be set to obtain IP automatically. The DHCP server will provide:
- IP Address
- Subnet Mask
- Default Gateway
- DNS Server(s)
- DNS Suffix

### Manual Client DNS Configuration

If client uses static IP:

```powershell
# Set DNS servers on client
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 192.168.1.10, 8.8.8.8

# Set DNS suffix
Set-DnsClientGlobalSetting -SuffixSearchList @("office.local")
```

### Register Client in DNS

```powershell
# Force DNS registration
ipconfig /registerdns

# Verify
nslookup computername.office.local
```

---

## Part 5: Testing and Verification

### Test DNS

```powershell
# Test forward lookup
Resolve-DnsName server01.office.local
nslookup server01.office.local

# Test reverse lookup
Resolve-DnsName 192.168.1.10
nslookup 192.168.1.10

# Test external resolution
Resolve-DnsName google.com
nslookup google.com

# Clear DNS cache
Clear-DnsClientCache
ipconfig /flushdns
```

### Test DHCP

```powershell
# On client - release and renew
ipconfig /release
ipconfig /renew

# View IP configuration
ipconfig /all

# On server - check leases
Get-DhcpServerv4Lease -ScopeId 192.168.1.0
```

---

## Part 6: Backup and Maintenance

### Backup DHCP

```powershell
# Export DHCP configuration
Export-DhcpServer -File "C:\Backup\dhcp-backup.xml" -Leases

# Backup location (automatic backups)
# C:\Windows\System32\dhcp\backup

# Restore DHCP
Import-DhcpServer -File "C:\Backup\dhcp-backup.xml" -BackupPath "C:\Backup\dhcp-restore"
```

### Backup DNS

```powershell
# DNS zone files location
# C:\Windows\System32\dns

# Export zone to file
Export-DnsServerZone -Name "office.local" -FileName "office.local.backup.dns"

# Copy zone files for backup
Copy-Item "C:\Windows\System32\dns\office.local.dns" "C:\Backup\DNS\"
Copy-Item "C:\Windows\System32\dns\1.168.192.in-addr.arpa.dns" "C:\Backup\DNS\"
```

### Scheduled Backup Script

```powershell
# Create backup script: C:\Scripts\Backup-DHCP-DNS.ps1
$backupPath = "C:\Backup\$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -Path $backupPath -ItemType Directory -Force

# Backup DHCP
Export-DhcpServer -File "$backupPath\dhcp-backup.xml" -Leases

# Backup DNS zones
Copy-Item "C:\Windows\System32\dns\*.dns" "$backupPath\" -Force

Write-Host "Backup completed to $backupPath"

# Schedule with Task Scheduler
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File C:\Scripts\Backup-DHCP-DNS.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "Backup DHCP and DNS" -Action $action -Trigger $trigger -User "SYSTEM"
```

---

## Troubleshooting

### DHCP Issues

```powershell
# Check DHCP service
Get-Service DHCPServer
Start-Service DHCPServer

# Check for conflicts
Get-DhcpServerv4ScopeStatistics

# View DHCP server log
Get-WinEvent -LogName "Microsoft-Windows-Dhcp-Server/Operational" -MaxEvents 20

# Common issues:
# - Scope not activated
# - IP range exhausted
# - Firewall blocking UDP 67/68
# - Rogue DHCP server on network
```

### DNS Issues

```powershell
# Check DNS service
Get-Service DNS
Start-Service DNS

# Test DNS resolution
Resolve-DnsName office.local

# Check DNS logs
Get-WinEvent -LogName "DNS Server" -MaxEvents 20

# Clear DNS server cache
Clear-DnsServerCache

# Common issues:
# - Zone not created
# - Forwarders not configured
# - Firewall blocking UDP/TCP 53
# - Server not pointing to itself for DNS
```

### Firewall Ports

Ensure these ports are open:

| Service | Port | Protocol |
|---------|------|----------|
| DNS | 53 | TCP/UDP |
| DHCP Server | 67 | UDP |
| DHCP Client | 68 | UDP |

```powershell
# Open DNS port
New-NetFirewallRule -DisplayName "DNS" -Direction Inbound -Protocol UDP -LocalPort 53 -Action Allow
New-NetFirewallRule -DisplayName "DNS TCP" -Direction Inbound -Protocol TCP -LocalPort 53 -Action Allow

# Open DHCP port
New-NetFirewallRule -DisplayName "DHCP Server" -Direction Inbound -Protocol UDP -LocalPort 67 -Action Allow
```

---

## Quick Reference

```powershell
# DHCP Commands
Get-DhcpServerv4Scope                          # List scopes
Get-DhcpServerv4Lease -ScopeId 192.168.1.0     # List leases
Add-DhcpServerv4Reservation ...                 # Add reservation
Get-DhcpServerv4ScopeStatistics                # View statistics

# DNS Commands
Get-DnsServerZone                              # List zones
Get-DnsServerResourceRecord -ZoneName "zone"   # List records
Add-DnsServerResourceRecordA ...               # Add A record
Get-DnsServerForwarder                         # List forwarders
Clear-DnsServerCache                           # Clear cache
```
