const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function start() {
    console.log("[START] Browser launching...");
    const browser = await puppeteer.launch({ 
        headless: "new", 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    try {
        console.log(`[URL] Navigating to: ${process.env.TARGET_URL}`);
        await page.goto(process.env.TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log("[SUCCESS] Page loaded.");

        // Step 1: Verify Button
        console.log("[STEP 1] Looking for 'Verify' button...");
        await page.waitForXPath("//a[contains(text(), 'Verify')] | //button[contains(text(), 'Verify')]", { timeout: 15000 });
        const [vBtn] = await page.$x("//a[contains(text(), 'Verify')] | //button[contains(text(), 'Verify')]");
        if (vBtn) {
            await vBtn.click();
            console.log("[STEP 1] Verify clicked. Redirecting...");
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
        }

        // Step 2: Timer
        console.log("[STEP 2] Timer started (12 seconds)...");
        await new Promise(r => setTimeout(r, 12000));
        console.log("[STEP 2] Timer elapsed.");

        // Step 3: Final Button (The Bridge)
        console.log("[STEP 3] Final bridge: Executing force-click...");
        const result = await page.evaluate(() => {
            const btn = document.querySelector('#btn-main') || document.querySelector('.get-link');
            if (btn) {
                btn.removeAttribute('disabled');
                btn.click();
                return "CLICKED_SUCCESSFULLY";
            }
            return "BUTTON_NOT_FOUND";
        });

        console.log(`[RESULT] ${result}`);
        await new Promise(r => setTimeout(r, 3000));
        console.log(`[END] Final URL: ${page.url()}`);

    } catch (e) {
        console.error(`[CRITICAL ERROR] ${e.message}`);
    } finally {
        await browser.close();
        console.log("[FINISH] Browser closed.");
    }
}
start();
