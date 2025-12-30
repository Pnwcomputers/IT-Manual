# Tool: Weekly Appointment Reminders

This Google Apps Script helps reduce "no-shows" by scanning your service calendar every Monday morning for all appointments scheduled for the upcoming week. 
It automatically identifies the client, retrieves their contact details, and sends a professional reminder including the date, time, and location.

## ⚙️ Script Configuration
1. Go to [script.google.com](https://script.google.com).
2. Create a new project named `Appointment Reminders`.
3. **Important:** Click the **+** next to "Services" in the left sidebar and add the **Google People API**.
4. Paste the code below. 
5. Replace placeholder values in `sendReminderEmail`:
   - `PHONE`: Your business phone.
   - `EMAIL`: Your support email.
   - `Company Name`: Your business name.
6. Run the `createWeeklyMondayTrigger` function **once** to schedule the automation for every Monday at 8:00 AM.

### The Script
```javascript
// ============================================
// WEEKLY APPOINTMENT REMINDERS
// Sends reminders for upcoming appointments
// ============================================

function sendWeeklyAppointmentReminders() {
  // Get specific calendar by name
  const calendars = CalendarApp.getCalendarsByName('default'); 
  
  if (calendars.length === 0) {
    Logger.log('ERROR: Calendar not found!');
    return;
  }
  
  const calendar = calendars[0];
  
  // Get Monday through Sunday of current week
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const events = calendar.getEvents(startOfWeek, endOfWeek);
  
  events.forEach(event => {
    const title = event.getTitle();
    const startDateTime = event.getStartTime();
    const location = event.getLocation();
    const description = event.getDescription();
    
    if (shouldSkipEvent(title)) return;
    
    // Search logic: Guest List -> Contacts -> Title Email
    const guests = event.getGuestList();
    let email = (guests.length > 0) ? guests[0].getEmail() : findEmailByName(title);
    
    if (email) {
      sendReminderEmail(email, title, startDateTime, location, description);
    }
  });
}

// ... [Insert the rest of the script provided above] ...
