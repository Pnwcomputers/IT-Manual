# 📶 Local Wi-Fi, Network Info & Login Retrieval

When assisting a client with network setup or migration, retrieving saved Wi-Fi credentials and account logins is often necessary. Always ensure you have **explicit client permission** before accessing or transferring sensitive data.

---

## 1. Retrieving Wi-Fi Network Information

### 💻 Windows Computer

#### Method 1: Command Prompt (Best for all saved networks)
1.  Open **Command Prompt as Administrator** ($\text{Win} + \text{X}$ and select Windows Terminal or Command Prompt (Admin)).
2.  Run the command to list saved profiles:
    ```sql
    netsh wlan show profiles
    ```
3.  Note the desired network name (**SSID**) listed under "User Profiles."
4.  Run the command below, replacing `NETWORK_NAME` with the SSID:
    ```arduino
    netsh wlan show profile name="NETWORK_NAME" key=clear
    ```
5.  Look for **"Key Content"** under "Security settings"; this is the Wi-Fi password.

#### Method 2: Network Settings (For the currently connected network)
1.  Go to **Control Panel $\rightarrow$ Network and Sharing Center**.
2.  Click on the **active Wi-Fi connection** and select **Wireless Properties**.
3.  Under the **Security tab**, check **Show Characters** to view the password.

### 🍎 macOS

#### Method 1: Keychain Access
1.  Open **Keychain Access** from **Applications $\rightarrow$ Utilities**.
2.  Search for the **Wi-Fi network name** in the search bar.
3.  Double-click the network, and check **Show password** (this requires the Mac's login credentials).

---

## 2. Retrieving Account Login Information

### Web Browser Passwords

Most modern browsers securely save passwords. Viewing them requires the device's login password.

| Browser | Access Path |
| :--- | :--- |
| **Google Chrome** | Settings $\rightarrow$ Autofill $\rightarrow$ Password Manager |
| **Microsoft Edge** | Settings $\rightarrow$ Profiles $\rightarrow$ Passwords |
| **Mozilla Firefox** | Settings $\rightarrow$ Privacy & Security $\rightarrow$ Saved Logins |
| **Safari (Mac)** | Safari $\rightarrow$ Preferences $\rightarrow$ Passwords |

### Email Accounts and Other Credentials

#### Built-in System Tools (Preferred Method)
1.  **Windows Credential Manager:**
    * Search for **Credential Manager** in the Start Menu.
    * Check under **Web Credentials** and **Windows Credentials** (or **Generic Credentials**) for saved application/email passwords.
2.  **macOS Keychain Access:**
    * Open **Keychain Access**.
    * Search for the email account or application by name and check the password field.

#### Outlook Email Settings (Preferred)
The password is NOT displayed in plain text, but server settings can be found:
1.  Open **Outlook $\rightarrow$ File $\rightarrow$ Account Settings $\rightarrow$ Account Settings**.
2.  Select the email account and click **Change** to view server settings (incoming/outgoing servers, port numbers, encryption methods, etc.).

---

## ⚠️ Using MailPassView or Similar Tools

Tools like MailPassView (from NirSoft) can extract email account information (including passwords) from clients like Outlook and Thunderbird, but they come with **Important Considerations**:

* **Security and Legality:** These tools are often flagged by antivirus software as **Potentially Unwanted Programs (PUPs)**. **Always ensure you have explicit client permission before use.**
* **Alternative Approach (Recommended):** Attempt to retrieve credentials using the **built-in system tools (Credential Manager / Keychain Access)** first.

### MailPassView Usage (If client consents)
1.  **Download and Use:** Download from the official NirSoft website. The tool typically runs without installation.
2.  **Precautions:**
    * You may need to **temporarily disable antivirus software** as it might block the tool.
    * **After usage, delete the tool** to avoid unnecessary risk.
    * **Store retrieved credentials securely** (e.g., in a password manager).

---

## Final Recommendations & Important Considerations

* **Client Approval:** **Always confirm client approval** for retrieving and transferring this data for security and privacy reasons.
* **Data Transfer:** If migrating passwords and settings to a new computer, **use a secure password manager** (like LastPass, 1Password, or Bitwarden) for transfer.
* **Best Practice:** Encourage the client to migrate all credentials to a secure password manager for better long-term management and security.
