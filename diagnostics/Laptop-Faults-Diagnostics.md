# 💻 Laptop Faults & Diagnostics

This document outlines a comprehensive, step-by-step procedure for diagnosing laptop issues, from initial physical inspection to in-depth component-level testing.

---

## 1. Initial System Inspection

### A. Exterior and Casing
* **Physical Damage:** Look for cracks, dents, or loose parts on the laptop’s body and screen.
* **Hinges:** Ensure the hinges move smoothly and are not broken or misaligned.
* **Ports:** Examine all ports (USB, HDMI, Ethernet, etc.) for dirt, **bent pins**, or damage.
* **Vents:** Check for dust or blockages, which can cause overheating.
* **Charging Port:** Ensure the charging port isn't loose or damaged.

### B. Screen and Display
* **Inspect for Damage:** Look for cracks, **dead pixels**, discoloration, or **backlight issues**.
* **Test for Flex Issues:** Gently press around the edges of the display to check for flickering or display distortion, which may indicate loose connections.

### C. Keyboard and Touchpad
* **Key Functionality:** Look for sticky, loose, or unresponsive keys.
* **Touchpad:** Check for smooth movement and proper click functionality.

### D. Battery
* **Visual Inspection:** Check for **swelling**, leaks, or corrosion around the battery (if removable).
* **Connection:** Ensure the battery is seated correctly.

### E. Label and Identification
* **Check Stickers:** Look for the laptop's serial number, model number, and warranty information.
* **Inspect Screw Integrity:** Ensure all screws are present and tightened properly.

---

## 2. Power and Startup Testing

### A. Power Check
* **Power Adapter:** Verify the adapter is working (test output voltage with a multimeter).
    * *Note: Output voltage should not be $\pm 15\%$ of the rated Voltage.*
* **DC Jack:** Ensure the charging light comes on when the adapter is plugged in.

### B. Power On
* **Attempt Boot:** Press the power button. Note any unusual beeps, sounds, or lack of response.
* **Battery and AC Operation:** Test booting the laptop with **just the AC adapter** (no battery) and vice versa.

### C. Observe Boot Behavior
* **Display:** Check if the laptop boots to the OS, BIOS, or displays error messages.
* **LED Indicators:** Observe status LEDs for power, charging, and HDD/SSD activity.
* **Noise:** Listen for abnormal fan noise, grinding from the hard drive, or clicking sounds.

---

## 3. Internal Hardware Check (If Necessary and Safe to Open)

* **Dust and Debris:** Inspect for excessive dust, which can cause overheating or fan obstruction.
* **Connections:** Check for **loose or disconnected cables** (display, hard drive, keyboard).
* **Damage:** Look for **burnt or scorched areas** on the motherboard. Inspect capacitors for **bulging or leaking**.
* **Cooling System:** Ensure the fan spins freely and is not obstructed.
* **Components:** Verify the seating and integrity of RAM, hard drives, SSDs, and Wi-Fi cards.

---

## 4. Functional Tests
* **Display:** Test the screen by connecting an **external monitor**.
    * *If external display works, the issue is likely the laptop screen, cable, or the integrated GPU.*
* **Keyboard and Touchpad:** Test for proper response from all keys and touchpad gestures.
* **Ports:** Plug in USB devices, external drives, or headphones to ensure ports are functional.
* **Audio, Network, Webcam:** Check speakers, microphone, Wi-Fi, Ethernet, and webcam functionality.

---

## 5. Basic Software Tests

* **BIOS/UEFI:** Access the BIOS/UEFI (usually **F2**, **Del**, or **Esc** during boot). Verify that the system detects the hard drive, RAM, and other components.
* **Operating System:** If the laptop boots, check for errors, slowness, or other software-related issues.
* **Device Manager (Windows):** Look for **driver issues** or hardware conflicts (yellow exclamation marks).
* **SMART Status:** Check the hard drive's SMART data for health indicators (e.g., using CrystalDiskInfo).
* **Memory and CPU Testing:** Use built-in diagnostics or third-party tools (e.g., **MemTest86** or **Prime95**) to test memory and CPU health.

---

## 6. Document Findings
* Take detailed notes of all physical damage, symptoms, and test results.
* Record error codes or unusual behaviors observed.

---

# ⚠️ Common Hardware Failure Types & Diagnostics

## Power Adapter (Charging Cable) & DC Jack

### Signs of a Faulty Adapter or DC Jack
* **No Charging:** Battery doesn't charge, or charge percentage doesn't increase.
* **Adapter Issues:** Charger gets unusually hot, has visible damage, or the charging light doesn't illuminate.
* **DC Jack Issues:** Must wiggle or hold the plug at a certain angle to work; sparks, burning smell, or the port feels loose/wobbly.

### Testing the Power Adapter
1.  **Visual Inspection:** Check for frayed wires, bent pins, or damage to the adapter block.
2.  **Multimeter Test (Output Voltage):**
    * Set Multimeter to **DC voltage mode**.
    * Plug the adapter in (not into the laptop).
    * Measure voltage: **Red probe** on the inside (center pin), **Black probe** on the outer part.
    * **Result:** Compare the reading to the voltage output listed on the adapter label (e.g., $19.5\text{V}$). A significantly lower or fluctuating voltage indicates a faulty adapter.

### Testing the DC Jack
1.  **Physical Check:** Inspect the DC jack for damage/debris.
2.  **Wiggle Test:** Plug in the adapter and gently wiggle the connector. If the charging light flickers or charging stops/starts, the DC jack is likely loose or damaged.
3.  **Internal Inspection (If safe):** Look for loose or broken soldering points or a burnt/charred appearance near the DC jack.

## Power Jack / DC Jack
* **Advanced Testing:** Use a multimeter to test the voltage at the DC jack solder points on the motherboard. If voltage is absent or fluctuates, the jack is defective.
* **Common Issues:** Loose solder joints, damaged internal pins, short circuit, or a worn adapter plug not making proper contact.

## Bad Battery
### Common Signs
* **Short Battery Life, Won't Charge, Sudden Shutdowns.**
* **Swelling:** The battery appears physically swollen or distorted (critical issue).
* **Overheating** during use or charging.

### Built-In Battery Diagnostics
* **Windows Battery Report:**
    * Open Command Prompt as Admin and run `powercfg /batteryreport`.
    * Check **Full Charge Capacity** vs. **Design Capacity**. A significant difference indicates deterioration.
* **MacBooks (System Report):** Check **Cycle Count** and **Condition** ("Replace Soon," "Service Battery").

## Power Switch / Power Button
* **Signs of Fault:** Pressing the button does not turn on the laptop; button feels stuck or unresponsive; no LED activity.
* **Alternate Power-On Method:**
    * Try **Keyboard Shortcut** (check manual for `Fn` + `Esc` or `Fn` + `Power`).
    * **Wake-On-Lid** if enabled in BIOS.
    * **Caution:** Advanced users may manually short the power pins on the motherboard connector to test if the button mechanism is the fault.
* **Multimeter Test:** Set to **Continuity mode**. Place probes on button terminals. If there is **no continuity when pressed**, the button is defective.

## CMOS Battery ($\mathbf{3.3\text{V}}$)
* **Issue:** Old or expired CMOS batteries can cause motherboard issues, including time/date resets and failure to save BIOS settings.
* **Fix:** **Just replace if in doubt.**

## Bent Pins of Ports or Connectors
* **Symptoms:** Devices don’t connect/charge, network cable won't click in, adapter fits loosely, or internal components are not recognized.
* **Inspection:** Use good lighting and a **magnifying glass** to examine pins in USB, HDMI, Ethernet, and internal connectors (RAM, M.2 slots, etc.).
* **Fixing:** Use **tweezers** or a small screwdriver to carefully straighten misaligned pins. **Ensure pins are not touching (short circuit).**

## RAM Failure
* **Diagnosis:** Physically check and reseat the RAM module(s). Run testing software such as **MemTest86+** or stress testing software.
* **Expected RAM Voltages:**
    * DDR: $2.5\text{V}$
    * DDR2: $1.8\text{V}$
    * DDR3: $1.5\text{V}$
    * DDR4: $1.2\text{V}$
    * DDR5: $1.1\text{V}$

## Hard Drive Issues / Failure (HDD or SSD)
* **Common Signs:** Frequent crashes, slow performance, clicking/grinding noises (HDD), disappearing/corrupted files, boot errors.
* **Diagnostic Tools:**
    * **Windows:** `chkdsk C: /f /r` and `wmic diskdrive get model, status` (for basic SMART check).
    * **macOS:** **Disk Utility** (First Aid).
    * **Third-Party:** **CrystalDiskInfo** (SMART status), **SeaTools** (error scans), **ATTO Disk Benchmark** (performance test).
* **Boot-Level:** Run built-in hardware diagnostics accessible from the startup menu.

## Graphics GPU
* **Common Signs:** **Screen artifacts** (lines, blocks), flickering, driver crashes, **overheating**, poor performance in graphics-intensive apps, or no display.
* **Diagnosis:**
    1.  **Test External Monitor:** If external display works, the internal screen/cable is the issue. If external display fails, the **GPU is likely the problem**.
    2.  **Drivers:** Update or roll back graphics drivers via Windows Update or the manufacturer's website (NVIDIA, AMD, Intel).
    3.  **Stress Testing:** Use **FurMark** or **Unigine Heaven** to check for artifacts and monitor temperatures (limit: $85-90^\circ\text{C}$).
    4.  **Event Viewer Logs:** Look for critical errors related to "Display" or specific driver files.

---

# ⚡ Electronics Diagnostics (Component Level)

## Power Protection Components
* **Location:** Typically near the main power jack/input.
* **Components:** Diodes, Fuses, and sometimes Capacitors.
* **Failure:** Fuses are often in a chain with a diode; one or both can fail.

## Charge Integrated Circuit (PWM IC)
* **Diagnosis:** If **any capacitor** connected to the IC tests as **shorted**, the **IC is shorted** and needs replacement.

## Blown/Failed Components
* **Visual Check:** Look for burns or physical signs of failure on ICs, Mosfets, Capacitors, Diodes, and Fuses.
* **Note:** Liquid capacitors can leak their fluid from their base onto the PCB even without bulging.

## Failed Switches (aka Mosfets)
* **Diagnosis:** Check power going **into** the Mosfet and coming **out**. If $19\text{V}$ comes in but $0\text{V}$ comes out, and it's not a connection issue, the **Mosfet is likely bad**.
* Check the drain of Mosfets for a **short**.

## Short Circuits
* **Indicator:** **Low resistance** can indicate a short circuit.
* **Inductor (Coil) Test:** Test inductors for shorts. **ANY short on an inductor** means a component in that circuit is shorted (local Capacitor, Mosfet, or IC).

## Super IO Issues
* **Function:** Major chipset for power management.
* **Diagnosis:** Check capacitors around the Super IO. **Any shorts** found indicate the **IC is bad**.

## Physical Damage Diagnostics
* **Electrostatic Damage (ESD):** Look for visible **burn marks**, scorching, tiny pits on chips, or blown/cracked components caused by electrical arcing.
* **Liquid Damage:** Look for **sticky/wet residue**, watermarks, **corrosion** (greenish/white) on metal parts, burn marks from short circuits, or warping/bubbling of the case/keyboard.

---

# 💡 Common Voltage Rails & Components

| Voltage Rail | Typical Range | Components Powered |
| :--- | :--- | :--- |
| **Main Input (Adapter)** | $19\text{V}$ (or $18-20\text{V}$) | Battery Charging, Input to Step-Down Regulators. |
| **CPU Power ($\text{V}\_\text{Core}$)** | $\sim 1.0\text{V} - 1.3\text{V}$ | CPU core (Regulated by VRM). |
| **RAM Power ($\text{V}\_\text{DDR}$)** | $1.1\text{V}, 1.2\text{V}, 1.35\text{V}, 1.5\text{V}$ | RAM modules. |
| **PCH/Chipset Power** | $\sim 1.05\text{V}$ | Platform Controller Hub. |
| **System Management** | $3.3\text{V}$ and $5\text{V}$ | Control circuits, logic components, USB ports, sensors. |
| **BIOS/CMOS Battery (RTC)** | $3.0\text{V}$ | BIOS settings, Real-Time Clock. |
| **Display Backlight** | $12\text{V}$ or $19\text{V}$ | LED Backlight. |

**Voltage Regulation Components:** **MOSFETs** and **Step-Down Voltage Regulators** are key to converting the $19\text{V}$ input to all the required lower voltages.

**Diagnosis and Testing:** Use a multimeter to check voltage rails at designated test points. Refer to the laptop’s schematic (if available) for exact locations and expected voltages.
