# Workgroup DNS & DHCP Server Setup
## *(NO DOMAIN)*

For isolated networks, home labs, or small offices, you can run a "Workgroup" DNS/DHCP server. This allows you to resolve local hostnames (like `myserver.lan`) and manage IP addresses centrally without needing a full Active Directory Domain.

> **⚠ Network Warning:** Do not plug this server into an existing network (like your corporate office) if there is already a DHCP server running. Two DHCP servers on the same LAN will cause IP conflicts and take down the network.

---

## Step 1: Set a Static IP (Mandatory)
A server providing infrastructure services **must** have a static IP address so clients always know where to find it.

1. Open **Control Panel > Network and Sharing Center**.
2. Click **Change adapter settings**.
3. Right-click your network adapter → **Properties**.
4. Select **Internet Protocol Version 4 (TCP/IPv4)** → **Properties**.
5. **Use the following IP address** (Example configuration):
   - **IP Address:** `192.168.1.10`
   - **Subnet mask:** `255.255.255.0`
   - **Default gateway:** `192.168.1.1` (Your internet router)
6. **Use the following DNS server addresses:**
   - **Preferred DNS server:** `127.0.0.1` (Point to itself)
   - **Alternate DNS server:** `8.8.8.8` (Google, for backup)

---

## Step 2: Install Roles
1. Open **Server Manager**.
2. Click **Add Roles and Features**.
3. Select **Role-based or feature-based installation**.
4. Select your local server.
5. On **Server Roles**, check:
   - ✅ **DHCP Server**
   - ✅ **DNS Server**
6. Finish the installation.

---

## Step 3: Configure DNS (The "Phonebook")
You need a "Zone" to store your local names. Since we have no domain, we will create a standalone Primary Zone.

1. Open **DNS Manager** (`dnsmgmt.msc`).
2. Right-click your server name → **New Zone...**
3. **Zone Type:** Select **Primary zone**.
   - *Note: "Store the zone in Active Directory" will be disabled.*
4. **Zone Name:** Enter a suffix for your network (e.g., `lan.local` or `office.internal`).
5. **Zone File:** Accept the default (`lan.local.dns`).
6. **Dynamic Updates:** Select **Do not allow dynamic updates** (safest for Workgroups).
7. Click **Finish**.

### Add "Forwarders" (For Internet Access)
This tells your server: "If you don't know the answer (like google.com), ask 8.8.8.8."

1. In DNS Manager, right-click your **Server Name** (top of the tree) → **Properties**.
2. Go to the **Forwarders** tab.
3. Click **Edit...** and add public DNS servers:
   - `1.1.1.1`
   - `8.8.8.8`
4. Click **OK**.

---

## Step 4: Configure DHCP (The "Assigner")
Now we create the "Scope" or pool of addresses the server can hand out.

### 1. Post-Install "Authorization"
1. In Server Manager, click the **Flag icon** (top right notifications).
2. Click **Complete DHCP configuration**.
3. **Important:** Since you are in a Workgroup, select **Skip AD authorization** (if available) or simply **Commit**.
   - *Note: It may say "Failed" regarding AD, but it will succeed locally.*

### 2. Create the Scope
1. Open **DHCP** (`dhcpmgmt.msc`).
2. Expand your server → Right-click **IPv4** → **New Scope...**
3. **Name:** `Office LAN`.
4. **IP Address Range:**
   - Start: `192.168.1.50`
   - End: `192.168.1.200`
   - *Leave 1.1 - 1.49 free for static devices like your Router and Server.*
5. **Lease Duration:** 8 Days (Default).
6. **Configure DHCP Options:** Select **Yes**.
   - **Router (Default Gateway):** Enter your router's IP (e.g., `192.168.1.1`) → **Add**.
   - **DNS Servers:**
     - Remove any auto-detected IPs.
     - Add **YOUR Server's IP** (`192.168.1.10`) → **Add**.
     - *Crucial: This ensures clients ask YOUR server for names, not the router.*
   - **Domain Name:** Enter the zone you created (e.g., `lan.local`).
7. **Activate Scope:** Select **Yes**.

---

## Step 5: Verify Client Connectivity
Go to a client PC (Windows 10/11) on the same network switch.

1. Open Command Prompt (`cmd`).
2. Refresh the connection:
   ```cmd
   ipconfig /release
   ipconfig /renew
   ```
3. Check status:
   ```cmd
   ipconfig /all
   ```
4. **Verify these values:**
   - **DHCP Server:** `192.168.1.10`
   - **DNS Servers:** `192.168.1.10`
   - **Connection-specific DNS Suffix:** `lan.local`

---

## Troubleshooting Checklist

1. **Clients have no Internet?**
   - Check **Step 3 (Forwarders)**. If your server doesn't know where `8.8.8.8` is, it can't resolve web pages for clients.
   - Check the **Server's own DNS settings** in Step 1. It must point to `127.0.0.1` or `8.8.8.8` to resolve names itself.

2. **Clients getting "169.254.x.x" IP?**
   - This means DHCP failed to reach the client.
   - Check **Services.msc** and ensure **DHCP Server** is "Running".
   - Check Firewall (`wf.msc`) and ensure **DHCP Server (UDP-In)** rules are enabled.

3. **Server Name Resolution Failing?**
   - If clients can't ping `printer.lan.local`, you may need to manually add "A Records" in your DNS zone for those static devices.
