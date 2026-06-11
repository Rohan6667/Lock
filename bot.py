from playwright.sync_api import sync_playwright
import time

def run_bot():
    with sync_playwright() as p:
        # Browser setup with stealth settings
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Human-like user agent
        page.set_extra_http_headers({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"})
        
        print("[LOG] Navigating...")
        page.goto("https://indianshortner.in/5Nrtc", wait_until="networkidle")

        # Cycle function to handle the repeated steps
        def perform_cycle(cycle_name):
            print(f"[LOG] Executing {cycle_name}...")
            # Step 1: Robot
            page.get_by_role("button", name="I am not a robot").click()
            page.wait_for_load_state("networkidle")
            
            # Step 2: Click 2x
            page.get_by_role("button", name="Click 2x").click()
            page.wait_for_load_state("networkidle")
            
            # Step 3: Download
            page.get_by_role("button", name="Download Link").click()
            page.wait_for_load_state("networkidle")

        # Repeat cycles as per your instruction
        perform_cycle("Cycle 1")
        perform_cycle("Cycle 2")

        # Timer phase
        print("[LOG] Waiting for 8s timer...")
        page.wait_for_timeout(9000)

        # Final trigger
        final_btn = page.locator("#btn-main")
        final_btn.wait_for(state="visible")
        final_btn.click()
        
        page.wait_for_load_state("networkidle")
        print(f"[SUCCESS] Final URL: {page.url}")
        browser.close()

if __name__ == "__main__":
    run_bot()
