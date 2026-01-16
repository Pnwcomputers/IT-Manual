# Active Directory Domain Controller Setup Guide

This guide walks through setting up your first **Active Directory Domain Controller (DC)**. This moves you from a "Workgroup" (decentralized) to a "Domain" (centralized) environment, allowing you to manage users, computers, and policies from one single server.

> **⚠ Crucial Prerequisite:** Your server **MUST** have a Static IP address before you begin. Do not use DHCP for the server's own IP.

---

## Step 1: Server Preparation
Before installing roles, you must prepare the server identity.

1. **Rename the Server:**
   - Open **Server Manager** → **Local Server**.
   - Click the Computer Name (e.g., `WIN-1234...`).
   - Change it to something simple like `DC01` or `AD-SERVER`.
   - **Reboot**.
2. **Set Static IP:**
   - Go to **Network Connections** (`ncpa.cpl`).
   - Set a static IP (e.g., `192.168.1.10`).
   - Set **Preferred DNS** to `127.0.0.1` (It will become its own DNS server).

---

## Step 2: Install Active Directory Domain Services (AD DS)
1. Open **Server Manager**.
2. Click **Add Roles and Features**.
3. Skip to **Server Roles**.
4. Check ✅ **Active Directory Domain Services**.
   - Click **Add Features** when prompted.
   - *Note: DNS Server will usually be selected automatically or required later.*
5. Click **Next** and **Install**.

---

## Step 3: Promote to Domain Controller
Installing the bits isn't enough; you must "Promote" the server.

1. In Server Manager, click the **Yellow Flag icon** (top right).
2. Click **Promote this server to a domain controller**.
3. **Deployment Operation:**
   - Select: 🔘 **Add a new forest**.
   - **Root domain name:** Enter your internal domain (e.g., `corp.local`, `company.internal`).
   - *Avoid using `.com` or `.net` if you own the public website to prevent DNS conflicts.*
4. **Domain Controller Options:**
   - Leave **DNS Server** and **Global Catalog (GC)** checked.
   - Set a **DSRM Password** (Write this down! It's for disaster recovery).
5. **DNS Options:**
   - Ignore the warning *"A delegation for this DNS server cannot be created."* (This is normal for the first DC).
6. **Paths:** Accept defaults (Database/Log/Sysvol).
7. **Prerequisites Check:**
   - You may see yellow warnings (Cryptography, etc.) → Ignore them.
   - If you see **Red Errors**, fix them (usually missing static IP or Administrator password blank).
8. Click **Install**.
   - *The server will automatically reboot.*

---

## Step 4: Verify Installation
Once rebooted, the login screen should show `DOMAIN\Administrator`.

1. Log in with your Administrator password.
2. Open **Active Directory Users and Computers** (`dsa.msc`).
   - Verify you see your domain (`corp.local`).
3. Open **DNS Manager** (`dnsmgmt.msc`).
   - Verify you see Forward Lookup Zones for your domain.

---

## Step 5: Create a New User
1. Open `dsa.msc` (AD Users and Computers).
2. Expand your domain.
3. Right-click the domain (or "Users" folder) → **New** → **User**.
4. **First name:** `John` | **Logon name:** `jdoe`.
5. Set a password.
   - Uncheck "User must change password at next logon" (for testing).
6. Click **Finish**.

---

## Step 6: Join a Client Computer to the Domain
Go to a Windows 10/11 Pro/Enterprise machine (Home edition cannot join domains).

1. **Set DNS Settings (Crucial):**
   - Open Network Settings on the client PC.
   - Change **Preferred DNS Server** to your DC's IP (`192.168.1.10`).
   - *Without this, the PC cannot find the domain.*
2. **Join the Domain:**
   - Right-click **This PC** → **Properties** → **Rename this PC (Advanced)** or **Change Settings**.
   - Click **Change...**
   - Switch from **Workgroup** to **Domain**.
   - Type your domain: `corp.local`.
3. **Authenticate:**
   - Enter `Administrator` and your Server Password when prompted.
4. **Reboot** the client PC.
5. Log in as the new user: `corp\jdoe`.
