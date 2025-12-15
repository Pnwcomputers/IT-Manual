// ============================================
// 30-DAY FOLLOW-UP EMAILS
// Sends follow-up emails to clients 30+ days after service
// ============================================

function sendFollowUpEmails() {
  // Get specific calendar by name
  const calendars = CalendarApp.getCalendarsByName('defualt'); // <-Enter your calendar name
  
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
  
  // Get date range: 30-37 days ago (1 week window)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 37);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 30);
  endDate.setHours(23, 59, 59, 999);
  
  Logger.log(`Searching for appointments between ${startDate.toDateString()} and ${endDate.toDateString()}`);
  
  // Get all events in that date range
  const events = calendar.getEvents(startDate, endDate);
  
  Logger.log(`Found ${events.length} appointments from 30-37 days ago`);
  
  // Track emails sent to avoid duplicates
  const emailsSent = new Set();
  
  // Process each event
  events.forEach(event => {
    const title = event.getTitle();
    const appointmentDate = event.getStartTime();
    const location = event.getLocation();
    
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
    
    if (email && !emailsSent.has(email)) {
      sendFollowUpEmail(email, title, appointmentDate, location);
      emailsSent.add(email);
      Logger.log(`✓ Follow-up sent to ${email} for ${title}`);
    } else if (email && emailsSent.has(email)) {
      Logger.log(`⊘ Already sent follow-up to ${email}, skipping`);
    } else {
      Logger.log(`✗ No email found for: ${title}`);
    }
  });
  
  Logger.log(`Total follow-up emails sent: ${emailsSent.size}`);
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
  'name': 'user@user.com'
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

function sendFollowUpEmail(email, clientName, appointmentDate, location) {
  const subject = `Following Up`;
  
  const formattedDate = Utilities.formatDate(appointmentDate, 
    'America/Los_Angeles', 
    "EEEE, MMMM dd, yyyy");
  
  const PHONE = '(888) 888-8888';
  const EMAIL = 'email@user.com';
  const FEEDBACK_FORM = 'https://';
  
  const body = `
Hello,

I wanted to follow up after our recent service visit on ${formattedDate}. 

I hope everything is still running smoothly! If you're experiencing any issues with your computer or have any questions about the work we performed, please don't hesitate to reach out.

A few things to keep in mind:
- Regular maintenance helps prevent future issues
- Windows updates should be checked monthly
- Backups are your best defense against data loss

If you'd like to schedule a maintenance check-in or need any additional IT support, I'm here to help.

We'd love to hear about your experience! Please take a moment to share your feedback:
${FEEDBACK_FORM}

Thank you for trusting us with your technology needs!

Best regards,

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

// Run this function ONCE to set up the weekly follow-up trigger
function createWeeklyFollowUpTrigger() {
  // Delete any existing triggers first
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'sendFollowUpEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger to run every Monday at 9 AM
  ScriptApp.newTrigger('sendFollowUpEmails')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();
  
  Logger.log('Weekly follow-up trigger created successfully');
}
