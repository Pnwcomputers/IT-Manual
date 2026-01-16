# Supported Workgroup RDS Install (NO DOMAIN)

Microsoft’s official stance is that Remote Desktop Services (RDS) generally requires an Active Directory Domain. However, for small environments, standalone servers, or specific test cases, you can set up a **Workgroup RDS Deployment**.

This guide covers how to install the RDS roles manually, configure licensing without a domain controller, and strictly manage local user access using `lusrmgr`, `secpol`, and Modern Settings.

> **⚠ Important Warning:** This guide focuses on a **Workgroup** setup. If you require strict Per-User CAL enforcement or advanced features like RD Gateway, a Domain environment is the only fully supported path.

---

## Step 1: Install RDS Roles Manually
**Do NOT use the "Quick Start" deployment.** It installs unnecessary components that rely on a domain.

1. Open **Server Manager**.
2. Click **Add Roles and Features**.
3. Choose **Role-based or feature-based installation**.
4. Select your local server.
5. On **Server Roles**, check only these two:
   - ✅ **Remote Desktop Session Host**
   - ✅ **Remote Desktop Licensing**
6. **Do NOT install:** RD Gateway, RD Web Access, or RD Connection Broker.
7. Finish the installation and **Reboot** the server.

---

## Step 2: Enable RDS Mode
Once the server reboots, ensure it isn't stuck in "Admin" mode.

1. Open Command Prompt (Admin).
2. Run the query command:
    ```cmd
    change user /query
    ```
3. You want to see: **Application EXECUTE mode is enabled**.
4. If it says "Install mode," run:
    ```cmd
    change user /execute
    ```

---

## Step 3: Activate the License Server
Even without a domain, you must activate the licensing service to issue CALs.

1. Open **Remote Desktop Licensing Manager**.
2. Right-click your server name and select **Activate Server**.
3. Choose **Automatic (Internet)** connection method.
4. **Install your Licenses:**
   - **Per-Device CALs:** Recommended for Workgroups. Strictly enforced by the server.
   - **Per-User CALs:** Works via a registry tweak (see Step 4), but there is **no enforcement**. It is an "Honor System" based on the paper licenses you own.

---

## Step 4: Configure Licensing via Local GPO
Because there is no Domain Controller, you must hard-code the licensing path in Local Group Policy.

1. Run `gpedit.msc`.
2. Navigate to:
   `Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Licensing`
3. **Configure these two settings:**
   - **Set the Remote Desktop licensing mode:** Enabled → **Per Device** (or Per User).
   - **Use the specified Remote Desktop license servers:** Enabled → `localhost`.
4. Force the update:
    ```cmd
    gpupdate /force
    ```

---

## Step 5: Create and Assign Users
Since there is no Active Directory, you must create users locally and explicitly grant them RDP access.

### 1. Create the Users (`lusrmgr.msc`)
1. Press `Win + R`, type `lusrmgr.msc`, and hit Enter.
2. Right-click **Users** → **New User**.
3. Create your users (e.g., `User1`, `User2`) and set their passwords.

### 2. Add to "Remote Desktop Users" Group
You can do this via the legacy GUI, but the Modern Settings menu is often faster for verification.

1. Open Windows **Settings** (Gear icon).
2. Navigate to **System > Remote Desktop**.
3. Click **Remote Desktop users**.
4. Click **Add** and search/type the names of the local users you just created.
   * *Note: This automatically adds them to the local "Remote Desktop Users" group.*

---

## Step 6: Critical Security Policy (The "LSP" Fix)
In Workgroup environments, simply adding a user to the group sometimes isn't enough. You must verify the **Local Security Policy** actually allows that group to log in.

1. Press `Win + R`, type `secpol.msc`, and hit Enter.
2. Navigate to:
   `Local Policies > User Rights Assignment`
3. Locate the policy: **Allow log on through Remote Desktop Services**.
4. Double-click it and ensure the following are listed:
   - `Administrators`
   - `Remote Desktop Users`
   - *(Optional)* Specific local usernames if the group isn't working.
5. **Critical Check:** Look for **Deny log on through Remote Desktop Services** in the same list. Ensure your users are **NOT** listed there.

---

## Step 7: Set Session Limits
In a Workgroup, idle sessions can hang indefinitely, lock files, and consume RAM.

1. Open `gpedit.msc`.
2. Navigate to:
   `Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Session Time Limits`
3. **Recommended Settings:**
   - **Idle Session Limit:** 1 Hour.
   - **Disconnected Session Limit:** 30 Minutes.
   - **End session when time limits are reached:** Enabled.

---

## Troubleshooting Checklist
If a user cannot log in, check these three layers in order:

1. **Does the user exist?**
   - Check: `lusrmgr.msc`
2. **Is the user in the group?**
   - Check: `System > Remote Desktop`
3. **Is the group allowed to log in?**
   - Check: `secpol.msc` > User Rights Assignment
