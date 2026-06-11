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
        console.log("Page 1 loaded.");

        // First click with navigation handler
        const [button] = await page.$x("//a[contains(text(), 'Verify')] | //button[contains(text(), 'Verify')]");
        if (button) {
            console.log("Clicking Verify...");
            await Promise.all([
                button.click(),
                page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {})
            ]);
        }

        await new Promise(r => setTimeout(r, 15000));

        // Final click with navigation handler
        console.log("Clicking final button...");
        await page.waitForSelector('#btn-main', { visible: true, timeout: 20000 });
        await Promise.all([
            page.click('#btn-main'),
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {})
        ]);
        
        console.log("Success! Final URL: " + page.url());
    } catch (e) {
        console.error("Bot Error: " + e.message);
    } finally {
        await browser.close();
    }
}
start();
