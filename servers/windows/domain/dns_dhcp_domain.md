# DNS and DHCP Configuration for Windows Server 2025 Active Directory

This guide covers setting up DNS and DHCP services to support your Active Directory domain environment. Proper DNS configuration is critical—AD relies heavily on DNS for locating domain controllers and services.

## Understanding DNS in Active Directory

Active Directory is completely dependent on DNS. When you install AD DS, DNS zones and records are automatically created that allow:

- Clients to locate domain controllers
- Domain controllers to find replication partners
- Services to register their locations (SRV records)
- Kerberos authentication to function

## Part 1: DNS Configuration

### DNS Zones Overview

After promoting a domain controller, you should have these zones:

- **Forward Lookup Zone**: `contoso.local` — resolves names to IPs
- **Reverse Lookup Zone**: `1.168.192.in-addr.arpa` — resolves IPs to names
- **_msdcs.contoso.local**: Contains critical AD service records

### Verify DNS Zones

```powershell
# List all DNS zones
Get-DnsServerZone

# Check forward lookup zone records
Get-DnsServerResourceRecord -ZoneName "contoso.local"

# Check critical SRV records exist
Get-DnsServerResourceRecord -ZoneName "_msdcs.contoso.local" -RRType SRV
```

### Configure DNS Forwarders

Forwarders handle queries your DNS server can't resolve (external domains):

```powershell
# View current forwarders
Get-DnsServerForwarder

# Clear existing forwarders
Remove-DnsServerForwarder -IPAddress (Get-DnsServerForwarder).IPAddress -Force

# Add reliable forwarders
Add-DnsServerForwarder -IPAddress 8.8.8.8       # Google Primary
Add-DnsServerForwarder -IPAddress 8.8.4.4       # Google Secondary
Add-DnsServerForwarder -IPAddress 1.1.1.1       # Cloudflare Primary
Add-DnsServerForwarder -IPAddress 1.0.0.1       # Cloudflare Secondary
```

#### Via GUI

1. Open **DNS Manager**
2. Right-click your server > **Properties**
3. Go to **Forwarders** tab
4. Click **Edit** and add forwarder IPs

### Create Reverse Lookup Zone

If not created during AD setup:

```powershell
# Create reverse zone for 192.168.1.0/24
Add-DnsServerPrimaryZone -NetworkID "192.168.1.0/24" -ReplicationScope "Forest"

# For multiple subnets, create additional zones
Add-DnsServerPrimaryZone -NetworkID "192.168.2.0/24" -ReplicationScope "Forest"
Add-DnsServerPrimaryZone -NetworkID "10.0.0.0/24" -ReplicationScope "Forest"
```

#### Via GUI

1. Open **DNS Manager**
2. Right-click **Reverse Lookup Zones** > **New Zone**
3. Select **Primary zone** and **Store in AD**
4. Choose replication scope (Forest is typical)
5. Select **IPv4 Reverse Lookup Zone**
6. Enter Network ID: `192.168.1`
7. Allow secure dynamic updates

### Configure DNS Scavenging

Scavenging removes stale DNS records. Important for dynamic environments:

```powershell
# Enable scavenging on the DNS server
Set-DnsServerScavenging -ScavengingState $true -ScavengingInterval 7.00:00:00

# Enable aging on zones (required for scavenging to work)
Set-DnsServerZoneAging -Name "contoso.local" -Aging $true -NoRefreshInterval 7.00:00:00 -RefreshInterval 7.00:00:00

# Enable on reverse zone too
Set-DnsServerZoneAging -Name "1.168.192.in-addr.arpa" -Aging $true -NoRefreshInterval 7.00:00:00 -RefreshInterval 7.00:00:00
```

### Add Static DNS Records

For servers and devices that don't update DNS dynamically:

```powershell
# Add A record (host record)
Add-DnsServerResourceRecordA -Name "fileserver" -ZoneName "contoso.local" -IPv4Address "192.168.1.20" -CreatePtr

# Add CNAME record (alias)
Add-DnsServerResourceRecordCName -Name "files" -ZoneName "contoso.local" -HostNameAlias "fileserver.contoso.local"

# Add PTR record manually (if not using -CreatePtr)
Add-DnsServerResourceRecordPtr -Name "20" -ZoneName "1.168.192.in-addr.arpa" -PtrDomainName "fileserver.contoso.local"
```

### DNS Best Practices

1. **All domain members should use internal DNS only** — never point clients to external DNS
2. **DNS servers should point to themselves** — DC01 should use 127.0.0.1 or its own IP
3. **Secondary DC should point to primary first, then itself**
4. **Forwarders handle external resolution** — don't add public DNS to clients

## Part 2: DHCP Configuration

### Install DHCP Role

```powershell
# Install DHCP Server role
Install-WindowsFeature -Name DHCP -IncludeManagementTools
```

Or via Server Manager > Add Roles and Features > DHCP Server.

### Authorize DHCP Server in Active Directory

DHCP servers must be authorized in AD to prevent rogue servers:

```powershell
# Authorize the DHCP server
Add-DhcpServerInDC -DnsName "dc01.contoso.local" -IPAddress 192.168.1.10

# Verify authorization
Get-DhcpServerInDC
```

#### Via GUI

1. Open **DHCP Manager**
2. Right-click **DHCP** > **Manage authorized servers**
3. Click **Authorize** and enter server name

### Complete Post-Install Configuration

```powershell
# Tell Server Manager the post-install config is complete
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\ServerManager\Roles\12" -Name "ConfigurationState" -Value 2

# Create DHCP security groups
netsh dhcp add securitygroups

# Restart DHCP service
Restart-Service DHCPServer
```

### Create DHCP Scope

A scope defines the range of IPs to hand out:

```powershell
# Create main scope
Add-DhcpServerv4Scope `
    -Name "Main Network" `
    -StartRange 192.168.1.100 `
    -EndRange 192.168.1.200 `
    -SubnetMask 255.255.255.0 `
    -State Active `
    -LeaseDuration 8.00:00:00

# Set default gateway (router)
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -Router 192.168.1.1

# Set DNS servers (your domain controllers)
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -DnsServer 192.168.1.10

# Set DNS domain name
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -DnsDomain "contoso.local"
```

#### Via GUI

1. Open **DHCP Manager**
2. Expand your server > **IPv4**
3. Right-click **IPv4** > **New Scope**
4. Follow the wizard:
   - Name: "Main Network"
   - Start IP: 192.168.1.100
   - End IP: 192.168.1.200
   - Subnet mask: 255.255.255.0
   - Exclusions: Add any reserved IPs
   - Lease duration: 8 days (typical)
   - Configure options: Yes
   - Router: 192.168.1.1
   - DNS: 192.168.1.10
   - Domain: contoso.local
   - Activate scope: Yes

### Add DHCP Exclusions

Exclude IPs that are statically assigned:

```powershell
# Exclude server range
Add-DhcpServerv4ExclusionRange -ScopeId 192.168.1.0 -StartRange 192.168.1.1 -EndRange 192.168.1.50

# Exclude printer range
Add-DhcpServerv4ExclusionRange -ScopeId 192.168.1.0 -StartRange 192.168.1.240 -EndRange 192.168.1.250
```

### Create DHCP Reservations

Reservations give specific devices the same IP every time:

```powershell
# Add reservation for a specific device
Add-DhcpServerv4Reservation `
    -ScopeId 192.168.1.0 `
    -IPAddress 192.168.1.150 `
    -ClientId "AA-BB-CC-DD-EE-FF" `
    -Name "Reception-PC" `
    -Description "Front desk computer"

# View all reservations
Get-DhcpServerv4Reservation -ScopeId 192.168.1.0
```

To find a device's MAC address:
```powershell
# On the client machine
Get-NetAdapter | Select-Object Name, MacAddress
```

### Configure DHCP to Update DNS

Enable DHCP to register DNS records for clients:

```powershell
# Configure dynamic DNS updates
Set-DhcpServerv4DnsSetting `
    -ScopeId 192.168.1.0 `
    -DynamicUpdates "Always" `
    -DeleteDnsRROnLeaseExpiry $true `
    -UpdateDnsRRForOlderClients $true
```

### Additional DHCP Options

Common options you might want to set:

```powershell
# Set NTP server (option 42)
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -OptionId 42 -Value 192.168.1.10

# Set WINS server if needed (option 44) - legacy
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -OptionId 44 -Value 192.168.1.10

# View all scope options
Get-DhcpServerv4OptionValue -ScopeId 192.168.1.0
```

### Multiple Scopes (Multiple VLANs/Subnets)

For networks with multiple subnets:

```powershell
# Create scope for second subnet
Add-DhcpServerv4Scope `
    -Name "Guest Network" `
    -StartRange 192.168.2.100 `
    -EndRange 192.168.2.200 `
    -SubnetMask 255.255.255.0 `
    -State Active

Set-DhcpServerv4OptionValue -ScopeId 192.168.2.0 -Router 192.168.2.1
Set-DhcpServerv4OptionValue -ScopeId 192.168.2.0 -DnsServer 192.168.1.10
Set-DhcpServerv4OptionValue -ScopeId 192.168.2.0 -DnsDomain "contoso.local"
```

Note: For DHCP to serve other subnets, you need either:
- DHCP relay agent (IP helper) on the router
- A DHCP server on each subnet

### DHCP Failover (High Availability)

If you have two servers, configure DHCP failover:

```powershell
# Add failover relationship (run on primary DHCP server)
Add-DhcpServerv4Failover `
    -Name "DHCP-Failover" `
    -PartnerServer "dc02.contoso.local" `
    -ScopeId 192.168.1.0 `
    -SharedSecret "YourSecretPassword123!" `
    -Mode "HotStandby" `
    -ReservePercent 10 `
    -AutoStateTransition $true `
    -StateSwitchInterval 00:01:00
```

## Verification and Troubleshooting

### Verify DNS is Working

```powershell
# Test forward lookup
Resolve-DnsName dc01.contoso.local

# Test reverse lookup
Resolve-DnsName 192.168.1.10

# Test SRV records
Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.contoso.local" -Type SRV

# Test from a client
nslookup contoso.local
nslookup dc01.contoso.local
```

### Verify DHCP is Working

```powershell
# Check scope statistics
Get-DhcpServerv4ScopeStatistics -ScopeId 192.168.1.0

# View active leases
Get-DhcpServerv4Lease -ScopeId 192.168.1.0

# Check DHCP server status
Get-Service DHCPServer
```

### Common DNS Issues

**Clients can't resolve domain name:**
- Verify client DNS is pointing to DC
- Check DNS service is running
- Verify zone exists and has records

**External sites don't resolve:**
- Check forwarders are configured
- Test: `Resolve-DnsName google.com`
- Verify firewall allows DNS (UDP/TCP 53) outbound

**PTR records not creating:**
- Ensure reverse zone exists
- Enable dynamic updates on reverse zone
- Check DHCP DNS update settings

### Common DHCP Issues

**Clients not getting IP:**
- Check DHCP service is running
- Verify scope is activated
- Check for IP conflicts or exhausted scope
- Verify no rogue DHCP servers

**Server not authorized:**
- Run `Get-DhcpServerInDC` to check
- Authorize server in AD

## Quick Reference: Port Requirements

Ensure these ports are open between clients and servers:

| Service | Port | Protocol |
|---------|------|----------|
| DNS | 53 | TCP/UDP |
| DHCP Server | 67 | UDP |
| DHCP Client | 68 | UDP |
| Kerberos | 88 | TCP/UDP |
| LDAP | 389 | TCP/UDP |
| LDAPS | 636 | TCP |
| Global Catalog | 3268 | TCP |
| RPC | 135 | TCP |
| SMB | 445 | TCP |

## Summary Commands

Quick setup script for DNS and DHCP:

```powershell
# === DNS Configuration ===
# Add forwarders
Add-DnsServerForwarder -IPAddress 8.8.8.8, 1.1.1.1

# Create reverse zone
Add-DnsServerPrimaryZone -NetworkID "192.168.1.0/24" -ReplicationScope "Forest"

# Enable scavenging
Set-DnsServerScavenging -ScavengingState $true -ScavengingInterval 7.00:00:00
Set-DnsServerZoneAging -Name "contoso.local" -Aging $true

# === DHCP Configuration ===
# Install and authorize
Install-WindowsFeature -Name DHCP -IncludeManagementTools
Add-DhcpServerInDC -DnsName "dc01.contoso.local" -IPAddress 192.168.1.10

# Create scope
Add-DhcpServerv4Scope -Name "Main Network" -StartRange 192.168.1.100 -EndRange 192.168.1.200 -SubnetMask 255.255.255.0 -State Active

# Set options
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -Router 192.168.1.1
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -DnsServer 192.168.1.10
Set-DhcpServerv4OptionValue -ScopeId 192.168.1.0 -DnsDomain "contoso.local"

# Add exclusions
Add-DhcpServerv4ExclusionRange -ScopeId 192.168.1.0 -StartRange 192.168.1.1 -EndRange 192.168.1.50
```
