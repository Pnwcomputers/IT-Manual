# Set Up Active Directory Domain Services; Windows Server 2025

This guide walks through installing and configuring Active Directory Domain Services (AD DS) on Windows Server 2025 to create a new domain controller for your network.

## Prerequisites

Before starting, ensure you have:

- Windows Server 2025 installed (Standard or Datacenter)
- Static IP address configured on the server
- Server name set to something meaningful (e.g., DC01, SRV-DC01)
- Local administrator access
- A planned domain name (e.g., contoso.local, yourbusiness.lan)

## Planning Your Domain

Choose your domain name carefully—changing it later is painful. Common naming conventions:

- **Internal-only domains**: Use `.local`, `.lan`, or `.internal` (e.g., `acmecorp.local`)
- **Split-horizon DNS**: Use a subdomain of your public domain (e.g., `ad.acmecorp.com`)—this is Microsoft's current recommendation

For this guide, we'll use `contoso.local` as our example domain.

## Step 1: Set a Static IP Address

Your domain controller must have a static IP. Open PowerShell as Administrator:

```powershell
# View current network configuration
Get-NetIPConfiguration

# Set static IP (adjust values for your network)
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.1.10 -PrefixLength 24 -DefaultGateway 192.168.1.1

# Set DNS to point to itself (required for AD)
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 127.0.0.1
```

Alternatively, configure via Server Manager > Local Server > Ethernet > Properties > IPv4.

## Step 2: Rename the Server

Give your server a meaningful name before promoting to domain controller:

```powershell
Rename-Computer -NewName "DC01" -Restart
```

Or via Server Manager > Local Server > Computer name.

## Step 3: Install Active Directory Domain Services

### Using Server Manager (GUI)

1. Open **Server Manager**
2. Click **Manage** > **Add Roles and Features**
3. Click Next through the wizard until **Server Roles**
4. Check **Active Directory Domain Services**
5. Click **Add Features** when prompted
6. Click Next through remaining screens
7. Click **Install**
8. Wait for installation to complete

### Using PowerShell

```powershell
# Install AD DS role and management tools
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools
```

## Step 4: Promote Server to Domain Controller

After the role installs, you'll see a notification flag in Server Manager. Click it and select **Promote this server to a domain controller**.

### For a New Forest (First Domain Controller)

1. Select **Add a new forest**
2. Enter your Root domain name: `contoso.local`
3. Click **Next**

### Domain Controller Options

Configure the following:

- **Forest functional level**: Windows Server 2016 (or higher for newest features)
- **Domain functional level**: Windows Server 2016 (or higher)
- **Domain Name System (DNS) server**: Checked
- **Global Catalog (GC)**: Checked
- **Directory Services Restore Mode (DSRM) password**: Set a strong password and document it securely

Click **Next**.

### DNS Options

You may see a delegation warning—this is normal for new forests. Click **Next**.

### Additional Options

The NetBIOS name will auto-populate (e.g., `CONTOSO`). Accept or modify, then click **Next**.

### Paths

Default paths are usually fine:

- Database folder: `C:\Windows\NTDS`
- Log files folder: `C:\Windows\NTDS`
- SYSVOL folder: `C:\Windows\SYSVOL`

Click **Next**.

### Review and Install

Review your selections, then click **Next** for prerequisites check. Warnings are normal—look for any errors. Click **Install**.

The server will restart automatically after promotion.

### Using PowerShell for Promotion

```powershell
# Install a new AD forest
Install-ADDSForest `
    -DomainName "contoso.local" `
    -DomainNetBIOSName "CONTOSO" `
    -ForestMode "WinThreshold" `
    -DomainMode "WinThreshold" `
    -InstallDns:$true `
    -SafeModeAdministratorPassword (ConvertTo-SecureString "YourDSRMPassword123!" -AsPlainText -Force) `
    -Force:$true
```

## Step 5: Post-Installation Verification

After the server restarts, log in with `CONTOSO\Administrator` (or your domain\Administrator).

### Verify AD DS Installation

```powershell
# Check AD DS service status
Get-Service NTDS, DNS, Netlogon, DFSR

# Verify domain controller
Get-ADDomainController

# Check domain information
Get-ADDomain

# Check forest information
Get-ADForest

# Test AD replication (useful for multi-DC environments)
repadmin /replsummary
```

### Verify DNS

```powershell
# Check DNS zones were created
Get-DnsServerZone

# Verify SRV records exist
Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.contoso.local" -Type SRV
```

## Step 6: Configure DNS Forwarders

Your DC needs to resolve external DNS queries:

```powershell
# Add DNS forwarders (Google and Cloudflare as examples)
Add-DnsServerForwarder -IPAddress 8.8.8.8
Add-DnsServerForwarder -IPAddress 1.1.1.1

# Verify forwarders
Get-DnsServerForwarder
```

Or via DNS Manager > Server > Properties > Forwarders tab.

## Step 7: Create Reverse Lookup Zone

Reverse DNS is important for proper name resolution:

```powershell
# Create reverse lookup zone for 192.168.1.x network
Add-DnsServerPrimaryZone -NetworkID "192.168.1.0/24" -ReplicationScope "Forest"
```

Or via DNS Manager > Reverse Lookup Zones > New Zone.

## Step 8: Basic AD Structure Setup

Create a basic OU structure to organize your domain:

```powershell
# Create top-level OUs
New-ADOrganizationalUnit -Name "Company" -Path "DC=contoso,DC=local"
New-ADOrganizationalUnit -Name "Users" -Path "OU=Company,DC=contoso,DC=local"
New-ADOrganizationalUnit -Name "Computers" -Path "OU=Company,DC=contoso,DC=local"
New-ADOrganizationalUnit -Name "Servers" -Path "OU=Company,DC=contoso,DC=local"
New-ADOrganizationalUnit -Name "Groups" -Path "OU=Company,DC=contoso,DC=local"
New-ADOrganizationalUnit -Name "Service Accounts" -Path "OU=Company,DC=contoso,DC=local"

# Create department OUs under Users
New-ADOrganizationalUnit -Name "IT" -Path "OU=Users,OU=Company,DC=contoso,DC=local"
New-ADOrganizationalUnit -Name "Sales" -Path "OU=Users,OU=Company,DC=contoso,DC=local"
New-ADOrganizationalUnit -Name "Accounting" -Path "OU=Users,OU=Company,DC=contoso,DC=local"
```

## Common Issues and Solutions

### DNS Not Resolving Domain

Ensure the DC's NIC is pointing to itself (127.0.0.1 or its own IP) for DNS.

### Cannot Log In After Promotion

Use the full domain login: `DOMAIN\Administrator` or `Administrator@contoso.local`

### Sysvol Not Replicating

Check DFSR service is running:
```powershell
Get-Service DFSR
Start-Service DFSR
```

### Time Sync Issues

Domain controllers are sensitive to time. The PDC emulator should sync to an external source:
```powershell
w32tm /config /manualpeerlist:"time.windows.com" /syncfromflags:manual /reliable:yes /update
Restart-Service w32time
w32tm /resync
```

## Next Steps

With AD DS installed, you should:

1. Configure DHCP to assign your DC as the DNS server
2. Create user accounts and groups
3. Join workstations to the domain
4. Configure Group Policy for security and management
5. Set up file shares with proper permissions
6. Consider adding a second DC for redundancy

## Security Recommendations

- Keep the DSRM password secure and documented offline
- Enable Windows Firewall with proper AD rules
- Consider implementing LAPS for local admin passwords
- Regularly backup AD (System State backup)
- Monitor security logs for failed authentications
- Use strong passwords and consider fine-grained password policies
