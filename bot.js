hereconst puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function start() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // Anti-bot detection ke liye user agent set karo
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

    try {
        console.log("Navigating...");
        await page.goto(process.env.TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Logic: Buttons ko dhundho aur click karo
        for (let attempt = 0; attempt < 5; attempt++) {
            console.log(`Attempt ${attempt + 1}: Checking for buttons...`);
            
            // Yahan CSS selectors change kar sakte ho agar button id alag ho
            const buttons = ['#btn-main', '.get-link', '#get-link', 'a.btn-primary', 'button.get-link'];
            
            for (const selector of buttons) {
                if (await page.$(selector)) {
                    await page.click(selector);
                    console.log(`Clicked: ${selector}`);
                    await new Promise(r => setTimeout(r, 5000)); // 5 sec wait
                }
            }
            
            // Agar page redirect ho gaya, toh ruk jao
            if (page.url().includes('google') || page.url().includes('drive')) {
                console.log("Destination reached!");
                break;
            }
        }
    } catch (e) {
        console.error("Error: " + e.message);
    } finally {
        await browser.close();
    }
}
start();
