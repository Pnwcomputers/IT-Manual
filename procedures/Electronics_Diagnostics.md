# 🔌 Electronics Diagnostics - Multimeter Testing

---

## Resistors (Ω) and Variable Resistors

| Component Type | Multimeter Mode | Test/Diagnosis |
| :--- | :--- | :--- |
| **Resistors** | Resistance Mode (Ω) | A **closed** resistor tests as a dead short (no resistance). If a resistor is **open**, you will get **no** resistance. Resistors can act like a fuse. Check and test if the devices are in series or parallel. |
| **Variable Resistors** | Resistance Mode (Ω) | Sweep to measure resistance, or match to set rating (Potentiometers, etc.). |

---

## Inductors (Coils) and Fuses

| Component Type | Multimeter Mode | Test/Diagnosis |
| :--- | :--- | :--- |
| **Coils (Inductor)** | Continuity Mode (|||) | Must have **Continuity** to be good. No Continuity means the Coil is **BAD**. (2 Terminals = +/-) |
| **Fuses** | Continuity Mode (|||) | Must **beep** (indicating continuity) to show the fuse is **not blown**. No continuity means the fuse is **BAD**. Fuses can be a Resistor or even a Diode. |

---

## Diodes, Mosfets, and Transistors

| Component Type | Multimeter Mode | Test/Diagnosis |
| :--- | :--- | :--- |
| **Diodes** (→←) | Diode Mode (→←) | Place positive on the **"dark"** side and ground on the **"white"** side to test. Measures voltage drop. |
| **Bridge Rectifier** | Diode Mode (→←) | Test pins A and D against B and C (four specific combinations provided in the original document). Reverse polarity on all combinations should be **0**. Can act like a fuse. |
| **Mosfets** (Gate, Drain, Source) | Diode Mode (→←) | Any **continuity** between **Drain and Source** means the Mosfet is **bad**. **N-Type** (NPN): Charge the gate with (+) to turn OFF (OL). |
| **Transistors** (made up of Diodes) | Diode Mode (→←) | Test Base to Collector/Emitter (and vice versa) for both NPN and PNP types. Any **continuity** means the Transistor is **bad**. |

### Mosfet Pinouts

| Type | Pinout |
| :--- | :--- |
| **8-Pin** | 4 Drain, 3 Source, 1 Gate |
| **6-Pin** | 4 Drain, 1 Source, 1 Gate |
| **4-Pin** | 1 Base (Gate), 2 Collector (Source), 1 Emitter (Drain) |
| **General** | **PIN 1 (Drain)** always has a marker, such as a dot. |

---

## Capacitors (→←) and Switches

| Component Type | Multimeter Mode | Test/Diagnosis |
| :--- | :--- | :--- |
| **Capacitors** (→←) | Diode Mode (→←) / ESR | **Better/Best:** Use an **ESR Meter**. Match readings to the listed rating. Short the +/- to discharge as needed. |
| **Capacitors (Resistance)** | Resistance Mode (Ω) | If a cap's resistance reading is more than **10% difference**, replace it. |
| **Capacitors (Continuity)** | Continuity Mode (|||) | If a capacitor has **ZERO/0 continuity**, it is **bad/shorted**. Capacitors for/under Chips (GPU, CPU etc.) will have a very **LOW resistance** and will have continuity. |
| **Switches** | Continuity Mode (|||) (Beep) | Should **beep only when turned on**. |

---

## Integrated Circuits (IC)

**General IC Testing:**

* **Charge Integrated Circuit (PWM IC):** If any of its capacitors test as **shorted**, the IC is shorted and **needs to be replaced**.
* **Super IO:** This is basically a big power management IC. Check capacitors around a Super IO; any **shorts** means the IC is **bad**.
* A **Circuit Diagram** is generally needed for in-depth testing of complex ICs (Clock Generator, Audio, RJ45, Super IO).
* The **Crystal Oscillator** is needed and needs to be functional for the Clock Generator IC.
