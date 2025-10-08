# 💻 Laptop Faults & Diagnostics

## 1. Initial System Inspection

### A. Physical Inspection

| Component | Check For |
| :--- | :--- |
| **Exterior and Casing** | Cracks, dents, or loose parts. |
| **Hinges** | Smooth movement, no breaks or misalignment. |
| **Ports** | Dirt, bent pins, or damage (USB, HDMI, Ethernet, etc.). |
| **Vents** | Dust or blockages that may cause overheating. |
| **Charging Port** | Ensure the port isn't loose or damaged. |
| **Screen and Display** | Cracks, dead pixels, discoloration, or backlight issues. |
| **Test for Flex Issues** | Gently press edges; check for flickering or distortion (loose connections). |
| **Keyboard and Touchpad** | Sticky, loose, or unresponsive keys; smooth touchpad movement/click. |
| **Battery** | Swelling, leaks, corrosion (if removable); ensure it's seated correctly. |
| **Label and Identification** | Serial number, model number, warranty information stickers. |
| **Screw Integrity** | Ensure all screws are present and properly tightened. |

---

## 2. Power and Startup Testing

### A. Power Check

* **Power Adapter:** Verify working with a multimeter or compatible device.
* **DC Jack:** Ensure the charging light comes on when the adapter is plugged in.

### B. Power On

* **Attempt Boot:** Press the power button. Note any unusual **beeps, sounds, or lack of response**.
* **Battery and AC Operation:** Test booting with **AC only** (no battery) and **Battery only** (if possible).

### C. Observe Boot Behavior

* **Display:** Check if the laptop boots to the OS, BIOS, or displays error messages.
* **LED Indicators:** Observe status LEDs for power, charging, and HDD/SSD activity.
* **Noise:** Listen for abnormal fan noise, grinding from the hard drive, or clicking.

---

## 3. Internal Hardware Check (If Necessary and Safe to Open)

* **Dust and Debris:** Inspect for excessive dust (can cause overheating/fan obstruction).
* **Connections:** Check for loose or disconnected cables (display, hard drive, keyboard).
* **Damage:** Look for **burnt or scorched areas** on the motherboard; check capacitors for **bulging or leaking**.
* **Cooling System:** Ensure the fan spins freely and is not obstructed.
* **Components:** Verify the seating and integrity of **RAM, hard drives, SSDs, and Wi-Fi cards**.

---

## 4. Functional Tests

* **Display:** Test by connecting an **external monitor**. If external works, the issue is likely the internal screen, cable, or GPU.
* **Keyboard and Touchpad:** Test all key and touchpad gesture responses.
* **Ports:** Plug in devices (USB, external drives, headphones) to ensure functionality.
* **Audio & Network:** Test speakers, microphone, Wi-Fi, and Ethernet connectivity.
* **Webcam:** Test via a camera utility or video calling app.

---

## 5. Basic Software Tests

* **BIOS/UEFI:** Access settings (F2, Del, or Esc). Verify system detects the **hard drive, RAM, and other components**.
* **Operating System:** If booting, check for errors, slowness, or signs of software issues.
* **Device Manager (Windows):** Look for driver issues or hardware conflicts.
* **SMART Status:** Check hard drive health using tools like **CrystalDiskInfo**.
* **Memory and CPU Testing:** Use built-in diagnostics or third-party tools (e.g., **MemTest86, Prime95**).

---

## 6. Document Findings

* Take **detailed notes** of physical damage, symptoms, and test results.
* Record **error codes** or unusual behaviors.

---

# Common Failure Types and Diagnostics

## Power Adapter (Charging Cable)

* **Voltage Rule:** Should not be **15% higher or lower** than the rated Voltage output.
* **Testing:** Use a **Multimeter** (set to DC voltage) to compare output to the adapter's label. If significantly low or fluctuating, the adapter is faulty.
* **Signs of Fault:** Battery doesn't charge, light doesn't illuminate, laptop powers off when unplugged, charger gets unusually hot, visible physical damage.

---

## Power Jack / DC Jack

### Signs of a Faulty Power Jack

* No or intermittent charging, often requiring the plug to be **wiggled or held at an angle**.
* The port feels **loose or wobbly**; the charger doesn't stay securely connected.
* **No power** to the laptop, even when plugged in.
* **Overheating** or a **burnt smell** near the jack.

### Diagnostics

1.  **Inspect Visually:** Check for debris, bent pins, or damage inside the port.
2.  **Wiggle Test:** If charging flickers when the plug is gently wiggled, the DC jack is likely loose or damaged.
3.  **Advanced Testing (Multimeter):** Test the voltage at the DC jack solder points on the motherboard. If voltage is absent or fluctuates, the jack is defective.
4.  **Internal Inspection:** Look for broken solder joints, burnt components, or a cracked jack (if comfortable opening the laptop).

---

## Bad Battery

### Common Signs

* **Short Battery Life** or **won't charge**.
* **Overheating** or **sudden shutdowns**.
* **Swelling** or physical distortion (must be replaced immediately).

### Diagnostics

* **Built-in Diagnostics (Windows):** Run `powercfg /batteryreport` in Command Prompt. Compare **Full Charge Capacity** to **Design Capacity**.
* **Built-in Diagnostics (MacBooks):** Check **Cycle Count** and **Condition** under System Report > Power.
* **Physical Inspection:** Check for swelling, bulging, or corrosion (if removable).
* **Test with AC:** If the laptop works fine with AC but fails on battery, the battery is the problem.

---

## Power Switch/Power Button

### Signs of Fault

* Pressing the button **does not turn on** the laptop.
* The button feels **stuck, unresponsive, or physically damaged**.
* No **LED indicator activity** when pressed.

### Diagnostics

* **Alternate Power-On:** Try waking with the keyboard or by shorting the appropriate pins on the motherboard (advanced/caution required).
* **Multimeter Test (Continuity):** Test the button terminals. If there is **no continuity when pressed**, the button is defective.
* **Physical Check:** Ensure the button moves freely; inspect the ribbon cable for damage or looseness.

---

## CMOS Battery (3.3V)

* **Issue:** An old/expired battery can cause motherboard issues.
* **Action:** **Just replace if in doubt.**

---

## Bent Pins of Ports or Connectors

### Common Areas to Check

* USB, HDMI, Ethernet, Charging Port, and internal connectors (RAM slots, M.2 slots, SATA).

### Diagnostics

* **Visual Inspection:** Use a **flashlight and magnifying glass** to look for bent, misaligned, or touching pins.
* **Symptoms:** Devices don’t connect (USB), no network (RJ45), or components aren't recognized (internal slots).
* **Fixing:** Use **tweezers or a small flathead screwdriver** to carefully straighten pins.

---

## RAM Failure

### Diagnostics

* **Reseat RAM:** Physically remove and reinstall the module(s) to ensure correct seating.
* **Testing Software:** Run a system stress test or **MemTest+86** to check for failures or errors.
* **Expected RAM Voltages:**
    * DDR: **2.5V**
    * DDR2: **1.8V**
    * DDR3: **1.5V**
    * DDR4: **1.2V**
    * DDR5: **1.1V**

---

## Hard Drive Issues/Failure (HDD or SSD)

### Common Signs

* Frequent crashes/freezes, slow file access, **clicking/grinding noises** (HDD), files corrupted, or system not detecting the drive.

### Diagnostics

* **SMART Status:** Use tools like **CrystalDiskInfo** or `wmic diskdrive get model, status` (Windows) to check health indicators.
* **Check Disk Utility:** Run `chkdsk C: /f /r` (Windows) or **First Aid** (macOS Disk Utility).
* **Performance Test:** Use benchmarking tools to check read/write speeds; significant slowdown indicates failure.
* **Listen:** Clicking or grinding sounds typically indicate mechanical failure in HDDs.

---

## Graphics GPU

### Common Signs

* **Screen Artifacts** (lines, blocks, strange shapes), **flickering**, or **driver crashes**.
* **Overheating** near the GPU.
* **No Display** (black screen) or poor performance in graphics-intensive apps.

### Diagnostics

* **External Monitor Test:** If the external monitor works fine, the internal display or cable is the issue. If the external shows artifacts, the **GPU is the problem**.
* **Driver Check:** Update or Rollback graphics drivers via manufacturer websites (NVIDIA, AMD, Intel).
* **Stress Testing:** Use **FurMark** or **Unigine Heaven** to stress the GPU. Look for artifacts or temperature spikes (above 85-90°C).
* **Event Viewer:** Check Windows Logs > System for critical errors related to the display driver.

---

# 🔌 Electronics Diagnostics - Multimeter Testing

## Power Protection Components

* Located near the main power jack/input. Includes **Diodes, Fuses, and sometimes Capacitors**.
* Fuses are often in a chain with a Diode; one or both can fail.

## Charge Integrated Circuit (PWM IC)

* **Test:** If any of its capacitors test as **shorted**, the IC is shorted and **needs replacement**.

## Blown/Failed Components

* **Look for:** Burns or any physical signs of failure on **ICs, Mosfets, Capacitors, Diodes, Fuses, etc.**
* **Note:** Liquid capacitors can leak fluid from their base onto a PCB, even if not bulging.

## Failed Switches (aka Mosfets)

* **Test:** Check power going **into** Mosfets and coming **out**. If no power all the way through, the Mosfet may be bad.
    * *Example: 19V comes in, but 0V on the battery input.*
* Check the **drain of Mosfets for a short**.

## Short Circuits

* **Indicator:** **Low resistance** can indicate a short circuit.
* **Test Inductors (Coils):** Test for shorts and verify correct power output (V).
* **If a short is found on an Inductor (Coil), it means:**
    * A local **Capacitor** is shorted.
    * A **Mosfet** is shorted.
    * An **IC** is shorted.

## Super IO Issues

* **Function:** Major chipset for power; a big power management IC.
* **Test:** Check capacitors around the Super IO; **any shorts mean the IC is bad.**

---

## Other Physical Damage

### Electrostatic Damage

* **Signs:** Visible **burn marks** or discoloration; tiny **pits or holes** on chips; **blown, swollen, or leaking** capacitors; unusual **burnt smell**.

### Liquid Damage

* **Signs:** Visible **wet residue or sticky stains**; **corrosion or rust** (greenish/white spots); burn marks from short circuits; **warping or bubbling** of the case/keyboard.

---

## Common Voltage Rails & Components

Diagnosis requires checking voltage rails at designated test points using a multimeter.

| Voltage Rail | Typical Voltage | Purpose |
| :--- | :--- | :--- |
| **Main Voltage (Adapter)** | **19V** (or similar) | Input for charging and step-down converters. |
| **CPU Power (V_Core)** | **1.0V–1.3V** (approx) | Supplies power to the CPU core (regulated by VRM). |
| **RAM Power (V_DDR)** | **1.1V, 1.2V, 1.35V, or 1.5V** | Supplies power to the RAM modules. |
| **PCH/Chipset Power** | **1.05V** (or similar) | Used by the Platform Controller Hub/chipset. |
| **System Management** | **3.3V and 5V** | Powers logic, USB ports, and general ICs. |
| **BIOS/CMOS Battery (RTC)**| **3.0V** | Maintains BIOS settings and real-time clock. |
| **Backlight and Display** | **12V or 19V** | Power for the LED display backlight. |

### Voltage Regulation Components

* **Step-Down Voltage Regulators:** Convert 19V to lower voltages (e.g., 5V, 3.3V).
* **MOSFETs and Capacitors:** Key parts of the regulation circuits.
* **Inductors and Ferrite Beads:** Smooth the voltage output.
