#!/usr/bin/env python3
"""
Script to update internal markdown links to match new folder structure.
This will scan all .md files and update relative links to point to the correct folders.
"""

import os
import re
from pathlib import Path

# Define the mapping of file names to their new folder locations
FILE_TO_FOLDER = {
    # FAQ
    'General-FAQ.md': 'faq',
    'Reception-FAQ.md': 'faq',
    'Employee-Information.md': 'faq',
    
    # Procedures
    'General-Job-Procedures.md': 'procedures',
    'How-To-Procedures-FULL-LIST.md': 'procedures',
    'On-Site-Service-How-Its-Done.md': 'procedures',
    'In-Shop-Service-How-Its-Done.md': 'procedures',
    'Improvised-Diagnostics-OODA-Loop.md': 'procedures',
    
    # Diagnostics
    'General-Diagnostic-Procedures.md': 'diagnostics',
    'Hardware-Testing-Programs.md': 'diagnostics',
    'HWInfo-System-Log-Diagnostics.md': 'diagnostics',
    'Laptop-Faults-Diagnostics.md': 'diagnostics',
    'Electronics-Diagnostics-Multimeter-Testing.md': 'diagnostics',
    'Mac-Apple-System-Log-Diagnostics.md': 'diagnostics',
    
    # Hardware
    'Motherboard-Testing.md': 'hardware',
    'POST-Failure.md': 'hardware',
    'No-Power.md': 'hardware',
    'How-to-Test-Power-Supply-PSU.md': 'hardware',
    'HDD-SSD-Health-Checking.md': 'hardware',
    'Clone-Hard-Drive-Hardware-Software-Methods.md': 'hardware',
    'Motherboard-BIOS-UEFI-Reset.md': 'hardware',
    
    # Networking
    'Networking-101.md': 'networking',
    'Router-Modem-Access.md': 'networking',
    'Router-Setup.md': 'networking',
    'Modem-Installation-How-To.md': 'networking',
    'Network-Migration-Old-to-New.md': 'networking',
    'Local-Wifi-Network-Info-Logins.md': 'networking',
    
    # Windows
    'Windows-10-11-Failing-To-Boot.md': 'windows',
    'Windows-11-Product-Key-Retrieval.md': 'windows',
    'Windows-Update-Troubleshooting.md': 'windows',
    'Windows-File-Print-Sharing.md': 'windows',
    'Setting-Network-Location-Private-Public-Windows-10-11.md': 'windows',
    'Editing-Windows-Host-File.md': 'windows',
    
    # Mac
    'Mac-Computer-Start-up-Repairs.md': 'mac',
    'Mac-System-Clean-Up-MBAM-Free-Onyx.md': 'mac',
    'Data-Backup-Restore-Mac.md': 'mac',
    'Apple-ID-Login-Troubleshooting.md': 'mac',
    'Mac-MS-Office-Troubleshooting.md': 'mac',
    'Mac-Outlook-Troubleshooting.md': 'mac',
    
    # Software
    'Software-We-Install-Use.md': 'software',
    'Software-Download-Reinstall.md': 'software',
    'Software-to-Remove-if-Found.md': 'software',
    'MS-Office-MS-Account-Troubleshooting.md': 'software',
    'Microsoft-Outlook-Troubleshooting.md': 'software',
    'Find-MS-Office-Product-License-Key.md': 'software',
    
    # Security
    'Check-for-Malware-and-Adware.md': 'security',
    'Eliminate-Start-up-Programs.md': 'security',
    'Clean-up-Temp-Junk-Data.md': 'security',
    'Online-Backup-Services-Ransomware-Protection.md': 'security',
    
    # Printers
    'Printer-New-Printer-Setup-PC-Mac.md': 'printers',
    'Printer-Troubleshooting-Windows-OS.md': 'printers',
    'Printer-Installation-OSX.md': 'printers',
    'Printer-Troubleshooting-OSX.md': 'printers',
    'Printer-Scanner-Support-Sites.md': 'printers',
    
    # Setup/Migration
    'New-PC-Setup-Migration-Checklist.md': 'setup-migration',
    'New-Computer-Set-up-Detailed.md': 'setup-migration',
    'New-PC-Client-To-Do-List.md': 'setup-migration',
    'Data-Backup-Restore-PC.md': 'setup-migration',
    'POP-to-IMAP-Email-Migration.md': 'setup-migration',
    'Email-Address-Change-To-Do-List.md': 'setup-migration',
    
    # Accounts
    'Account-Recovery-Support-Limitations.md': 'accounts',
    'General-Accounts-Login-Issues.md': 'accounts',
    'Microsoft-Account-Issues.md': 'accounts',
    'Find-Passwords-Password-Help.md': 'accounts',
    
    # Business
    'Upselling.md': 'business',
    'Payment-Processing.md': 'business',
    'Online-Payment-Methods.md': 'business',
    'In-Shop-PC-Check-Out-Payments.md': 'business',
    'Parking-Guidelines-Laws.md': 'business',
    
    # Templates
    'SMS-Email-Templates.md': 'templates',
    'Invoice-Templates.md': 'templates',
    'Communication.md': 'templates',
    'Notes-Documentation.md': 'templates',
    
    # Policies
    'Terms-of-Service.md': 'policies',
    'Client-Confidentiality-Policies.md': 'policies',
    'Our-Service-Guarantee.md': 'policies',
    'Disclaimers.md': 'policies',
    '3rd-Party-Software-Support-Disclaimer.md': 'policies',
    
    # Tools
    'Tools-Usage.md': 'tools',
    'Bootable-USB-How-To.md': 'tools',
    'Websites-Diagnostics-Assistance.md': 'tools',
}

def calculate_relative_path(from_folder, to_folder, filename):
    """Calculate the relative path from one folder to another."""
    if from_folder == to_folder:
        return f'./{filename}'
    
    # If in root, just use folder/file
    if from_folder == '':
        return f'./{to_folder}/{filename}'
    
    # If target is in root
    if to_folder == '':
        return f'../{filename}'
    
    # Both in different folders
    return f'../{to_folder}/{filename}'

def update_links_in_file(filepath, current_folder):
    """Update all markdown links in a file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern to match markdown links: [text](./path/to/file.md)
    link_pattern = r'\[([^\]]+)\]\(\.\/([^\)]+\.md)\)'
    
    def replace_link(match):
        link_text = match.group(1)
        old_path = match.group(2)
        
        # Extract just the filename
        filename = os.path.basename(old_path)
        
        # Look up the new folder for this file
        if filename in FILE_TO_FOLDER:
            target_folder = FILE_TO_FOLDER[filename]
            new_path = calculate_relative_path(current_folder, target_folder, filename)
            return f'[{link_text}]({new_path})'
        
        # If not found in mapping, keep original
        return match.group(0)
    
    # Replace all links
    content = re.sub(link_pattern, replace_link, content)
    
    # Only write if content changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    """Main function to process all markdown files."""
    repo_root = Path('.')
    updated_files = []
    
    print("Scanning for markdown files to update...")
    print("-" * 60)
    
    # Special case: Update README.md in root
    readme_path = repo_root / 'README.md'
    if readme_path.exists():
        if update_links_in_file(readme_path, ''):
            updated_files.append('README.md')
            print(f"✓ Updated: README.md")
    
    # Process all markdown files
    for filename, folder in FILE_TO_FOLDER.items():
        # Check if file exists in current location (root or folder)
        possible_paths = [
            repo_root / filename,
            repo_root / folder / filename
        ]
        
        for filepath in possible_paths:
            if filepath.exists():
                if update_links_in_file(filepath, folder):
                    updated_files.append(str(filepath.relative_to(repo_root)))
                    print(f"✓ Updated: {filepath.relative_to(repo_root)}")
                break
    
    print("-" * 60)
    print(f"\nTotal files updated: {len(updated_files)}")
    
    if updated_files:
        print("\nUpdated files:")
        for f in updated_files:
            print(f"  - {f}")
    else:
        print("\nNo files needed updating.")

if __name__ == '__main__':
    main()
