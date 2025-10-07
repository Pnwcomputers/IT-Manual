# 🏢 Network Migration (Old → New)

This checklist provides a structured procedure for migrating a network from old hardware to new hardware, emphasizing configuration preservation and verification.

---

## 1. OLD NETWORK: Pre-Setup Configuration Notes

The goal here is to record *every* detail of the current network to ensure the new setup functions identically.

### 📝 Information to Back Up & Note:
1.  **Current Network Device/Router Login Information**
2.  **Current DHCP Settings:** Gateway IP, DNS servers, DHCP range, etc.
3.  **WAN/Modem Static IP Information:** If applicable/as needed.
4.  **Current IP Address Range:**
    * `192.168.1.1` or `192.168.0.1`
    * `10.0.0.1` or `10.1.10.1`
    * *Etc.*
5.  **Current Wi-Fi SSID(s) and associated Access Password(s)**
6.  **Current Static IP Assignments:** For computers, printers, scanners, VoIP phones, network cameras, etc. (Record both **IP Address** and **MAC Address**).
7.  **Current Port Configurations, Port Forwarding, Port Triggering:** If applicable/as needed (e.g., `IP Address:443`, `IP Address:8080`, etc.).
8.  **Current VLAN or VPN Configurations** and appropriate settings.
9.  **Server Access** for client systems, **Network Shares** for client systems, etc.

---

## 2. NEW NETWORK: Pre-Setup Configuration

This phase involves setting up the new hardware in a controlled, isolated environment before deployment.

### 💨 Temporary Setup (Air-Gapped)
* **Unbox** the new hardware and assemble a **temporary, air-gapped** set up to start pre-configuration.
* **ONLY** connect the **WAN port** of the new router to the modem initially!

### ⚙️ Configure New Hardware to Match Previous Network:
1.  **Recreate Login Information** for New Device Access (make it the same as the old router's login, or as close as possible).
2.  **Recreate DHCP Settings & IP Range.**
3.  **Recreate Static IP Reservations** (if possible, using noted MAC addresses).
4.  **Recreate VLAN Configuration** (if applicable).
5.  **Recreate Port Configurations** (Port Forwarding, etc. if applicable).
6.  **Recreate Wi-Fi SSID & Password** (must be identical to minimize client reconfiguration).

### ✅ Double & Triple Check EVERYTHING!
* **Triple check** that the new hardware is configured to be as **close to identical** as possible to the old configuration before the swap.
* **Static IP Note:** Device static IP assignments (reservations) may need to wait until the devices are connected. If so:
    * Set the **local devices** to their needed static IP addresses through the computer's network configuration settings temporarily.
    * Once the new router is installed, assign the static IP reservations through the **new router's interface**.
    * Finally, set the local devices back to **Automatic DHCP**. The router will then assign the appropriate static IP based on the reservation.
* **CRITICAL:** No matter the method, ensure you have recorded **ALL needed information** (hostnames, MAC addresses, etc.) for quick configuration after the swap.

---

## 3. NEW NETWORK: Change Over Process

This is the physical swap and post-configuration validation phase.

1.  **Disconnect Old Hardware:** **FULLY DISCONNECT** the old hardware (ensure no power).
2.  **Install New Network Hardware.**
3.  **Login** to the new router’s web interface to verify basic status.
4.  Make sure all **LAN devices** are back online.
5.  Make sure all **Wi-Fi devices** are back online.
6.  **Check all Device IP Addressing:** Configure needed static IP reservations and correct any incorrectly assigned IP addresses.
7.  **Check all Port Configurations, Port Forwarding, etc.**
8.  **Verify Network Profile (Windows Systems):** Most Windows systems will treat the new network as a **Public Network**.
    * Make sure all local workstations, servers, etc., are set to the **Private Profile** and **NOT the Public Profile** to enable sharing.
9.  **Check and Verify** all file/print sharing settings are on and active for client workstations.
10. **Test all printing/scanning** from client workstations.
11. **Test network share/data access** from client workstations (if applicable).
12. **Check security camera access** (if applicable).
13. **Have the client** go over, review, and/or verify everything.

---

## FINISHED!
