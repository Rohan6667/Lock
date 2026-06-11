hereconst puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');

puppeteer.use(StealthPlugin());

async function getProxy() {
    try {
        const res = await axios.get('https://proxylist.geonode.com/api/proxy-list?limit=1&page=1&sort_by=lastChecked&sort_type=desc', { timeout: 5000 });
        const p = res.data.data[0];
        return `${p.protocols[0]}://${p.ip}:${p.port}`;
    } catch (e) { return null; }
}

async function start() {
    console.log("Bot process initiated...");
    const proxy = await getProxy();
    
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            proxy ? `--proxy-server=${proxy}` : '--no-sandbox',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({ 'referer': 'https://www.google.com/' });
    
    try {
        const target = process.env.TARGET_URL;
        if (!target) throw new Error("TARGET_URL is missing in Secrets!");
        
        console.log("Navigating to target...");
        await page.goto(target, { waitUntil: 'networkidle2', timeout: 60000 });

        await new Promise(r => setTimeout(r, 10000));
        
        const selectors = ['button#submit-button', '.get-link', 'a#btn-main', 'button[type="submit"]', '.btn-primary'];
        
        for (const sel of selectors) {
            if (await page.$(sel)) {
                console.log(`Clicking: ${sel}`);
                await page.click(sel);
                await new Promise(r => setTimeout(r, 5000));
                break;
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await browser.close();
        console.log("Process finished.");
    }
}

start();
