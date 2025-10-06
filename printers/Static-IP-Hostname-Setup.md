# Static IP/Host Name Setup

Setting up a printer with a static IP address or hostname is an effective way to avoid connection issues, especially in networks where dynamic IP addresses (assigned by DHCP) might change over time. Here's how to do it!

---

## Static IP Setup & Usage

### Option 1: Through the Printer's Control Panel

#### 1. Access Network Settings
On the printer's menu, navigate to **Settings** > **Network Settings** > **IP Settings** or a similar option.

#### 2. Set the IP to Static
Locate the **IP Address Assignment** option and select **Manual** or **Static IP**.

#### 3. Enter the Details
Input the desired:
- **IP Address** (e.g., 192.168.1.100)
- **Subnet Mask** (e.g., 255.255.255.0)
- **Default Gateway** (your router's IP, e.g., 192.168.1.1)

#### 4. Save Settings
Save settings and restart the printer.

---

### Option 2: Through the Router's DHCP Reservation

#### 1. Log in to the Router
Access your router's admin interface by entering its IP (e.g., 192.168.1.1) in a web browser.

#### 2. Find DHCP Reservations
Navigate to **LAN** > **DHCP** or a similar section. Look for **DHCP Reservation** or **Address Binding**.

#### 3. Add the Printer
Locate the printer in the list of connected devices (often listed by hostname or MAC address) or manually enter its MAC address and assign a specific IP.

#### 4. Save and Reboot
Save the settings and reboot the printer and router, if necessary.

---

## Use a Printer Hostname

Most network printers have a default hostname (e.g., PRINTERNAME.local) or allow you to configure one.

### Find or Set the Hostname

- Check the printer's network configuration to find its default hostname
- If needed, change it in the printer's control panel or web interface to something more recognizable (e.g., OfficePrinter)

### Access via Hostname

When adding the printer on a computer, use the hostname instead of the IP (e.g., `\\OfficePrinter` or `http://OfficePrinter.local`).

---

## Test Connectivity

### Ping Test
From a computer, ping the static IP or hostname (e.g., `ping 192.168.1.100` or `ping OfficePrinter.local`) to ensure the printer responds.

### Print Test Page
Print a test page to confirm the printer is functioning correctly.

---

## Additional Tips

- **Update Printer Drivers**: Ensure the printer driver is up-to-date on all computers

- **Document the Settings**: Record the printer's static IP, hostname, and other configuration details for future reference

- **Network Range**: Assign the static IP within the router's IP range but outside the DHCP pool (e.g., if DHCP assigns 192.168.1.100-200, use 192.168.1.201)

---

**By setting up a static IP or hostname for your printer, you'll significantly reduce the risk of connection issues caused by IP address changes.**
