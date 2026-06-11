from playwright.sync_api import sync_playwright
import os
import time

def run_bot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Random User-Agent add kiya hai taaki bot block na ho
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
        page = context.new_page()
        
        target_url = os.getenv("TARGET_URL")
        print(f"[LOG] Navigating to: {target_url}")
        page.goto(target_url, wait_until="networkidle")

        def click_element(text):
            print(f"[LOG] Clicking: {text}")
            # XPath se button dhundhna sabse safe hai
            xpath = f"//*[contains(text(), '{text}')]"
            page.locator(xpath).first.click()
            page.wait_for_load_state("networkidle")
            time.sleep(2)

        # Main Loop: Flow sequence
        for i in range(2):
            print(f"[LOG] --- Cycle {i+1} ---")
            click_element("I am not a robot")
            click_element("Click 2x")
            click_element("Download Link")
        
        print("[LOG] Waiting for 9s final timer...")
        time.sleep(9)

        # Final button trigger
        print("[LOG] Triggering final link...")
        page.locator("#btn-main").click()
        time.sleep(5)
        
        print(f"[SUCCESS] Final Destination: {page.url}")
        browser.close()

if __name__ == "__main__":
    run_bot()

