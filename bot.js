hereconst puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');

puppeteer.use(StealthPlugin());

async function runBot() {
    console.log("Bot Start Ho Gaya...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    try {
        const url = process.env.TARGET_URL;
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log("Page Load Ho Gaya!");
        // Yahan tumhara click logic aayega
        await new Promise(r => setTimeout(r, 5000));
    } catch (err) {
        console.log("Error:", err.message);
    } finally {
        await browser.close();
    }
}

runBot();
