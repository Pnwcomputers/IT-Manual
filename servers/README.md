# Server Administration

Welcome to the **Server Administration** documentation hub. This repository acts as the central knowledge base for deploying, managing, and maintaining our server infrastructure across different operating systems.

Please select the operating system environment below to view specific standard operating procedures (SOPs).

---

## 📂 Operating Systems

### [🐧 Linux Administration](linux/)
Documentation for managing Linux-based servers and workstations.
* **Includes:** Command line operations, package management, SSH configuration, and service deployment.
* **Key Distros:** Debian, Ubuntu, SUSE, DietPi, Alma, Rocky, etc.

### [🪟 Windows Administration](windows/)
Documentation for managing Windows Server environments.
* **Includes:** Active Directory (Domain) management, standalone Workgroup configurations, Group Policy, and PowerShell automation.
* **Key Versions:** Windows Server 2019/2022, Windows 10/11 Enterprise.

---

## ⚡ Quick Reference: Common Administrative Tasks

| Task | Linux Command | Windows Command / Tool |
| :--- | :--- | :--- |
| **Check IP Address** | `ip addr` or `ifconfig` | `ipconfig /all` |
| **Check Hostname** | `hostnamectl` | `hostname` |
| **Remote Access** | SSH (`ssh user@host`) | RDP (Remote Desktop Connection) |
| **Service Status** | `systemctl status <service>` | `Get-Service <service>` |
| **Elevated Privileges**| `sudo` | Run as Administrator |

---

## 📝 Contribution Standards

When adding new documentation to either section:
1.  **Format:** Ensure all new guides follow the standard Markdown structure used in this repo.
2.  **Naming:** Use `snake_case` for filenames (e.g., `setup_guide.md`, not `Setup Guide.md`).
3.  **Paths:** Always use relative paths when linking images or other markdown files.
