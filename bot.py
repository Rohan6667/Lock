from playwright.sync_api import sync_playwright
import time
import sys

# Ensure logs are printed instantly
sys.stdout.reconfigure(line_buffering=True)

def run_bot():
    with sync_playwright() as p:
        # Launching with a proper User-Agent to mimic a real browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
        page = context.new_page()
        
        target_url = "https://indianshortner.in/5Nrtc"
        print(f"[LOG] Navigating to: {target_url}")
        
        try:
            page.goto(target_url, wait_until="networkidle")
            
            def wait_and_click(button_text):
                print(f"[LOG] Searching for: {button_text}")
                # We look for buttons/links containing the text
                selector = f"//button[contains(text(), '{button_text}')] | //a[contains(text(), '{button_text}')]"
                # Wait up to 20 seconds for the element to appear
                page.wait_for_selector(selector, timeout=20000)
                page.locator(selector).first.click()
                print(f"[SUCCESS] Clicked: {button_text}")
                # Wait for any potential redirect after the click
                page.wait_for_load_state("networkidle")
                time.sleep(3)

            # Cycle execution
            for i in range(2):
                print(f"[LOG] --- Starting Cycle {i+1} ---")
                wait_and_click("I am not a robot")
                wait_and_click("Click 2x")
                wait_and_click("Download Link")

            print("[LOG] Waiting for 10s timer...")
            time.sleep(10)
            
            # Clicking the final button
            print("[LOG] Attempting to click final button...")
            page.locator("#btn-main").click()
            time.sleep(5)
            print(f"[SUCCESS] Final URL reached: {page.url}")

        except Exception as e:
            print(f"[ERROR] Bot failed: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run_bot()
