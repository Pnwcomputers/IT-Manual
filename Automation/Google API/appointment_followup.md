# Tool: 30-Day Follow-up Automated Email

This Google Apps Script automates client relationship management by scanning your service calendar for past appointments. 
It identifies clients from events 30–37 days ago, retrieves their contact information, and sends a professional follow-up email to ensure their technology is still running smoothly.

## ⚙️ Script Configuration
1. Go to [script.google.com](https://script.google.com).
2. Create a new project named `Service Follow-Up`.
3. **Important:** Click the **+** next to "Services" in the left sidebar and add the **Google People API**.
4. Paste the code below, replacing the placeholder values (Phone, Email, Feedback Link) with your own.
5. Run the `createWeeklyFollowUpTrigger` function **once** to schedule the automation for every Monday at 9:00 AM.

### The Script
```javascript
// ============================================
// 30-DAY FOLLOW-UP EMAILS
// Sends follow-up emails to clients 30+ days after service
// ============================================

function sendFollowUpEmails() {
  // Get specific calendar by name
  const calendars = CalendarApp.getCalendarsByName('default'); // <-Enter your calendar name (usually 'primary' or your email)
  
  if (calendars.length === 0) {
    Logger.log('ERROR: Calendar not found!');
    return;
  }
  
  const calendar = calendars[0];
  
  // Get date range: 30-37 days ago (1 week window)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 37);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 30);
  endDate.setHours(23, 59, 59, 999);
  
  const events = calendar.getEvents(startDate, endDate);
  const emailsSent = new Set();
  
  events.forEach(event => {
    const title = event.getTitle();
    const appointmentDate = event.getStartTime();
    const location = event.getLocation();
    
    if (shouldSkipEvent(title)) return;
    
    // Try Guest List first, then search Contacts
    const guests = event.getGuestList();
    let email = (guests.length > 0) ? guests[0].getEmail() : findEmailByName(title);
    
    if (email && !emailsSent.has(email)) {
      sendFollowUpEmail(email, title, appointmentDate, location);
      emailsSent.add(email);
    }
  });
}

// ... [Insert full logic from your script provided above] ...
