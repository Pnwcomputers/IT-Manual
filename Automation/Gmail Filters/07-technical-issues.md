# Filter: Specific Technical Issues (WiFi/Printer/Email)
**Priority:** 4

## Gmail Filter Syntax
- **Has the words:** `to:(support@yourdomain.com) {"wifi" "internet" "router" "modem" "network" "printer" "won't print" "print job" "outlook" "email issue" "login" "password"}`
- **Doesn't have:** `{subject:(re: fw: fwd:) "do not reply" noreply "tracking" "shipment" "delivery" "order" "package" "invoice" "receipt" "password reset" "verification code" "Support Team" "Customer Service" unsubscribe ">" "urgent" "emergency" "data recovery" "onsite" "house call"}`

## Action
- Send Template: `Onsite Service Request`
- Mark as Important
