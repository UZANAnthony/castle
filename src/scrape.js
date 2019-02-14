// Import de puppeteer
const puppeteer = require("puppeteer")

const getData = async () => {
  // 1 - Créer une instance de navigateur
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // 2 - Naviguer jusqu'à l'URL cible
  await page.goto("https://www.https://www.relaischateaux.com/fr/france/bussiere-cote-d-or-la-bussiere-sur-ouche.com/fr/site-map/etablissements")
  //await page.click('')
  await page.waitFor(1000)

  // 3 - Cliquer sur un lien...
  
  // 4 - Récupérer les données...
  const result = await page.evaluate(() => {
      let name = document.querySelector('')
  })

  // 5 - Retourner les données
  browser.close()
  return result
}

// Appel de la fonction getData() et affichage des données
getData().then(value => {
  console.log(value)
})
