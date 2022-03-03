const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios')
const fs = require('fs/promises');
const router = require('express').Router();   

router.get('/a', function(req, res, next){
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});




router.get('/data', async (req, res, next) => {
    try
    {
        async function getPriceFeed(){
            try
              {
          
              const siteURL = 'https://www.ansa.it/sito/notizie/economia/economia.shtml'
          
              const { data }= await axios({
                method: "GET",
                url : siteURL,
          
                })
          
            //console.log(data)
              const $ = cheerio.load(data)
          
          
          
              tabella = {}
              json_final = []   
          
          //
          // SETTARE GLI tabella 
          //
              const tableheader = 'div.hp-box-stock:nth-child(2) > table:nth-child(2) > thead:nth-child(2) > tr'
              $(tableheader).each((id ,element ) => {
          
          
          
            
               $(element).children().each((childrenID , childrenEL) => {
          
                // valorizzazione in fomato text 
                 const element = $(childrenEL).text()
                 const index = $(childrenID).text()
               // console.log("tabella:  : " +  element  )
          
          
                varkey = element;
                tabella[varkey] = ""
          
              })
          
               })
          
               console.log(tabella)
          
          
          
          //
          // SETTARE GLI ELEMENTI 
          //
                const selectECINDEX = 'div.hp-box-stock:nth-child(2) > table:nth-child(2) > tbody:nth-child(3) > tr'
                $(selectECINDEX).each((parentID,parentELE ) => {
          
          //       console.log(parentID + $(parentELE).text())
                    
                 const counter = 0;
                 const array_temp = [];
                   $(parentELE).children().each((childrenID , childrenEL) => {
          
                    // valorizzazione in fomato text 
                     const element = $(childrenEL).text()
                     const index = $(childrenID).text()
          
          
                    if(element)
                   {
                    array_temp.push(element)
                   }
          
                  })
                  
                  var indTab = 0
                  for (const [key, value] of Object.entries( tabella)) {
                    
                    tabella[key] = array_temp[indTab]
                    indTab++
                  }
          
          
          
          
                // console.log( tabella)
                 json_final.push(tabella)
          
                })
          
                /**
                 * 
          <tbody>
          <tr>
          <td class="stock-ind"><a href="/finanza/scheda.shtml?code=CB.ITLMS" title="FTSE Italia All-Share Index">FTSE Italia All-Share Index</a></td><td class="stock-val">28080.04</td><td class="stock-var">3.54</td>
          </tr>
          <tr>
          <td class="stock-ind"><a href="/finanza/scheda.shtml?code=CB.ITMC" title="FTSE Italia Mid Cap Index">FTSE Italia Mid Cap Index</a></td><td class="stock-val">44676.56</td><td class="stock-var">3.08</td>
          </tr>
          <tr>
          <td class="stock-ind"><a href="/finanza/scheda.shtml?code=CB.ITSTAR" title="FTSE Italia STAR Index">FTSE Italia STAR Index</a></td><td class="stock-val">54872.36</td><td class="stock-var">3.20</td>
          </tr>
          <tr>
          <td class="stock-ind"><a href="/finanza/scheda.shtml?code=CB.FTSEMIB" title="FTSE MIB Index">FTSE MIB Index</a></td><td class="stock-val">25773.03</td><td class="stock-var">3.59</td>
          </tr>
          </tbody>
          
                 * 
                 * 
                 */
          
             console.log(json_final)
          
             return json_final
          
             }
            catch(err)
            {
          
              console.log(err)
            }
          
          
          }
          
  
    res.status(200).json({ success: true, msg: "opk " , result : json_final.json});
    }
    catch (err)
    {
      res.status(500).json({ success: false, msg: err});
    }
});



module.exports = router;