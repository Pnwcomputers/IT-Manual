# ✍️ Standard Operating Procedures (SOPs)

**Part of the [IT-Manual](../README.md)**
*The master playbook for service workflows, optimization routines, and standard repairs.*

---

## 📖 Overview
This directory contains the "How-To" guides for the most frequent tasks in the shop. While other directories focus on specific hardware or software, this folder defines the **process**—from how we handle an on-site visit to the exact steps for a system tune-up.

## 📂 Contents

### 🏢 Core Workflows
*The logistics of how we deliver service.*

- **[General Job Procedures](./General-Job-Procedures.md)**
  The baseline expectations for any ticket, regardless of location.
- **[In-Shop Service: How It's Done](./In-Shop-Service-How-Its-Done.md)**
  Logistics for the bench: Intake, tagging, queue management, and checkout.
- **[On-Site Service: How It's Done](./On-Site-Service-How-Its-Done.md)**
  Protocol for field visits: Arrival etiquette, client communication, and closing out the job site.
- **[How-To Procedures FULL LIST](./How-To-Procedures-FULL-LIST.md)**
  A master index of all technical guides across the entire repository.

### 🚀 System Optimization (The "Tune-Up")
*Standard steps for the "My computer is slow" ticket.*

- **[Clean up Temp & Junk Data](./Clean-up-Temp-Junk-Data.md)**
  Safe removal of temp files, caches, and bloatware to free up disk space.
- **[Eliminate Startup Apps](./Eliminate_Startup_Apps.md)**
  Methodology for identifying and disabling high-impact startup processes to improve boot time.
- **[Security Tune-up Detailed](./Security_Tuneup_Detailed.md)**
  Hardening the OS, verifying antivirus status, and checking for vulnerabilities.

### 🔍 Diagnostics & Recovery
*Techniques for solving problems and retrieving access.*

- **[Improvised Diagnostics (OODA Loop)](./Improvised-Diagnostics-OODA-Loop.md)**
  **Essential Reading:** A mental framework (Observe, Orient, Decide, Act) for troubleshooting unknown or complex issues when standard checklists fail.
  
- **[Electronics Diagnostics](./Electronics_Diagnostics.md)**
  General protocols for testing physical components.
- **[Account Login Issues](./Account_Login_Issues.md)**
  Steps for resolving generic access problems across various platforms.
- **[Find Passwords](./Find_Passwords.md)**
  Tools and methods for recovering saved credentials from browsers and keychains.
- **[Data Backup](./Data_Backup.md)**
  The definitive procedure for securing user data before attempting risky repairs or migrations.

---

## ⚡ The "Tune-Up" Workflow
*When a client requests a General Service or Tune-Up, follow this order of operations:*

1.  **Backup** (`Data_Backup.md`) - *Always save data first.*
2.  **Diagnostics** (`Electronics_Diagnostics.md`) - *Ensure the drive/RAM isn't failing.*
3.  **Cleanup** (`Clean-up-Temp-Junk-Data.md`) - *Remove the garbage.*
4.  **Optimization** (`Eliminate_Startup_Apps.md`) - *Speed up the boot.*
5.  **Security** (`Security_Tuneup_Detailed.md`) - *Patch holes and scan for malware.*

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
