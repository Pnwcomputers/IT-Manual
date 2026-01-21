# 💻 Hardware Repair & Testing

**Part of the [IT-Manual](../README.md)**
*Procedures for physical repairs, component isolation, and storage management.*

---

## 📖 Overview
This directory focuses on the "Nuts and Bolts" of the job. It contains guides for diagnosing specific hardware failures (Power, Motherboard, Storage) and procedures for hardware-level tasks like cloning drives and accessing BIOS interfaces.

## 📂 Contents

### 🔌 Power & Boot Issues
*Troubleshooting devices that won't turn on or won't boot.*

- **[No Power](./No-Power.md)**
  **Start Here** for "Dead" machines. Steps to trace power delivery issues from the wall to the board.
- **[POST Failure](./POST-Failure.md)**
  Diagnosing machines that turn on (fans spin/lights on) but fail to display video or pass the Power-On Self-Test (Beep codes/LED debug).
- **[How to Test Power Supply (PSU)](./How-to-Test-Power-Supply-PSU.md)**
  Specific methods for validating PSU voltage rails (Paperclip test, Multimeter probing).
- **[BIOS Access](./BIOS_Access.md)**
  Key combinations and tricks for accessing UEFI/BIOS on various manufacturers (HP, Dell, Lenovo, etc.).

### 💾 Storage & Data
*Drive health and replication.*

- **[HDD & SSD Health Checking](./HDD-SSD-Health-Checking.md)**
  Interpreting S.M.A.R.T. data to detect failing drives before they die completely.
- **[Clone Hard Drive (Hardware & Software Methods)](./Clone-Hard-Drive-Hardware-Software-Methods.md)**
  Procedures for upgrading clients to SSDs or creating exact images for data recovery, using both software tools and hardware duplicators.

### 🛠️ Component Isolation
*Motherboard and form-factor specific guides.*

- **[Motherboard Testing](./Motherboard-Testing.md)**
  Visual inspection guides (blown capacitors, burn marks) and board-level testing.
- **[Laptop Fault Diagnostics](./Laptop_Fault_Diagnostics.md)**
  Troubleshooting issues unique to laptops: Battery charging circuits, LCD cables, and hinge sensors.

---

## ⚡ Triage Decision Tree
*Quick logic for hardware diagnosis.*

[Image of computer hardware troubleshooting flowchart]

1.  **Is it completely dead?** (No fans, no lights)
    * &rarr; Go to **[No Power](./No-Power.md)**
    * &rarr; Check **[PSU](./How-to-Test-Power-Supply-PSU.md)**

2.  **Does it turn on, but black screen?**
    * &rarr; Go to **[POST Failure](./POST-Failure.md)**
    * &rarr; Check RAM seating and GPU.

3.  **Does it show a Logo, but fail to load Windows?**
    * &rarr; Check **[BIOS Access](./BIOS_Access.md)** (Is the drive detected?)
    * &rarr; Go to **[HDD Health](./HDD-SSD-Health-Checking.md)**

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
