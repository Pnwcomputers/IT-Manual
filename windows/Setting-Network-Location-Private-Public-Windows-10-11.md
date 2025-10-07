# 📶 Setting Network Location (Private/Public) - Windows 10/11

Ensuring your Windows network is set to **Private** and not Public is crucial for enabling network discovery and file/printer sharing.

---

## 💻 Windows 11 (Recommended Method)

1.  **Open Settings:** Press **$\text{Windows} + \text{I}$**.
2.  **Go to Network & Internet:** Click on **Network & Internet**.
3.  **Select Adapter:** Click on **Wi-Fi** (for wireless) or **Ethernet** (for wired).
4.  **Choose Network:** Click on the network name you are connected to.
5.  **Set Network Profile:** Under "Network profile type," select **Private**.

---

## 💻 Windows 10 (Recommended Method)

1.  **Open Settings:** Press **$\text{Windows} + \text{I}$**.
2.  **Go to Network & Internet:** Click on **Network & Internet**.
3.  **Select Network Status:** In the left sidebar, click on **Status**.
4.  **Change Connection Properties:** Under the network you are connected to, click on **Change connection properties**.
5.  **Set Network Profile:** Under "Network profile," select **Private**.

---

## 🛠️ Alternative Method (Windows 10 & 11)

1.  **Open Control Panel:** Press **$\text{Windows} + \text{R}$**, type `control`, and press **Enter**.
2.  **Go to Network and Sharing Center:** Click on **Network and Sharing Center**.
3.  **Change Network Location:** Next to the network name, click on the **current network location** (which says "Public network" or "Private network").
4.  **Select the Network Location:** Choose **Private** to set the network profile.

---

## 🚀 Using PowerShell (Advanced)

You can quickly change the network profile using an elevated PowerShell prompt.

1.  **Open PowerShell:** Press **$\text{Windows} + \text{X}$** and select **Windows PowerShell (Admin)**.
2.  **Get Network Adapter Index:** Run the following command to find the **InterfaceIndex** number of your network adapter:
    ```powershell
    Get-NetConnectionProfile
    ```
3.  **Set Network Profile to Private:** Use the index number from the previous step in the command below:
    ```powershell
    Set-NetConnectionProfile -InterfaceIndex <IndexNumber> -NetworkCategory Private
    ```
    *(Replace `<IndexNumber>` with the actual number.)*

---

## ✅ Verifying the Network Profile

To ensure the network profile has been set to private:

1.  **Open Settings:** Press **$\text{Windows} + \text{I}$**.
2.  **Go to Network & Internet.**
3.  **Check Network Status:** The status should clearly show the network profile as **Private**.
