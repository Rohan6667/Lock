from playwright.sync_api import sync_playwright
import os
import time

def run_bot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Using a context with a standard user-agent to avoid immediate blocking
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
        page = context.new_page()
        
        target_url = os.getenv("TARGET_URL")
        print(f"[LOG] Navigating to: {target_url}")
        
        # Increased timeout for initial load
        page.goto(target_url, wait_until="networkidle", timeout=60000)

        def click_safe(text):
            print(f"[LOG] Attempting to click: {text}")
            try:
                # Using a broader XPath to find buttons or links containing the text
                # and increasing timeout to 45 seconds for difficult elements
                page.wait_for_selector(f"//button[contains(text(), '{text}')] | //a[contains(text(), '{text}')]", timeout=45000)
                page.locator(f"//button[contains(text(), '{text}')] | //a[contains(text(), '{text}')]").first.click()
                print(f"[SUCCESS] Clicked: {text}")
                page.wait_for_load_state("networkidle")
                time.sleep(3) # Extra pause for redirection
            except Exception as e:
                print(f"[WARNING] Could not click {text}: {e}")

        # Executing the flow
        click_safe("I am not a robot")
        click_safe("Click 2x")
        click_safe("Download Link")
        
        # Second cycle
        print("[LOG] Starting second cycle...")
        click_safe("I am not a robot")
        click_safe("Click 2x")
        click_safe("Download Link")
        
        print("[LOG] Waiting for final timer...")
        time.sleep(10)

        # Trigger final button
        try:
            page.locator("#btn-main").wait_for(state="visible", timeout=20000)
            page.locator("#btn-main").click()
            time.sleep(5)
            print(f"[SUCCESS] Final URL: {page.url}")
        except Exception as e:
            print(f"[ERROR] Could not find final button: {e}")
        
        browser.close()

if __name__ == "__main__":
    run_bot()

