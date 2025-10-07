# 🔌 Electronics Diagnostics - Multimeter Testing

This section outlines procedures for testing common electronic components using a multimeter, including resistance, continuity, and diode modes.

---

## Resistors & Inductors ($\Omega$)

| Component | Test Mode | Procedure | Failure Sign |
| :--- | :--- | :--- | :--- |
| **Fixed Resistor** | Resistance ($\Omega$) | Measure resistance; compare to marked value. | **Closed:** Tests as a dead short ($0\Omega$). **Open:** Gives no resistance (OL). |
| **Inductor (Coil)** | Continuity (🔊) | Test continuity between the two terminals. | **No Continuity:** The coil is bad/open. |
| **Variable Resistor** (Potentiometer) | Resistance ($\Omega$) | Sweep the adjustment to measure resistance, or match to set rating. | Does not sweep or match the set rating. |

* **Note:** Resistors and inductors can be in series or parallel circuits. A resistor can sometimes act like a **fuse**.

---

## Diodes and Rectifiers ($\rightarrow\leftarrow$)

### Diodes ("One Way Wire")

* **Test Mode:** Diode Mode ($\rightarrow\leftarrow$)
* **Procedure:**
    1.  Place the **Positive** lead on the "dark" (cathode) side and **Negative** lead on the "white" (anode) side. The meter should display a **voltage drop** (typically $0.5\text{V}-0.7\text{V}$).
    2.  Reverse the leads (Negative on cathode, Positive on anode). The meter should display **OL** (Over Limit/Open) as current flow is blocked.

### Bridge Rectifier

* **Test Mode:** Diode Mode ($\rightarrow\leftarrow$).
* **Procedure (Test between pins A, B, C, D):**
    * Test: **- Pin A, + Pin B** = Measure (Reverse polarity should be $0$).
    * Test: **- Pin A, + Pin C** = Measure (Reverse polarity should be $0$).
    * Test: **+ Pin D, - Pin C** = Measure (Reverse polarity should be $0$).
    * Test: **+ Pin D, - Pin B** = Measure (Reverse polarity should be $0$).
* **Note:** A bridge rectifier can sometimes act like a **fuse** when severely shorted.

---

## Transistors, Mosfets, and Capacitors

### Mosfets (Gate, Drain, Source)

* **Test Mode:** Diode Mode ($\rightarrow\leftarrow$) or Continuity (🔊).
* **Failure Sign:** **Any continuity** (or beep) between **Drain** and **Source** means the Mosfet is **bad/shorted**.
* **Testing Procedure (N-Type NPN):**
    1.  **Turn OFF:** Place **+** to Drain, **-** to Source. Meter should read **OL**.
    2.  **Charge Gate (ON):** Momentarily tap the Gate with the **+** lead.
    3.  **Test ON State:** Go back to Drain with **+** and Source with **-**. Meter should show continuity (beep).
    4.  **Turn OFF (Discharge):** Tap the Drain with the **+** lead to discharge the Gate.
    5.  **Test OFF State:** Go back to Drain with **+** and Source with **-**. Meter should return to **OL**.
* **P-Type (PNP):** Opposite function/polarity of the N-Type.
* **Pin Types:**
    * **8-Pin:** 4 Drain, 3 Source, 1 Gate.
    * **6-Pin:** 4 Drain, 1 Source, 1 Gate.
    * **4-Pin:** 1 Base (Gate), 2 Collector (Source), 1 Emitter (Drain).
    * **Note:** Pin 1 (Drain) always has a marker (e.g., a dot).

### Transistors (made up of Diodes)

* **Test Mode:** Diode Mode ($\rightarrow\leftarrow$).
* **Procedure (NPN - Base, Collector, Emitter):** Test diode drop between Base to Collector and Base to Emitter (and reverse). A functioning NPN transistor should act like two diodes connected at the Base.
* **Failure Sign:** **Any continuity** means the Transistor is **bad/shorted**.

### Capacitors

* **Test Mode:** Diode Mode ($\rightarrow\leftarrow$).
* **Better/Best Test:** Use an **ESR Meter** to compare readings to the listed rating.
* **Voltage Test:** If a capacitor is charged, its voltage reading should match its rated output.
* **Resistance/Continuity:**
    * **If a capacitor has ZERO ($0\Omega$) continuity/resistance, it is bad/shorted.**
    * If a capacitor's resistance reading is more than $10\%$ different from expected, replace it.
* **Low Resistance Exception:** Capacitors for/under chips (e.g., GPU, CPU) will naturally have very **LOW resistance** and will show continuity due to the low-resistance power plane they connect to.
* **Safety:** **Short the $\pm$ leads** to fully discharge the capacitor before testing.

---

## Switches, Fuses, and Integrated Circuits (IC)

| Component | Test Mode | Procedure | Failure Sign |
| :--- | :--- | :--- | :--- |
| **Switches** | Continuity (🔊) | Should beep when the switch is turned **ON** (closed) and only when ON. | Bleeps when OFF, or no beep when ON. |
| **Fuses** | Continuity (🔊) | Should beep, indicating the fuse is **NOT blown**. | **No continuity** means the fuse is **BAD** (open circuit). |
| **Integrated Circuits (IC)** | Varies | Requires a **Circuit Diagram** for pin-by-pin testing. | A short on any connected capacitor often indicates a **failed IC**. |

### Integrated Circuits (IC)

* **General Note:** Testing complex ICs (Clock Generator, Audio IC, RJ45 IC, Super IO, PWM IC) typically **requires a circuit diagram**.
* **Super IO:** This is a big **power management IC**. Check capacitors around the Super IO; **any shorts** means the **IC is bad**.
* **Charge Integrated Circuit (PWM IC):** If **any of its capacitors test as shorted**, the **IC is shorted** and needs replacement.
