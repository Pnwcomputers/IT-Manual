# Google API Automation Suite

This directory contains specialized Google Apps Scripts designed to automate client communication, logistics, and financial reporting. By leveraging the **Google Calendar API**, **GmailApp**, and **Google People API**, these tools eliminate manual administrative overhead for IT service operations.

## 📂 Scripts Overview

### 1. Appointment Reminders (`appointment_reminder.md`)
A proactive "No-Show" prevention tool. 
- **Frequency:** Runs every Monday at 8:00 AM.
- **Logic:** Scans the upcoming 7 days of the primary calendar.
- **Function:** Identifies client emails via guest lists or contact name matching and sends a personalized reminder with the date, time, and location of their appointment.

### 2. Appointment Follow-up (`appointment_followup.md`)
A client retention and feedback engine.
- **Frequency:** Runs weekly.
- **Logic:** Scans appointments from 30–37 days ago.
- **Function:** Reaches out to clients one month post-service to ensure technology is still running smoothly, provides basic maintenance tips, and requests feedback/reviews.

### 3. Calendar Mileage Calculator (`calendar_appointment_mileage_calculator.md`)
An automated financial reporting tool for tax compliance.
- **Logic:** Scans the current fiscal year for onsite appointments.
- **Function:** Uses the Google Maps DirectionFinder to calculate round-trip mileage from the shop address to each service location. 
- **Output:** Generates a Google Sheet with a line-item audit trail and calculates the total IRS mileage deduction.

## 🛠 Prerequisites

All scripts in this section require the following setup within the [Google Apps Script Editor](https://script.google.com):

1. **Services:** You must enable the **Google People API** in the "Services" tab to allow the scripts to search your contacts by name.
2. **Permissions:** Upon first run, you must authorize the script to access your Calendar, Gmail, and (for the mileage calculator) your Drive and Maps data.
3. **Time-Based Triggers:** Ensure you run the `createTrigger` functions provided in each script to automate the weekly execution.

## 🛡 Security & Best Practices

- **Manual Overrides:** Use the `manualOverrides` object in the scripts to handle regular clients whose calendar nicknames do not match their official contact records.
- **Exclusion Patterns:** Customize the `shouldSkipEvent` function in each script to ignore personal blocks, holidays, or non-billable service types.
- **Address Protection:** Ensure your shop address is correctly set in the `OFFICE` constant of the mileage calculator to prevent incorrect distance calculations.

---
*Maintained as part of the PNWC IT-Manual Automation Suite.*
