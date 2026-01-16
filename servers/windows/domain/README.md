# Windows Domain Administration

Welcome to the **Windows Domain** section of the IT Manual. This directory contains standard operating procedures (SOPs), configuration guides, and troubleshooting documentation for managing our Windows Active Directory (AD) environment.

## 📂 Documentation Index

### 🏗️ Core Infrastructure & Setup
Foundational guides for establishing the domain environment.

| File | Description |
| :--- | :--- |
| **[ad_domain_setup.md](ad_domain_setup.md)** | Step-by-step guide for promoting a server to a Domain Controller and initializing a new Forest/Domain. |
| **[dns_dhcp_domain.md](dns_dhcp_domain.md)** | Configuration standards for DNS records and DHCP scopes within the domain environment. |
| **[join_ad_domain.md](join_ad_domain.md)** | Procedure for joining client workstations and member servers to the Active Directory domain. |
| **[setup_rds_domain.md](setup_rds_domain.md)** | Guide for deploying and licensing Remote Desktop Services (RDS) in the domain. |

### 👥 Users & Device Management
Managing identity and endpoints.

| File | Description |
| :--- | :--- |
| **[users_devices_basic.md](users_devices_basic.md)** | Fundamentals of user account creation and local device management. |
| **[users_devices_domain.md](users_devices_domain.md)** | Advanced management using AD Users and Computers (ADUC), OUs, and bulk operations. |

### 📜 Group Policy (GPO)
Automating configurations and enforcing standards.

| File | Description |
| :--- | :--- |
| **[grp_policy_basic.md](grp_policy_basic.md)** | Introduction to Group Policy Objects, inheritance, and precedence. |
| **[grp_policy_domain.md](grp_policy_domain.md)** | Implementation of specific domain-wide policies (e.g., wallpaper, drive mapping, printer deployment). |

### 📂 File Services & Storage
Data management and access control.

| File | Description |
| :--- | :--- |
| **[file_sharing_basic.md](file_sharing_basic.md)** | Setting up simple shared folders and understanding standard permissions. |
| **[file_sharing_domain.md](file_sharing_domain.md)** | Advanced file serving, including DFS Namespaces and NTFS permission hierarchies. |

### 🛡️ Operations, Security & Maintenance
Keeping the environment healthy and secure.

| File | Description |
| :--- | :--- |
| **[security.md](security.md)** | Best practices for domain security, password policies, and account hardening. |
| **[backup_recovery.md](backup_recovery.md)** | Procedures for backing up System State/AD and performing disaster recovery. |
| **[troubleshooting.md](troubleshooting.md)** | Common issues (replication errors, trust relationship failures, etc.) and their solutions. |

---

## 📝 Contribution Guidelines

When adding new documentation to this section:
1. Ensure all screenshots typically have sensitive info (IPs, real usernames) blurred unless using a lab environment.
2. Link back to the main `IT-Manual` index where necessary.
3. Use the `[File Name](link)` format to cross-reference other guides in this folder.
