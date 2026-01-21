# 🐧 Linux Command References

**Part of the [IT-Manual](../README.md)**
*CLI cheatsheets and distribution guides for technician reference.*

---

## 📖 Overview
This directory serves as a quick lookup for Linux command-line syntax. It is specifically divided between the two major package management families most likely to be encountered in the field: **Debian-based** (Ubuntu, Mint, Kali) and **Arch-based** (Manjaro, SteamOS).

## 📂 Contents

### ⌨️ Command Cheatsheets
*Syntax guides for package management and system control.*

- **[Debian Linux Commands](./debian_linux_commands.md)**
  Reference for `apt` / `apt-get` systems. Covers Ubuntu, Linux Mint, Pop!_OS, and Kali Linux.
- **[Arch Linux Commands](./arch_linux_commands.md)**
  Reference for `pacman` / `yay` systems. Critical for working on Steam Decks, Manjaro laptops, or custom Arch installs.

### 📋 General Reference
*Distro identification and hierarchies.*

- **[Linux OS List](./linux_OS_list.md)**
  A catalog of common distributions, their upstream bases, and their primary use cases (e.g., General Desktop vs. Penetration Testing vs. Server).

[Image of Linux distribution family tree simplified]

---

## ⚡ Quick Config: Package Managers
*The most common commands needed when hopping between distributions.*

| Action | Debian / Ubuntu (`apt`) | Arch / Manjaro (`pacman`) |
| :--- | :--- | :--- |
| **Refresh Repos** | `sudo apt update` | `sudo pacman -Sy` |
| **Upgrade System** | `sudo apt upgrade` | `sudo pacman -Syu` |
| **Install Package** | `sudo apt install <name>` | `sudo pacman -S <name>` |
| **Remove Package** | `sudo apt remove <name>` | `sudo pacman -Rs <name>` |
| **Search** | `apt search <term>` | `pacman -Ss <term>` |
| **Clean Cache** | `sudo apt autoremove` | `sudo pacman -Sc` |

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
