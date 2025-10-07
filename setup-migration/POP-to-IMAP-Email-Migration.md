# 📮 POP to IMAP Email Migration

This recommended process details how to migrate a single email address setup from using the old POP protocol to the modern IMAP protocol, ensuring local data is preserved and then uploaded to the server.

[Full Google Form Checklist - Click Here!]

---

## ✅ Step 1. Backup Existing Email Data

If using Outlook, POP accounts store data locally in PST files. This data must be backed up before changing settings.

* **Export Data File:** Go to **File $\rightarrow$ Open & Export $\rightarrow$ Import/Export $\rightarrow$ Export to a file $\rightarrow$ Outlook Data File (.pst)**.
* Export all folders to create a full backup before changing settings.
* The currently used PST file(s) should contain all needed data from the previous POP account setup.
* **Recommendation:** It is still recommended that you backup **Contacts, Email Rules, and Calendars individually** nonetheless.

---

## ✅ Step 2. Create a New Outlook Profile & Add IMAP Account

You must create a new profile to avoid conflicts when changing the core account type.

### For Outlook 2016, 2019, 2021, and Microsoft 365

1.  **Close Outlook** completely.
2.  **Open Control Panel.** (Press $\text{Windows} + \text{S}$, type `Control Panel`, and open it).
3.  Click **Mail (Microsoft Outlook)**. *(If you don’t see it, change View by to Small icons or Large icons).*
4.  In the Mail Setup window, click **Show Profiles**.
5.  Click **Add…**
6.  Enter a name for the new profile (e.g., `Outlook IMAP Migration`), then click **OK**.
7.  **Follow the Add Account wizard:**
    * Enter the email address $\rightarrow$ Choose **IMAP**.
    * Input **IMAP server settings** (incoming and outgoing) as provided by the email host.
8.  **Set Profile Usage (Final Step):**
    * After setup completes, return to the Mail Profiles window.
    * Under “When starting Microsoft Outlook, use this profile:” choose one option:
        * **"Prompt for a profile to be used"** (if testing alongside old profile) or…
        * **"Always use this profile"** and select your new profile as default.
9.  Click **Apply** and **OK**.
10. **Open Outlook** using the new profile to confirm setup and mail synchronization.

---

## ✅ Step 3. Restore Old Emails from Backup to IMAP Folders

The goal is to move the old emails from the local PST file to the new IMAP folders, which uploads them to the mail server.

### Import From Previously Used, or Exported, PST Data File:

1.  Go to **File $\rightarrow$ Open & Export $\rightarrow$ Open Outlook Data File.**
2.  The exported PST will appear as a **separate mailbox** in Outlook.

### Move emails to IMAP folders (Drag & Drop - RECOMMENDED):

1.  Expand the PST data file in Outlook.
2.  Select emails or folders you wish to migrate.
3.  **Drag and drop** them into your IMAP account folders (e.g., Inbox, Sent Items, or custom folders).

**Tip: If migrating entire folders:**
* Right-click a folder $\rightarrow$ **Copy Folder** $\rightarrow$ choose the destination under your IMAP account.

4.  **Wait for Outlook to upload emails to the IMAP server.** Larger mailboxes or thousands of emails may take hours or even days to fully sync, depending on internet speed and system performance.

### Method B: Import wizard (Less Recommended)

* Go to **File $\rightarrow$ Open & Export $\rightarrow$ Import/Export.**
* Choose **“Import from another program or file”** $\rightarrow$ **Next.**
* Select **“Outlook Data File (.pst)”** $\rightarrow$ **Next.**
* Browse to and select your `.pst` file $\rightarrow$ **Next.**
* Choose the **IMAP account** as the destination for imported data $\rightarrow$ **Finish.**

**🔴 Note:** The Import wizard may place items in default folders, which you might need to move again for proper IMAP folder mapping. Therefore, **Method A (open then drag/drop) is cleaner** and allows full control.

---

## ✅ Step 4. Verify Synchronization

* Check via **webmail** or another device to confirm all old emails are now visible under the IMAP account.

---

## 🔍 Important Notes

* **Contacts and calendars** are not affected by POP/IMAP settings but ensure they are backed up if stored locally.
* **Upload Time:** If the mailbox is very large, upload times may be long depending on the client’s internet connection.
* **Safety:** **Do not delete the PST file backup** even after successfully migrating. It can always be re-accessed for data if ever needed.
