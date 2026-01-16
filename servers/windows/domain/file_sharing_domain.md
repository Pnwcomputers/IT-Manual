# Domain File Server Setup Guide (AD INTEGRATED)

Setting up a file server in an **Active Directory Domain** is more secure and manageable than in a Workgroup.

Instead of managing "Everyone" or local users, we use **Domain Security Groups** (e.g., `CORP\Marketing`) to control who sees what.

---

## Step 1: Install File Server Role
1. Open **Server Manager**.
2. Click **Add Roles and Features**.
3. Skip to **Server Roles**.
4. Expand **File and Storage Services** > **File and iSCSI Services**.
5. Check:
   - ✅ **File Server**
   - ✅ **File Server Resource Manager** (Highly recommended for quotas and screening).
6. Finish the installation.

---

## Step 2: Create AD Security Groups
**Rule of Thumb:** Never assign permissions to individual users. Always use groups.

1. Log in to your **Domain Controller** (or use RSAT).
2. Open **Active Directory Users and Computers** (`dsa.msc`).
3. Create new **Security Groups** based on function:
   - `FS_Public_RW` (Read/Write access to Public)
   - `FS_Management_RW` (Read/Write access to Management)
4. Add your users to these groups.
   - *Tip: Changes to group membership require the user to log off and back on to take effect.*

---

## Step 3: Create the Share
We will use the "Advanced Sharing" method for granular control.

1. On the File Server, create your folder structure (e.g., `D:\CompanyData\Public`).
2. Right-click the folder > **Properties** > **Sharing** > **Advanced Sharing**.
3. Check **Share this folder**.
4. **Share Permissions (The "Door"):**
   - Remove `Everyone`.
   - Add `Domain Users` (or `Authenticated Users`).
   - Grant **Full Control**.
   - *Note: In a domain, we leave the "Share" door wide open and rely on NTFS (Step 4) to lock it down. This prevents conflicting permission issues.*

---

## Step 4: Configure NTFS Permissions (The "Lock")
This is where the actual security happens.

1. Switch to the **Security** tab.
2. Click **Advanced** > **Disable Inheritance** > **Convert inherited permissions...**.
3. **Clean up:** Remove `Users` or `Everyone` if present. Keep `SYSTEM` and `Administrators`.
4. **Add your Group:**
   - Click **Add** > **Select a principal** > Type `FS_Public_RW` (your AD group).
   - **Type:** Allow.
   - **Applies to:** This folder, subfolders, and files.
   - **Basic Permissions:** Check **Modify**.
     - *Avoid "Full Control" for users, as it allows them to mess with permissions.*
5. Click **OK** > **OK**.

---

## Step 5: Publish via Group Policy (Drive Maps)
In a Domain, users shouldn't have to map drives manually. We use GPO to do it for them.

1. Open **Group Policy Management** (`gpmc.msc`) on your DC.
2. Create a new GPO named `Drive Maps - Public` and link it to your Users OU.
3. Edit the GPO and navigate to:
   `User Configuration > Preferences > Windows Settings > Drive Maps`
4. Right-click > **New** > **Mapped Drive**.
5. **General Tab:**
   - **Action:** Update.
   - **Location:** `\\FILESERVER\Public` (Use FQDN if possible: `\\fs01.corp.local\Public`).
   - **Reconnect:** Checked.
   - **Label:** `Public Share`.
   - **Drive Letter:** Use `P:` (or specific letter).
6. **Common Tab (Targeting):**
   - Check **Item-level Targeting** > **Targeting...**.
   - Click **New Item** > **Security Group**.
   - Select the group `FS_Public_RW`.
   - *Result: Only members of this group will get the P: drive mapped.*

---

## Step 6: Verify Access
1. Log in as a user on a domain-joined PC.
2. Open **File Explorer**.
3. You should automatically see the **P: Drive** (Public Share).
4. Try to create a file.
   - **Success:** NTFS permissions are working.
5. Try to access a folder you *don't* have permission for.
   - **Access Denied:** Security is working.

---

## Troubleshooting Checklist

1. **Drive not mapping?**
   - Run `gpupdate /force` on the client PC.
   - Check `gpresult /r` to see if the "Drive Maps" GPO is applying.
   - Ensure the user is actually in the `FS_Public_RW` group.

2. **Access Denied on a mapped drive?**
   - Check **NTFS Permissions** (Step 4). Does the group have "Modify"?
   - Check **Share Permissions** (Step 3). Does `Domain Users` have "Full Control"? (Remember: Share Permissions + NTFS Permissions are combined, and the *most restrictive* wins).

3. **Slow access?**
   - Ensure DNS is working correctly. Always map drives using the **FQDN** (`fs01.corp.local`) rather than just the NetBIOS name (`fs01`) or IP address.
