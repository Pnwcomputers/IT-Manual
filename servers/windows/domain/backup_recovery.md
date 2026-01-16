# Active Directory Backup and Disaster Recovery

This guide covers backing up your Windows Server 2025 Active Directory environment and recovering from various failure scenarios.

## What Needs to Be Backed Up

### Critical AD Components

1. **System State** - Contains AD database, SYSVOL, registry, boot files
2. **AD Database** - `C:\Windows\NTDS\ntds.dit`
3. **SYSVOL** - Group Policy Objects and login scripts
4. **DNS Zones** - If AD-integrated
5. **Certificate Services** - If running a CA
6. **DHCP Database** - Lease and configuration data

### Backup Frequency Recommendations

| Component | Frequency | Retention |
|-----------|-----------|-----------|
| System State | Daily | 30 days minimum |
| Full Server | Weekly | 4 weeks |
| SYSVOL/GPO | After changes | Multiple versions |
| DHCP | Daily | 2 weeks |

## Part 1: Windows Server Backup

### Install Windows Server Backup

```powershell
# Install backup feature
Install-WindowsFeature Windows-Server-Backup -IncludeManagementTools

# Open backup console
wbadmin.msc
```

### Configure System State Backup (GUI)

1. Open **Windows Server Backup**
2. Click **Backup Schedule** in Actions pane
3. Select **Custom** configuration
4. Click **Add Items** > **System State**
5. Choose backup destination (network share recommended)
6. Set schedule (daily at minimum)
7. Complete wizard

### System State Backup via PowerShell

```powershell
# One-time backup to local disk
wbadmin start systemstatebackup -backuptarget:E: -quiet

# One-time backup to network share
wbadmin start systemstatebackup -backuptarget:\\BACKUP-SERVER\Backups\DC01 -quiet

# Create scheduled backup policy
$policy = New-WBPolicy
$systemState = New-WBSystemState
Add-WBSystemState -Policy $policy
$target = New-WBBackupTarget -NetworkPath "\\BACKUP-SERVER\Backups\DC01" -Credential (Get-Credential)
Add-WBBackupTarget -Policy $policy -Target $target
Set-WBSchedule -Policy $policy -Schedule 02:00
Set-WBPolicy -Policy $policy

# View current backup policy
Get-WBPolicy

# View backup history
Get-WBBackupSet
wbadmin get versions
```

### Full Server Backup

For complete disaster recovery capability:

```powershell
# Create full server backup
wbadmin start backup -backuptarget:\\BACKUP-SERVER\Backups\DC01 -include:C: -allcritical -systemstate -quiet

# Using PowerShell cmdlets
$policy = New-WBPolicy
$volumes = Get-WBVolume -AllVolumes | Where-Object { $_.MountPoint -eq "C:" }
Add-WBVolume -Policy $policy -Volume $volumes
Add-WBSystemState -Policy $policy
Add-WBBareMetalRecovery -Policy $policy
$target = New-WBBackupTarget -NetworkPath "\\BACKUP-SERVER\Backups\DC01"
Add-WBBackupTarget -Policy $policy -Target $target
Start-WBBackup -Policy $policy
```

## Part 2: Backup Individual Components

### Backup Group Policy Objects

```powershell
# Backup all GPOs
$backupPath = "C:\GPOBackups\$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -Path $backupPath -ItemType Directory -Force

Get-GPO -All | ForEach-Object {
    $gpoBackup = Backup-GPO -Name $_.DisplayName -Path $backupPath
    Write-Host "Backed up: $($_.DisplayName)"
}

# Backup with comment
Backup-GPO -All -Path $backupPath -Comment "Weekly GPO Backup"

# Export GPO to XML report
Get-GPO -All | ForEach-Object {
    Get-GPOReport -Name $_.DisplayName -ReportType XML -Path "$backupPath\$($_.DisplayName).xml"
}
```

### Backup DHCP

```powershell
# Export DHCP configuration
Export-DhcpServer -File "C:\Backups\DHCP\dhcp-backup.xml" -Leases

# Or using netsh
netsh dhcp server export "C:\Backups\DHCP\dhcp-backup.txt" all

# Schedule daily DHCP backup
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-Command `"Export-DhcpServer -File 'C:\Backups\DHCP\dhcp-$(Get-Date -Format 'yyyyMMdd').xml' -Leases`""
$trigger = New-ScheduledTaskTrigger -Daily -At 1am
Register-ScheduledTask -TaskName "DHCP Backup" -Action $action -Trigger $trigger -User "SYSTEM"
```

### Backup DNS Zones (Non-AD Integrated)

```powershell
# Export DNS zones
$zones = Get-DnsServerZone | Where-Object { $_.ZoneType -eq "Primary" -and -not $_.IsAutoCreated }

foreach ($zone in $zones) {
    Export-DnsServerZone -Name $zone.ZoneName -FileName "$($zone.ZoneName).dns"
    Copy-Item "C:\Windows\System32\dns\$($zone.ZoneName).dns" "C:\Backups\DNS\"
}
```

### Backup AD Objects with LDIFDE

```powershell
# Export users
ldifde -f C:\Backups\AD\users.ldf -d "OU=Users,OU=Company,DC=contoso,DC=local" -r "(objectClass=user)"

# Export groups
ldifde -f C:\Backups\AD\groups.ldf -d "OU=Groups,OU=Company,DC=contoso,DC=local" -r "(objectClass=group)"

# Export computers
ldifde -f C:\Backups\AD\computers.ldf -d "OU=Computers,OU=Company,DC=contoso,DC=local" -r "(objectClass=computer)"

# Export OUs
ldifde -f C:\Backups\AD\ous.ldf -d "DC=contoso,DC=local" -r "(objectClass=organizationalUnit)"
```

## Part 3: AD Recycle Bin

Enable the AD Recycle Bin to easily recover deleted objects:

### Enable AD Recycle Bin

```powershell
# Check current status
Get-ADOptionalFeature -Filter "Name -eq 'Recycle Bin Feature'"

# Enable Recycle Bin (irreversible)
Enable-ADOptionalFeature -Identity "Recycle Bin Feature" -Scope ForestOrConfigurationSet -Target "contoso.local" -Confirm:$false

# Verify enabled
Get-ADOptionalFeature -Filter "Name -eq 'Recycle Bin Feature'" | Select-Object Name, EnabledScopes
```

### Recover Deleted Objects

```powershell
# View deleted objects
Get-ADObject -Filter {Deleted -eq $true} -IncludeDeletedObjects

# Find specific deleted user
Get-ADObject -Filter {Deleted -eq $true -and ObjectClass -eq "user" -and Name -like "*jsmith*"} -IncludeDeletedObjects

# Restore deleted user
Get-ADObject -Filter {Deleted -eq $true -and Name -like "*John Smith*"} -IncludeDeletedObjects | Restore-ADObject

# Restore to specific OU
Get-ADObject -Filter {Deleted -eq $true -and Name -like "*John Smith*"} -IncludeDeletedObjects | 
    Restore-ADObject -TargetPath "OU=Users,OU=Company,DC=contoso,DC=local"

# Restore deleted OU and contents
$deletedOU = Get-ADObject -Filter {Deleted -eq $true -and Name -like "*Sales*" -and ObjectClass -eq "organizationalUnit"} -IncludeDeletedObjects
Restore-ADObject -Identity $deletedOU -NewName "Sales"
```

## Part 4: Disaster Recovery Scenarios

### Scenario 1: Single DC Failure (Multi-DC Environment)

If one DC fails in a multi-DC environment:

1. **Verify replication partners are healthy**
   ```powershell
   repadmin /replsummary
   Get-ADReplicationFailure -Target contoso.local
   ```

2. **Seize FSMO roles if needed** (if failed DC held roles)
   ```powershell
   # Check FSMO role holders
   netdom query fsmo
   
   # Seize roles (only if original DC won't return)
   Move-ADDirectoryServerOperationMasterRole -Identity DC02 -OperationMasterRole PDCEmulator,RIDMaster,InfrastructureMaster,SchemaMaster,DomainNamingMaster -Force
   ```

3. **Clean up metadata** for failed DC
   ```powershell
   # Remove DC from AD (after confirming it won't return)
   # GUI: AD Sites and Services > delete server object
   # Or via ntdsutil
   ntdsutil
   metadata cleanup
   connections
   connect to server DC02
   quit
   select operation target
   list domains
   select domain 0
   list sites
   select site 0
   list servers in site
   select server X  # (failed DC number)
   quit
   remove selected server
   ```

4. **Remove DNS records** for failed DC
   ```powershell
   # Check and remove stale records
   Get-DnsServerResourceRecord -ZoneName "contoso.local" -Name "DC01-Failed" | Remove-DnsServerResourceRecord -ZoneName "contoso.local" -Force
   ```

### Scenario 2: Complete AD Restoration (Single DC)

If your only DC fails:

**Option A: Restore from System State Backup**

1. Boot from Windows Server installation media
2. Select **Repair your computer** > **Troubleshoot** > **System Image Recovery**
3. Or select **Command Prompt** and use:
   ```cmd
   wbadmin get versions -backuptarget:\\BACKUP-SERVER\Backups\DC01
   wbadmin start systemstaterecovery -version:MM/DD/YYYY-HH:MM -backuptarget:\\BACKUP-SERVER\Backups\DC01
   ```

**Option B: Directory Services Restore Mode (DSRM)**

1. Restart DC and press F8 during boot
2. Select **Directory Services Restore Mode**
3. Log in with DSRM password (set during AD promotion)
4. Restore system state:
   ```cmd
   wbadmin get versions -backuptarget:E:
   wbadmin start systemstaterecovery -version:MM/DD/YYYY-HH:MM -backuptarget:E:
   ```
5. Restart normally

### Scenario 3: Restore Specific AD Objects (Without Recycle Bin)

If Recycle Bin isn't enabled:

1. Boot DC into DSRM
2. Restore system state from backup
3. Mark objects for authoritative restore:
   ```cmd
   ntdsutil
   activate instance ntds
   authoritative restore
   restore object "CN=John Smith,OU=Users,OU=Company,DC=contoso,DC=local"
   # Or restore entire OU
   restore subtree "OU=Users,OU=Company,DC=contoso,DC=local"
   quit
   quit
   ```
4. Restart DC normally

### Scenario 4: Rebuild DC from Scratch

If no backup is available:

1. Install new Windows Server
2. Promote to DC in same domain (requires another working DC)
3. Wait for replication to complete
4. Transfer FSMO roles if needed

If no other DCs exist:
1. Install new Windows Server
2. Restore from system state backup, OR
3. Rebuild domain from scratch (last resort)

## Part 5: Monitoring AD Health

### Daily Health Checks

```powershell
# Check replication status
repadmin /replsummary

# Check DC health
dcdiag /v /c /e /f:C:\Logs\dcdiag.txt

# Check DNS
dcdiag /test:DNS /v /e

# Check SYSVOL replication
dcdiag /test:sysvolcheck /e

# Check FSMO roles
netdom query fsmo

# Check time sync
w32tm /query /status
```

### Automated Health Check Script

```powershell
# AD-HealthCheck.ps1
$report = @()

# DC Connectivity
$dcs = Get-ADDomainController -Filter *
foreach ($dc in $dcs) {
    $pingResult = Test-Connection $dc.HostName -Count 1 -Quiet
    $report += [PSCustomObject]@{
        Check = "DC Ping"
        Target = $dc.HostName
        Status = if ($pingResult) { "OK" } else { "FAILED" }
    }
}

# Replication
$replStatus = Get-ADReplicationPartnerMetadata -Target * -Partition *
$replFailures = $replStatus | Where-Object { $_.LastReplicationResult -ne 0 }
$report += [PSCustomObject]@{
    Check = "Replication"
    Target = "All DCs"
    Status = if ($replFailures.Count -eq 0) { "OK" } else { "FAILED - $($replFailures.Count) failures" }
}

# SYSVOL
$sysvolTest = Test-Path "\\$env:USERDNSDOMAIN\SYSVOL"
$report += [PSCustomObject]@{
    Check = "SYSVOL Access"
    Target = "Domain"
    Status = if ($sysvolTest) { "OK" } else { "FAILED" }
}

# Output report
$report | Format-Table -AutoSize

# Send email if failures
$failures = $report | Where-Object { $_.Status -ne "OK" }
if ($failures) {
    Send-MailMessage -To "admin@contoso.com" -From "monitoring@contoso.com" -Subject "AD Health Alert" -Body ($failures | Out-String) -SmtpServer "mail.contoso.local"
}
```

## Part 6: Second Domain Controller

For redundancy, always have at least two DCs:

### Add Second DC

```powershell
# On new server, install AD DS role
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools

# Promote to additional DC
Install-ADDSDomainController `
    -DomainName "contoso.local" `
    -InstallDns:$true `
    -Credential (Get-Credential CONTOSO\Administrator) `
    -SafeModeAdministratorPassword (ConvertTo-SecureString "DSRMPassword!" -AsPlainText -Force) `
    -SiteName "Default-First-Site-Name" `
    -ReplicationSourceDC "DC01.contoso.local" `
    -Force:$true
```

### Verify Replication

```powershell
# Force replication
repadmin /syncall /AdeP

# Check replication status
repadmin /showrepl

# Check queue
repadmin /queue
```

## Best Practices Summary

1. **Enable AD Recycle Bin** immediately after creating your domain
2. **Backup System State daily** to network storage
3. **Test restores** quarterly in a lab environment
4. **Document DSRM password** and store securely
5. **Have at least two DCs** for redundancy
6. **Monitor replication** and DC health daily
7. **Keep multiple backup versions** (at least 30 days)
8. **Backup before major changes** (schema updates, software installs)
9. **Store backups offsite** or in cloud storage
10. **Create runbooks** for common recovery scenarios
