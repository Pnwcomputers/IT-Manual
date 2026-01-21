# 🤖 AI Tools & Workflows

**Part of the [IT-Manual](../README.md)**
*Standardized prompts, recommended tools, and guidelines for using AI in technical operations.*

---

## 📖 Overview
This directory serves as the hub for integrating Artificial Intelligence into our daily workflows. It is not just a list of tools, but a guide on *how* to use them effectively to speed up scripting, draft client communications, and diagnose obscure errors without hallucinating facts.

## 📂 Contents

### 🧠 Prompt Libraries
*Pre-written inputs to get consistent outputs.*

- **[AI Prompts](./ai_prompts.md)**
  **The Master List:** A collection of "battle-tested" prompts for specific shop scenarios.
  * *Includes:* "Explain this technical failure to a non-tech client," "Convert this Batch file to PowerShell," and "Analyze this event log for root cause."

### 🛠️ Approved Tools
*Software and platforms authorized for use.*

* *Documentation in progress. Future updates will include approved LLMs for coding vs. communication.*

---

## ⚡ The "Context Sandwich" Method
*To get useful results from AI, technicians should follow this structure (detailed in `ai_prompts.md`).*



| Layer | Purpose | Example |
| :--- | :--- | :--- |
| **1. Role** | Tell the AI who it is. | "Act as a Senior Tier 3 Technician..." |
| **2. Context** | Give the background. | "...Helping a frustrated client whose printer keeps going offline..." |
| **3. Task** | The specific action. | "...Draft an email explaining that the issue is their network, not the printer." |
| **4. Constraints** | Limits on the output. | "**Do not** use technical jargon. Keep it under 150 words. Be empathetic." |

---

## ⚠️ AI Usage Warnings
* **Do NOT paste client passwords, API keys, or PII (Personally Identifiable Information) into public AI tools.**
* AI can "hallucinate" (invent) command syntax. **Always test code** in a sandbox before running it on a client machine.

---
*Maintained by [Pacific Northwest Computers](https://github.com/Pnwcomputers)*
