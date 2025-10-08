# 📶 Setting Network Location (Private/Public) - Windows 10/11

Ensuring that your Windows network is set to **Private** and not **Public** is crucial for enabling network discovery and file sharing.

---

## Windows 10 (via Settings)

1.  **Open Settings:** Press **Windows + I**.
2.  **Go to Network & Internet:** Click on **Network & Internet**.
3.  **Select Network Status:** In the left sidebar, click on **Status**.
4.  **Change Connection Properties:** Under the network you are connected to, click on **Change connection properties**.
5.  **Set Network Profile:** Under *Network profile*, select **Private**.

---

## Windows 11 (via Settings)

1.  **Open Settings:** Press **Windows + I**.
2.  **Go to Network & Internet:** Click on **Network & Internet**.
3.  **Select Wi-Fi or Ethernet:** Click on **Wi-Fi** (for wireless) or **Ethernet** (for wired).
4.  **Choose Network:** Click on the network you are connected to.
5.  **Set Network Profile:** Under *Network profile type*, select **Private**.

---

## Alternative Method (Control Panel - Windows 10 & 11)

1.  **Open Control Panel:** Press **Windows + R**, type `control`, and press Enter.
2.  **Go to Network and Sharing Center:** Click on **Network and Sharing Center**.
3.  **Change Network Location:** Next to the network name, it will display either *Public network* or *Private network*. Click on the network name.
4.  **Select the Network Location:** Choose **Private** to set the network profile.

---

## Using PowerShell

You can also change the network profile using PowerShell:

1.  **Open PowerShell:** Press **Windows + X** and select **Windows PowerShell (Admin)**.
2.  **Get Network Adapter Index:** Type the following command to get the index number of the network adapter:
    ```powershell
    Get-NetConnectionProfile
    ```
3.  **Set Network Profile to Private:** Use the index number from the previous step in this command (replace `<IndexNumber>`):
    ```powershell
    Set-NetConnectionProfile -InterfaceIndex <IndexNumber> -Networ kCategory Private
    ```

---

## Verifying the Network Profile

To verify that the network profile has been set to private:

1.  **Open Settings:** Press **Windows + I**.
2.  **Go to Network & Internet:** Click on **Network & Internet**.
3.  **Check Network Status:** The network status should show the network profile as **Private**.
