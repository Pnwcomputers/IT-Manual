# 📁 Editing Windows Host File

The Windows **hosts file** is a plain text file used to map hostnames to IP addresses. It is a critical, low-level component that can be used to override DNS settings locally.

> **Note:** This procedure works **ONLY IF** the target network device(s) has a **STATIC IP**. Ensure you **SET A DEVICE STATIC IP IF/AS NEEDED!**

---

## Common Reasons to Modify the Hosts File

1.  **Redirecting Domains:** To point a domain to a different IP address for development or testing purposes.
2.  **Blocking Websites:** To prevent access to specific websites by redirecting them to a non-existent or loopback IP (e.g., `0.0.0.0`).
3.  **Testing Server Changes:** To test changes on a staging server by pointing a domain to the staging server's IP instead of the production server.
4.  **Improving Local Network Access & Performance:**
    * Used to create a static **"direct link"** to resolve local network hostnames when experiencing general network device access issues (e.g., DNS or network bugs).
    * Resolves local network hostnames faster without querying a DNS server.
    * **Always triple check** a system's file and print sharing setup/settings before modifying the hosts file.
5.  **Bypassing DNS:** To bypass the DNS settings for specific domains, useful for troubleshooting DNS issues (e.g., the static link bypass).

---

## Procedure to Modify the Windows Hosts File

### Step 1: Locate the Hosts File

The hosts file is located in the following directory:
