# Windows Server 2025: User & Device Management

How to organize your Active Directory cleanly and join computers to the domain.

---

## Step 1: Create an Organizational Unit (OU) Structure
**Never** put your users/computers in the default "Users" or "Computers" containers (you cannot apply Group Policy to those easily).

1. Open **Active Directory Users and Computers** (`dsa.msc`).
2. Right-click your domain (`corp.internal`) > **New** > **Organizational Unit**.
   - Name: `_CorpData` (Underscore keeps it at the top).
3. Inside `_CorpData`, create sub-OUs:
   - `Users`
   - `Computers`
   - `Groups`
   - `Admin`

---

## Step 2: Create a New User
1. Right-click the `Users` OU > **New** > **User**.
2. **First/Last Name:** `John Doe`.
3. **User logon name:** `jdoe` (or `john.doe`).
4. **Password:**
   - Uncheck "User must change password at next logon" (unless this is a real deployment).
   - Check "Password never expires" (Optional, for service accounts/testing).
5. Click **Finish**.

---

## Step 3: Join a Device to the Domain
Go to a Windows 10/11 Pro computer (Home edition cannot join domains).

1. **DNS Check:**
   - Open Network Settings (Control Panel) on the client.
   - Ensure the **Preferred DNS Server** is manually set to your DC IP (`192.168.10.10`).
   - *Note: If DHCP is working, this should happen automatically.*

2. **Join Domain:**
   - Right-click **This PC** > **Properties**.
   - Click **Rename this PC (Advanced)** or **System Protection** > **Computer Name**.
   - Click **Change...**
   - Switch from Workgroup to **Domain**.
   - Type: `corp.internal`.
   - Enter `Administrator` credentials when prompted.
   - **Reboot**.

3. **Move the Computer Object:**
   - Back on the Server, refresh the default "Computers" container.
   - Drag the new computer object into your `_CorpData > Computers` OU.
