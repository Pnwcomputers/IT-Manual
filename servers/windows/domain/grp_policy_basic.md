# Windows Server 2025: Group Policy Automation

Use Group Policy (GPO) to map drives and install software automatically upon login/boot.

---

## Basics: Creating a GPO
1. Open **Group Policy Management** (`gpmc.msc`).
2. Expand your Forest > Domain > `corp.internal` > `_CorpData`.
3. Right-click `Users` OU > **Create a GPO in this domain, and Link it here...**
   - Name: `User_Standard_Config`.
4. Right-click the new GPO > **Edit**.

---

## Task A: Auto-Map Network Drive
1. In the GPO Editor, navigate to:
   `User Configuration > Preferences > Windows Settings > Drive Maps`
2. Right-click > **New** > **Mapped Drive**.
3. **General Tab:**
   - **Action:** Update.
   - **Location:** `\\DC01\HR_Docs` (Use the share path).
   - **Reconnect:** Checked.
   - **Label:** `HR Files`.
   - **Drive Letter:** `H:`
4. **Common Tab (Item Level Targeting):**
   - Check **Item-level targeting** > **Targeting...**
   - Click **New Item** > **Security Group**.
   - Select group `FS_Department_HR_RW`.
   - *Result: Only HR members get the H: drive mapped.*

---

## Task B: Auto-Install Software (MSI)
*Note: This works best with .MSI files. EXE files usually require scripting.*

1. **Prepare the Source:**
   - Put the MSI file (e.g., `Chrome.msi`) in a shared folder accessible by everyone (Read-Only).
   - Example path: `\\DC01\Software\Chrome.msi`.
2. **Create GPO:**
   - Link a new GPO to the `Computers` OU named `Deploy_Chrome`.
3. **Edit GPO:**
   - Navigate to `Computer Configuration > Policies > Software Settings > Software installation`.
4. Right-click > **New** > **Package**.
5. Browse to the **UNC PATH** (`\\DC01\Software\Chrome.msi`). *Do not use C:\...*
6. Select **Assigned**.
7. Click **OK**.

**Result:** The next time the computer reboots, it will install Chrome before the login screen appears.

---

## Task C: Disable "Server Manager" on Login (Optional)
If you RDP into the server often, this popup gets annoying.

1. Navigate to:
   `Computer Configuration > Policies > Admin Templates > System > Server Manager`
2. Enable: **Do not display Server Manager automatically at logon**.
