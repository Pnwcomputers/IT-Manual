# 📋 Worksheets and Checklists

This directory is the location for all **fillable worksheets, paper forms, and procedural checklists** that require physical documentation or structured data capture during an IT operation or administrative task.

The purpose is to provide a standardized, physical, or digital form for technicians to follow and fill out when executing specific, multi-step procedures, ensuring **no critical step is missed and data is captured uniformly**.

---

## 📚 Contents Overview

This documentation provides the ready-to-use forms that guide technicians through repeatable processes:

| File / Folder | Description | Key Focus |
| :--- | :--- | :--- |
| `new_workstation_build_checklist.md` | A step-by-step checklist to follow when setting up a new user's computer, verifying all required software, settings, and peripherals are configured. | **Deployment Quality** |
| `server_decommissioning_worksheet.md` | A multi-step form detailing the process of taking a server offline, backing up data, ensuring service dependencies are moved, and securely wiping the drives. | **Asset Retirement** |
| `network_cable_labeling_worksheet.md` | A simple form used to document and track the physical port number, patch panel location, and corresponding device ID when installing new network drops. | **Physical Inventory** |
| `emergency_contact_sheet.md` | A structured sheet listing essential after-hours contacts, including third-party vendors, ISP support, and key internal personnel, for rapid reference during an outage. | **Crisis Communication** |
| `on-site_service_call_report.md` | A form used by field technicians to log time spent, parts used, observations, and user sign-off for services performed at a remote location. | **Service Logging** |

---

## 🖊️ Usage Guidelines

* **Completion is Mandatory:** For critical procedures (e.g., server retirement, new system deployment), the corresponding worksheet/checklist must be completed and archived.
* **Version Control:** Always use the latest version of the worksheet found in this directory. If a file needs updating, modify the master document and document the changes in the Pull Request.
* **Archiving:** Completed physical forms should be digitized and archived in the designated document management system for audit purposes.

---

## 🔗 Related Documentation

* **[Procedures Documentation](../procedures):** The SOPs often explain *why* these worksheets must be used (e.g., the `server_decommissioning_worksheet.md` follows the steps outlined in the `server_patching_sop.md`).
* **[Templates Documentation](../templates):** For more formal, narrative-style documents (like Change Requests) as opposed to step-by-step forms.
