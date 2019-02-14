// Import de puppeteer
const puppeteer = require("puppeteer")
const rp = require('request-promise');
const $ = require('cheerio');

const getData = async () => {
    // 1 - Créer une instance de navigateur
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    // 2 - Naviguer jusqu'à l'URL cible
    await page.goto("https://www.relaischateaux.com/fr/france/annedebretagne-loire-atlantique-la-plaine-sur-mer")

    // 3 - Cliquer sur un lien...
    await page.click('body > div.jsSecondNav.will-stick > ul.jsSecondNavMain > li:nth-child(2) > a > span')
    await page.waitFor(1000)

    // 4 - Récupérer les données...
    const result = await page.evaluate(() => {
        let name = document.querySelector("h1[itemprop = 'name']").innerText
        let price = document.querySelector(".price").innerText
        let restaurant = document.querySelector("h3[itemprop = 'name']").innerText

        return {name, price, restaurant}
    })

    // 5 - Retourner les données
    browser.close()
    return result
}

    // Appel de la fonction getData() et affichage des données
getData().then(value => {
    console.log(value)
})