# Workgroup File Server & Public Share Guide
## *(NO DOMAIN)*

Setting up a file share in a Workgroup environment (no Active Directory) requires handling permissions differently than in a Domain. By default, Windows blocks unauthenticated access.

This guide covers how to set up a **"Public" Share** (accessible by anyone on the local network without a specific user account) and a standard secure share.

> **⚠ Security Warning:** A "Public" share with "Password Protected Sharing" turned **OFF** means *anyone* who connects to your Wi-Fi or LAN can read/write these files. Use this only for trusted internal networks.

---

## Step 1: Install File Server Role
While Windows Server comes with basic file capabilities, installing the full role ensures you have the proper management tools (fsrm, etc.).

1. Open **Server Manager**.
2. Click **Add Roles and Features**.
3. Skip to **Server Roles**.
4. Expand **File and Storage Services** > **File and iSCSI Services**.
5. Check:
   - ✅ **File Server**
   - ✅ **File Server Resource Manager** (Optional, but good for quotas/monitoring).
6. Finish the installation.

---

## Step 2: Configure Network Discovery & Password Sharing
For a "Public" share to work without prompting for a password, you must disable password-protected sharing.

1. Open **Control Panel** (classic view).
2. Go to **Network and Sharing Center**.
3. Click **Change advanced sharing settings** (left sidebar).
4. Expand **Private** (or Current Profile):
   - ✅ **Turn on network discovery**.
   - ✅ **Turn on file and printer sharing**.
5. Expand **All Networks** (at the bottom):
   - ✅ **Turn off password protected sharing**.
   - *Note: If you leave this ON, users must have a local account on the server to access even "Public" folders.*
6. Click **Save changes**.

---

## Step 3: Create the Folder Structure
It is best practice to keep shares off the `C:` drive (system drive) if possible to prevent the OS from filling up.

1. Open File Explorer.
2. Navigate to your data drive (e.g., `D:\`).
3. Create a folder named `CompanyData` (or similar).
4. Inside that, create your subfolder: `PublicShare`.

---

## Step 4: Create the Share (The "Door" Permissions)
Windows has two layers of security: **Share Permissions** (the network door) and **NTFS Permissions** (the local file lock). For a public share, we open both.

1. Right-click the `PublicShare` folder > **Properties**.
2. Go to the **Sharing** tab.
3. Click **Advanced Sharing**.
4. Check **Share this folder**.
5. Click **Permissions**:
   - Highlight **Everyone**.
   - Check **Allow** for **Full Control** (or Change/Read depending on needs).
   - Click **OK**.
6. Click **OK** again to close Advanced Sharing.

---

## Step 5: Configure NTFS Permissions (The "Lock" Permissions)
Even if the Share is open, the file system will block access if NTFS is restrictive.

1. Switch to the **Security** tab (in the same Properties window).
2. Click **Edit...** > **Add...**.
3. Type `Everyone` and click **Check Names** > **OK**.
4. With **Everyone** highlighted:
   - Check **Allow** for **Modify** (allows reading, writing, deleting, but not changing owner).
   - *Security Tip: Avoid "Full Control" here unless users need to change permissions.*
5. Click **OK** > **OK**.

---

## Step 6: Verify Firewall Rules
If users cannot connect, the Windows Firewall is usually the blocker.

1. Open **Run** (`Win + R`) and type `wf.msc`.
2. Click **Inbound Rules**.
3. Ensure the following rules are **Enabled** (Green Checkmark):
   - `File and Printer Sharing (SMB-In)`
   - `File and Printer Sharing (NB-Session-In)`
4. If they are gray/disabled, right-click them and select **Enable Rule**.

---

## Step 7: How to Connect (Client Side)
Since there is no domain to publish shares, users must map the drive manually.

### Method A: Network Browse
1. Open File Explorer on a client PC.
2. Click **Network** in the sidebar.
3. If discovery is on, you should see the `SERVERNAME`.
4. Double-click it. You should see `PublicShare` and be able to open it without a password.

### Method B: Map Network Drive (Persistent)
1. Open File Explorer > **This PC**.
2. Click **Map network drive** (in the ribbon "Computer" tab).
3. **Drive:** Select a letter (e.g., `P:`).
4. **Folder:** `\\SERVERNAME\PublicShare` (or use IP: `\\192.168.1.10\PublicShare`).
5. Check **Reconnect at sign-in**.
6. Click **Finish**.

---

## Troubleshooting Checklist

1. **"Access Denied" Error?**
   - Check **Step 5**: Did you add "Everyone" to the **Security** tab?
   - Check **Step 2**: Did you turn off Password Protected Sharing in "All Networks"?

2. **"Network Path Not Found"?**
   - Check **Step 6**: Is the Firewall blocking SMB?
   - Try connecting via IP address instead of name (`\\192.168.x.x\Share`).

3. **Asking for a Username/Password?**
   - This means "Password Protected Sharing" is still active, OR the client PC thinks the network is "Public" and is blocking unauthenticated traffic.
   - **Fix:** On the client PC, ensure the network connection type is set to **Private** (Work), not Public.
  
***
