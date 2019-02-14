const request = require('request')
const cheerio = require('cheerio')

request('https://www.relaischateaux.com/fr/site-map/etablissements', (error, response, html) => {
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(html)
        $('#countryF').first().remove()
        const destinationResults = $('#countryF').html()
        const link = destinationResults.split('"').filter(word => word.includes("https://www.relaischateaux.com/fr/france"))
        //console.log(link)
    }
})