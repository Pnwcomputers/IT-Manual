# Workgroup DNS & DHCP Server Setup
## *(NO DOMAIN)*

For isolated networks or home labs, you can run a "Workgroup" DNS/DHCP server. This allows you to resolve local hostnames (like `myserver.lan`) and manage IP addresses centrally without Active Directory.

> **⚠ Warning:** Ensure no other DHCP server (like your ISP Router) is active on this network. Multiple DHCP servers will cause IP conflicts.

---

## Step 1: Set a Static IP (Mandatory)
The server must have a fixed address to function as a reliable DNS/DHCP provider.

1. Open **Network Connections** (`ncpa.cpl`).
2. Right-click your adapter → **Properties**.
3. Select **IPv4** → **Properties**.
4. Set a static configuration (Example):
   - **IP Address:** `192.168.1.10`
   - **Subnet Mask:** `255.255.255.0`
   - **Gateway:** `192.168.1.1` (Your internet router)
5. **Important DNS Settings:**
   - **Preferred DNS:** `127.0.0.1` (Point to itself)
   - **Alternate DNS:** `8.8.8.8` (External backup)

---

## Step 2: Install Roles
1. Open **Server Manager**.
2. Manage → **Add Roles and Features**.
3. Select **Role-based or feature-based installation**.
4. Check these two roles:
   - ✅ **DHCP Server**
   - ✅ **DNS Server**
5. Complete the installation.

---

## Step 3: Configure DNS (The "Phonebook")
We will create a local zone for your private network names.

1. Open **DNS Manager** (`dnsmgmt.msc`).
2. Right-click your server → **New Zone...**
   - **Type:** Primary Zone.
   - **Zone Name:** `lan.local` (or your preferred suffix).
   - **Dynamic Updates:** "Do not allow" (safest) or "Nonsecure and secure".
3. **Configure Internet Forwarding:**
   - Right-click your Server Name (in the left tree) → **Properties**.
   - Go to the **Forwarders** tab.
   - Click **Edit** and add `1.1.1.1` or `8.8.8.8`.
   - *This ensures the server can resolve "google.com" for your clients.*

---

## Step 4: Configure DHCP (The "Assigner")
We will create a pool of IP addresses to hand out to clients.

### 1. "Authorize" the Server
1. In Server Manager, look for the **Yellow Flag** (top right).
2. Click **Complete DHCP configuration**.
3. **Important:** Since this is a Workgroup, choose **Skip AD Authorization** (if available) or simply **Commit**. You do not need Enterprise Admin credentials here.

### 2. Create the Scope
1. Open **DHCP Manager** (`dhcpmgmt.msc`).
2. Expand your server → Right-click **IPv4** → **New Scope...**
3. Follow the wizard:
   - **Name:** `Office LAN`
   - **Start IP:** `192.168.1.50`
   - **End IP:** `192.168.1.200`
   - **Subnet Mask:** `255.255.255.0`
4. **Scope Options (Crucial):**
   - **Router (Default Gateway):** Enter your actual router IP (e.g., `192.168.1.1`).
   - **DNS Server:** Remove everything and add **YOUR Server's IP** (`192.168.1.10`).
   - *This forces clients to use your new DNS server for name resolution.*

---

## Step 5: Verify Client Connectivity
On a client PC connected to the same switch:

1. Open Command Prompt.
2. Run:
   ```cmd
   ipconfig /release
   ipconfig /renew
