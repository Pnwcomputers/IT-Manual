
# IT Service Automation Suite

This directory contains the automation logic used to streamline the customer lifecycle—from initial inquiry and scheduling to post-service follow-up and financial reporting.


## 🛠 Structure

The automation suite is divided into two primary categories:

### 1. [Gmail Filters](./Gmail%20Filters/)
**The "Front Desk"**
A collection of complex search strings and "Waterfall Logic" that acts as an automated triage system for incoming leads.
- **Triage:** Automatically identifies Emergency, Data Recovery, Onsite, and In-Shop requests.
- **Efficiency:** Uses a hierarchy of exclusions to ensure customers receive exactly one relevant template.
- **Spam Protection:** Filters out automated notifications, receipts, and no-reply aliases.

### 2. [Google API](./Google%20API/)
**The "Operations Manager"**
Google Apps Scripts (GAS) that leverage Google Calendar and Contacts to handle logistics and relationship management.
- **Logistics:** Automatically reminds clients of upcoming appointments to reduce no-shows.
- **Retention:** Sends automated check-ins 30 days after service to drive repeat business and feedback.
- **Financials:** Scans the calendar to generate mileage audit trails for IRS tax deductions.

## 🔗 How They Work Together

1.  **Discovery:** A customer emails the shop.
2.  **Triage:** **Gmail Filters** identify the service type and send the appropriate scheduling template.
3.  **Scheduling:** Once an appointment is added to the **Google Calendar**, the API scripts take over.
4.  **Logistics:** The **Appointment Reminder** script notifies the client on Monday morning of the service week.
5.  **Audit:** After the service, the **Mileage Calculator** logs the travel for tax purposes.
6.  **Loyalty:** 30 days later, the **Follow-up** script checks in to ensure the solution is still holding up.

## 🛡 Security and Maintenance

- **API Access:** All scripts in the `Google API` folder require the **Google People API** service to be enabled in the Apps Script project settings.
- **Generalization:** To maintain privacy, ensure all scripts and filter strings use environment-specific variables (like `[YOUR SHOP ADDRESS]`) rather than hard-coded personal data.

---
*This automation suite is part of the PNWC IT-Manual, designed for maximum operational efficiency with minimal manual intervention.*
