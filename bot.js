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
        console.log("Navigating to: " + process.env.TARGET_URL);
        await page.goto(process.env.TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        // Timer handler (8-10 seconds ka wait)
        await new Promise(r => setTimeout(r, 10000));
        
        // Clicker logic
        const selectors = ['#btn-main', '.get-link', '#get-link', 'button.get-link', '.btn-primary'];
        for (const sel of selectors) {
            if (await page.$(sel)) {
                await page.click(sel);
                console.log("Clicked successfully: " + sel);
                break;
            }
        }
    } catch (e) {
        console.error("Bot Error: " + e.message);
    } finally {
        await browser.close();
    }
}
start();

