# Windows Server Administration

Welcome to the **Windows Server** documentation hub. This section covers standard operating procedures (SOPs), deployment guides, and troubleshooting steps for Windows environments.

The documentation is split into two primary categories based on the management model. Please select the appropriate environment below.

---

## 📂 Choose Your Environment

### [🏢 Domain Environment (Active Directory)](domain/)
**Go here if you are working with:**
* Domain Controllers (DC) & Active Directory Domain Services (AD DS).
* Centralized user management (AD Users & Computers).
* Group Policy Objects (GPO) for automation.
* Enterprise-grade file sharing (DFS, NTFS permissions).

> **Best for:** Corporate offices, centralized networks, and environments requiring single-sign-on (SSO).

### [🏠 Workgroup Environment (Standalone)](workgroup/)
**Go here if you are working with:**
* Standalone servers or isolated machines.
* Local user accounts (SAM) and Peer-to-Peer networking.
* Manual configuration (Local Security Policy, Hosts files).
* Small deployments where no Domain Controller exists.

> **Best for:** Small branch offices, DMZ servers, isolated kiosks, or test labs without AD infrastructure.

---

## ⚡ Quick Comparison

| Feature | Domain | Workgroup |
| :--- | :--- | :--- |
| **Authentication** | Centralized (Kerberos/AD) | Decentralized (Local SAM) |
| **Management** | Group Policy (GPO) | Local Policy / Manual |
| **DNS/DHCP** | Integrated AD DNS | Router-based or Static |
| **Scalability** | High (Hundreds/Thousands of users) | Low (<10-20 users recommended) |

## 🛠️ General Troubleshooting
*For specific issues, navigate to the respective folder above. However, general connectivity principles apply to both.*

* **Ping/Network:** Ensure ICMP is allowed through the firewall.
* **Services:** Check that standard Windows services (Server, Workstation, DNS Client) are running.
* **Updates:** Ensure servers are patched to the latest supported baseline.
