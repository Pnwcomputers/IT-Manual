# 🍎 macOS Documentation

This directory is the dedicated section for all guides, configuration standards, and procedures specific to **Apple macOS** machines (MacBook, iMac, Mac mini) within the organization.

The objective is to ensure that all Mac devices are **uniformly deployed, securely configured, and efficiently managed** in a professional environment, supporting various business and creative roles.

---

## 📚 Contents Overview

This documentation focuses on the unique aspects of managing macOS:

| File / Folder | Description | Key Focus |
| :--- | :--- | :--- |
| `initial_setup_and_enrollment.md` | Step-by-step guide for deploying new Macs, including MDM enrollment (e.g., Jamf, Intune), initial user setup, and standard provisioning. | **Deployment & Provisioning** |
| `security_hardening_macos.md` | Procedures for enforcing security policies, including **FileVault** disk encryption, native firewall configuration, and user permissions best practices. | **Endpoint Security** |
| `software_deployment_guide.md` | Instructions for installing, updating, and patching standard applications using management tools or scripting (e.g., Munki, MDM payload). | **Application Management** |
| `common_troubleshooting.md` | Guide to diagnosing and resolving common macOS issues unique to the platform (e.g., Keychain issues, PRAM reset, network settings). | **Tier 1 & 2 Support** |
| `terminal_commands_cheat_sheet.md` | A quick reference for essential macOS command-line tools for IT support and advanced diagnostics (e.g., `dscl`, `launchctl`). | **Advanced Troubleshooting** |

---

## 🔒 Security Focus

Mac security is a core concern, and is enforced through specific procedures detailed here:

* **Zero-Touch Deployment:** Leveraging Apple Business Manager (ABM) and MDM for streamlined and standardized setup.
* **Full Disk Encryption:** Mandatory FileVault encryption on all portable devices.
* **Configuration Profiles:** Use of MDM profiles to ensure consistent settings and prevent unauthorized changes.

---

## 🔗 Related Documentation

* **[Hardware Documentation](../hardware):** Reference documentation for approved Mac models and their specifications.
* **[Diagnostics Documentation](../diagnostics):** For general troubleshooting principles applicable across all platforms.
