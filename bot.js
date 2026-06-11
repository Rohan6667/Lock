const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function start() {
    console.log("--- BOT STARTING ---");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    try {
        console.log("Navigating to target URL...");
        await page.goto(process.env.TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log("Initial page loaded successfully.");

        // Step 1: Verify/Continue
        const verifyXpath = "//a[contains(text(), 'Verify')] | //button[contains(text(), 'Verify')] | //div[contains(text(), 'Continue')]";
        console.log("Waiting for Verify/Continue button...");
        await page.waitForXPath(verifyXpath, { visible: true, timeout: 30000 });
        const [btn1] = await page.$x(verifyXpath);
        await btn1.click();
        console.log("Step 1 Complete: Verify/Continue button clicked.");

        // Step 2: Timer Wait
        console.log("Timer active: Waiting 10 seconds for shortener process...");
        await new Promise(r => setTimeout(r, 10000));
        console.log("Timer finished.");

        // Step 3: Final Link
        const finalBtn = '#btn-main'; 
        console.log("Looking for final 'Get Link' button...");
        await page.waitForSelector(finalBtn, { visible: true, timeout: 20000 });
        
        console.log("Clicking final button now...");
        await Promise.all([
            page.click(finalBtn),
            page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {})
        ]);

        console.log("SUCCESS: Final destination reached. Current URL: " + page.url());

    } catch (e) {
        console.error("--- BOT ERROR DETECTED ---");
        console.error("Error Message: " + e.message);
        console.error("Current URL at crash: " + page.url());
    } finally {
        await browser.close();
        console.log("--- BROWSER CLOSED ---");
    }
}
start();
