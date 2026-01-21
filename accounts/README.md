# 👥 Accounts & Login Support

**Part of the [IT-Manual](../README.md)**
*Troubleshooting guides for client account recovery, password management, and platform-specific login issues.*

---

## 📖 Overview
This directory contains resources for technicians assisting clients who are locked out of their accounts or experiencing authentication issues. It covers specific platforms (Apple/Microsoft) as well as general password recovery techniques and support limitations.

## 📂 Contents

### 🍎 Platform-Specific Troubleshooting
*Guides for the most common ecosystem accounts.*

- **[Apple ID Login Troubleshooting](./Apple-ID-Login-Troubleshooting.md)**
  Steps for resolving iCloud login failures, 2FA prompt issues, and "Account Locked" status.
- **[Microsoft Account Issues](./Microsoft-Account-Issues.md)**
  Troubleshooting for Microsoft 365, Outlook.com, and Windows user profile sign-in problems.

### 🔐 Password Recovery & General Access
*Techniques for retrieving credentials and resolving generic errors.*

- **[Find Passwords / Password Help](./Find-Passwords-Password-Help.md)**
  Methods for locating saved credentials in web browsers (Chrome, Edge), Keychain, and password managers to assist clients who have forgotten their logins.
- **[General Accounts Login Issues](./General-Accounts-Login-Issues.md)**
  A checklist for diagnosing login failures that aren't platform-specific (e.g., keyboard layout issues, network blocks, browser cache).

### ⚠️ Policy & Scope
*Guidelines on what support we can and cannot provide.*

- **[Account Recovery Support Limitations](./Account-Recovery-Support-Limitations.md)**
  **Critical Read:** Defines the boundaries of our support. Clarifies when a client must contact the vendor directly and protects the technician from liability during high-risk recovery attempts.

---

## 🔗 Quick Recovery Links
*Official vendor portals for immediate account recovery actions.*

| Platform | Recovery URL |
| :--- | :--- |
| **Microsoft** | [account.live.com/password/reset](https://account.live.com/password/reset) |
| **Apple** | [iforgot.apple.com](https://iforgot.apple.com) |
| **Google** | [accounts.google.com/signin/recovery](https://accounts.google.com/signin/recovery) |
| **Yahoo** | [login.yahoo.com/account/challenge](https://login.yahoo.com/account/challenge) |

---

## 🛠️ Operational Principles

Account management is based on principles critical for enterprise security:

1.  **Principle of Least Privilege (PoLP):** All users and systems are granted only the minimum access necessary to perform their required tasks.
2.  **Identity Lifecycle Management (ILM):** Ensuring accounts are accurately provisioned, maintained, and promptly de-provisioned according to their status.
3.  **Auditability:** Every action taken on an account must be logged, retained, and available for periodic security review.

---

## 🤝 Contribution & Maintenance

We welcome contributions to keep these procedures current, accurate, and aligned with best security practices.

* If you are updating an existing SOP, ensure the changes are tested and clearly documented in your Pull Request.
* New documentation should cover a complete process (e.g., start-to-finish account creation) and be placed in a clearly named markdown file.

---

*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
