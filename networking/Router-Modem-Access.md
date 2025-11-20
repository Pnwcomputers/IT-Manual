# 🔓 Router/Modem Access via a Web Browser

This guide outlines the steps for accessing your router's or modem's administrative settings using a web browser.

---

## Access Procedure

### Step 1: Connect to the Device
* Ensure your device (PC, laptop, or phone) is connected to the router via **Wi-Fi or Ethernet**.

### Step 2: Find The Device’s IP Address
The router's IP address is also known as the **Default Gateway**.

#### Common Default IPs:
* `192.168.1.1`
* `192.168.0.1`
* `192.168.1.254`
* `10.0.0.1` (Common for Xfinity/Comcast routers)

#### To Confirm Your Router’s IP:
* **Windows:** Open Command Prompt ($\text{Win} + \text{R}$, type `cmd`), then type `ipconfig`. Look for the **Default Gateway**.
* **Mac:** Open Terminal, then type `netstat -nr | grep default`.

### Step 3: Open the Device Web Login Page
1.  Open any web browser (Chrome, Edge, Firefox, Safari).
2.  Type your router’s IP address into the address bar and press **Enter**.

### Step 4: Log In
Enter the **username and password**. These are usually printed on the router's sticker or found in the manual.

#### Common Default Logins:
* **Username:** `admin`
* **Password:** `admin` or `password`

*(If default credentials don't work, check the device's sticker/manual, search Google for the device's default login, or contact the client's manufacturer/ISP.)*

### Step 5: Make Your Changes
Once logged in, you can modify settings such as **Wi-Fi SSID/password**, **static IP assignment**, **security settings**, and **port forwarding**.

### Step 6: Log Out & Reboot (If Needed)
After making changes, **save settings** and **reboot the router** if prompted.

---

## 🔑 Common Default Router & Modem Logins

| Brand | Default IP Address | Default Username | Default Password |
| :--- | :--- | :--- | :--- |
| **Arris** | `192.168.0.1` / `192.168.100.1` | `admin` | `password` |
| **Asus** | `192.168.1.1` | `admin` | `admin` |
| **Belkin** | `192.168.2.1` | `admin` / (blank) | `admin` / (blank) |
| **Cisco** | `192.168.1.1` / `192.168.0.1` | `admin` | `admin` / `cisco` |
| **Comcast Residential** | `10.1.10.1` / `10.0.0.1` | `admin` | `password` |
| **Comcast Business** | `10.1.10.1` / `10.0.0.1` | `cusadmin` | `highspeed` |
| **D-Link** | `192.168.0.1` / `192.168.1.1` | `admin` | `admin` / (blank) |
| **Linksys** | `192.168.1.1` | `admin` | `admin` |
| **Netgear** | `192.168.1.1` / `192.168.0.1` | `admin` | `password` |
| **TP-Link** | `192.168.0.1` / `192.168.1.1` | `admin` | `admin` |
| **Ubiquiti (UniFi)** | `192.168.1.1` | `ubnt` | `ubnt` |
| **ZyXEL** | `192.168.1.1` | `admin` | `1234` |

---

# Legality & Ethics ⚠️
### IMPORTANT: This information is for *authorized* use **only**. Unauthorized access to networks OR network devices is illegal.
