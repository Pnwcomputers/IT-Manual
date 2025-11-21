# 🔧 Tools and Utilities Documentation

This directory is dedicated to the documentation, guides, and configuration details for **essential IT tools, utilities, and scripts** used by the support and engineering teams.

The objective is to standardize the use of diagnostic software, administrative consoles, and custom scripts, ensuring that all technicians use the approved methods and configurations for efficiency and security.

---

## 📚 Contents Overview

This documentation covers the usage and management of key administrative software:

| File / Folder | Description | Key Focus |
| :--- | :--- | :--- |
| `admin_tools_list.md` | The comprehensive list of all authorized third-party administrative and diagnostic tools (e.g., remote desktop clients, network scanners, disk utilities). | **Standardization** |
| `remote_access_setup.md` | Configuration guides for the primary remote access and remote control software used to support end-users and manage servers. | **Remote Support** |
| `custom_scripts/` | Directory containing documentation and usage instructions for internally developed or essential shell/PowerShell scripts used for automation and bulk tasks. | **Automation** |
| `monitoring_system_guide.md` | The operational guide for the organization's network and system monitoring platform (e.g., how to acknowledge alerts, run custom reports). | **System Visibility** |
| `asset_inventory_system_guide.md` | Instructions for managing, updating, and running reports within the central IT asset and configuration management database (CMDB). | **Inventory Control** |
| `backup_software_operations.md` | Detailed instructions on the daily operation, restoration process, and troubleshooting for the centralized backup solution. | **Data Recovery** |

---

## 🔒 Security and Access

* **Approved Use Only:** Only the tools documented in `admin_tools_list.md` are permitted for use on company systems. Unauthorized tools pose a security risk.
* **Credentials:** Never embed sensitive credentials directly into scripts. All automation scripts must follow documented best practices for secure secret management.
* **Licensing:** Ensure all licensed tools are tracked according to the `software_licensing_policy.md` (in the `../software` directory).

---

## 🔗 Related Documentation

* **[Software Documentation](../software):** Policies and licensing information for the commercial tools listed here.
* **[Diagnostics Documentation](../diagnostics):** Procedures that often reference the use of specific diagnostic tools found in this directory.
