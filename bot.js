const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');

puppeteer.use(StealthPlugin());

// 1. Proxy Rotation Logic
async function getProxy() {
    try {
        const res = await axios.get('https://proxylist.geonode.com/api/proxy-list?limit=1&page=1&sort_by=lastChecked&sort_type=desc', { timeout: 5000 });
        const p = res.data.data[0];
        return `${p.protocols[0]}://${p.ip}:${p.port}`;
    } catch (e) { return null; }
}

// 2. Main Bot Logic
async function start() {
    const proxy = await getProxy();
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            proxy ? `--proxy-server=${proxy}` : '--no-sandbox',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1920,1080'
        ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
    
    try {
        const url = process.env.TARGET_URL;
        console.log("Navigating to: " + url);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for page to render
        await new Promise(r => setTimeout(r, 15000));
        
        // Dynamic Selector Clicker
        const selectors = ['button#submit-button', '.get-link', 'a#btn-main', 'button[type="submit"]', '.btn-primary'];
        for (const sel of selectors) {
            if (await page.$(sel)) {
                console.log(`Found and clicking: ${sel}`);
                await page.click(sel);
                await new Promise(r => setTimeout(r, 5000));
                break;
            }
        }
        console.log("Task Completed.");
    } catch (e) {
        console.error("Bot Error: " + e.message);
    } finally {
        await browser.close();
    }
}

start();
