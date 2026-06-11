hereconst puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');

puppeteer.use(StealthPlugin());

async function run() {
    console.log("Bot started...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    try {
        const target = process.env.TARGET_URL;
        if (!target) throw new Error("TARGET_URL not set in Secrets!");
        
        console.log("Navigating...");
        await page.goto(target, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 10000));
        
        console.log("Process complete.");
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await browser.close();
    }
}
run();
