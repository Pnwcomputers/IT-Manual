# 🏦 Find MS Office Product/License Key

Finding your Microsoft Office license information is crucial for verifying your product key, checking your subscription status, or transferring your license.

---

## Method 1: Using an Office Application (Recommended)

This method works for Office 2013, 2016, 2019, and Office 365/Microsoft 365.

1.  **Open an Office Application** (e.g., Word, Excel, or PowerPoint).
2.  Click on **File** in the top-left corner.
3.  Select **Account** (or **Office Account**).
4.  **View Product Information:** Under the Product Information section, you'll see details about your Office product, including the product name and whether it's a subscription or a one-time purchase.

---

## Method 2: Using Command Prompt (To Find Last 5 Digits)

This method displays the license status and the last five characters of the product key, which is usually enough to identify the key in your records.

1.  **Open Command Prompt as Administrator:** Press $\text{Windows} + \text{S}$, type `cmd`, right-click $\rightarrow$ **Run as administrator**.
2.  **Navigate to Office Installation Directory:** Run the command that matches your Office version and installation type (check the bit-ness of your installation):

| Office Version | 64-bit Command | 32-bit Command |
| :--- | :--- | :--- |
| **Office 2016/2019/365** | `cd \Program Files\Microsoft Office\Office16` | `cd \Program Files (x86)\Microsoft Office\Office16` |
| **Office 2013** | `cd \Program Files\Microsoft Office\Office15` | `cd \Program Files (x86)\Microsoft Office\Office15` |

3.  **Run the License Command:**
    ```bash
    cscript ospp.vbs /dstatus
    ```
4.  **View License Information:** Look for the section detailing the **last five characters of the installed product key**.

---

## Method 3: Using Microsoft Account (For Full Keys/Subscriptions)

This is the definitive method for managing and retrieving retail keys associated with your account.

1.  **Sign in to Your Microsoft Account:** Go to the **Microsoft Account page** and sign in with the email address associated with your Office product.
2.  **View Subscriptions and Services:**
    * Under **Subscriptions**, see details about your Office 365/Microsoft 365 subscription.
    * Under **Services & subscriptions**, find information about one-time purchases of Office, where you can often view the full product key or manage the license.

---

## Method 4: Using Registry Editor (Advanced)

*This method is advanced and should be used with caution.*

1.  **Open Registry Editor:** Press $\text{Windows} + \text{R}$, type `regedit`, and press **Enter**.
2.  **Navigate to Office Key:**
    * **Office 2016/2019/365:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Office\16.0\Registration`
    * **Office 2013:** `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Office\15.0\Registration`
3.  **Find Product Information:** Look for a subkey with a long GUID (Globally Unique Identifier). On the right, look for **`DigitalProductID`** or **`ProductID`**, which contains encrypted or partial information about your product key.

---

## Method 5: Use a Third-Party Tool

1.  **Download a Key Finder Tool:** Tools like **Belarc Advisor** or **ProduKey** are designed to extract product keys for installed software, including Microsoft Office.
2.  **Run the Tool:** Install and run the tool, which will scan your system and display product keys for various installed software.
