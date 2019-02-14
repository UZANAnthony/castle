'use strict'

const request = require('request')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const fs = require('fs')

//let url = JSON.stringify()


function createJsonURL(){
    request('https://www.relaischateaux.com/fr/site-map/etablissements', (error, response, html) => {
        if(!error && response.statusCode == 200){
            const $ = cheerio.load(html)
            $('#countryF').first().remove()
            const destinationResults = $('#countryF').html()
            const url = 
            {
                links: destinationResults.split('"').filter(word => word.includes("https://www.relaischateaux.com/fr/france"))
            }
            let data = JSON.stringify(url)
            fs.writeFileSync('url.json', data)
        }
    })
}

//createJsonURL()

function getURL(){
    const file = fs.readFileSync('url.json')
    const url = JSON.parse(file)
    return url
}

const url = getURL()
//console.log(url)


/*const getDataFromUrl = async (browser, url) => {
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitFor('body')
    return page.evaluate(() => {
      let title = document.querySelector('h1').innerText
      let price = document.querySelector('.price_color').innerText
      return { title, price }
    })
  }

module.exports = getDataFromUrl;*/





