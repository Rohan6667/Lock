from playwright.sync_api import sync_playwright
import os
import time
import sys

# Live logs ke liye
sys.stdout.reconfigure(line_buffering=True)

def run_bot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        target_url = os.getenv("TARGET_URL")
        
        print(f"[LOG] Navigating to: {target_url}")
        page.goto(target_url, wait_until="networkidle")

        def perform_click(text):
            print(f"[LOG] Trying to click: {text}")
            try:
                # Selector ko aur generic banaya
                page.wait_for_selector(f"text={text}", state="visible", timeout=15000)
                page.get_by_text(text, exact=False).first.click()
                page.wait_for_load_state("networkidle")
                time.sleep(3)
            except Exception as e:
                print(f"[WARNING] Click failed: {text}")

        # Flow execution
        for i in range(2):
            perform_click("I am not a robot")
            perform_click("Click 2x")
            perform_click("Download Link")
        
        time.sleep(10)
        
        # Final button
        try:
            page.locator("#btn-main").click()
            print("[SUCCESS] Final button clicked!")
        except:
            print("[ERROR] Final button not found.")
            
        browser.close()

if __name__ == "__main__":
    run_bot()
