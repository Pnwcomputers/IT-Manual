# Tool: Mileage & Tax Deduction Calculator

This Google Apps Script automatically scans your Google Calendar for the current year, identifies onsite service calls by their location field, calculates the driving distance from your shop using Google Maps, and generates a spreadsheet for tax purposes.

## ⚙️ Script Configuration
1. Go to [script.google.com](https://script.google.com).
2. Create a new project named `Mileage Calculator`.
3. Paste the code below, replacing the placeholder values with your own.

### The Script
```javascript
/**
 * Mileage Calculator
 * * SETUP: Paste into script.google.com, click Run
 */

const OFFICE = "[YOUR SHOP ADDRESS]";
const YEAR = new Date().getFullYear();
const IRS_RATE = 0.70; // Update annually based on IRS standard mileage rates

function run() {
  const calendar = CalendarApp.getDefaultCalendar();
  const events = calendar.getEvents(new Date(YEAR, 0, 1), new Date(YEAR, 11, 31, 23, 59, 59));
  
  Logger.log(`Total calendar events in ${YEAR}: ${events.length}`);
  
  const cache = {};
  const results = [];
  let totalMiles = 0;
  
  for (const event of events) {
    const location = event.getLocation();
    
    // Skip if no location or virtual meeting
    if (!location || location.length < 5 || 
        location.includes("http") || location.includes("zoom") || 
        location.includes("teams") || location.includes("meet.google")) {
      continue;
    }
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    const day = event.getStartTime().getDay();
    if (day === 0 || day === 6) {
      continue;
    }
    
    const key = location.toLowerCase().trim();
    let miles;
    
    if (cache[key]) {
      miles = cache[key];
    } else {
      try {
        const directions = Maps.newDirectionFinder()
          .setOrigin(OFFICE)
          .setDestination(location)
          .setMode(Maps.Direction
