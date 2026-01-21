# 🚀 New System Setup & Data Migration

**Part of the [IT-Manual](../README.md)**
*Procedures for setting up new workstations, migrating user data, and upgrading email protocols.*

---

## 📖 Overview
This directory contains the workflows for the "New Computer Experience." It covers the entire lifecycle of replacing a client's machine: preparing the client for the switch, backing up the old data, setting up the new hardware, and performing the migration.

## 📂 Contents

### 📦 The Migration Workflow
*Technical checklists for the transfer process.*

- **[New PC Setup & Migration Checklist](./New-PC-Setup-Migration-Checklist.md)**
  **The Master List:** The start-to-finish tracking sheet for a migration job. Covers intake, backup, setup, transfer, and quality assurance.
- **[New Computer Set-up Detailed](./New-Computer-Set-up-Detailed.md)**
  Specific technical steps for the "Out of Box Experience" (OOBE)—removing bloatware, running updates, and configuring standard settings.
- **[Data Backup & Restore (PC)](./Data-Backup-Restore-PC.md)**
  Procedures for locating, copying, and verifying user data (Documents, Desktop, Pictures, Quickbooks, Outlook PSTs) during the move.

### 📧 Email & Accounts
*Handling identity and protocol changes.*

- **[POP to IMAP Email Migration](./POP-to-IMAP-Email-Migration.md)**
  A guide for upgrading clients from legacy POP3 (local storage) to IMAP/Exchange (cloud sync) to ensure their email syncs across multiple devices.
- **[Email Address Change To-Do List](./Email-Address-Change-To-Do-List.md)**
  A checklist to guide clients through the hassle of changing a primary email address (updating banks, utilities, subscriptions, and Amazon).

### 📋 Client Homework
*Lists to give the client *before* or *after* the job.*

- **[New PC Client To-Do List](./New-PC-Client-To-Do-List.md)**
  **Pre-Service Requirement:** A document sending the client to gather their passwords, license keys, and 2FA devices *before* the appointment to avoid delays.

---

## ⚡ Migration Order of Operations
*Follow this path to ensure no data is lost.*

[Image of data migration workflow diagram]

| Phase | Step | Relevant Document |
| :--- | :--- | :--- |
| **1. Prep** | Send client "homework" to get passwords ready. | `New-PC-Client-To-Do-List` |
| **2. Protect** | **Backup the old machine completely.** | `Data-Backup-Restore-PC` |
| **3. Setup** | Unbox and update the new machine. | `New-Computer-Set-up-Detailed` |
| **4. Transfer** | Move files and configure email. | `POP-to-IMAP...` |
| **5. Verify** | QC check using the master list. | `New-PC-Setup-Migration-Checklist` |

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
