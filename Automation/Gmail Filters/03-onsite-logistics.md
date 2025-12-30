# Filter: Onsite Service Requests
**Priority:** 3

## Gmail Filter Syntax
- **Has the words:** `to:(support@yourdomain.com) {"onsite" "on-site" "house call" "home visit" "office visit" "come to my" "visit my" "at my house" "at my office" "at my business" "at my location" "send someone" "someone to come" "in-home service" "in-office network" "onsite service" "can't bring it" "too big to move" "multiple computers" "whole office" "my address is" "come set up my" "come fix my"}`
- **Doesn't have:** `{subject:(re: fw: fwd:) "do not reply" noreply "tracking number" shipment delivery "order confirmation" invoice receipt "password reset" "verification code" "Support Team" "Customer Service" unsubscribe "automated message" "auto-reply" "out of office" ">" "urgent" "emergency" "data recovery" "recover files" "[YOUR BUSINESS ADDRESS]"}`

## Action
- Send Template: `Onsite Service Request`
- Mark as Important
