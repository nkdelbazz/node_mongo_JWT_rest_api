const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios')
const fs = require('fs/promises');
const router = require('express').Router();   
//const writeStream = fs.createWriteStream('post.csv');


// request('https://translate.google.com/', (error, response, html) => {
//   if (!error && response.statusCode == 200) 

//  // PER VEDERE COME RECUPERA IL FILE HTML    
//    // console.log(html);
//  //   console.log(response);
//     console.log('Scraping fatto');


//     const $ = cheerio.load(html); // caricami il file html recuperato 
//     const singleElement = $('#gb');
//     // console.log(singleElement.text());
//     // console.log(singleElement.html());
//     const innerElema = singleElement.find('div').text;  
//     console.log(innerElema);

//   }
// });



async function getPriceFeed(){
  try
    {

    const siteURL = 'https://www.ansa.it/sito/notizie/economia/economia.shtml'

    const { data }= await axios({
      method: "GET",
      url : siteURL,

      })

    const $ = cheerio.load(data)



    tabella = {}
   var json_final = []   

//
// SETTARE GLI tabella 
//
    const tableheader = 'div.hp-box-stock:nth-child(2) > table:nth-child(2) > thead:nth-child(2) > tr'
    $(tableheader).each((id ,element ) => {



  
     $(element).children().each((childrenID , childrenEL) => {

      // valorizzazione in fomato text 
       const element = $(childrenEL).text()
       const index = $(childrenID).text()



      varkey = element;
      tabella[varkey] = ""

    })

     })




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
        //  console.log(array_temp)
         }

        })
        
        var indTab = 0
        for (const [key, value] of Object.entries( tabella)) {
          
          tabella[key] = array_temp[indTab]
          indTab++
        }

    console.log( tabella)

      })

//  console.log(json_final)

   return tabella

   }
  catch(err)
  {

    console.log(err)
  }


}



getPriceFeed() 




  
module.exports = router



//getPriceFeed()













// const request = require('request');
// const cheerio = require('cheerio');
// const fs = require('fs');
// const writeStream = fs.createWriteStream('post.csv');

// // Write tabella
// writeStream.write(`Title,Link,Date \n`);

// request('https://translate.google.com/', (error, response, html) => {
//   if (!error && response.statusCode == 200) {
//     console.log(html);
//     const $ = cheerio.load(html);

//     $('.post-preview').each((i, el) => {
//       const title = $(el)
//         .find('.post-title')
//         .text()
//         .replace(/\s\s+/g, '');
//       const link = $(el)
//         .find('a')
//         .attr('href');
//       const date = $(el)
//         .find('.post-date')
//         .text()
//         .replace(/,/, '');

//       // Write Row To CSV
//       writeStream.write(`${title}, ${link}, ${date} \n`);
//     });

//     console.log('Scraping Done...');
//   }
// })