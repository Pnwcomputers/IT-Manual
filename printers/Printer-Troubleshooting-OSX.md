# 🖨️ Printer Troubleshooting (macOS)

If your printer isn't working properly with your Mac, use these steps to diagnose and fix the issue.

---

## 1. Connection & Restart Devices

### Check Printer Connection
* **USB:** Disconnect, reconnect, and try a different USB port. **Replace the USB cable** if necessary.
* **Wi-Fi/Ethernet:**
    * Ensure the printer and Mac are on the **same network**.
    * Verify the printer has a **valid IP address** (print a network configuration page).
    * **WPS Reconnect:** Press and hold the **WPS button** on the router for $3-5$ seconds, then start the WPS setup on the printer.

### Restart Devices
* Power off and on the **printer**.
* **Restart** your Mac and router.

---

## 2. Printer Status and Queue

### Check Printer Status
* Go to **System Settings $\rightarrow$ Printers \& Scanners**.
* Select the printer and ensure it’s marked as **“Online”**.
* If the printer is **Paused**, click **Resume**.

### Clear the Print Queue
1.  Go to **System Settings $\rightarrow$ Printers \& Scanners**.
2.  Select the printer and click **Open Print Queue**.
3.  If any jobs are stuck, click **"X"** to cancel them.

---

## 3. Drivers, Software, and System Resets

### Update and Re-Add
* **Update macOS:** $\text{Apple menu} (\text{}) \rightarrow \text{System Settings} \rightarrow \text{Software Update}$.
* **Update Drivers:** Download the **latest drivers** from the printer manufacturer’s website (especially for scanning).
* **Remove and Re-Add:**
    1.  Go to **System Settings $\rightarrow$ Printers \& Scanners**.
    2.  Select the printer and click the **( - )** button to remove it.
    3.  Click **( + )**, select the printer, and click **Add**.

### Reset the Print System (Last Resort)
1.  Go to **System Settings $\rightarrow$ Printers \& Scanners**.
2.  **Right-click (or Control + Click)** anywhere in the printer list.
3.  Select **"Reset printing system…"**.
4.  Restart your Mac and re-add the printer.

---

## 4. Advanced & Network Checks

### Scanning Issues
* Install the **manufacturer’s scanning software**.
* Use **Image Capture** (built-in macOS scanning app).
* Try scanning from **Preview** ($\text{File} \rightarrow \text{Import from Scanner}$).

### Wireless Printing Issues
* **AirPrint:** Not all wireless printers support Apple’s AirPrint feature. Check the printer’s manual.
* **ePrint/Cloud Printing:** These are separate from AirPrint and require specific apps or services from the manufacturer.

### Firewall & Security Settings
* Ensure **macOS Firewall** isn't blocking printer communication: $\text{System Settings} \rightarrow \text{Network} \rightarrow \text{Firewall}$. Temporarily disable and test printing.
* Verify third-party security software (antivirus) allows communication.

### Printer Sharing
* If printing from another Mac, go to **System Settings $\rightarrow$ Printers \& Scanners**, select the printer, and click **"Share this printer on the network"**.

### Reset Printer to Factory Settings (Last Resort)
* Refer to the printer’s manual for reset instructions.
* **Reset the printer**, then reconnect it to the Wi-Fi network and re-add it to the Mac.
