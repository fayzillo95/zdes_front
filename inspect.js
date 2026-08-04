const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:4200/holidays', { waitUntil: 'networkidle2' });
  
  // Wait for the table to load
  await page.waitForSelector('.btn-delete');
  
  const computedStyle = await page.evaluate(() => {
    const btn = document.querySelector('.btn-delete');
    const style = window.getComputedStyle(btn);
    return {
      textDecoration: style.textDecoration,
      borderBottom: style.borderBottom,
      outline: style.outline,
      boxShadow: style.boxShadow,
      border: style.border,
      background: style.background
    };
  });
  
  console.log("Button Computed Style:", computedStyle);
  
  const cellStyle = await page.evaluate(() => {
    const cell = document.querySelector('.actions-cell');
    const style = window.getComputedStyle(cell);
    return {
      textDecoration: style.textDecoration,
      borderBottom: style.borderBottom,
      outline: style.outline,
      boxShadow: style.boxShadow
    };
  });
  
  console.log("Cell Computed Style:", cellStyle);
  
  await browser.close();
})();
