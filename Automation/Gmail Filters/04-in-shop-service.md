# Filter: In-Shop/Bench Repairs
**Priority:** 3

## Gmail Filter Syntax
- **Has the words:** `to:(support@yourdomain.com) {"drop off" "drop-off" "bring it in" "bring in" "take it to your shop" "at your shop" "leave it with you" "screen replacement" "keyboard replacement" "upgrade ram" "upgrade my ram" "replace hard drive" "reinstall windows" "clean install windows" "in shop" "in-shop" "repair shop" "new computer" "new laptop" "new pc" "just bought" "just purchased" "transfer data" "move data"}`
- **Doesn't have:** `{subject:(re: fw: fwd:) "do not reply" noreply "tracking" shipment delivery "order" invoice receipt "password reset" "verification code" "Support Team" "Customer Service" unsubscribe "automated message" "auto-reply" "out of office" ">" "urgent" "emergency" "data recovery" "recover files" "onsite" "house call"}`

## Action
- Send Template: `In-Shop Service`
- Mark as Important
