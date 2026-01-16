# Supported RDS Install
## *(DOMAIN JOINED)*

This guide covers how to install Remote Desktop Services (RDS) on a server that is joined to an **Active Directory Domain**.

Unlike Workgroup deployments, a Domain setup allows you to:
1. Use **Per-User CALs** (licenses follow the person, not the device).
2. Manage access via **AD Groups** (e.g., `OFFICE\RDS_Users`).
3. Enforce settings via **Group Policy (GPO)** centrally.

> **⚠ Prerequisite:** The server must already be joined to the domain and have a Static IP.

---

## Step 1: Install RDS Roles
**Note:** For a single-server deployment, we will still use "Role-based" installation to keep it lightweight.

1. Log in as a **Domain Administrator**.
2. Open **Server Manager** on the RDS server.
3. Click **Add Roles and Features**.
4. Choose **Role-based or feature-based installation**.
5. Select your server.
6. On **Server Roles**, check:
   - ✅ **Remote Desktop Session Host**
   - ✅ **Remote Desktop Licensing**
   - *(Optional)* **Remote Desktop Web Access** (if you want browser-based access).
7. Finish the installation and **Reboot** the server.

---

## Step 2: Activate the License Server
In a domain, the License Server is published to Active Directory so other servers can find it.

1. Open **Remote Desktop Licensing Manager**.
2. Right-click your server name and select **Activate Server**.
3. Choose **Automatic (Internet)**.
4. **Install your Licenses:**
   - **Per-User CALs:** This is the **preferred** method for Domains. It allows users to connect from *any* device (laptop, home PC, phone) using one license.
   - **Per-Device CALs:** Use only if users share devices (e.g., a shift-work call center).

---

## Step 3: Configure Licensing via Group Policy (GPO)
Instead of editing the local registry, we configure this via a **Domain GPO** so it sticks even if you reinstall the server.

1. On your Domain Controller (or a machine with RSAT), open **Group Policy Management** (`gpmc.msc`).
2. Create a new GPO named `RDS Server Policy` and link it to the OU containing your RDS Server.
3. Right-click and **Edit** the GPO.
4. Navigate to:
   `Computer Configuration > Policies > Admin Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Licensing`
5. **Configure these two settings:**
   - **Set the Remote Desktop licensing mode:** Enabled → **Per User** (or Per Device).
   - **Use the specified Remote Desktop license servers:** Enabled → Enter the **FQDN** of your server (e.g., `rds01.corp.local`).
6. On the RDS Server, run:
   ```cmd
   gpupdate /force
