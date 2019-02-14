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
//console.log(url.links.length)


const getDataFromUrl = async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    let result = []

    for(let i = 6; i < 7; i++)
    {
        await page.goto(url.links[i])
        await page.click('body > div.jsSecondNav.will-stick > ul.jsSecondNavMain > li:nth-child(2) > a > span')
        await page.waitFor(1000)
        
        let data = await page.evaluate(() => {
            try{
                let index = i + 1
                let name = document.querySelector("h1[itemprop = 'name']").innerText
                let price = document.querySelector(".price").innerText
                let restaurant = document.querySelector("h3[itemprop = 'name']").innerText
                return {index, name, price, restaurant}
            }
            catch(error){
                console.error(error)
            }
        })

        result.push(data)

    }
    browser.close()
    return result
}


getDataFromUrl().then(value => {
    let data = JSON.stringify(value)
    fs.writeFileSync('hotels.json', data)
})






