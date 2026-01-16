# Joining Windows Workstations to Active Directory Domain

This guide covers the process of joining Windows 10 and Windows 11 workstations to your Windows Server 2025 Active Directory domain.

## Prerequisites

Before joining a workstation to the domain:

1. **Domain controller is configured and running**
2. **DNS is working** - Workstation must be able to resolve the domain name
3. **Network connectivity** - Workstation can reach the domain controller
4. **DHCP or static IP** - Workstation has correct DNS settings
5. **Domain admin credentials** - Or delegated join permissions
6. **Computer name decided** - Best to set before joining

## Pre-Join Checklist

### Verify Network Settings

The workstation must use your domain controller as its DNS server:

```powershell
# Check current DNS settings
Get-DnsClientServerAddress

# If using DHCP, ensure DHCP scope has correct DNS
# If static, set DNS to domain controller IP
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 192.168.1.10
```

### Test DNS Resolution

```powershell
# Test domain name resolution
nslookup contoso.local

# Should return your DC's IP address
# If it fails, fix DNS settings first

# Test SRV record lookup
nslookup -type=srv _ldap._tcp.dc._msdcs.contoso.local

# Should return your domain controller
```

### Test Network Connectivity

```powershell
# Ping domain controller
ping dc01.contoso.local

# Test SMB access to SYSVOL
dir \\contoso.local\SYSVOL

# Test RPC connectivity
Test-NetConnection -ComputerName dc01.contoso.local -Port 135
```

## Method 1: Join via Settings (Windows 10/11 GUI)

### Windows 11

1. Open **Settings** (Win + I)
2. Go to **Accounts** > **Access work or school**
3. Click **Connect**
4. Click **Join this device to a local Active Directory domain**
5. Enter domain name: `contoso.local`
6. Click **Next**
7. Enter domain admin credentials
8. Select account type for user (Administrator or Standard User)
9. Click **Next** then **Restart now**

### Windows 10

1. Open **Settings** > **Accounts** > **Access work or school**
2. Click **Connect**
3. Click **Join this device to a local Active Directory domain**
4. Enter domain name: `contoso.local`
5. Enter credentials and complete wizard
6. Restart

## Method 2: Join via System Properties (Classic)

Works on all Windows versions:

1. Press **Win + R**, type `sysdm.cpl`, press Enter
2. On **Computer Name** tab, click **Change**
3. Under "Member of", select **Domain**
4. Enter: `contoso.local`
5. Click **OK**
6. Enter domain admin credentials when prompted
7. Click **OK** on welcome message
8. Restart the computer

## Method 3: Join via PowerShell

Most efficient for IT professionals:

```powershell
# Basic domain join
Add-Computer -DomainName "contoso.local" -Credential (Get-Credential) -Restart

# Join and specify OU
Add-Computer `
    -DomainName "contoso.local" `
    -OUPath "OU=Workstations,OU=Computers,OU=Company,DC=contoso,DC=local" `
    -Credential (Get-Credential) `
    -Restart

# Join with new computer name
Add-Computer `
    -DomainName "contoso.local" `
    -NewName "WKS-RECEPTION-01" `
    -OUPath "OU=Workstations,OU=Computers,OU=Company,DC=contoso,DC=local" `
    -Credential (Get-Credential) `
    -Restart

# Join using stored credentials (for scripting)
$cred = Get-Credential CONTOSO\Administrator
Add-Computer -DomainName "contoso.local" -Credential $cred -Restart
```

## Method 4: Join via Command Line

Using netdom (requires RSAT tools):

```cmd
netdom join %COMPUTERNAME% /domain:contoso.local /userd:CONTOSO\Administrator /passwordd:* /reboot
```

Using djoin (offline domain join):

```powershell
# On domain controller - create provisioning file
djoin /provision /domain contoso.local /machine WKS-NEW-01 /savefile C:\djoin-WKS-NEW-01.txt

# Copy file to workstation, then on workstation (as admin):
djoin /requestODJ /loadfile C:\djoin-WKS-NEW-01.txt /windowspath %SystemRoot% /localos

# Restart workstation
shutdown /r /t 0
```

## Method 5: Bulk Domain Join (Deployment)

### Using PowerShell Remoting

```powershell
# List of computers to join
$computers = @("PC01", "PC02", "PC03")
$cred = Get-Credential CONTOSO\Administrator

foreach ($computer in $computers) {
    Invoke-Command -ComputerName $computer -ScriptBlock {
        Add-Computer -DomainName "contoso.local" -Credential $using:cred -OUPath "OU=Workstations,OU=Computers,OU=Company,DC=contoso,DC=local"
    } -Credential $cred
    
    # Restart remotely
    Restart-Computer -ComputerName $computer -Credential $cred -Force
}
```

### Using Answer Files (Unattended)

In your unattend.xml for Windows deployment:

```xml
<settings pass="specialize">
    <component name="Microsoft-Windows-UnattendedJoin" processorArchitecture="amd64">
        <Identification>
            <Credentials>
                <Domain>contoso.local</Domain>
                <Username>Administrator</Username>
                <Password>YourPassword</Password>
            </Credentials>
            <JoinDomain>contoso.local</JoinDomain>
            <MachineObjectOU>OU=Workstations,OU=Computers,OU=Company,DC=contoso,DC=local</MachineObjectOU>
        </Identification>
    </component>
</settings>
```

## Post-Join Configuration

### Verify Domain Membership

After restart, verify the join was successful:

```powershell
# Check domain membership
(Get-WmiObject Win32_ComputerSystem).Domain

# Should return: contoso.local

# Check computer account in AD (from DC)
Get-ADComputer -Identity "WKS-RECEPTION-01"

# Test domain authentication
nltest /dsgetdc:contoso.local
```

### Log In with Domain Account

1. At login screen, click **Other user** (if not shown by default)
2. Enter: `CONTOSO\username` or `username@contoso.local`
3. Enter password

### Configure Local Administrators

Add domain users/groups to local Administrators:

```powershell
# Add domain group to local Administrators
Add-LocalGroupMember -Group "Administrators" -Member "CONTOSO\IT-Admins"

# Or via GPO (recommended):
# Computer Config > Policies > Windows Settings > Security Settings > Restricted Groups
```

### Move Computer to Correct OU

If not specified during join:

```powershell
# On domain controller
Move-ADObject -Identity "CN=WKS-RECEPTION-01,CN=Computers,DC=contoso,DC=local" `
    -TargetPath "OU=Workstations,OU=Computers,OU=Company,DC=contoso,DC=local"
```

Or via Active Directory Users and Computers GUI - drag and drop.

## Delegating Join Permissions

Allow specific users to join computers without Domain Admin rights:

### Pre-stage Computer Account Method

1. Create computer account in AD before joining
2. Right-click computer > **Properties** > **Security**
3. Add user/group and grant **Full Control**

```powershell
# Pre-create computer account with specific user as owner
New-ADComputer -Name "WKS-NEW-01" -Path "OU=Workstations,OU=Computers,OU=Company,DC=contoso,DC=local" -ManagedBy "HelpDesk-User"
```

### OU-Level Delegation

1. In ADUC, right-click target OU > **Delegate Control**
2. Add user/group
3. Select **Join a computer to the domain** (or create custom)
4. Complete wizard

```powershell
# Grant user rights to join computers to specific OU
$ou = "OU=Workstations,OU=Computers,OU=Company,DC=contoso,DC=local"
$user = "CONTOSO\HelpDesk-Team"

# Using dsacls
dsacls $ou /G "${user}:CCDC;computer"
dsacls $ou /G "${user}:WP;computer"
```

Note: Default domain limit is 10 computers per user. Increase via:
```powershell
Set-ADDomain -Identity "contoso.local" -Replace @{"ms-DS-MachineAccountQuota"="50"}
```

## Troubleshooting Join Issues

### "The specified domain either does not exist or could not be contacted"

**Causes and Solutions:**

1. **DNS not pointing to DC**
   ```powershell
   # Check DNS
   Get-DnsClientServerAddress
   # Fix if wrong
   Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 192.168.1.10
   ```

2. **Cannot resolve domain name**
   ```powershell
   nslookup contoso.local
   # If fails, check DC DNS service
   ```

3. **Firewall blocking traffic**
   - Ensure ports 53, 88, 135, 389, 445, 464 are open
   - Check Windows Firewall on workstation

### "Access is denied"

**Causes and Solutions:**

1. **Wrong credentials** - Verify username and password
2. **User doesn't have join rights** - Use Domain Admin or delegated user
3. **Computer account exists and is different** - Delete old account or use different name
4. **Reached machine account quota** - Increase quota or pre-stage account

### "The join operation was not successful"

Check detailed error:
```powershell
# View NetSetup log
Get-Content "C:\Windows\Debug\NetSetup.LOG" -Tail 50
```

Common issues in log:
- `NERR_UserExists` - Computer name already exists
- `ERROR_ACCESS_DENIED` - Permission issue
- `NERR_DCNotFound` - Can't find domain controller

### "The trust relationship between this workstation and the primary domain failed"

Computer account password out of sync:

**Option 1: Reset from workstation** (if you can log in locally)
```powershell
# Log in with local admin account
Reset-ComputerMachinePassword -Server "DC01" -Credential (Get-Credential CONTOSO\Administrator)
# Restart
```

**Option 2: Rejoin domain**
```powershell
# Remove from domain
Remove-Computer -UnjoinDomainCredential (Get-Credential) -Restart

# After restart, rejoin
Add-Computer -DomainName "contoso.local" -Credential (Get-Credential) -Restart
```

**Option 3: Reset from DC**
```powershell
# On domain controller
Reset-ComputerMachineAccount -Identity "WKS-PROBLEM"
# Restart affected workstation
```

### Firewall Ports Required

Ensure these ports are open between workstation and DC:

| Port | Protocol | Service |
|------|----------|---------|
| 53 | TCP/UDP | DNS |
| 88 | TCP/UDP | Kerberos |
| 135 | TCP | RPC Endpoint Mapper |
| 389 | TCP/UDP | LDAP |
| 445 | TCP | SMB |
| 464 | TCP/UDP | Kerberos Password Change |
| 636 | TCP | LDAPS |
| 3268 | TCP | Global Catalog |
| 49152-65535 | TCP | RPC Dynamic Ports |

## Remove Computer from Domain

If you need to unjoin:

```powershell
# Leave domain and join workgroup
Remove-Computer -UnjoinDomainCredential (Get-Credential CONTOSO\Administrator) -WorkgroupName "WORKGROUP" -Restart

# Or via GUI
# System Properties > Change > Workgroup > Enter workgroup name
```

After unjoining, consider deleting the computer account from AD:
```powershell
# On domain controller
Remove-ADComputer -Identity "OLD-WORKSTATION" -Confirm:$false
```

## Best Practices

1. **Name computers before joining** - Easier than renaming after
2. **Pre-stage computer accounts** - Better organization and control
3. **Use OUs for organization** - Don't leave computers in default CN=Computers
4. **Document naming convention** - WKS-LOCATION-### or similar
5. **Test with one machine first** - Before bulk deployment
6. **Keep DNS clean** - Remove stale records
7. **Use LAPS** - Manage local admin passwords
8. **Apply GPOs** - Security baselines immediately after join
