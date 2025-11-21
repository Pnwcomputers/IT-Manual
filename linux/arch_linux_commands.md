# Arch Linux Command Cheat Sheet and Reference 🛠️

This document serves as a quick reference for common system administration, networking, and security auditing commands on **Arch Linux** and systems using the **`pacman`** package manager (like Manjaro).

---

## 1. SSH and File Permissions

| Command | Purpose | Explanation |
| :--- | :--- | :--- |
| `ssh-keygen -R 192.168.0.1` | **Remove SSH Key** | Removes the host key for the specified IP from your `known_hosts` file. Use this if the remote server key changes. |
| `sudo chmod u+x my_script.sh` | **Allow Execution** | Adds the **e**xecute permission (`+x`) for the **u**ser (`u+`) who owns the file, making a script runnable. |
| `sudo chmod 644` | **File Permissions** | Owner can read/write; Group/Others can only read (standard file permission). |
| `sudo chmod 755` | **Script/Directory Permissions** | Owner can read/write/execute; Group/Others can read/execute (standard directory/script permission). |

---

## 2. Package Management (`pacman` and AUR)

| Command | Purpose | Explanation |
| :--- | :--- | :--- |
| `sudo pacman -Syu` | **Sync, Refresh & Update** | **S**yncs package lists (`y`) and **u**pgrades the entire system. |
| `sudo pacman -S [package_name]` | **Install Package** | **S**yncs/Installs the specified package from the repositories. |
| `sudo pacman -R [package_name]` | **Remove Package** | **R**emoves the specified package, but keeps its dependencies. |
| `sudo pacman -Rs [package_name]` | **Remove Package & Deps** | **R**emoves the specified package and its unneeded **s**urviving dependencies. |
| `pacman -Qk` | **Check Package Integrity** | Checks the integrity of installed packages (verifies file hash). |
| `pacman -Qs [search_term]` | **Search Installed** | **Q**ueries the installed packages for a specific **s**tring. |
| `pacman -Ss [search_term]` | **Search Repositories** | **S**earches the official repository package **s**trings. |
| `sudo pacman -Sc` | **Clear Package Cache** | Clears the package cache, removing old versions of packages. |
| `yay -S [package_name]` | **Install from AUR** | Uses the common AUR helper `yay` to install packages from the **A**rch **U**ser **R**epository. |

---

## 3. Diagnostics and System Info

| Command | Purpose | Explanation |
| :--- | :--- | :--- |
| `ls -la /usr/folder1/folder2/` | **Check Files/Folders** | **L**i**s**ts all (`-a`) files in the path with long format details (`-l`). |
| `lsblk` | **List Disks** | Lists all block devices (drives and partitions) on the system. |
| `free -h` | **Memory Usage** | Displays free, used, and total system memory and swap space in a **h**uman-readable format. |
| `sudo iftop` | **Network Traffic (General)** | Displays network bandwidth usage on an interface in real-time. |
| `sudo nethogs` | **Network Traffic (Per Process)** | Displays which process/program is using the most network bandwidth. |
| `ncdu` | **Disk Usage** | An interactive ncurses utility for visualizing disk space usage. |
| `htop` | **Process Viewer** | An interactive, improved version of the `top` command for monitoring processes and resources. |
| `btop` | **Modern Monitor** | A feature-rich, visually appealing resource monitor. |

---

## 4. Storage and File System Management

| Command | Purpose | Explanation |
| :--- | :--- | :--- |
| `sudo pacman -S exfatprogs` | **Install ExFAT Support** | Installs the necessary utilities for managing ExFAT filesystems. |
| `sudo mount -t exfat /dev/sdXN /mnt/your_mount_point` | **Mount ExFAT Drive** | Mounts an ExFAT-formatted drive to the specified mount point. Replace `sdXN` with actual device (e.g., `sdb1`). |

---

## 5. Network Configuration and Scanning

| Command | Purpose | Explanation |
| :--- | :--- | :--- |
| `ip a` | **View IP Addresses** | Displays address information for all network interfaces (modern replacement for `ifconfig`). |
| `iw dev` | **Wireless Info** | Shows detailed information about wireless devices. |
| `sudo ip link set wlan1 down` | **Disable Interface** | Brings down the specified wireless interface. |
| `sudo ip link set wlan1 name wlan1mon` | **Rename Interface** | Renames the wireless interface (useful for monitor mode setup). |
| `airmon-ng` | **Monitor Mode** | Puts a wireless card into monitor mode for security auditing. |
| `sudo pacman -S arp-scan` | **Install ARP Scan** | Installs the `arp-scan` utility (not always pre-installed). |
| `sudo arp-scan -l++` | **ARP Scan** | Scans the local network segment using ARP packets to discover active hosts. |

**ARP Scan Usage Example:**
```bash
cd /tmp/
sudo arp-scan -l++
