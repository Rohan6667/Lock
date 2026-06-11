hereconst puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function start() {
    const browser = await puppeteer.launch({ 
        headless: "new", 
        args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'] 
    });
    const page = await browser.newPage();
    
    // 1. Human-like User Agent & Headers
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

    try {
        await page.goto(process.env.TARGET_URL, { waitUntil: 'networkidle2' });
        
        // 2. Random Delay to mimic human thinking
        const randomDelay = (min, max) => new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1) + min)));

        // Step 1: Click Verify
        await randomDelay(2000, 5000); 
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('a, button'));
            const vBtn = btns.find(b => b.innerText.toLowerCase().includes('verify'));
            if(vBtn) vBtn.click();
        });

        // Step 2: Adaptive Timer Wait
        console.log("Waiting for timer...");
        await randomDelay(10000, 13000); 

        // Step 3: Evade detection by simulating Mouse Movement
        await page.mouse.move(100, 100);
        await randomDelay(500, 1500);
        await page.mouse.move(500, 500);

        // Step 4: Final Click with "Human Jitter"
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('a, button'));
            const target = btns.find(b => b.innerText.toLowerCase().includes('get link') || b.innerText.toLowerCase().includes('open'));
            if(target) {
                target.style.pointerEvents = 'auto'; // Force interaction
                target.click();
            }
        });

        await randomDelay(3000, 6000);
        console.log("Final URL reached: " + page.url());

    } catch (e) {
        console.error("Detection Triggered: " + e.message);
    } finally {
        await browser.close();
    }
}
start();
