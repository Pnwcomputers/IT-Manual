# Backup and Recovery for Workgroup Servers

This guide covers backup strategies and disaster recovery for Windows Server 2025 in a workgroup environment.

## Part 1: Windows Server Backup

### Install Windows Server Backup

```powershell
# Install backup feature
Install-WindowsFeature Windows-Server-Backup -IncludeManagementTools

# Verify installation
Get-WindowsFeature Windows-Server-Backup

# Open backup console
wbadmin.msc
```

### Configure Backup Destination

#### Option 1: Dedicated Backup Disk

Best for reliable local backups:

```powershell
# List disks
Get-Disk

# Identify backup disk (e.g., Disk 1)
# Warning: This will format the disk
wbadmin enable backup -addtarget:E: -include:C:,D: -schedule:02:00
```

#### Option 2: Network Share

```powershell
# Create credentials for backup
$cred = Get-Credential

# Backup to network share
wbadmin start backup -backuptarget:\\NAS\Backups\SERVER01 -include:C:,D: -user:NAS\backupuser -password:BackupP@ss
```

#### Option 3: External USB Drive

```powershell
# Identify USB drive letter
Get-Volume

# Backup to USB (manual)
wbadmin start backup -backuptarget:F: -include:C:,D: -allcritical
```

### Configure Scheduled Backup

#### Using GUI

1. Open Windows Server Backup (`wbadmin.msc`)
2. Click "Backup Schedule" in Actions pane
3. Select "Full server" or "Custom"
4. Choose backup destination
5. Set schedule (daily recommended)
6. Complete wizard

#### Using PowerShell

```powershell
# Create backup policy for daily backup
$policy = New-WBPolicy

# Add all critical volumes
$volumes = Get-WBVolume -AllVolumes
Add-WBVolume -Policy $policy -Volume $volumes

# Add system state
Add-WBSystemState -Policy $policy

# Add bare metal recovery capability
Add-WBBareMetalRecovery -Policy $policy

# Set backup target (local disk)
$target = New-WBBackupTarget -VolumePath "E:"
Add-WBBackupTarget -Policy $policy -Target $target

# Or network share
$target = New-WBBackupTarget -NetworkPath "\\NAS\Backups\SERVER01" -Credential (Get-Credential)
Add-WBBackupTarget -Policy $policy -Target $target

# Set schedule
Set-WBSchedule -Policy $policy -Schedule 02:00

# Apply policy
Set-WBPolicy -Policy $policy

# Verify
Get-WBPolicy
```

### Manual Backup

```powershell
# One-time full backup to local disk
wbadmin start backup -backuptarget:E: -include:C:,D: -allcritical -quiet

# Backup to network share
wbadmin start backup -backuptarget:\\NAS\Backups -include:C:,D: -user:backupuser -password:P@ss -quiet

# Backup specific folders only
wbadmin start backup -backuptarget:E: -include:D:\Shares,D:\Data -quiet

# Backup system state only
wbadmin start systemstatebackup -backuptarget:E: -quiet
```

### View Backup History

```powershell
# List backup versions
wbadmin get versions

# Get detailed backup info
wbadmin get versions -backuptarget:E:

# Get items in specific backup
wbadmin get items -version:MM/DD/YYYY-HH:MM -backuptarget:E:

# Using PowerShell
Get-WBBackupSet
```

## Part 2: Backup Individual Components

### Backup File Shares

```powershell
# Simple robocopy backup
robocopy "D:\Shares" "E:\Backups\Shares" /MIR /R:3 /W:5 /LOG:"C:\Logs\ShareBackup.log"

# With timestamp
$date = Get-Date -Format "yyyy-MM-dd"
robocopy "D:\Shares" "E:\Backups\Shares-$date" /MIR /R:3 /W:5 /LOG:"C:\Logs\ShareBackup-$date.log"

# Robocopy options:
# /MIR = Mirror (delete files at destination not in source)
# /R:3 = Retry 3 times
# /W:5 = Wait 5 seconds between retries
# /LOG = Log file
# /XD = Exclude directories
# /XF = Exclude files
```

### Backup DHCP Configuration

```powershell
# Export DHCP configuration
Export-DhcpServer -File "C:\Backup\DHCP\dhcp-config.xml" -Leases

# Or using netsh
netsh dhcp server export "C:\Backup\DHCP\dhcp-backup.txt" all

# Create backup script
$backupPath = "C:\Backup\DHCP\$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -Path $backupPath -ItemType Directory -Force
Export-DhcpServer -File "$backupPath\dhcp-config.xml" -Leases
```

### Backup DNS Configuration

```powershell
# Export DNS zones (for non-AD zones)
$zones = Get-DnsServerZone | Where-Object { $_.ZoneType -eq "Primary" }
foreach ($zone in $zones) {
    Export-DnsServerZone -Name $zone.ZoneName -FileName "$($zone.ZoneName).dns"
}

# Copy zone files
Copy-Item "C:\Windows\System32\dns\*.dns" "C:\Backup\DNS\" -Force
```

### Backup IIS Configuration

```powershell
# Backup IIS configuration
$backupName = "IIS-$(Get-Date -Format 'yyyy-MM-dd')"
Backup-WebConfiguration -Name $backupName

# Backup location: C:\Windows\System32\inetsrv\backup\

# List backups
Get-WebConfigurationBackup

# Backup website content
robocopy "C:\inetpub\wwwroot" "C:\Backup\IIS\wwwroot" /MIR
```

### Backup Hyper-V VMs

```powershell
# Export VM (includes configuration and VHDs)
Export-VM -Name "VMName" -Path "E:\Backup\VMs"

# Export all VMs
Get-VM | Export-VM -Path "E:\Backup\VMs"

# Create VM checkpoint (snapshot)
Checkpoint-VM -Name "VMName" -SnapshotName "Pre-Update-$(Get-Date -Format 'yyyy-MM-dd')"
```

## Part 3: Automated Backup Script

Create comprehensive backup script:

```powershell
# Save as C:\Scripts\FullBackup.ps1

$backupRoot = "E:\Backups"
$date = Get-Date -Format "yyyy-MM-dd"
$logFile = "C:\Logs\Backup-$date.log"

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Tee-Object -FilePath $logFile -Append
}

Write-Log "=== Starting Full Backup ==="

# Create backup directories
$folders = @("Shares", "DHCP", "DNS", "SystemState")
foreach ($folder in $folders) {
    New-Item -Path "$backupRoot\$date\$folder" -ItemType Directory -Force | Out-Null
}

# Backup File Shares
Write-Log "Backing up file shares..."
$robocopyResult = robocopy "D:\Shares" "$backupRoot\$date\Shares" /MIR /R:3 /W:5 /NP /LOG+:"$logFile"
Write-Log "File shares backup completed"

# Backup DHCP
Write-Log "Backing up DHCP..."
try {
    Export-DhcpServer -File "$backupRoot\$date\DHCP\dhcp-config.xml" -Leases -ErrorAction Stop
    Write-Log "DHCP backup completed"
}
catch {
    Write-Log "DHCP backup failed: $_"
}

# Backup DNS
Write-Log "Backing up DNS..."
try {
    Copy-Item "C:\Windows\System32\dns\*.dns" "$backupRoot\$date\DNS\" -Force -ErrorAction Stop
    Write-Log "DNS backup completed"
}
catch {
    Write-Log "DNS backup failed: $_"
}

# Backup System State
Write-Log "Backing up system state..."
$wbadminResult = wbadmin start systemstatebackup -backuptarget:"$backupRoot\$date\SystemState" -quiet
Write-Log "System state backup completed"

# Cleanup old backups (keep 30 days)
Write-Log "Cleaning up old backups..."
$cutoffDate = (Get-Date).AddDays(-30)
Get-ChildItem -Path $backupRoot -Directory | Where-Object { 
    try { [datetime]::ParseExact($_.Name, "yyyy-MM-dd", $null) -lt $cutoffDate } catch { $false }
} | ForEach-Object {
    Write-Log "Removing old backup: $($_.Name)"
    Remove-Item $_.FullName -Recurse -Force
}

Write-Log "=== Backup Complete ==="

# Send email notification (optional)
# $body = Get-Content $logFile -Raw
# Send-MailMessage -To "admin@company.com" -From "server@company.com" -Subject "Backup Report - $date" -Body $body -SmtpServer "mail.company.com"
```

Schedule the script:

```powershell
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File C:\Scripts\FullBackup.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
$settings = New-ScheduledTaskSettingsSet -WakeToRun
Register-ScheduledTask -TaskName "Daily Full Backup" -Action $action -Trigger $trigger -Settings $settings -User "SYSTEM"
```

## Part 4: Disaster Recovery

### Recovery Scenarios

#### Scenario 1: Recover Individual Files

From Windows Server Backup:

```powershell
# List backup versions
wbadmin get versions -backuptarget:E:

# Start recovery wizard
wbadmin start recovery -version:MM/DD/YYYY-HH:MM -itemtype:File -items:D:\Shares\Finance\report.xlsx -recoverytarget:D:\Recovered\ -backuptarget:E:
```

Via GUI:
1. Open Windows Server Backup
2. Click "Recover" in Actions
3. Select backup location
4. Select backup date
5. Select "Files and folders"
6. Browse to file/folder
7. Choose recovery destination

#### Scenario 2: Recover Entire Volume

```powershell
# Recover volume
wbadmin start recovery -version:MM/DD/YYYY-HH:MM -itemtype:Volume -items:D: -recoverytarget:D: -backuptarget:E:
```

#### Scenario 3: Full System Recovery (Bare Metal)

If server completely fails:

1. Boot from Windows Server installation media
2. Select "Repair your computer"
3. Select "Troubleshoot" > "System Image Recovery"
4. Select the backup to restore
5. Follow wizard to complete recovery

Or from command line in recovery environment:

```cmd
wbadmin get versions -backuptarget:E:
wbadmin start sysrecovery -version:MM/DD/YYYY-HH:MM -backuptarget:E: -machine:SERVER01
```

#### Scenario 4: Restore DHCP

```powershell
# Restore DHCP configuration
Import-DhcpServer -File "C:\Backup\DHCP\dhcp-config.xml" -BackupPath "C:\Backup\DHCP\Restore" -Leases

# Or using netsh
netsh dhcp server import "C:\Backup\DHCP\dhcp-backup.txt" all
```

#### Scenario 5: Restore DNS

```powershell
# Stop DNS service
Stop-Service DNS

# Copy zone files back
Copy-Item "C:\Backup\DNS\*.dns" "C:\Windows\System32\dns\" -Force

# Start DNS service
Start-Service DNS

# Verify
Get-DnsServerZone
```

## Part 5: Shadow Copies (Previous Versions)

Enable quick file recovery for users:

### Enable Shadow Copies

```powershell
# Enable shadow copies on D: drive
vssadmin add shadowstorage /for=D: /on=D: /maxsize=10%

# Create initial shadow copy
vssadmin create shadow /for=D:

# View shadow copies
vssadmin list shadows

# View storage usage
vssadmin list shadowstorage
```

### Schedule Shadow Copies

```powershell
# Create scheduled task for shadow copies
$action = New-ScheduledTaskAction -Execute "vssadmin.exe" -Argument "create shadow /for=D:"

# Morning snapshot
$trigger1 = New-ScheduledTaskTrigger -Daily -At 7am

# Noon snapshot
$trigger2 = New-ScheduledTaskTrigger -Daily -At 12pm

# Afternoon snapshot
$trigger3 = New-ScheduledTaskTrigger -Daily -At 5pm

Register-ScheduledTask -TaskName "Shadow Copy D Drive" -Action $action -Trigger $trigger1,$trigger2,$trigger3 -User "SYSTEM"
```

### Recover from Shadow Copy

Users can self-recover:
1. Right-click file or folder
2. Select "Properties"
3. Click "Previous Versions" tab
4. Select version and click "Restore"

Administrators can recover via command line:

```powershell
# List shadow copies
vssadmin list shadows /for=D:

# Access shadow copy
mklink /d C:\ShadowAccess \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\

# Copy files from shadow copy
Copy-Item "C:\ShadowAccess\Shares\file.txt" "D:\Recovered\"

# Remove link when done
rmdir C:\ShadowAccess
```

## Part 6: Backup to Cloud (Optional)

### Azure Backup (Microsoft Azure)

```powershell
# Install Azure Backup agent
# Download from Azure portal

# Register server with Azure Backup vault
Start-OBRegistration -VaultCredentials "C:\Downloads\VaultCredentials.publishsettings"

# Configure backup
$policy = New-OBPolicy
$schedule = New-OBSchedule -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday -TimesOfDay 22:00
Set-OBSchedule -Policy $policy -Schedule $schedule

$includes = New-OBFileSpec -FileSpec "D:\Shares"
Add-OBFileSpec -Policy $policy -FileSpec $includes

Set-OBRetentionPolicy -Policy $policy -RetentionDays 30
Set-OBPolicy -Policy $policy
```

### Sync to Cloud Storage (Rclone)

```powershell
# Download and install rclone from rclone.org
# Configure rclone with your cloud provider
rclone config

# Sync to cloud
rclone sync D:\Backups remote:ServerBackups --progress
```

## Part 7: Backup Best Practices

### 3-2-1 Rule

- **3** copies of data (primary + 2 backups)
- **2** different storage types (local disk + network/cloud)
- **1** offsite backup (cloud or remote location)

### Backup Schedule Example

| Type | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| File sync | Hourly | 24 hours | Network share |
| Shadow copy | 3x daily | 7 days | Local disk |
| Full backup | Daily | 30 days | Backup drive |
| System image | Weekly | 4 weeks | Network share |
| Offsite | Weekly | 90 days | Cloud/offsite |

### Test Your Backups!

Regularly test backup restoration:

```powershell
# Create test restore script
# Test file recovery
wbadmin start recovery -version:MM/DD/YYYY-HH:MM -itemtype:File -items:D:\Shares\TestFile.txt -recoverytarget:C:\TestRestore\ -backuptarget:E:

# Verify file
if (Test-Path "C:\TestRestore\TestFile.txt") {
    Write-Host "Backup test successful!"
    Remove-Item "C:\TestRestore" -Recurse -Force
} else {
    Write-Host "Backup test FAILED!" -ForegroundColor Red
}
```

## Part 8: Backup Checklist

### Daily
- [ ] Verify backup job completed
- [ ] Check backup logs for errors
- [ ] Verify backup size is reasonable

### Weekly
- [ ] Test restore of random files
- [ ] Verify offsite backup sync
- [ ] Review backup storage space

### Monthly
- [ ] Full restore test in isolated environment
- [ ] Review backup retention
- [ ] Update backup documentation

### Quarterly
- [ ] Bare metal recovery test
- [ ] Review and update backup strategy
- [ ] Verify all critical data is included

## Quick Reference

```powershell
# Windows Server Backup
wbadmin get versions                    # List backups
wbadmin start backup -backuptarget:E: -include:C:,D: -quiet  # Manual backup
wbadmin start recovery ...              # Restore files

# Shadow Copies
vssadmin list shadows                   # List shadow copies
vssadmin create shadow /for=D:          # Create shadow copy
vssadmin delete shadows /for=D: /oldest # Delete oldest

# Policy Management
Get-WBPolicy                            # View backup policy
Set-WBPolicy -Policy $policy            # Apply policy

# DHCP/DNS Backup
Export-DhcpServer -File "path.xml"      # Backup DHCP
Import-DhcpServer -File "path.xml"      # Restore DHCP
```
