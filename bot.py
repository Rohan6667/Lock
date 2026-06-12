from playwright.sync_api import sync_playwright
import time
import sys

sys.stdout.reconfigure(line_buffering=True)

def run_bot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
        
        # AD-BLOCKER: Ads aur Trackers ko block karne ke liye
        ad_list = ["*doubleclick.net*", "*googleadservices.com*", "*adservice.google.com*", "*googlesyndication.com*", "*.ads.*"]
        page = context.new_page()
        
        def block_ads(route):
            if any(ad in route.request.url for ad in ad_list):
                route.abort()
            else:
                route.continue_()
        
        page.route("**/*", block_ads)
        
        target_url = "https://indianshortner.in/5Nrtc"
        print(f"[LOG] Navigating with Ad-Blocker: {target_url}")
        page.goto(target_url, wait_until="networkidle")

        def handle_step(text):
            print(f"[LOG] Finding: {text}")
            try:
                # Button dhundhna
                selector = f"//button[contains(text(), '{text}')] | //a[contains(text(), '{text}')]"
                page.wait_for_selector(selector, timeout=15000)
                page.locator(selector).first.click()
                print(f"[SUCCESS] Clicked {text}")
                page.wait_for_load_state("networkidle")
                time.sleep(3)
            except Exception as e:
                print(f"[WARNING] Step skipped: {text}")

        # Cycle Execution
        for i in range(2):
            handle_step("I am not a robot")
            handle_step("Click 2x")
            handle_step("Download Link")

        print("[LOG] Waiting for timer...")
        time.sleep(15)
        
        # Final Action
        if page.locator("#btn-main").is_visible():
            page.locator("#btn-main").click()
            print(f"[SUCCESS] Final URL: {page.url}")
        
        browser.close()

if __name__ == "__main__":
    run_bot()
