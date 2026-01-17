# Raspberry Pi Administration

Welcome to the **Raspberry Pi** section of the IT Manual. This directory covers the management of ARM-based Single Board Computers (SBCs) within our infrastructure.

We currently support two primary operating systems for these devices, each serving a distinct purpose.

## 📂 Operating System Index

| OS Variant | Directory | Description | Best For |
| :--- | :--- | :--- | :--- |
| **DietPi** | **[dietpi/](dietpi/)** | A highly optimized, lightweight OS based on Debian. It features a text-based menu system (`dietpi-software`) for automating software installs. | Headless servers, Home Assistant, Pi-hole, and appliances where performance is critical. |
| **Raspberry Pi OS** | **[pi_os/](pi_os/)** | The official OS (formerly Raspbian). It provides the standard desktop environment and full compatibility with official accessories. | Desktop usage, educational tools (Scratch/Python), and projects requiring the official GUI. |

---

## ⚖️ Decision Guide: Which OS to use?

### Choose **DietPi** if:
* You are running a server without a monitor (Headless).
* You need to squeeze maximum performance out of older hardware (e.g., Pi 3 or Zero).
* You want to install complex software stacks (like LAMP, Media Servers, Docker) with a single click.
* You want to minimize SD card wear (extensive RAM logging options).

### Choose **Raspberry Pi OS** if:
* You need a graphical user interface (Desktop mode).
* You are following a tutorial that specifically assumes the standard environment.
* You are using the GPIO pins for electronics projects and need standard Python libraries pre-installed.
* You are using the official Camera Module or specialized HATs that require official drivers.

---

## ⚡ Universal Hardware Setup
*Regardless of the OS chosen, these hardware standards apply to all deployments.*

1.  **Storage:** Use High Endurance microSD cards (Class 10 / U1 minimum) to prevent corruption.
2.  **Power:** Ensure the power supply delivers adequate voltage (5.1V). Undervoltage is the #1 cause of random crashes.
    * *Pi 4/5:* 3A USB-C.
    * *Pi 3:* 2.5A Micro-USB.
3.  **Cooling:** Passive heatsinks are required for Pi 4 and newer. Active cooling (fan) is recommended for continuous 24/7 server loads.

## 📝 Contribution Guidelines
* When documenting specific software (e.g., Pi-hole), place the guide inside the folder of the OS it is running on.
* Note the hardware model used (e.g., "Tested on Pi 4 4GB") as performance varies significantly between generations.
