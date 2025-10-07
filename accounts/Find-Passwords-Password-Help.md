# 🔒 Find Passwords/Password Help

This guide details methods for retrieving saved account login information from web browsers and local operating system credential managers.

---

## 1. Web Browser Passwords

Most modern browsers save passwords for accounts. Viewing these credentials usually requires the computer's login password for security.

| Browser | Access Path | Key Notes |
| :--- | :--- | :--- |
| **Google Chrome** | Open Chrome and go to **Settings $\rightarrow$ Autofill $\rightarrow$ Password Manager**. | Requires the device login password to view. |
| **Microsoft Edge** | Go to **Settings $\rightarrow$ Profiles $\rightarrow$ Passwords**. | Requires the device login password to view. |
| **Mozilla Firefox** | Go to **Settings $\rightarrow$ Privacy \& Security $\rightarrow$ Saved Logins**. | Requires device login password or Firefox Master Password if set. |
| **Safari (Mac)** | Open **Safari $\rightarrow$ Preferences $\rightarrow$ Passwords**. | Requires the Mac's login password to view. |

---

## 2. Email Account Passwords

If an email account password is not saved in a browser, check the local system's credential storage or the email client itself.

### Check Existing Email Configuration
* Open the email client (Outlook, Thunderbird, etc.).
* Check **account settings** for saved server configurations (incoming/outgoing servers, ports) and any visible password fields. *(Note: Passwords are often masked or not fully displayed in the client.)*

### Windows Credential Manager
* Search for **Credential Manager** in the Start Menu.
* Check under **Web Credentials** and **Windows Credentials** (or Generic Credentials) for saved application and email passwords.

### Keychain Access (macOS)
* Open **Keychain Access** ($\text{Applications} \rightarrow \text{Utilities}$).
* Search for the email account by name.
* Double-click the entry and check the password field (requires the Mac's login credentials).
