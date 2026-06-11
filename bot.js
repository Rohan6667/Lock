hereconst puppeteer = require('puppeteer-extra');
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
        console.log("Page 1: Navigating...");

        // 1. Verify/Continue Button
        const vBtn = "//a[contains(text(), 'Verify')] | //button[contains(text(), 'Verify')]";
        await page.waitForXPath(vBtn, { visible: true, timeout: 20000 }).catch(() => console.log("Skip step 1"));
        const [btn1] = await page.$x(vBtn);
        if (btn1) await btn1.click();
        
        console.log("Waiting for timer (15s)...");
        await new Promise(r => setTimeout(r, 15000));

        // 2. Universal "Get Link" Finder (ID pe depend nahi karega)
        console.log("Searching for 'Get Link' button...");
        await page.waitForFunction(() => {
            const elements = Array.from(document.querySelectorAll('a, button'));
            const target = elements.find(el => el.innerText.toLowerCase().includes('get link') || el.innerText.toLowerCase().includes('open link'));
            if (target) {
                target.click();
                return true;
            }
            return false;
        }, { timeout: 20000 });

        console.log("Success! Final button clicked.");
        await new Promise(r => setTimeout(r, 5000));
        console.log("Final URL: " + page.url());

    } catch (e) {
        console.error("Critical Error: " + e.message);
    } finally {
        await browser.close();
    }
}
start();
