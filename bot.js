hereconst puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function start() {
    console.log("Bot process started...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

    try {
        const target = process.env.TARGET_URL;
        console.log("Navigating to: " + target);
        await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Step 1: Initial Click (Verify/Continue)
        await page.waitForSelector('button, a', { visible: true, timeout: 20000 });
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, a'));
            const targetBtn = buttons.find(b => b.innerText.toLowerCase().includes('verify') || b.innerText.toLowerCase().includes('continue'));
            if(targetBtn) targetBtn.click();
        });
        console.log("Initial click performed, waiting for timer...");
        await new Promise(r => setTimeout(r, 12000)); // 12 seconds wait for timer

        // Step 2: Final Click (Get Link)
        console.log("Looking for Final Get Link button...");
        await page.waitForSelector('#btn-main', { visible: true, timeout: 20000 });
        await page.click('#btn-main');
        console.log("Final link clicked!");

        await new Promise(r => setTimeout(r, 5000));
        console.log("Current URL: " + page.url());

    } catch (e) {
        console.error("Critical Error: " + e.message);
    } finally {
        await browser.close();
        console.log("Browser closed.");
    }
}
start();
