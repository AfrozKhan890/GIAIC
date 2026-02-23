# """
# Kiro CLI Orchestrator for AI Employee
# Free version using Kiro instead of Claude Code
# """

# import subprocess
# import time
# from pathlib import Path
# import sys
# from datetime import datetime

# class KiroOrchestrator:
#     def __init__(self, vault_path):
#         self.vault_path = Path(vault_path)
#         self.scripts_path = self.vault_path / 'Scripts'
#         self.logs_path = self.vault_path / 'Logs'
#         self.needs_action = self.vault_path / 'Needs_Action'
#         self.plans = self.vault_path / 'Plans'
        
#     def log(self, message):
#         timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#         log_entry = f"[{timestamp}] {message}\n"
#         print(log_entry.strip())
        
#         log_file = self.logs_path / f'kiro_{datetime.now().strftime("%Y%m%d")}.log'
#         with open(log_file, 'a', encoding='utf-8') as f:
#             f.write(log_entry)
    
#     def run_gmail_watcher(self):
#         """Run Gmail watcher script"""
#         self.log("📧 Running Gmail watcher...")
#         try:
#             result = subprocess.run(
#                 [sys.executable, 'gmail_watcher.py'],
#                 cwd=self.scripts_path,
#                 capture_output=True,
#                 text=True,
#                 timeout=60
#             )
#             if result.returncode == 0:
#                 self.log("✅ Gmail watcher completed")
#                 # Count files
#                 files = list(self.needs_action.glob('*.md'))
#                 self.log(f"📊 Files in Needs_Action: {len(files)}")
#                 return True
#             else:
#                 self.log(f"❌ Error: {result.stderr}")
#                 return False
#         except Exception as e:
#             self.log(f"❌ Exception: {str(e)}")
#             return False
    
#     def run_kiro_processing(self):
#         """Run Kiro to process Needs_Action files"""
#         self.log("🤖 Starting Kiro processing...")
        
#         # Get list of files
#         files = list(self.needs_action.glob('*.md'))
#         if not files:
#             self.log("📭 No files to process")
#             return True
        
#         self.log(f"📋 Processing {len(files)} files...")
        
#         # Process all files with Kiro (ek saath)
#         prompt = f"""
#         I have {len(files)} email files in the Needs_Action folder.
        
#         Please do the following for ALL files:
        
#         1. Read each file in Needs_Action folder
#         2. For EACH file, create a corresponding plan file in the Plans folder
#         3. Name each plan file as: [original_name]_plan.md
#         4. Each plan must have this exact format:
        
#         ---
#         # EMAIL PLAN
#         **Original Email:** [filename]
#         **Date:** {datetime.now().strftime('%Y-%m-%d')}
        
#         ## 📧 Summary
#         [Brief 1-line summary]
        
#         ## ✅ Action Items
#         - [ ] Read full email
#         - [ ] Draft reply (if needed)
#         - [ ] Take necessary action
#         - [ ] Move to Done folder
        
#         ## 🚨 Priority
#         [High/Medium/Low]
        
#         ## 📝 Notes
#         [Any important details]
#         ---
        
#         5. After creating all plans, list all files now in Plans folder
#         """
        
#         try:
#             # Run Kiro
#             self.log("⏳ Kiro is working (may take 30-60 seconds)...")
#             result = subprocess.run(
#                 ['C:\\Users\\afroz\\AppData\\Local\\Programs\\Kiro\\bin\\kiro.cmd', prompt],
#                 cwd=self.vault_path,
#                 capture_output=True,
#                 text=True,
#                 timeout=180  # 3 minutes timeout
#             )
            
#             if result.returncode == 0:
#                 self.log("✅ Kiro processing complete")
#                 # Log response (first 500 chars)
#                 self.log(f"📝 Response preview: {result.stdout[:500]}...")
#                 return True
#             else:
#                 self.log(f"❌ Kiro error: {result.stderr}")
#                 return False
                
#         except subprocess.TimeoutExpired:
#             self.log("❌ Kiro timeout - took too long")
#             return False
#         except Exception as e:
#             self.log(f"❌ Error: {str(e)}")
#             return False
    
#     def check_plans(self):
#         """Check created plans"""
#         plan_files = list(self.plans.glob('*_plan.md'))
#         self.log(f"📊 Plans created: {len(plan_files)}")
        
#         if plan_files:
#             self.log("📋 Plan files:")
#             for plan in plan_files[:5]:  # First 5 plans
#                 size = len(plan.read_text()) if plan.exists() else 0
#                 self.log(f"   - {plan.name} ({size} bytes)")
        
#         return plan_files
    
#     def move_to_done(self):
#         """Move processed files to Done folder"""
#         self.log("📦 Moving processed files...")
        
#         # Get plan files
#         plan_files = list(self.plans.glob('*_plan.md'))
        
#         if not plan_files:
#             self.log("📭 No plans found to move")
#             return
        
#         # For each plan, find original file and move
#         moved = 0
#         for plan in plan_files:
#             # Original filename (remove _plan suffix)
#             original_name = plan.name.replace('_plan.md', '.md')
#             original_path = self.needs_action / original_name
            
#             if original_path.exists():
#                 # Move to Done
#                 dest_path = self.vault_path / 'Done' / original_name
#                 original_path.rename(dest_path)
#                 self.log(f"✅ Moved: {original_name} -> Done/")
#                 moved += 1
        
#         self.log(f"📊 Total moved to Done: {moved}")
    
#     def run_once(self):
#         """Run one complete cycle"""
#         self.log("\n" + "="*60)
#         self.log("🚀 STARTING AI EMPLOYEE CYCLE")
#         self.log("="*60)
        
#         # Step 1: Run watcher
#         if self.run_gmail_watcher():
#             # Step 2: Process with Kiro
#             if self.run_kiro_processing():
#                 # Step 3: Check results
#                 plans = self.check_plans()
                
#                 # Step 4: Ask about moving to Done
#                 if plans:
#                     print("\n" + "="*60)
#                     print(f"✅ {len(plans)} plans created successfully!")
#                     print("="*60)
#                     move = input("\nMove processed files to Done folder? (y/n): ")
#                     if move.lower() == 'y':
#                         self.move_to_done()
        
#         self.log("="*60)
#         self.log("✅ CYCLE COMPLETE")
#         self.log("="*60 + "\n")
    
#     def run_continuous(self, interval_minutes=5):
#         """Run continuously"""
#         self.log(f"🔄 Continuous mode: Every {interval_minutes} minutes")
#         print("Press Ctrl+C to stop\n")
#         try:
#             while True:
#                 self.run_once()
#                 self.log(f"⏰ Waiting {interval_minutes} minutes...")
#                 time.sleep(interval_minutes * 60)
#         except KeyboardInterrupt:
#             self.log("👋 Stopped by user")

# def main():
#     vault_path = r"C:\Users\afroz\Desktop\GIAIC\AI_Employee_Vault"
#     orch = KiroOrchestrator(vault_path)
    
#     print("╔════════════════════════════════════╗")
#     print("║    AI EMPLOYEE - KIRO ORCHESTRATOR ║")
#     print("╚════════════════════════════════════╝\n")
    
#     print("1. Run once")
#     print("2. Run continuous (every 5 minutes)")
#     print("3. Exit")
    
#     choice = input("\nChoice (1/2/3): ")
    
#     if choice == '1':
#         orch.run_once()
#     elif choice == '2':
#         orch.run_continuous()
#     else:
#         print("Exiting...")

# if __name__ == "__main__":
#     main()



"""
Fixed Kiro Orchestrator - Processes files one by one
"""

import subprocess
import time
from pathlib import Path
import sys
from datetime import datetime

class FixedKiroOrchestrator:
    def __init__(self, vault_path):
        self.vault_path = Path(vault_path)
        self.scripts_path = self.vault_path / 'Scripts'
        self.logs_path = self.vault_path / 'Logs'
        self.needs_action = self.vault_path / 'Needs_Action'
        self.plans = self.vault_path / 'Plans'
        
    def log(self, message):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}\n"
        print(log_entry.strip())
        
        log_file = self.logs_path / f'kiro_{datetime.now().strftime("%Y%m%d")}.log'
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(log_entry)
    
    def run_gmail_watcher(self):
        """Run Gmail watcher script"""
        self.log("📧 Running Gmail watcher...")
        try:
            result = subprocess.run(
                [sys.executable, 'gmail_watcher.py'],
                cwd=self.scripts_path,
                capture_output=True,
                text=True,
                timeout=60
            )
            if result.returncode == 0:
                self.log("✅ Gmail watcher completed")
                files = list(self.needs_action.glob('*.md'))
                self.log(f"📊 Files in Needs_Action: {len(files)}")
                return True
            else:
                self.log(f"❌ Error: {result.stderr}")
                return False
        except Exception as e:
            self.log(f"❌ Exception: {str(e)}")
            return False
    
    def process_single_file(self, file_path):
        """Process one file with Kiro"""
        filename = file_path.name
        plan_name = filename.replace('.md', '_plan.md')
        plan_path = self.plans / plan_name
        
        # Skip if plan already exists
        if plan_path.exists():
            self.log(f"⏩ Plan exists for {filename}")
            return True
        
        self.log(f"🔄 Processing: {filename}")
        
        # Read file content
        try:
            content = file_path.read_text(encoding='utf-8')
            # Limit content length
            if len(content) > 1000:
                content = content[:1000] + "..."
        except:
            content = "Could not read file"
        
        # Create prompt for this specific file
        prompt = f"""
        Create a plan for this email file: {filename}
        
        Email content:
        {content}
        
        Create a plan file named: {plan_name}
        Save it in the Plans folder.
        
        The plan MUST have this exact format:
        
        # EMAIL PLAN: {filename}
        
        ## 📧 Summary
        [Write a 1-line summary]
        
        ## ✅ Action Items
        - [ ] Read full email
        - [ ] Take necessary action
        - [ ] Mark as done
        
        ## 🚨 Priority
        [High/Medium/Low]
        
        ## 📝 Notes
        [Any important details]
        
        Return ONLY the plan content, nothing else.
        """
        
        try:
            # Run Kiro for this file
            result = subprocess.run(
                ['C:\\Users\\afroz\\AppData\\Local\\Programs\\Kiro\\bin\\kiro.cmd', prompt],
                cwd=self.vault_path,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0 and result.stdout.strip():
                # Save the response as plan file
                plan_path.write_text(result.stdout, encoding='utf-8')
                self.log(f"✅ Created plan: {plan_name}")
                return True
            else:
                self.log(f"❌ Failed to create plan for {filename}")
                return False
                
        except Exception as e:
            self.log(f"❌ Error: {str(e)}")
            return False
    
    def process_all_files(self):
        """Process all files one by one"""
        files = list(self.needs_action.glob('*.md'))
        if not files:
            self.log("📭 No files to process")
            return []
        
        self.log(f"📋 Processing {len(files)} files one by one...")
        
        successful = []
        failed = []
        
        for i, file in enumerate(files, 1):
            self.log(f"\n[{i}/{len(files)}] Processing...")
            if self.process_single_file(file):
                successful.append(file)
            else:
                failed.append(file)
            
            # Small delay between files
            time.sleep(2)
        
        self.log(f"\n✅ Successful: {len(successful)}")
        self.log(f"❌ Failed: {len(failed)}")
        
        return successful
    
    def check_plans(self):
        """Check created plans"""
        plan_files = list(self.plans.glob('*_plan.md'))
        self.log(f"📊 Plans created: {len(plan_files)}")
        
        if plan_files:
            self.log("📋 Plan files:")
            for plan in plan_files[:5]:
                size = len(plan.read_text()) if plan.exists() else 0
                self.log(f"   - {plan.name} ({size} bytes)")
        
        return plan_files
    
    def move_to_done(self):
        """Move processed files to Done folder"""
        plan_files = list(self.plans.glob('*_plan.md'))
        
        if not plan_files:
            self.log("📭 No plans found to move")
            return
        
        moved = 0
        for plan in plan_files:
            original_name = plan.name.replace('_plan.md', '.md')
            original_path = self.needs_action / original_name
            
            if original_path.exists():
                dest_path = self.vault_path / 'Done' / original_name
                original_path.rename(dest_path)
                self.log(f"✅ Moved: {original_name} -> Done/")
                moved += 1
        
        self.log(f"📊 Total moved to Done: {moved}")
    
    def run_once(self):
        """Run one complete cycle"""
        self.log("\n" + "="*60)
        self.log("🚀 STARTING AI EMPLOYEE CYCLE (FIXED VERSION)")
        self.log("="*60)
        
        # Step 1: Run watcher
        if self.run_gmail_watcher():
            # Step 2: Process files one by one
            processed = self.process_all_files()
            
            # Step 3: Check results
            plans = self.check_plans()
            
            # Step 4: Ask about moving to Done
            if plans:
                print("\n" + "="*60)
                print(f"✅ {len(plans)} plans created successfully!")
                print("="*60)
                move = input("\nMove processed files to Done folder? (y/n): ")
                if move.lower() == 'y':
                    self.move_to_done()
        
        self.log("="*60)
        self.log("✅ CYCLE COMPLETE")
        self.log("="*60 + "\n")

def main():
    vault_path = r"C:\Users\afroz\Desktop\GIAIC\AI_Employee_Vault"
    orch = FixedKiroOrchestrator(vault_path)
    
    print("╔═══════════════════════════════════════╗")
    print("║    AI EMPLOYEE - FIXED ORCHESTRATOR   ║")
    print("╚═══════════════════════════════════════╝\n")
    
    orch.run_once()

if __name__ == "__main__":
    main()