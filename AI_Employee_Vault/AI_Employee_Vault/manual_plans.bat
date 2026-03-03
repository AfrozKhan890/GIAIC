@echo off
cd C:\Users\afroz\Desktop\GIAIC\AI_Employee_Vault
echo ================================
echo MANUAL PLAN CREATION
echo ================================

:: Pehle file ka naam dekh lo
dir Needs_Action\*.md /b

echo.
echo Copy karo filename from above
set /p filename="Enter filename to process: "

kiro "Create a plan for Needs_Action\%filename%. Save as Plans\%filename%_plan.md"

echo Done!
dir Plans
pause