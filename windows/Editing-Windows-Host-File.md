# 📁 Editing Windows Host File

The Windows **hosts file** is a plain text file used to map hostnames to IP addresses. It is a critical, low-level component that can be used to override DNS settings locally.

> **Note:** This procedure works **ONLY IF** the target network device(s) has a **STATIC IP**. Ensure you **SET A DEVICE STATIC IP IF/AS NEEDED!**

---

## Common Reasons to Modify the Hosts File

1.  **Redirecting Domains:** To point a domain to a different IP address for development or testing purposes.
2.  **Blocking Websites:** To prevent access to specific websites by redirecting them to a non-existent or loopback IP (e.g., `0.0.0.0`).
3.  **Testing Server Changes:** To test changes on a staging server by pointing a domain to the staging server's IP instead of the production server.
4.  **Improving Local Network Access & Performance:**
    * Used to create a static **"direct link"** to resolve local network hostnames when experiencing general network device access issues (e.g., DNS or network bugs).
    * Resolves local network hostnames faster without querying a DNS server.
    * **Always triple check** a system's file and print sharing setup/settings before modifying the hosts file.
5.  **Bypassing DNS:** To bypass the DNS settings for specific domains, useful for troubleshooting DNS issues (e.g., the static link bypass).

---

## Procedure to Modify the Windows Hosts File

### Step 1: Locate the Hosts File

The hosts file is located in the following directory:
C:\Windows\System32\drivers\etc\hosts

### Step 2: Open Notepad as Administrator

1.  **Search for Notepad:** Press $\text{Windows} + \text{S}$, type `Notepad`.
2.  **Run as Administrator:** **Right-click** on Notepad and select **Run as administrator**.

### Step 3: Open the Hosts File in Notepad

1.  In Notepad, click **File $\rightarrow$ Open**.
2.  Navigate to `C:\Windows\System32\drivers\etc`.
3.  In the lower right corner, change the file type from **Text Documents (\*.txt)** to **All Files (\*.\*)**.
4.  Select the **hosts** file and click **Open**.

### Step 4: Modify and Replace the Hosts File (Permissions Bypass)

* **Permissions Note:** You typically **cannot save** the edited file directly back to the `\etc` folder unless using advanced tools. We use a workaround:

1.  **Add Entries:** To add a new entry, type the **IP address** followed by a space or tab, then the **hostname**.
    ```
    127.0.0.1 example.com
    192.168.1.100 localtestserver
    ```
2.  **Save to Desktop:** Click **File $\rightarrow$ Save As** and save the newly edited file to the system's **Desktop**.
3.  **Show File Extensions:** Through the Windows File Explorer, navigate to the Desktop. Under the **"View"** menu, mouse over **"Show"**, and then click **"File Name Extensions"**.
4.  **Rename File:** The modified host file saved to the Desktop will show as **`hosts.txt`**. Rename it by removing the `.txt` extension, so the file simply reads **`hosts`**.
    * *Windows will warn you; accept the change.*
5.  **Backup Original:** Navigate back to the system's host file directory: `C:\Windows\System32\drivers\etc\`
6.  **Rename the system’s current `hosts` file to `hosts.old`** (accept the Windows warning/permission request).
7.  **Copy/Paste New File:** Copy/paste or drag your modified **`hosts`** file from the Desktop to the system’s `\etc` directory.
    * *Windows will ask for Administrative Permission; accept it.*
8.  **Clean Up:** Go back to File Explorer and change the View settings back to **NOT** show file extensions.

### Step 5: Flush DNS Cache (As Needed)

After modifying the hosts file, it is often necessary to flush the DNS cache for changes to take effect immediately.

1.  **Open Command Prompt as Administrator** ($\text{Windows} + \text{S}$, type `cmd`, right-click $\rightarrow$ **Run as administrator**).
2.  Run the command:
    ```bash
    ipconfig /flushdns
    ```

---

## 📝 Example Modifications

| Purpose | Example Entry |
| :--- | :--- |
| **Redirecting to Localhost** | `127.0.0.1 mytestsite.com` |
| **Blocking a Website** | `0.0.0.0 badwebsite.com` |
| **Testing a New Server** | `192.168.1.50 mysite.com` |

## Important Considerations

* **Backup:** By renaming the original hosts file to `hosts.old`, you create an easy backup for reversion if needed.
* **Syntax:** Ensure there are no typos. Use the format: `[IP Address] [Hostname]`.
    * **Comments** can be added using the **`#`** character at the start of the line.
* **Permissions:** Modifying the hosts file **requires administrative privileges**.
