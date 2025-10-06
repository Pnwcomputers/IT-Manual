# Windows File & Print Sharing

[Setting Network Location (Private/Public) - Windows 10/11](./Setting-Network-Location-Private-Public-Windows-10-11.md)

Here is a detailed guide for troubleshooting Windows file and print sharing issues:

---

## 1. Check Network Connectivity

Ensure all devices are connected to the same network:
- Verify Wi-Fi or Ethernet connections on all involved devices

---

## 2. Enable File and Printer Sharing

- Go to **Control Panel** > **Network and Sharing Center**
- Click on **Change advanced sharing settings**
- Ensure **Turn on file and printer sharing** is selected

---

## 3. Ensure Network Discovery is Enabled

- Go to **Control Panel** > **Network and Sharing Center**
- Click on **Change advanced sharing settings**
- Ensure **Turn on network discovery** is selected

---

## 4. Check Sharing Settings for Folders or Printers

- Right-click on the folder or printer you want to share and select **Properties**
- Go to the **Sharing** tab and click **Share**
- Ensure the correct user or **Everyone** is added and permissions are set appropriately

---

## 5. Verify Firewall Settings

Ensure that file and printer sharing is allowed through the firewall:
- Go to **Control Panel** > **Windows Defender Firewall** > **Allow an app or feature through Windows Defender Firewall**
- Make sure **File and Printer Sharing** is checked for both private and public networks

---

## 6. Check Workgroup Settings

Ensure all computers are in the same workgroup:
- Go to **Control Panel** > **System**
- Under **Computer name, domain, and workgroup settings**, click **Change settings**
- Click **Change** and ensure the **Workgroup** is the same on all computers

---

## 7. Ensure Proper Permissions

- Go to the shared folder or printer's **Properties**
- Click on the **Security** tab and ensure the appropriate permissions are set for users

---

## 8. Use IP Address Instead of Computer Name

Instead of using the computer name to access shared resources, use the IP address (e.g., `\\192.168.1.10\SharedFolder`)

---

## 9. Restart the Print Spooler Service

- Press `Windows + R`, type `services.msc`, and press Enter
- Find **Print Spooler**, right-click it, and select **Restart**

---

## 10. Ensure Sharing Protocols are Enabled

- Press `Windows + R`, type `appwiz.cpl`, and press Enter
- Click on **Turn Windows features on or off**
- Ensure that **SMB 1.0/CIFS File Sharing Support** is checked (especially for older devices)

---

## 11. Check User Account Settings

Ensure the user accounts are properly configured:
- Go to **Control Panel** > **User Accounts**
- Ensure the user accounts exist and have the necessary permissions

---

## 12. Check Printer Drivers

Ensure that the correct printer drivers are installed:
- Go to **Control Panel** > **Devices and Printers**
- Right-click the printer and select **Properties** > **Advanced** to verify driver settings

---

## 13. Map Network Drive

Map the shared folder as a network drive:
- Right-click **This PC** or **Computer** and select **Map network drive**
- Follow the prompts to map the shared folder

---

## 14. Check for Windows Updates

Ensure all devices have the latest Windows updates installed:
- Go to **Settings** > **Update & Security** > **Windows Update**
- Check for and install any available updates

---

## 15. Check for Third-Party Software Conflicts

Disable or configure third-party antivirus or firewall software to ensure they are not blocking file and printer sharing.

---

## 16. Use the Network Troubleshooter

- Go to **Settings** > **Update & Security** > **Troubleshoot**
- Run the **Network Adapter** and **Incoming Connections** troubleshooters

---

## 17. Check Group Policy Settings (for Advanced Users)

Ensure group policies are not restricting file and printer sharing:
- Press `Windows + R`, type `gpedit.msc`, and press Enter
- Navigate to **Computer Configuration** > **Administrative Templates** > **Network** > **Lanman Workstation**
- Ensure settings are properly configured to allow sharing

---

## 18. Restart Devices

Restart all devices to ensure all settings take effect.

If these steps do not resolve the issue, you may need to consult with a network professional or seek further assistance from Microsoft Support.

---

# Windows 11 Product Key Retrieval

## via PowerShell

### Method

1. Open **PowerShell** as an administrator
2. Enter the command:
   ```powershell
   wmic path softwarelicensingservice get OA3xOriginalProductKey
   ```
3. Press Enter
4. The product key will be displayed in the format:
   `XXXXX-XXXXX-XXXXX-XXXXX-XXXXX`

---

# Windows 10/11 Failing To Boot

Here's a comprehensive guide for troubleshooting Windows 10 and 11 boot issues:

---

## 1. Check Hardware Connections

Ensure all cables are securely connected and there are no loose connections.

---

## 2. Power Cycle the Computer

- Turn off the computer
- Disconnect all external devices (USB drives, printers, etc.)
- Press and hold the power button for 10-15 seconds
- Reconnect only essential peripherals and turn the computer back on

---

## 3. Access Safe Mode

If Windows fails to boot, try accessing Safe Mode:
- Turn on the computer and press `F8` (or `Shift + F8`) before the Windows logo appears
- If this doesn't work, turn the computer on and off three times to trigger the Automatic Repair environment
- Navigate to **Troubleshoot** > **Advanced options** > **Startup Settings** > **Restart**
- Select **4) Enable Safe Mode**

---

## 4. Use Startup Repair

- Boot from a Windows installation media (USB/DVD)
- Select **Repair your computer** > **Troubleshoot** > **Advanced options** > **Startup Repair**
- Follow the on-screen instructions

---

## 5. Check and Repair File System

- Boot from a Windows installation media
- Select **Repair your computer** > **Troubleshoot** > **Advanced options** > **Command Prompt**
- In the Command Prompt, type `chkdsk /f /r C:` and press Enter (replace C: with the appropriate drive letter if necessary)

---

## 6. Use System Restore

- Boot from a Windows installation media
- Select **Repair your computer** > **Troubleshoot** > **Advanced options** > **System Restore**
- Follow the on-screen instructions to restore the system to a previous working state

---

## 7. Rebuild BCD (Boot Configuration Data)

- Boot from a Windows installation media
- Select **Repair your computer** > **Troubleshoot** > **Advanced options** > **Command Prompt**
- In the Command Prompt, type the following commands one by one and press Enter after each:

```cmd
bootrec /fixmbr
bootrec /fixboot
bootrec /scanos
bootrec /rebuildbcd
```

---

## 8. Disable Automatic Restart on System Failure

- Boot from a Windows installation media
- Select **Repair your computer** > **Troubleshoot** > **Advanced options** > **Startup Settings**
- Press `F9` to disable automatic restart on system failure and see if an error message appears

---

## 9. Check for Corrupt System Files

- Boot from a Windows installation media
- Select **Repair your computer** > **Troubleshoot** > **Advanced options** > **Command Prompt**
- In the Command Prompt, type `sfc /scannow` and press Enter

---

## 10. Check Disk Space

Ensure the system drive has enough free space:
- Boot into Safe Mode or use a Windows installation media to access the Command Prompt
- Check the available disk space with diskpart:

```cmd
diskpart
list volume
exit
```

---

## 11. Update or Roll Back Drivers

Boot into Safe Mode and update or roll back drivers:
- Go to **Device Manager** and update or roll back any recently installed or updated drivers

---

## 12. Reset BIOS/UEFI to Default Settings

- Enter BIOS/UEFI settings (usually by pressing `F2`, `Del`, or `Esc` during boot)
- Find the option to reset to default settings

---

## 13. Check for BIOS/UEFI Updates

Visit the manufacturer's website to check for BIOS/UEFI updates and follow the instructions to update if necessary.

---

## 14. Perform a Clean Installation

As a last resort, perform a clean installation of Windows:
- Backup important data using another computer or a bootable Linux live USB
- Boot from Windows installation media and follow the instructions to install a fresh copy of Windows

If these steps do not resolve the issue, you may need to consult with a professional technician for further assistance.

---

# Websites (Diagnostics Assistance)

## Device Related

- [Microsoft Answers Support](https://answers.microsoft.com/)
- [Microsoft Surface Diagnostic Toolkit (MS App Store)](https://apps.microsoft.com/)
- [Apple Self-Service & Repair](https://support.apple.com/self-service-repair)
- [Apple Support](https://support.apple.com/)
- [iFixit Answers](https://www.ifixit.com/Answers)
- [Tom's Hardware Forums](https://forums.tomshardware.com/)
- [Tech Support Forum](https://www.techsupportforum.com/forums/)
- [PC Repair Forum](https://pcrepairforum.com/)
- [BadCaps Forum - Electronics Repair](https://www.badcaps.net/forum/)

---

## Networks, Email, Domains, DNS, IP Lookup, etc.

- [ping.canbeuseful.com](https://www.ping.canbeuseful.com) - Looping Ping Test
- [trt-netztest.at](https://trt-netztest.at) - Internet Loop Test
- [packetstats.com](https://packetstats.com) - Internet Reliability Testing
- [whatismyipaddress.com](https://whatismyipaddress.com) - Public IP Address Lookup
- [whois.domaintools.com](https://whois.domaintools.com) - Who IS & Other Domain Reverse Engineering
- [dnschecker.org/domain-ip-lookup](https://dnschecker.org/domain-ip-lookup) - Reverse IP Lookup from Domains
- [mxtoolbox.com/DnsLookup.aspx](https://mxtoolbox.com/DnsLookup.aspx) - DNS Lookup/Traceroute

---

## Blacklist Email Checking

- [mxtoolbox.com/blacklists.aspx](https://mxtoolbox.com/blacklists.aspx)
- [whatismyipaddress.com/blacklist-check](https://whatismyipaddress.com/blacklist-check)
