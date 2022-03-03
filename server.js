

const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const cheerio = require('cheerio');
const axios = require('axios')


require('dotenv').config() ; // server per il collegamento con il ENV 
// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`

const app = express();

require('./config/database');

// Must first load the models
require('./models/user');

// Pass the global passport object into the configuration function
require('./config/passport')(passport);



// This will initialize the passport object on every request
app.use(passport.initialize());


app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Allows our Angular application to make HTTP requests to Express application
const whitelist = [
    "http://localhost:3000",
    "http://localhost:4200"
  ];

var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
      optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));


app.use(express.static(path.join(__dirname, 'public')));

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(require('./routes'));


/**
 * 
 * ESEMPIO CHIAMATA SCRAPER 
 * 
 */


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
     json_final = []
     dataname = []
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
      if (varkey.includes("%") || varkey.includes(".")){
        varkey = varkey.replace("%", "per");
        varkey = varkey.replace(".", "");
      }
      tabella[varkey] = ""
      dataname.push(varkey)
    })

     })

     console.log(dataname)


//
// SETTARE GLI ELEMENTI 
//
      var counter_M = 0
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

       // console.log(tabella)

        console.log("\n inizio \n")
        console.log(tabella.Indice)
        
        var perc = "Var.%"

        var obj = {
          Indice : tabella.Indice,
          Valore : tabella.Valore,
          per : tabella.Varper
        //  percentuale : tabella.Var.%
        }
      
        json_final.push(obj)
        console.log("\n fine \n \n ")
      })

   return json_final

   }
  catch(err)
  {

    console.log(err)
  }


}






app.get('/data', async (req, res) => {
  try
  {
  const result = await getPriceFeed()

  res.status(200).json({ success: true, msg: "You are successfully retrive the data " , result : result});
  }
  catch (err)
  {
    res.status(500).json({ success: false, msg: err});
  }
})

/**
 * 
 * ESEMPIO CHIAMATA SCRAPER 
 * 
 */





/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000) , () => console.log('Server is running for JWT auth');




