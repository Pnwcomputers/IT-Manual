# Duplicate Files Resolution Guide

This guide helps you resolve the 6 duplicate filename issues in the IT Manual.

---

## 📋 Duplicate Files List

### 1. Websites-Diagnostics-Assistance.md
- **Location 1**: `tools/Websites-Diagnostics-Assistance.md`
- **Location 2**: `windows/Websites-Diagnostics-Assistance.md`

**Recommendation**: Keep the `tools/` version as primary. Content appears to be general diagnostic websites that apply to all platforms. The `windows/` directory should focus on Windows-specific content.

**Action**:
```bash
# Delete the Windows version
rm windows/Websites-Diagnostics-Assistance.md

# Update any links pointing to the Windows version to use:
../tools/Websites-Diagnostics-Assistance.md
```

---

### 2. Apple-ID-Login-Troubleshooting.md
- **Location 1**: `mac/Apple-ID-Login-Troubleshooting.md`
- **Location 2**: `accounts/Apple-ID-Login-Troubleshooting.md`

**Recommendation**: Keep the `accounts/` version as primary since it's specifically about account login issues. The `accounts/` directory is the logical home for all login troubleshooting.

**Action**:
```bash
# Delete the Mac version
rm mac/Apple-ID-Login-Troubleshooting.md

# Update any links in Mac-related files to use:
../accounts/Apple-ID-Login-Troubleshooting.md
```

---

### 3. Mac-Apple-System-Log-Diagnostics.md
- **Location 1**: `mac/Mac-Apple-System-Log-Diagnostics.md`
- **Location 2**: `diagnostics/Mac-Apple-System-Log-Diagnostics.md`

**Recommendation**: Keep the `diagnostics/` version as primary. System log diagnostics is fundamentally a diagnostic procedure, and having it in the diagnostics directory makes it easier to find alongside other diagnostic procedures.

**Action**:
```bash
# Delete the Mac version
rm mac/Mac-Apple-System-Log-Diagnostics.md

# Update any links to use:
../diagnostics/Mac-Apple-System-Log-Diagnostics.md
```

---

### 4. Printer-Troubleshooting-OSX.md
- **Location 1**: `mac/Printer-Troubleshooting-OSX.md`
- **Location 2**: `printers/Printer-Troubleshooting-OSX.md`

**Recommendation**: Keep the `printers/` version as primary. All printer-related content should be centralized in the printers directory for easier maintenance and discoverability.

**Action**:
```bash
# Delete the Mac version
rm mac/Printer-Troubleshooting-OSX.md

# Update any links to use:
../printers/Printer-Troubleshooting-OSX.md
```

---

### 5. Security_Tuneup_Detailed.md
- **Location 1**: `security/Security_Tuneup_Detailed.md`
- **Location 2**: `procedures/Security_Tuneup_Detailed.md`

**Recommendation**: Keep the `security/` version as primary. Security tune-ups are fundamentally security operations and should be housed in the security directory.

**Action**:
```bash
# Delete the Procedures version
rm procedures/Security_Tuneup_Detailed.md

# Update any links to use:
../security/Security_Tuneup_Detailed.md
```

---

### 6. Clean-up-Temp-Junk-Data.md
- **Location 1**: `security/Clean-up-Temp-Junk-Data.md`
- **Location 2**: `procedures/Clean-up-Temp-Junk-Data.md`

**Recommendation**: This is a tricky one. Cleaning temp data is both a security measure AND a standard procedure.

**Option A - Keep Security version**:
- Primary purpose is system security/optimization
- Place in `security/` and reference from procedures

**Option B - Keep Procedures version**:
- Part of standard job procedures
- Place in `procedures/` and cross-reference in security docs

**Recommended: Option A - Keep in security/**

**Action**:
```bash
# Delete the Procedures version
rm procedures/Clean-up-Temp-Junk-Data.md

# Update any links to use:
../security/Clean-up-Temp-Junk-Data.md
```

---

## 🔧 Implementation Script

Here's a script to automatically resolve all duplicates based on the recommendations above:

```bash
#!/bin/bash
# Duplicate Resolution Script

cd /path/to/IT-Manual-main

# Backup before making changes
echo "Creating backup..."
tar -czf IT-Manual-backup-$(date +%Y%m%d).tar.gz .

# Delete duplicate files
echo "Removing duplicate files..."
rm windows/Websites-Diagnostics-Assistance.md
rm mac/Apple-ID-Login-Troubleshooting.md
rm mac/Mac-Apple-System-Log-Diagnostics.md
rm mac/Printer-Troubleshooting-OSX.md
rm procedures/Security_Tuneup_Detailed.md
rm procedures/Clean-up-Temp-Junk-Data.md

echo "Duplicate files removed!"
echo "Note: You may need to update some links manually if any files referenced the deleted versions."
```

---

## 🔍 Verification Steps

After removing duplicates:

1. **Run link checker**:
   ```bash
   python3 analyze_manual.py
   ```

2. **Search for any remaining broken links**:
   ```bash
   grep -r "Websites-Diagnostics-Assistance.md" --include="*.md"
   grep -r "Apple-ID-Login-Troubleshooting.md" --include="*.md"
   grep -r "Mac-Apple-System-Log-Diagnostics.md" --include="*.md"
   grep -r "Printer-Troubleshooting-OSX.md" --include="*.md"
   grep -r "Security_Tuneup_Detailed.md" --include="*.md"
   grep -r "Clean-up-Temp-Junk-Data.md" --include="*.md"
   ```

3. **Test navigation** - Ensure all links work as expected

---

## 📝 Alternative Approach: Redirect Files

If you want to keep both files temporarily, you can convert the duplicates to redirect files:

**Example redirect file** (`mac/Apple-ID-Login-Troubleshooting.md`):
```markdown
# Apple ID Login Troubleshooting

> ⚠️ **This page has moved!**
> 
> Please see: [Apple ID Login Troubleshooting](../accounts/Apple-ID-Login-Troubleshooting.md)

This content has been consolidated into the Accounts section for better organization.
```

This approach:
- Keeps old links working
- Provides clear redirection
- Can be removed later once all references are updated

---

## ✅ Recommended Order of Operations

1. **Review each duplicate pair** - Verify which version has the most complete content
2. **Create backup** - Always backup before deleting files
3. **Update primary file** - If needed, merge content from both versions
4. **Update links** - Run find/replace to update any references
5. **Delete duplicate** - Remove the secondary copy
6. **Test** - Verify all links work
7. **Commit changes** - Save your work with a clear commit message

---

**Last Updated**: October 2025
