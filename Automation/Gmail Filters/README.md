# Gmail Support Automation Waterfall

This repository contains a collection of optimized Gmail filter strings designed for a computer repair and IT support business. These filters use a **Hierarchy of Exclusions** (Waterfall Logic) to ensure that customers receive the most relevant automated response without triggering multiple templates.

## 🚀 How the "Waterfall" Works

Gmail does not have a "stop processing" rule for filters. If an email matches three filters, the customer gets three replies. This system prevents that by using the following priority hierarchy:

1.  **Level 1: Crisis (Emergency)** - Overrides everything.
2.  **Level 2: Specialized (Data Recovery)** - Overrides standard repairs.
3.  **Level 3: Logistics (Onsite vs. In-Shop)** - Routes by service type.
4.  **Level 4: Technical Issues & Quotes** - Handles specific hardware or pricing queries.
5.  **Level 5: Safety Net (General)** - Only fires if no specific keywords are detected.

## 📁 Repository Structure

* `01-emergency.md`: Handles high-priority outages and urgent requests.
* `02-data-recovery.md`: Specialized intake for data loss and drive failures.
* `03-onsite-logistics.md`: Phrases indicating the customer needs a technician at their location.
* `04-in-shop-service.md`: Hardware repairs and drop-off indicators.
* `05-remote-support.md`: Screen sharing and remote login requests.
* `06-pricing-consultation.md`: Quote requests and rate inquiries.
* `07-technical-issues.md`: Specific troubleshooting for WiFi, Printers, and Email.
* `08-general-safety-net.md`: The catch-all for generic "computer help" emails.

## 🛠 Installation Instructions

To implement these filters in Gmail:

1.  **Create Templates:**
    * Go to Gmail Settings > **See all settings** > **Advanced**.
    * Enable **Templates**.
    * Compose a new email for each category, click the three dots (More options) > **Templates** > **Save draft as template**.

2.  **Create Filters:**
    * Click the **Search options** icon in the Gmail search bar.
    * Copy the `Has the words` string from the `.md` file into the "Has the words" field.
    * Copy the `Doesn't have` string into the "Doesn't have" field.
    * Click **Create filter**.
    * Check **Send template** and select the corresponding template.
    * Check **Mark as important** to ensure visibility.

3.  **Personalization:**
    * Replace `support@yourdomain.com` with your actual business email.
    * In `03-onsite-logistics.md`, replace `[YOUR BUSINESS ADDRESS]` with your actual shop address to prevent self-triggering from business correspondence.

## 🛡 Spam & Junk Protection

Every filter includes a standardized exclusion string to prevent auto-replies to:
* Automated "No-Reply" addresses.
* Shipping and tracking notifications.
* Invoices, receipts, and order confirmations.
* Password reset and verification codes.
* Marketing "Limited Time" sales.

## 🧪 Testing the Logic

To test, send emails from a **non-business account** with the following subject lines:
* *Test:* "Urgent: Printer not working" → **Expected:** Emergency Template.
* *Test:* "I need a quote for a printer" → **Expected:** Consultation Template.
* *Test:* "Help my computer is slow" → **Expected:** General Info Template.

## 🔍 Troubleshooting & Optimization

### 1. Avoiding "Email Loops"
An email loop occurs if two automated systems (e.g., your Gmail and a customer’s "Out of Office" reply) keep replying to each other.
* **The Fix:** Every filter in this repo includes `-">"` in the "Doesn't have" section. This detects the "quoted text" marker used in replies. This ensures the automation **only** fires on the first email of a new thread and never on a reply or a back-and-forth conversation.
* **Shop Address:** Ensure your physical shop address is listed in the `Doesn't have` field of logistical filters to prevent auto-replying to your own shipping labels or vendor invoices.

### 2. Gmail Character Limits
Gmail has a hidden character limit for filter strings (approximately 1,500 characters). 
* **The Issue:** If you add too many keywords, the filter may stop working or fail to save.
* **The Fix:** If a filter gets too long, use partial matches. Instead of `"emergency service request"`, use `"emergency"`. Gmail’s search is broad; "emergency" will catch "emergency service," "emergency repair," and "emergencies."

### 3. "Double-Firing" Templates
If a customer receives two different templates for one email:
* **The Issue:** The email contained keywords that matched two separate filters, and the "Doesn't have" exclusions were not broad enough.
* **The Fix:** Identify the template that *shouldn't* have sent. Take a unique keyword from the template that *should* have sent, and add it to the "Doesn't have" field of the incorrect filter.
    * *Example:* If a "Printer" email also triggers "General Info," add `-printer` to the General Info filter's exclusions.

### 4. Template Not Sending
* **The Issue:** Gmail limits the number of automated template sends to prevent spamming.
* **The Fix:** If you are testing heavily, Gmail may pause the automation for 24 hours. Additionally, ensure the "Send Template" box is checked in the filter settings; sometimes, updating the search criteria can accidentally uncheck the action box.

### 5. False Positives from Marketing
If a newsletter triggers a "Pricing" or "Emergency" reply:
* **The Fix:** Add unique words found in that newsletter (e.g., `"Unsubscribe"`, `"View in browser"`, or the sender's domain) to the `Doesn't have` section of the relevant filter.

---
*Written & Maintained by Jon Pienkowski ~ Pacific NW Computers*
