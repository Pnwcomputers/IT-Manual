# 🔒 Find Passwords/Password Help

This guide details methods for retrieving saved account login information from web browsers and local operating system credential managers.

---

## 1. Web Browser Passwords

Most modern browsers save passwords for accounts. Viewing these credentials usually requires the computer's login password for security.

| Browser | Access Path | Key Notes |
| :--- | :--- | :--- |
| **Google Chrome** | Open Chrome and go to **Settings $\rightarrow$ Autofill $\rightarrow$ Password Manager**. Or go to the [Google Password Manager Page](https://passwords.google.com/) | Requires the device login password to view. |
| [**Microsoft Edge**](https://support.microsoft.com/en-us/topic/edit-your-passwords-in-microsoft-edge-38ef988f-5a65-4c6a-9db8-937995d3ae31) | Go to **Settings $\rightarrow$ Profiles $\rightarrow$ Passwords**. | Requires the device login password to view. |
| [**Mozilla Firefox**](https://support.mozilla.org/en-US/kb/manage-your-logins-firefox-password-manager) | Go to **Settings $\rightarrow$ Privacy \& Security $\rightarrow$ Saved Logins**. | Requires device login password or Firefox Master Password if set. |
| [**Safari (Mac)**](https://support.apple.com/en-us/105115) | Open **Safari $\rightarrow$ Preferences $\rightarrow$ Passwords**. | Requires the Mac's login password to view. |

---

## 2. Email Account Passwords

If an email account password is not saved in a browser, check the local system's credential storage or the email client itself.

### Check Existing Email Configuration
* Open the email client ([Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/outlook-for-windows), [Thunderbird](https://www.thunderbird.net/en-US/), etc.).
* Check **account settings** for saved server configurations (incoming/outgoing servers, ports) and any visible password fields. *(Note: Passwords are often masked or not fully displayed in the client.)*

### Windows Credential Manager
* Search for [**Credential Manager**](https://support.microsoft.com/en-us/windows/credential-manager-in-windows-1b5c916a-6a16-889f-8581-fc16e8165ac0) in the the Windows Control Panel.
* Check under [**Web Credentials**](https://support.microsoft.com/en-us/windows/credential-manager-in-windows-1b5c916a-6a16-889f-8581-fc16e8165ac0) and **Windows Credentials** (or Generic Credentials) for saved application and email passwords.

### Keychain Access (macOS)
* Open [**Keychain Access**](https://support.apple.com/guide/keychain-access/what-is-keychain-access-kyca1083/mac) ($\text{Applications} \rightarrow \text{Utilities}$).
* Search for the email account by name.
* Double-click the entry and check the password field (requires the Mac's login credentials).
