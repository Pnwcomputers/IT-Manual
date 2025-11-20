# 🧑🏼‍🔬 Hardware and System Testing Programs

This list details essential software utilities for diagnosing, stress-testing, and benchmarking system hardware.

---

## 🔬 Stress Testing and Benchmarking

| Program | Primary Function | Key Notes |
| :--- | :--- | :--- |
| [**MemTest86+**](https://www.memtest.org/) | Test the **RAM** (Random Access Memory). | The longer it runs, the better; some RAM fails only after getting hot. |
| [**FurMark 3D**](https://geeks3d.com/furmark/) | Test the **GPU** (Graphics Processing Unit) and **CPU**. | Great for checking for hardware stability and stress-testing system endurance. |
| [**Prime95**](https://www.mersenne.org/download/) | **CPU Stress Testing** tool. | Pushes the CPU to its limit to test stability. |
| [**Cinebench**](https://www.maxon.net/en/cinebench) | **Single-core & Multi-core CPU Testing & Benchmarking**. | Provides a reliable score to compare CPU performance. |

---

## 🌡️ Monitoring and Health Checks

| Program | Primary Function | Key Notes |
| :--- | :--- | :--- |
| [**HWiNFO**](https://www.hwinfo.com/) | **System Monitoring** tool. | Checks temperatures, power rails ($3\text{V}$, $5\text{V}$, $12\text{V}$), gets specs, etc. **Tip:** Always have this running when performing FurMark, Prime95, or Cinebench testing. |
| [**CrystalDiskInfo**](https://crystalmark.info/en/software/crystaldiskinfo/) | **HDD/SSD Health and Diagnostic** Software. | Reads S.M.A.R.T. data to assess drive health, temperature, and errors. |

---

## 🔧 Windows & Linux Diagnostics (Sysinternals Suite)

The Sysinternals website was created in 1996 by Mark Russinovich to host advanced system utilities.

* **Purpose:** Helps IT Pros and developers manage, troubleshoot, and diagnose Windows and Linux systems and applications.
* **Key Utilities (Examples):**
    * [**MailPassView**](https://www.nirsoft.net/utils/mailpv.html)
    * [**AutoRuns**](https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns)
    * [**ProcessExplorer**](https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer)
    * *Etc.*

---

## 💿 Bootable Diagnostic Toolkits

These are comprehensive toolsets packaged onto a single bootable USB drive or CD for system maintenance and recovery.

* [**Hiren's Boot CD/USB (All-In-One):**](https://www.hirensbootcd.org/) A great utility CD/USB with **TONS of diagnostic software**, including drive manufacturer tools.
* [**Medicat Boot USB:**](https://medicatusb.com/) A USB/SSD based toolkit that compiles a selection of the **latest computer diagnostic and recovery tools** into an easy-to-use kit.
* [**Sergei Strelec Boot USB:**](https://www.majorgeeks.com/files/details/sergei_strelecs_winpe.html) A bootable USB disk for Windows 11, 10, and 8 PE, used for **maintenance, hard disk/partition management, backup/restore, computer diagnostics, data recovery, and Windows installation**.
