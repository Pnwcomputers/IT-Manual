# Common Active Directory Troubleshooting Guide

This guide covers diagnosing and resolving common issues in Windows Server 2025 Active Directory environments.

## Diagnostic Tools Overview

### Built-in Tools

| Tool | Purpose | Command |
|------|---------|---------|
| dcdiag | DC health diagnostics | `dcdiag /v` |
| repadmin | Replication diagnostics | `repadmin /showrepl` |
| nltest | Domain trust and DC location | `nltest /dsgetdc:domain` |
| nslookup | DNS troubleshooting | `nslookup domain.local` |
| gpresult | Group Policy results | `gpresult /r` |
| netdom | Domain membership | `netdom query fsmo` |

### PowerShell Modules

```powershell
# Import AD module
Import-Module ActiveDirectory

# Key cmdlets
Get-ADDomainController
Get-ADReplicationFailure
Test-ComputerSecureChannel
Get-ADUser / Get-ADComputer / Get-ADGroup
```

## Issue 1: User Cannot Log In

### Symptoms
- "The username or password is incorrect"
- "The trust relationship between this workstation and the primary domain failed"
- Account locked out messages

### Diagnostic Steps

```powershell
# 1. Check if account exists and is enabled
Get-ADUser -Identity "username" -Properties Enabled, LockedOut, PasswordExpired, PasswordLastSet

# 2. Check if account is locked
Search-ADAccount -LockedOut | Where-Object { $_.SamAccountName -eq "username" }

# 3. Check password expiration
Get-ADUser -Identity "username" -Properties PasswordLastSet, PasswordNeverExpires, msDS-UserPasswordExpiryTimeComputed | Select-Object Name, PasswordLastSet, @{N='ExpiryDate';E={[datetime]::FromFileTime($_.'msDS-UserPasswordExpiryTimeComputed')}}

# 4. Check group membership
Get-ADUser -Identity "username" -Properties MemberOf | Select-Object -ExpandProperty MemberOf

# 5. Check logon hours restrictions
Get-ADUser -Identity "username" -Properties LogonHours

# 6. Check "Log on to" workstation restrictions
Get-ADUser -Identity "username" -Properties LogonWorkstations
```

### Solutions

```powershell
# Unlock account
Unlock-ADAccount -Identity "username"

# Reset password
Set-ADAccountPassword -Identity "username" -Reset -NewPassword (ConvertTo-SecureString "TempP@ss123!" -AsPlainText -Force)
Set-ADUser -Identity "username" -ChangePasswordAtLogon $true

# Enable account
Enable-ADAccount -Identity "username"

# Clear logon workstation restrictions
Set-ADUser -Identity "username" -LogonWorkstations $null
```

## Issue 2: Trust Relationship Failed

### Symptoms
- "The trust relationship between this workstation and the primary domain failed"
- Cannot log in with domain account
- Local login works

### Diagnostic Steps

```powershell
# On the workstation (logged in as local admin)
Test-ComputerSecureChannel -Verbose

# Check domain membership
(Get-WmiObject Win32_ComputerSystem).Domain

# Check computer account on DC
Get-ADComputer -Identity "COMPUTER-NAME" -Properties PasswordLastSet, Enabled
```

### Solutions

**Option 1: Reset machine password (workstation)**
```powershell
# On workstation as local admin
Test-ComputerSecureChannel -Repair -Credential (Get-Credential CONTOSO\Administrator)
```

**Option 2: Reset computer account (DC)**
```powershell
# On domain controller
Reset-ComputerMachineAccount -Identity "COMPUTER-NAME"
# Then restart the workstation
```

**Option 3: Rejoin domain**
```powershell
# On workstation - remove from domain
Remove-Computer -UnjoinDomainCredential (Get-Credential CONTOSO\Administrator) -Restart

# After restart - rejoin
Add-Computer -DomainName "contoso.local" -Credential (Get-Credential CONTOSO\Administrator) -Restart
```

## Issue 3: DNS Resolution Problems

### Symptoms
- "The domain could not be contacted"
- Cannot find domain controller
- Intermittent connectivity issues

### Diagnostic Steps

```powershell
# Check DNS server settings
Get-DnsClientServerAddress

# Test domain resolution
Resolve-DnsName contoso.local
nslookup contoso.local

# Test SRV records
Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.contoso.local" -Type SRV
nslookup -type=srv _ldap._tcp.dc._msdcs.contoso.local

# Test DC locator
nltest /dsgetdc:contoso.local

# Check DNS service on DC
Get-Service DNS

# View DNS zones
Get-DnsServerZone
```

### Solutions

```powershell
# Set correct DNS server (should be your DC)
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 192.168.1.10

# Flush DNS cache
Clear-DnsClientCache
ipconfig /flushdns

# Re-register DNS records (on DC)
ipconfig /registerdns
dcdiag /fix

# Restart DNS service
Restart-Service DNS

# Restart Netlogon (re-registers SRV records)
Restart-Service Netlogon
```

## Issue 4: Replication Problems

### Symptoms
- Changes not appearing on other DCs
- dcdiag replication tests failing
- Users work on one DC but not another

### Diagnostic Steps

```powershell
# Check replication status
repadmin /replsummary

# Detailed replication info
repadmin /showrepl

# Check for replication failures
Get-ADReplicationFailure -Target contoso.local

# Check replication queue
repadmin /queue

# Check USN (Update Sequence Number)
repadmin /showutdvec DC01 "DC=contoso,DC=local"

# Run dcdiag replication tests
dcdiag /test:replications /v
dcdiag /test:topology /v
```

### Solutions

```powershell
# Force replication
repadmin /syncall /AdeP

# Force replication from specific DC
repadmin /replicate DC02 DC01 "DC=contoso,DC=local"

# Check and fix replication topology
repadmin /kcc  # Knowledge Consistency Checker

# If RPC errors - check firewall
Test-NetConnection -ComputerName DC02 -Port 135
Test-NetConnection -ComputerName DC02 -Port 389
Test-NetConnection -ComputerName DC02 -Port 445

# Check time sync (replication fails if time is >5 min off)
w32tm /query /status
w32tm /resync /force
```

## Issue 5: Group Policy Not Applying

### Symptoms
- Settings not appearing on workstations
- GPO changes not taking effect
- Some users/computers affected, others not

### Diagnostic Steps

```powershell
# Check applied GPOs
gpresult /r

# Detailed report
gpresult /h C:\gpreport.html

# Check specific GPO
Get-GPO -Name "Policy Name"

# Check GPO link
Get-GPInheritance -Target "OU=Computers,OU=Company,DC=contoso,DC=local"

# Check SYSVOL access
Test-Path \\contoso.local\SYSVOL
dir \\contoso.local\SYSVOL\contoso.local\Policies

# Check RSoP
Get-GPResultantSetOfPolicy -Computer "COMPUTER-NAME" -ReportType HTML -Path "C:\rsop.html"
```

### Solutions

```powershell
# Force GP update
gpupdate /force

# Target specific policy
gpupdate /force /target:computer
gpupdate /force /target:user

# Check security filtering
Get-GPPermission -Name "Policy Name" -All

# Verify Authenticated Users has Read permission
Set-GPPermission -Name "Policy Name" -TargetName "Authenticated Users" -TargetType Group -PermissionLevel GpoRead

# Check WMI filter
Get-GPO -Name "Policy Name" | Select-Object WmiFilter

# Check block inheritance
# GUI: Right-click OU > Block Inheritance should be unchecked
```

### Common GPO Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No GPOs applied | Wrong OU | Move object to correct OU |
| Some settings missing | Security filtering | Add Authenticated Users - Read |
| User settings not applying | Computer not processing user | Check loopback mode |
| Settings from wrong GPO | Precedence issue | Adjust link order |
| GPO denied | Block inheritance | Check parent OUs |

## Issue 6: SYSVOL/DFSR Issues

### Symptoms
- GPO inconsistent between DCs
- Login scripts not running
- SYSVOL share not accessible

### Diagnostic Steps

```powershell
# Check SYSVOL share
net share | findstr SYSVOL

# Compare SYSVOL on different DCs
dir \\DC01\SYSVOL\contoso.local\Policies
dir \\DC02\SYSVOL\contoso.local\Policies

# Check DFSR service
Get-Service DFSR

# Check DFSR replication
Get-DfsrState
dfsrdiag.exe pollad

# View DFSR backlog
dfsrdiag.exe backlog /rgname:"Domain System Volume" /rfname:"SYSVOL Share" /smem:DC01 /rmem:DC02

# DFSR event log
Get-WinEvent -LogName "DFS Replication" -MaxEvents 20
```

### Solutions

```powershell
# Restart DFSR
Restart-Service DFSR

# Force DFSR poll
dfsrdiag.exe pollad

# If SYSVOL not sharing
net share SYSVOL=C:\Windows\SYSVOL\sysvol /GRANT:"Authenticated Users",READ

# Authoritative restore of SYSVOL (last resort)
# On primary DC - set as authoritative
# HKLM\SYSTEM\CurrentControlSet\Services\DFSR\Parameters\SysVols\Migrating SysVols
# Set "Local State" to 1

# On other DCs - set as non-authoritative
# Set "Local State" to 0
```

## Issue 7: FSMO Role Issues

### Symptoms
- Cannot create users (RID Master issue)
- Time sync problems (PDC Emulator)
- Schema changes failing (Schema Master)

### Diagnostic Steps

```powershell
# Check FSMO role holders
netdom query fsmo

# Or via PowerShell
Get-ADDomain | Select-Object PDCEmulator, RIDMaster, InfrastructureMaster
Get-ADForest | Select-Object SchemaMaster, DomainNamingMaster

# Check if role holder is reachable
Test-Connection (Get-ADDomain).PDCEmulator
```

### Solutions

```powershell
# Transfer FSMO roles (if current holder is online)
Move-ADDirectoryServerOperationMasterRole -Identity DC02 -OperationMasterRole PDCEmulator, RIDMaster, InfrastructureMaster

# Seize FSMO roles (if current holder is permanently offline)
Move-ADDirectoryServerOperationMasterRole -Identity DC02 -OperationMasterRole PDCEmulator, RIDMaster, InfrastructureMaster -Force

# For Schema and Domain Naming Master
Move-ADDirectoryServerOperationMasterRole -Identity DC02 -OperationMasterRole SchemaMaster, DomainNamingMaster -Force
```

## Issue 8: Time Synchronization

### Symptoms
- Kerberos authentication failing
- "Clock skew too great" errors
- Replication failures

### Diagnostic Steps

```powershell
# Check time configuration
w32tm /query /status
w32tm /query /configuration

# Check time source
w32tm /query /source

# Test time sync
w32tm /stripchart /computer:time.windows.com

# Check time difference between DCs
$dcs = Get-ADDomainController -Filter *
foreach ($dc in $dcs) {
    $time = Invoke-Command -ComputerName $dc.HostName -ScriptBlock { Get-Date }
    Write-Host "$($dc.HostName): $time"
}
```

### Solutions

```powershell
# On PDC Emulator - sync to external source
w32tm /config /manualpeerlist:"time.windows.com" /syncfromflags:manual /reliable:yes /update
Restart-Service w32time
w32tm /resync /force

# On other DCs - sync to domain hierarchy (automatic)
w32tm /config /syncfromflags:domhier /update
Restart-Service w32time
w32tm /resync /force

# On member computers - sync to DC (automatic if domain-joined)
w32tm /resync /force
```

## Issue 9: LDAP/LDAPS Issues

### Symptoms
- Applications cannot connect to AD
- LDAP queries timing out
- Certificate errors with LDAPS

### Diagnostic Steps

```powershell
# Test LDAP port
Test-NetConnection -ComputerName DC01 -Port 389

# Test LDAPS port
Test-NetConnection -ComputerName DC01 -Port 636

# Test LDAP query
Get-ADUser -Filter * -Server DC01:389 -ResultSetSize 1

# Check LDAP signing requirements
Get-ItemProperty "HKLM:\System\CurrentControlSet\Services\NTDS\Parameters" -Name "LDAPServerIntegrity"

# Check certificate for LDAPS
$cert = Get-ChildItem Cert:\LocalMachine\My | Where-Object { $_.EnhancedKeyUsageList -match "Server Authentication" }
$cert | Format-List Subject, NotAfter, Thumbprint
```

### Solutions

```powershell
# Check firewall rules
Get-NetFirewallRule -DisplayName "*LDAP*"

# Enable LDAP over firewall
New-NetFirewallRule -DisplayName "LDAP Inbound" -Direction Inbound -Protocol TCP -LocalPort 389 -Action Allow
New-NetFirewallRule -DisplayName "LDAPS Inbound" -Direction Inbound -Protocol TCP -LocalPort 636 -Action Allow

# For LDAPS - ensure certificate is valid and bound
# Check AD DS certificate binding in certlm.msc > Personal > Certificates
```

## Issue 10: Slow Logon

### Symptoms
- "Applying user settings" takes long time
- Desktop appears slowly
- GPO processing delays

### Diagnostic Steps

```powershell
# Check logon time
# Look at User Profile Service events
Get-WinEvent -LogName "Application" -MaxEvents 20 | Where-Object { $_.ProviderName -eq "Microsoft-Windows-User Profiles Service" }

# Check GP processing time
# Look at Group Policy Operational log
Get-WinEvent -LogName "Microsoft-Windows-GroupPolicy/Operational" -MaxEvents 50

# Check startup scripts execution time
# Review scripts in GPO

# Network issues
Test-Connection DC01
Test-NetConnection DC01 -Port 445  # SMB for SYSVOL
```

### Solutions

- Reduce number of GPOs
- Optimize logon scripts
- Use GPO preferences instead of scripts where possible
- Enable fast logon optimization
- Check for slow network links
- Review drive mapping (async if possible)
- Use folder redirection instead of roaming profiles

## Comprehensive Health Check Script

```powershell
# AD-HealthCheck.ps1
Write-Host "=== AD Health Check ===" -ForegroundColor Green

# DC Status
Write-Host "`n--- Domain Controllers ---" -ForegroundColor Yellow
$dcs = Get-ADDomainController -Filter *
foreach ($dc in $dcs) {
    $ping = Test-Connection $dc.HostName -Count 1 -Quiet
    $status = if ($ping) { "Online" } else { "OFFLINE" }
    Write-Host "$($dc.HostName): $status"
}

# Replication
Write-Host "`n--- Replication Status ---" -ForegroundColor Yellow
$replFailures = Get-ADReplicationFailure -Target $env:USERDNSDOMAIN
if ($replFailures) {
    Write-Host "Replication failures detected:" -ForegroundColor Red
    $replFailures | Format-Table Server, FailureCount, FirstFailureTime -AutoSize
} else {
    Write-Host "No replication failures"
}

# FSMO Roles
Write-Host "`n--- FSMO Roles ---" -ForegroundColor Yellow
$domain = Get-ADDomain
$forest = Get-ADForest
Write-Host "PDC Emulator: $($domain.PDCEmulator)"
Write-Host "RID Master: $($domain.RIDMaster)"
Write-Host "Infrastructure Master: $($domain.InfrastructureMaster)"
Write-Host "Schema Master: $($forest.SchemaMaster)"
Write-Host "Domain Naming Master: $($forest.DomainNamingMaster)"

# DNS
Write-Host "`n--- DNS Check ---" -ForegroundColor Yellow
$srvRecords = Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.$($env:USERDNSDOMAIN)" -Type SRV -ErrorAction SilentlyContinue
if ($srvRecords) {
    Write-Host "SRV records found: $($srvRecords.Count)"
} else {
    Write-Host "WARNING: No SRV records found!" -ForegroundColor Red
}

# SYSVOL
Write-Host "`n--- SYSVOL Check ---" -ForegroundColor Yellow
$sysvolPath = "\\$env:USERDNSDOMAIN\SYSVOL"
if (Test-Path $sysvolPath) {
    Write-Host "SYSVOL accessible"
} else {
    Write-Host "WARNING: SYSVOL not accessible!" -ForegroundColor Red
}

# Locked accounts
Write-Host "`n--- Locked Accounts ---" -ForegroundColor Yellow
$locked = Search-ADAccount -LockedOut
if ($locked) {
    Write-Host "Locked accounts: $($locked.Count)" -ForegroundColor Yellow
    $locked | Select-Object Name, SamAccountName | Format-Table
} else {
    Write-Host "No locked accounts"
}

# DCDiag summary
Write-Host "`n--- DCDiag Summary ---" -ForegroundColor Yellow
Write-Host "Running dcdiag... (this may take a minute)"
$dcdiag = dcdiag /q
if ($dcdiag) {
    Write-Host "DCDiag issues found:" -ForegroundColor Red
    $dcdiag
} else {
    Write-Host "All DCDiag tests passed"
}

Write-Host "`n=== Health Check Complete ===" -ForegroundColor Green
```

## Quick Reference Commands

```powershell
# User issues
Get-ADUser username -Properties *              # Full user details
Unlock-ADAccount username                       # Unlock
Search-ADAccount -LockedOut                     # Find locked accounts
Search-ADAccount -PasswordExpired               # Find expired passwords

# Computer issues  
Test-ComputerSecureChannel -Repair             # Fix trust relationship
Reset-ComputerMachineAccount -Identity PC      # Reset computer account

# DC health
dcdiag /v                                       # Full diagnostics
dcdiag /test:DNS /v                            # DNS diagnostics
repadmin /replsummary                          # Replication summary
repadmin /showrepl                             # Detailed replication

# DNS
nslookup domain.local                          # Basic DNS test
Resolve-DnsName _ldap._tcp.dc._msdcs.domain.local -Type SRV  # SRV records
Clear-DnsClientCache                           # Flush DNS

# GPO
gpresult /r                                    # Applied GPOs
gpupdate /force                                # Force GP refresh

# Time
w32tm /query /status                           # Time sync status
w32tm /resync /force                           # Force time sync
```
