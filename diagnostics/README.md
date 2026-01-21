# 🔍 Hardware & System Diagnostics

**Part of the [IT-Manual](../README.md)**
*Procedures for isolating hardware failures, analyzing system logs, and component-level testing.*

---

## 📖 Overview
This directory contains the standard operating procedures for diagnosing computer hardware and operating system stability. It covers the full range of diagnostics—from reading software logs to using a multimeter on a motherboard.

## 📂 Contents

### 🚦 General Procedures
*Standard workflows for initial triage.*

- **[General Diagnostic Procedures](./General-Diagnostic-Procedures.md)**
  The foundational checklist for any intake. Covers the "Process of Elimination" method to determine if a fault is Hardware, Software, or User Error.

### 💻 Hardware Testing & Electrical
*Physical testing of components and circuits.*

- **[Laptop Faults Diagnostics](./Laptop-Faults-Diagnostics.md)**
  Specific troubleshooting for portable devices, including battery failures, screen issues, hinge sensors, and charging ports.
- **[Electronics Diagnostics & Multimeter Testing](./Electronics-Diagnostics-Multimeter-Testing.md)**
  Guide on using a multimeter to test power supplies (PSU), AC adapters, continuity, and basic motherboard voltage rails.
- **[Hardware Testing Programs](./Hardware-Testing-Programs.md)**
  A curated list of approved software tools (e.g., MemTest86, CrystalDiskInfo, Prime95) used to stress-test components and validate repairs.

### 📊 System Logs & Sensors
*Interpreting error codes and thermal data.*

- **[HWInfo & System Log Diagnostics](./HWInfo-System-Log-Diagnostics.md)**
  How to use HWInfo to monitor thermals/voltages and Windows Event Viewer to trace crash causes (BSODs).
- **[Mac / Apple System Log Diagnostics](./Mac-Apple-System-Log-Diagnostics.md)**
  Guide to using macOS Console.app, interpreting Kernel Panics, and analyzing crash reports on Apple Silicon and Intel Macs.

---

## ⚡ Diagnostic Workflow Reference
*The standard order of operations for a device on the bench.*

| Step | Action | Tools/Files |
| :--- | :--- | :--- |
| **1. Visual** | Check for physical damage, swollen batteries, liquid signs. | Eyes / Microscope |
| **2. Electrical** | specific power rail checks if device is dead. | `Electronics-Diagnostics...` |
| **3. POST/Boot** | Attempt boot, check for beep codes/LEDs. | `General-Diagnostic-Procedures` |
| **4. Stress Test** | If boots, run load tests to force failure. | `Hardware-Testing-Programs` |
| **5. Log Analysis** | Check OS logs for timestamps of crashes. | `HWInfo...` / `Mac-Apple...` |

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
