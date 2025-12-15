// ============================================
// WEEKLY APPOINTMENT REMINDERS
// Sends reminders for upcoming appointments
// ============================================

function sendWeeklyAppointmentReminders() {
  // Get specific calendar by name
  const calendars = CalendarApp.getCalendarsByName('default');  // <- Enter Calendar Name
  
  if (calendars.length === 0) {
    Logger.log('ERROR: Calendar "Calendar" not found!');
    Logger.log('Available calendars:');
    CalendarApp.getAllCalendars().forEach(cal => {
      Logger.log(`  - ${cal.getName()}`);
    });
    return;
  }
  
  const calendar = calendars[0];
  Logger.log(`Using calendar: ${calendar.getName()}`);
  
  // Get Monday through Sunday of current week
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);
  
  // Get all events for the week
  const events = calendar.getEvents(startOfWeek, endOfWeek);
  
  Logger.log(`Found ${events.length} appointments for the week`);
  
  // Process each event
  events.forEach(event => {
    const title = event.getTitle();
    const startDateTime = event.getStartTime();
    const location = event.getLocation();
    const description = event.getDescription();
    
    // Skip events that match exclusion patterns
    if (shouldSkipEvent(title)) {
      Logger.log(`⊘ Skipping excluded event: ${title}`);
      return;
    }
    
    // Try to find email from event guests first
    const guests = event.getGuestList();
    let email = null;
    
    if (guests.length > 0) {
      email = guests[0].getEmail();
      Logger.log(`Found email from guest list: ${email} for ${title}`);
    } else {
      // Search contacts by client name in title
      email = findEmailByName(title);
    }
    
    if (email) {
      sendReminderEmail(email, title, startDateTime, location, description);
      Logger.log(`✓ Reminder sent to ${email} for ${title}`);
    } else {
      Logger.log(`✗ No email found for: ${title}`);
    }
  });
}

function shouldSkipEvent(title) {
  const titleLower = title.toLowerCase();
  
  const excludePatterns = [
    'term one',
    'term 2',
  ];
  
  return excludePatterns.some(pattern => titleLower.includes(pattern));
}

function findEmailByName(clientName) {
  // ============================================
  // MANUAL OVERRIDES (add problem cases here)
  // ============================================
  const manualOverrides = {
  'name': 'user@user.com',
  // etc.
};
  
  // Clean up the name
  let cleanName = clientName.split('-')[0].trim();
  
  // Remove common appointment suffixes/prefixes
  const removeWords = ['onsite', 'remote', 'phone', 'call', 'visit', 'appointment', 
                       'meeting', 'service', 'repair', 'follow', 'up', 'followup', 
                       'consultation', 'ram', 'replacement'];
  removeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleanName = cleanName.replace(regex, '').trim();
  });
  
  // Clean up extra spaces and hyphens
  cleanName = cleanName.replace(/\s+/g, ' ').replace(/\s*-\s*/g, ' ').trim();
  
  Logger.log(`Searching for contact: "${clientName}" → cleaned to: "${cleanName}"`);
  
  // Check manual overrides first
  const cleanLower = cleanName.toLowerCase();
  for (const [key, email] of Object.entries(manualOverrides)) {
    if (cleanLower.includes(key) || key.includes(cleanLower)) {
      Logger.log(`✓ Found manual override: "${key}" → ${email}`);
      return email;
    }
  }
  
  // Check if there's an email in the title
  const emailPattern = /[\w\.-]+@[\w\.-]+\.\w+/;
  const emailMatch = cleanName.match(emailPattern);
  if (emailMatch) {
    Logger.log(`✓ Found email in event title: ${emailMatch[0]}`);
    return emailMatch[0];
  }
  
  try {
    // Try People API search
    const email = searchPeopleAPI(cleanName);
    if (email) return email;
    
    Logger.log(`No contact found for: "${clientName}" (cleaned: "${cleanName}")`);
    Logger.log(`   To manually add, put this in manualOverrides: '${cleanLower}': 'email@example.com'`);
  } catch (e) {
    Logger.log(`Error finding contact for "${cleanName}": ${e.message}`);
  }
  
  return null;
}

function searchPeopleAPI(searchTerm) {
  try {
    // Search using People API Advanced Service
    const response = People.People.searchContacts({
      query: searchTerm,
      readMask: 'names,emailAddresses,organizations',
      pageSize: 10
    });
    
    if (response.results && response.results.length > 0) {
      // Loop through results to find one with an email
      for (const result of response.results) {
        const person = result.person;
        
        if (person.emailAddresses && person.emailAddresses.length > 0) {
          const email = person.emailAddresses[0].value;
          const name = person.names && person.names.length > 0 ? person.names[0].displayName : '';
          Logger.log(`✓ Found contact: "${name}" → ${email}`);
          return email;
        }
      }
    }
    
    // If full search didn't work, try individual words
    const words = searchTerm.split(/\s+/).filter(word => word.length >= 3);
    for (const word of words) {
      const wordResponse = People.People.searchContacts({
        query: word,
        readMask: 'names,emailAddresses,organizations',
        pageSize: 5
      });
      
      if (wordResponse.results && wordResponse.results.length > 0) {
        const person = wordResponse.results[0].person;
        
        if (person.emailAddresses && person.emailAddresses.length > 0) {
          const email = person.emailAddresses[0].value;
          const name = person.names && person.names.length > 0 ? person.names[0].displayName : '';
          Logger.log(`✓ Found contact by word "${word}": "${name}" → ${email}`);
          return email;
        }
      }
    }
  } catch (e) {
    Logger.log(`People API search failed: ${e.message}`);
  }
  
  return null;
}

function sendReminderEmail(email, clientName, appointmentTime, location, description) {
  const subject = `Appointment Reminder - Pacific Northwest Computers`;
  
  const formattedTime = Utilities.formatDate(appointmentTime, 
    'America/Los_Angeles', 
    "EEEE, MMMM dd, yyyy 'at' h:mm a");
  
  const PHONE = '(888) 888-8888';
  const EMAIL = 'email@user.com';
  
  const body = `
Hello,

This is a reminder that you have an upcoming appointment:

Date & Time: ${formattedTime}
${location ? 'Location: ' + location : ''}

${description ? description + '\n' : ''}
If anything has changed or come up and you need to cancel or reschedule, please let us know ASAP and we can get you rescheduled!
Otherwise we will plan to see you then!

Thank you,

Company Name
Location
${PHONE}
${EMAIL}
  `.trim();
  
  try {
    GmailApp.sendEmail(email, subject, body);
  } catch (e) {
    Logger.log(`Error sending email to ${email}: ${e.message}`);
  }
}

// Run this function ONCE to set up the weekly Monday trigger
function createWeeklyMondayTrigger() {
  // Delete any existing triggers first
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'sendWeeklyAppointmentReminders') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger for every Monday at 8 AM
  ScriptApp.newTrigger('sendWeeklyAppointmentReminders')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();
  
  Logger.log('Weekly reminder trigger created successfully');
}
