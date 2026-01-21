# 🌐 Networking Module

**Part of the [IT-Manual](../README.md)** *Essential resources, troubleshooting protocols, and standard operating procedures for field network diagnostics.*

---

## 📖 Overview
This directory contains guidelines and tools for setting up, maintaining, and troubleshooting network infrastructure in the field. It is designed for independent technicians handling SOHO (Small Office/Home Office) and SMB (Small to Medium Business) environments.

## 📂 Contents

### 🛠️ Troubleshooting & SOPs
*Standard Operating Procedures for diagnosing common network issues.*
- **[Connectivity Diagnostics](./connectivity-troubleshooting.md)**: Steps to isolate WAN vs. LAN issues.
- **[Wi-Fi Optimization](./wifi-optimization.md)**: Signal strength mapping, channel selection, and interference mitigation.
- **[DNS & DHCP Issues](./dns-dhcp-guide.md)**: Resolving IP conflicts and name resolution failures.
- **[Printer Networking](./network-printing.md)**: Static IP assignment and discovery protocols (Bonjour/WSD).

### 📚 Reference & Cheatsheets
*Quick-reference materials for on-site work.*
- **[Common Ports & Protocols](./common-ports.md)**: A list of standard ports (20/21 FTP, 22 SSH, 80/443 HTTP, etc.).
- **[Cabling Standards](./cabling-standards.md)**: T568A vs. T568B pinouts and termination guides.
- **[Subnetting Table](./subnetting-cheatsheet.md)**: Quick reference for CIDR notation and subnet masks (/24, /30, etc.).
- **[Hardware Defaults](./hardware-defaults.md)**: Default IP addresses and credentials for common router brands (Ubiquiti, TP-Link, Cisco, Netgear).

### 💻 Scripts & Tools
*Automation and diagnostic scripts.*
> *Ensure you have the necessary permissions before running network scans.*
- **`/scripts`**: Directory containing Python/PowerShell utilities.
  - `network_scanner.py`: Basic LAN discovery tool.
  - `speedtest_logger.ps1`: Automated bandwidth logging.

---

## ⚡ Quick Command Reference
*Essential CLI commands for Windows/Linux/macOS.*

| Command (Windows) | Command (Linux/Mac) | Purpose |
| :--- | :--- | :--- |
| `ipconfig /all` | `ifconfig` / `ip a` | View interface configuration |
| `tracert <IP>` | `traceroute <IP>` | Trace the path to a destination |
| `nslookup <domain>` | `dig <domain>` | Query DNS records |
| `netstat -an` | `netstat -tuln` | Show active connections and listening ports |
| `arp -a` | `arp -a` | View the ARP table (MAC-to-IP mapping) |

---

## 🤝 Contributing
If you have a useful script, a new SOP, or a correction:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/networking-update`).
3. Commit your changes.
4. Open a Pull Request.

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
