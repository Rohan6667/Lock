const puppeteer = require('puppeteer-extra');
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
    const proxy = await getProxy();
    const browser = await puppeteer.launch({
        headless: "new",
        args: [proxy ? `--proxy-server=${proxy}` : '--no-sandbox', '--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(process.env.TARGET_URL, { waitUntil: 'networkidle2' });

    // Multi-page navigation handler
    for (let i = 0; i < 5; i++) { // Max 5 pages handle karega
        console.log(`Checking page ${i + 1}...`);
        await new Promise(r => setTimeout(r, 7000)); // Har page par 7 sec wait

        const selectors = ['button#submit-button', '.get-link', 'a#btn-main', 'button[type="submit"]', '.btn-primary', '#next-button'];
        
        for (const sel of selectors) {
            if (await page.$(sel)) {
                console.log(`Clicking ${sel}`);
                await Promise.all([
                    page.click(sel),
                    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
                ]);
                break;
            }
        }
        
        // Final destination check
        const currentUrl = page.url();
        if (currentUrl.includes('google.com') || currentUrl.includes('drive.google')) {
            console.log("Reached destination!");
            break;
        }
    }
    await browser.close();
}

start();
