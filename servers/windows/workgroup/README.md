# Windows Server Workgroup Administration
## *(NO DOMAIN)*

Welcome to the **Windows Server Workgroup Setup & Administration** section of the IT Manual. This directory contains procedures for managing standalone Windows Servers and peer-to-peer networks where Active Directory is not present.

## 📂 Documentation Index

### 🏗️ Server Setup & Client Configuration
Initial deployment and connectivity standards.

| File | Description |
| :--- | :--- |
| **[workgroup_server_setup.md](workgroup_server_setup.md)** | Baseline configuration for a standalone Windows Server (naming, static IP, workgroup association). |
| **[client_config_workgroup.md](client_config_workgroup.md)** | Configuring Windows 10/11 clients to connect to workgroup resources (Network Discovery, Private Network profiles). |

### 🌐 Networking (DNS & DHCP)
Handling name resolution and addressing without a Domain Controller.

| File | Description |
| :--- | :--- |
| **[dns_dhcp_basic.md](dns_dhcp_basic.md)** | Fundamentals of TCP/IP addressing and manual DNS settings. |
| **[dns_dhcp_workgroup.md](dns_dhcp_workgroup.md)** | Managing DNS via router/hosts files and setting up standalone DHCP services. |

### 👥 User Management (Local)
Managing identities via the Security Accounts Manager (SAM).

| File | Description |
| :--- | :--- |
| **[localusers_groups.md](localusers_groups.md)** | Creating and managing local users and groups (`lusrmgr.msc`) and mirroring accounts for pass-through authentication. |

### 📂 File Services & Remote Access
Resource sharing in a decentralized environment.

| File | Description |
| :--- | :--- |
| **[fileshare_basic.md](fileshare_basic.md)** | Quick setup for simple folder sharing. |
| **[fileshare_workgroup.md](fileshare_workgroup.md)** | Advanced permissions, mapping drives via batch scripts, and handling "Access Denied" issues in workgroups. |
| **[rds_workgroup.md](rds_workgroup.md)** | Deploying Remote Desktop Services (RDS) and licensing on a workgroup server. |

### 🛡️ Operations, Security & Maintenance
Keeping standalone systems secure and running.

| File | Description |
| :--- | :--- |
| **[security.md](security.md)** | Local Security Policy (`secpol.msc`) hardening, Windows Firewall rules, and UAC settings. |
| **[backup_recovery.md](backup_recovery.md)** | Using Windows Server Backup and managing local backups for standalone machines. |
| **[troubleshooting.md](troubleshooting.md)** | Resolving common workgroup issues (e.g., computers not appearing in Network, credential prompts). |

---

## 📝 Key Differences from Domain
* **Authentication:** Relies on matching Username/Password pairs on Client and Server (Pass-through authentication).
* **Policy:** Configurations are managed via Local Group Policy rather than centralized GPO.

## 📝 Contribution Guidelines
1. Ensure all IPs listed are generic (e.g., `192.168.x.x`) unless documenting a specific static production server.
2. Verify that screenshots do not reveal external-facing credentials.
