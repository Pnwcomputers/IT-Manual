# 🪟 Windows Documentation

This directory serves as the dedicated section for all documentation, guides, and configuration standards related to the **Microsoft Windows operating system**, covering both Windows Server and Windows client machines (workstations/laptops).

The objective is to ensure that all Windows environments are **uniformly deployed, securely managed via Group Policy/MDM, and correctly maintained** to meet organizational standards.

---

## 📚 Contents Overview

This documentation focuses on the deployment, configuration, and support of Windows environments:

| File / Folder | Description | Key Focus |
| :--- | :--- | :--- |
| `os_deployment_guide.md` | Standardized procedure for imaging, installing, and joining new Windows machines to the domain or management system (e.g., Autopilot, SCCM). | **System Provisioning** |
| `group_policy_management.md` | Documentation of key Group Policy Objects (GPOs), including security baselines, folder redirection, and standardized desktop settings. | **Centralized Configuration** |
| `security_hardening_windows.md` | Checklist and procedures for essential security controls, including Windows Defender configuration, BitLocker encryption, and user access control (UAC) settings. | **Endpoint Security** |
| `powershell_scripting_library.md` | Collection of approved and documented PowerShell scripts used for routine administration, diagnostics, and automation tasks. | **Automation** |
| `common_troubleshooting.md` | Guide to diagnosing and resolving typical Windows issues (e.g., blue screens, corrupt profiles, Windows Update failures). | **Tier 1 & 2 Support** |
| `active_directory_sop.md` | Standard operating procedure for managing Active Directory objects, including OUs, user/group creation, and domain controller maintenance. | **Identity Management** |

---

## 🛠️ Key Administration Areas

* **Standardization:** All configurations should leverage Group Policy or management tools to minimize local variations.
* **Patch Management:** Windows Update settings are centrally managed to ensure timely application of critical security patches.
* **Security:** Focus on securing the endpoint, network communication, and access to privileged domain resources.

---

## 🔗 Related Documentation

* **[Active Directory SOPs](../accounts):** Detailed procedures for user and account management within the Active Directory framework.
* **[Procedures Documentation](../procedures):** High-level guides that mandate the patching and maintenance schedules for Windows Server environments.
