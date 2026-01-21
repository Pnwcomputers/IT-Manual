# 🛡️ Security & Malware Removal

**Part of the [IT-Manual](../README.md)**
*Standard procedures for removing infections, hardening systems, and preventing data loss.*

---

## 📖 Overview
This directory contains the "Battle Plans" for dealing with compromised systems. It covers the full lifecycle of a security ticket: identifying the infection, removing the malicious code, cleaning up the aftermath, and setting up defenses to prevent recurrence (including ransomware protection).

## 📂 Contents

### 🧹 Remediation (Cleaning)
*Steps to remove active threats and "junk" from the system.*

- **[Check for Malware and Adware](./Check-for-Malware-and-Adware.md)**
  **The Core SOP:** Tools and techniques for identifying and removing viruses, trojans, spyware, and browser hijackers.
- **[Clean up Temp & Junk Data](./Clean-up-Temp-Junk-Data.md)**
  Procedures for clearing temp directories (`%temp%`, browser caches). *Note: Perform this **before** scanning to significantly reduce scan times.*
- **[Eliminate Start-up Programs](./Eliminate-Start-up-Programs.md)**
  How to identify malicious persistence mechanisms (programs that auto-start) and remove unnecessary bloatware that slows down the system.

### 🧱 Hardening (Prevention)
*Steps to secure the system after the threat is removed.*

- **[Security Tuneup Detailed](./Security_Tuneup_Detailed.md)**
  A comprehensive checklist for hardening the OS: User Account Control (UAC) settings, Windows Updates, Firewall verification, and browser security settings.
- **[Online Backup Services & Ransomware Protection](./Online-Backup-Services-Ransomware-Protection.md)**
  Strategies for immutable backups (cloud storage) and configuring software to detect and block encryption behaviors typical of ransomware.

---

## ⚡ Virus Removal Workflow
*The standard order of operations for a dirty machine.*



1.  **Preparation:** Run **[Clean up Temp Data](./Clean-up-Temp-Junk-Data.md)**.
    * *Why?* Scanning thousands of temp files wastes time.
2.  **Sanitization:** Run **[Check for Malware](./Check-for-Malware-and-Adware.md)**.
    * *Why?* Kill the active virus processes.
3.  **Persistence:** Run **[Eliminate Start-up Programs](./Eliminate-Start-up-Programs.md)**.
    * *Why?* Ensure the virus doesn't come back on reboot.
4.  **Hardening:** Run **[Security Tuneup](./Security_Tuneup_Detailed.md)**.
    * *Why?* Close the hole they got in through.
5.  **Future-Proofing:** Setup **[Backup Services](./Online-Backup-Services-Ransomware-Protection.md)**.
    * *Why?* Because no antivirus is perfect; backups are the only 100% cure for Ransomware.

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
