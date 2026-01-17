# Linux Server Administration

Welcome to the **Linux Server** section of the IT Manual. This directory serves as the knowledge base for the various Linux distributions used within our infrastructure.

Each sub-directory contains specific documentation for that ecosystem, including installation guides, package management standards, and service configuration (DNS, Web, Storage, etc.).

## 🐧 Distribution Index

Select a distribution below to view its specific standard operating procedures (SOPs).

| Distribution | Folder | Description | Best For |
| :--- | :--- | :--- | :--- |
| **AlmaLinux** | **[alma/](alma/)** | Enterprise-grade, free RHEL-compatible OS. | Production servers requiring long-term stability (RHEL alternative). |
| **Debian** | **[debian/](debian/)** | The rock-solid upstream foundation for many other distros. | Core infrastructure where stability is the highest priority. |
| **Raspberry Pi** | **[raspberrypi/](raspberrypi/)** | Optimized OS for ARM-based Raspberry Pi hardware. | IoT, sensors, digital signage, and lightweight appliances. |
| **Rocky Linux** | **[rocky/](rocky/)** | Community-led, bug-for-bug compatible RHEL alternative. | Enterprise workloads migrating from CentOS. |
| **SUSE** | **[suse/](suse/)** | Enterprise Linux with unique management tools (YaST). | SAP workloads and mixed Windows/Linux environments. |
| **Ubuntu** | **[ubuntu/](ubuntu/)** | The most popular general-purpose server OS. | Web servers, Cloud deployments, and AI/ML workflows. |

---

## 📂 Directory Structure Strategy
Inside each distribution folder, you will generally find documentation covering the following lifecycle stages:

1.  **Setup & Install:** Base installation, partitioning, and initial user creation.
2.  **Network Configuration:** Static IP assignment, DNS settings, and hostname configuration.
3.  **Package Management:** How to update and install software (e.g., `apt`, `dnf`, `zypper`).
4.  **Services:** Specific guides for roles like Web Server (Apache/Nginx), Database, or File Sharing.

---

## ⚡ Quick Package Manager Reference

| Distro | Update Command | Install Command | Service Management |
| :--- | :--- | :--- | :--- |
| **Debian / Ubuntu / Pi** | `apt update && apt upgrade` | `apt install <package>` | `systemctl restart <service>` |
| **Alma / Rocky** | `dnf update` | `dnf install <package>` | `systemctl restart <service>` |
| **SUSE** | `zypper up` | `zypper install <package>` | `systemctl restart <service>` |

---

## 📝 Contribution Guidelines
* **Version Specificity:** When writing a guide, please specify the version used (e.g., *Ubuntu 22.04 LTS* or *Debian 12*).
* **Root vs Sudo:** Clearly indicate if commands require root privileges (usually denoted by `#` for root or `$` for user).
