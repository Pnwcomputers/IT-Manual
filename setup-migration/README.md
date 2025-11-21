# 🚀 Setup and Migration Guides

This directory contains the essential, detailed guides for performing **major IT setup operations, system upgrades, and data migrations**.

The objective is to provide structured, validated procedures for large-scale, non-routine tasks to ensure minimal downtime, data integrity, and consistent results when implementing new infrastructure or transitioning between systems.

---

## 📚 Contents Overview

This documentation focuses on methodical execution of high-impact technical changes:

| File / Folder | Description | Key Focus |
| :--- | :--- | :--- |
| `new_server_deployment_guide.md` | Comprehensive procedure for racking, cabling, OS installation, initial hardening, and application provisioning for new servers. | **Infrastructure Deployment** |
| `office_relocation_it_checklist.md` | A complete checklist of IT-related tasks required before, during, and after relocating an office (e.g., ISP coordination, hardware moving, network testing). | **Business Continuity** |
| `email_platform_migration_sop.md` | Step-by-step guide for migrating user mailboxes, contacts, and calendar data between different email platforms (e.g., from local Exchange to cloud M365). | **Data Transition** |
| `major_os_upgrade_plan.md` | The plan for rolling out major operating system version upgrades across the user base (e.g., Windows 10 to 11, or macOS Big Sur to Ventura). | **Client Management** |
| `data_server_transfer_sop.md` | Standardized procedure for moving large volumes of data from an old server/storage unit to a new one, including verification steps. | **Storage Management** |
| `post_migration_verification.md` | Standard checklist of tests and user confirmations required to formally sign-off on any major setup or migration project. | **Quality Assurance** |

---

## ⚠️ High-Impact Procedures

Due to the critical nature of these processes, all setup and migration guides require adherence to the following:

* **Testing Environment:** Procedures must first be validated in a non-production or staging environment.
* **Rollback Plan:** Every migration and setup guide must include a clearly defined, tested plan to revert to the previous working state in case of failure.
* **Communication:** Comprehensive communication with affected business units and users is mandatory prior to execution.

---

## 🔗 Related Documentation

* **[Procedures Documentation](../procedures):** High-level framework and templates that these specific guides follow.
* **[Hardware Documentation](../hardware):** Reference for the specifications and physical requirements of the systems being set up or migrated.
