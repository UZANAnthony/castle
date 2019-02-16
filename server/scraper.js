const request = require('request')
const rp = require('request-promise')
const cheerio = require('cheerio')
const $ = require('cheerio')
const fs = require('fs')
const fetch = require("node-fetch")

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


const getDataFromUrl = function(url){
    return rp(url)
        .then(function(html){
            let rest0 = null, rest1 = null
            if($('.jsSecondNavSub',html).find("li").first().find("a").text() != '')
                    {
                        rest0 = $('.jsSecondNavSub', html).find("li").first().find("a").text().trim()
                        if($('.jsSecondNavSub',html).find("li").next().find("a").text() != '')
                        {
                            rest1 = $('.jsSecondNavSub',html).find("li").next().find("a").text().trim()
                        }
                    }
            else
            {
                rest0 = $('.rc-popinQualitelis-header',html).find("h1").text().trim()
            }
            let data = {
                name: $('.rc-popinQualitelis-heading', html).text().trim(),
                url: url,
                price: $('.price', html).text().trim(),
                city: $('[itemprop="addressLocality"]', html).first().text().trim(),
                citation: $('.citationMsg', html).text().trim().trim(),
                desc: $('.propertyDesc', html).find('.richTextMargin').text().trim(),
                rest: [{name: rest0, michelinurl: null, star: null},{name: rest1, michelinurl: null, star: null}]                 
            }
            return data
        })
        .catch(function(err){
            //handle error
        })
}

async function getHotelJSON(){
    let result = []
    for(let i = 0; i < 2; i++)
    {
        console.log('Process : ' + (i+1) + '/' + url.links.length)
        await getDataFromUrl(url.links[i]).then(value => {
            result.push(value)
        })
    }
    let data = JSON.stringify(result)
    fs.writeFileSync('hotelsv2.json', data)
}

//getHotelJSON()

function getHotel(){
    const file = fs.readFileSync('hotelsv2.json')
    const url = JSON.parse(file)
    return url
}

let hotels = getHotel()

//console.log(hotels)

async function michelin(hotels){
    let result = []
    for (let i = 0; i < hotels.length; i++) {
        //console.log(hotels[i].rest[1].name)
        if(hotels[i].rest[1].name != null){
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[0].name.slice(0, -1))))
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[1].name.slice(0, -1))))
        }
        else{
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[0].name.slice(0, -1))))
        }
    }
    //console.log(result.length)
    let trash = []
    for (let i = 0; i < result.length; i++) {
        var response = await result[i]
        response = (await response.json())
        if (response.toString().includes("Aucun résultat.")) {
            trash.push(i)
        }
        else {
            response = await JSON.stringify(response)
            if (response.includes("poi")) {
                response = await JSON.parse(response)
                let keys = Object.keys(response)
                let key = null
                for (let w = keys.length - 1; w != -1; w--) {
                    if (keys[w] != "poi-all" && keys[w].includes("poi")) {
                        key = keys[w]
                    }
                }
                if (key != null) {
                    response = response[key].split('"')[1]
                    hotels[Math.trunc(i/2)].rest[i%2].michelinurl = "https://restaurant.michelin.fr" + response
                    //console.log(hotels[Math.trunc(i/2)].rest[i%2])
                }
            }
        }
    }
    let data = JSON.stringify(hotels)
    fs.writeFileSync('hotelsv3.json', data)

    return hotels
}

michelin(hotels)








