## 📒 HWInfo - System Log Diagnostics: Logging System Issues

This guide explains how to use **HWInfo** to capture system data for troubleshooting computer issues.

## Why Use HWInfo for Diagnostics?

If a customer is experiencing issues (like crashes, errors, or freezing) but can't clearly describe them, or if problems reappear after a recent service, **HWInfo** can log important system data for analysis. This allows us to troubleshoot remotely without the client bringing the system in.

* The log file captures: **crashes, errors, freezing events, temperature fluctuations, and other system anomalies.**
* **Goal:** Log any crashes or system issues so our team can analyze the data and determine the cause of the problem.

---

## Getting Started

The client needs to download and install HWInfo to generate a system log file (CSV format) that they can send to us for review.

👉 **Download HWInfo here:** [https://www.hwinfo.com/](https://www.hwinfo.com/)

---

## How to Enable Logging in HWInfo (PC)

### 1. Install and Open HWInfo

1. Launch **HWInfo64** (or **HWInfo32** if on a 32-bit system).
2. If prompted, select **"Sensors-only"** mode and click **Run**.

### 2. Open the Sensor Window

* If the sensor window doesn't open automatically, click the **Sensors** button (a small graph icon).

### 3. Enable Logging

1. In the sensor window, press **F2** or click the **"Logging Start"** button (a small disk icon with a red dot).
2. Choose a location to save the log file (**CSV format**).
3. Click **Save** to start logging.

### 4. Let HWInfo Run in the Background

* Keep **HWInfo** running while using the computer normally to capture system events.
* The program will continuously log sensor data to the CSV file.
* **Tip:** If monitoring over a long period, you can adjust the logging interval in **Settings → Safety → Logging Interval** (default is $1000\text{ms}$).

### 5. Capture a System Issue

* The goal is to log a **crash** or **performance issue**, even if it is temperature-related.

### 6. Send Us the Log File

1. Once the system issue has been experienced while logging, email the saved **CSV file** to the support mailbox (e.g., **support@example.com**).
2. The engineering team will analyze the logs to help diagnose the problem and will follow up with a report.
