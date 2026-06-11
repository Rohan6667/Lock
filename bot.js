const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function start() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    try {
        await page.goto(process.env.TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log("Page loaded. Looking for first button...");

        // Pehla Click (Verify/Continue/Next)
        // XPath ka use kiya hai jo kisi bhi 'Verify' ya 'Continue' text wale button ko pakad lega
        const [button] = await page.$x("//a[contains(text(), 'Verify')] | //button[contains(text(), 'Verify')] | //a[contains(text(), 'Continue')]");
        if (button) {
            await button.click();
            console.log("First button clicked!");
        }

        await new Promise(r => setTimeout(r, 15000)); // 15 sec wait for timer

        // Final Click (Get Link)
        console.log("Looking for final button...");
        await page.waitForSelector('#btn-main', { timeout: 20000 });
        await page.click('#btn-main');
        console.log("Final link clicked successfully!");
        
        await new Promise(r => setTimeout(r, 5000));
        console.log("Finished. URL: " + page.url());

    } catch (e) {
        console.error("Bot Error: " + e.message);
    } finally {
        await browser.close();
    }
}
start();
