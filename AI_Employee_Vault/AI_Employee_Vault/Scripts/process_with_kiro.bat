@echo off
echo ========================================
echo AI EMPLOYEE - Processing with Kiro CLI
echo ========================================
echo.

cd C:\Users\afroz\Desktop\GIAIC\AI_Employee_Vault

echo Step 1: Checking Needs_Action folder...
dir Needs_Action /w
echo.

echo Step 2: Processing emails with Kiro...
echo.

kiro "I am your AI Employee. Please process all files in the Needs_Action folder. For each file:
1. Read the email content
2. Create a plan file in the Plans folder with the same name (add _plan suffix)
3. The plan file should have this format:
   ---
   # EMAIL PLAN: [subject]
   ## Actions Required
   - [ ] Read full email
   - [ ] Draft reply (if needed)
   - [ ] Flag for approval (if contains payment)
   - [ ] Move to Done after processing
   ## Summary
   [Brief summary of email]
   ---
4. After creating plans, list all files in Plans folder"

echo.
echo Step 3: Checking Plans folder...
dir Plans /w
echo.

echo ========================================
echo Processing complete!
pause