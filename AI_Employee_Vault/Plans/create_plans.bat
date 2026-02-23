@echo off
cd C:\Users\afroz\Desktop\GIAIC\AI_Employee_Vault
echo ========================================
echo CREATING PLANS FOR ALL EMAILS
echo ========================================
echo.

:: Clear old plans (optional)
del Plans\*.md 2>nul

:: Process each file one by one
for %%f in (Needs_Action\*.md) do (
    echo Processing: %%f
    kiro "Read file %%f and create a plan in Plans folder with same name but _plan suffix. Use this format: # EMAIL PLAN^
    ^
    ## Summary^
    [Brief summary]^
    ^
    ## Action Items^
    - [ ] Action 1^
    - [ ] Action 2^
    ^
    ## Priority^
    [High/Medium/Low]"
    echo ----------------------------------------
)

echo.
echo Done! Check Plans folder:
dir Plans
pause