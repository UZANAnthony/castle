const request = require('request')
const rp = require('request-promise')
const cheerio = require('cheerio')
const $ = require('cheerio')
const fs = require('fs')
const fetch = require("node-fetch")

async function createJsonURL(){
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
            return url
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


const getDataFromUrl = async function(url){
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
    for(let i = 0; i < url.links.length; i++)
    {
        console.log('Process : ' + (i+1) + '/' + url.links.length)
        await getDataFromUrl(url.links[i]).then(value => {
            result.push(value)
        })
    }
    let data = JSON.stringify(result)
    fs.writeFileSync('hotelsv2.json', data)
    return result
}

//getHotelJSON()

function getHotel(){
    const file = fs.readFileSync('hotelsv2.json')
    const url = JSON.parse(file)
    return url
}

//let hotels = getHotel()

function removeRest(hotels){
    let res = []
    for(let i = 0; i < hotels.length; i++){
        if(hotels[i].name != ""){
            res.push(hotels[i])
        }
    }
    let data = JSON.stringify(res)
    fs.writeFileSync('hotelsv3.json', data)
    return res
}

//removeRest(hotels)

//console.log(hotels)

async function michelin(hotels){
    let result = []
    for (let i = 0; i < hotels.length; i++) {
        if(hotels[i].rest[1].name != null){
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[0].name)))
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[1].name)))
        }
        else{
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[0].name)))
            result.push(fetch("https://restaurant.michelin.fr/index.php?q=search/autocomplete/" + encodeURI(hotels[i].rest[0].name)))
        }
    }
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
                }
            }
        }
    }
    //let data = JSON.stringify(hotels)
    //fs.writeFileSync('hotelsv4.json', data)
    return hotels
}

function getHotel2(){
    const file = fs.readFileSync('hotelsv3.json')
    const url = JSON.parse(file)
    return url
}

//let hotels = getHotel2()
//console.log(hotels)

/*michelin(hotels).then(value => {
    let data = JSON.stringify(value)
    fs.writeFileSync('hotelsv4.json', data)
})*/

async function countMichelinStars(hotels) {
    let res = []
    for (let i = 0; i < hotels.length * 2; i++) {
        if(hotels[Math.trunc(i/2)].rest[i%2].michelinurl != null){
            res.push(fetch(hotels[Math.trunc(i/2)].rest[i%2].michelinurl))
        }
        else{
            res.push(0)
        }
    }
    let star = 0
    for (let i = 0; i < hotels.length * 2; i++) {
        if(res[i] != 0){
            var response = await res[i]
            response = await response.text()
            star = 0
            if (response.includes("icon-cotation1etoile")) {
                star = 1
            }
            else if (response.includes("icon-cotation2etoiles")) {
                star = 2
            }
            else if (response.includes("icon-cotation3etoiles")) {
                star = 3
            }
            hotels[Math.trunc(i/2)].rest[i%2].star = star
        }
        
    }
    let data = JSON.stringify(hotels)
    fs.writeFileSync('hotelsv5.json', data)
    return hotels
}

function getHotel3(){
    const file = fs.readFileSync('hotelsv4.json')
    const url = JSON.parse(file)
    return url
}

//let hotels2 = getHotel3()
//console.log(hotels2)

//countMichelinStars(hotels2)



function getHotel4(){
    const file = fs.readFileSync('hotelsv5.json')
    const hotels = JSON.parse(file)
    return hotels
}

let hotels3 = getHotel4()

function cleanJson(hotels){
    let res = []
    for(let i = 0; i < hotels.length; i++){
        if(hotels[i].rest[0].michelinurl != null && hotels[i].rest[0].star > 0 && hotels[i].rest[1].michelinurl == null){
            res.push(hotels[i])
        }
        if(hotels[i].rest[0].michelinurl == null && hotels[i].rest[1].michelinurl != null && hotels[i].rest[1].star > 0){
            res.push(hotels[i])
        }
        if(hotels[i].rest[0].michelinurl != null && hotels[i].rest[1].michelinurl != null && hotels[i].rest[1].name != null && (hotels[i].rest[1].star > 0 || hotels[i].rest[0].star > 0)){
            res.push(hotels[i])
        }
    }
    let data = JSON.stringify(res)
    fs.writeFileSync('hotelsv6.json', data)
    return res
}

//cleanJson(hotels3)
