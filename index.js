#!/usr/bin/env node
'use strict';
/**
 * Require dependencies
 *
 */

 const commander = require("commander"),
  // Log = require("log"),
  readlineSync = require('readline-sync'),
  fs     = require('fs'),
  request = require("request");




  function logUrl(searchTerm){
    request("https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search="+searchTerm, function(error,response,body){
      // console.log(body);
      response = JSON.parse(body);
      // console.log(response[3]);
      var url = response[3];
      if(typeof url[0] === 'undefined'){
        console.log("Unable to find a valid link");
      }else{
        url = searchTerm + " :\t " + url[0]+"\n";
        fs.appendFile('wikilink.log',url, (err) => {
          if (err) throw err;
          console.log(searchTerm + ": Url Successfully logged to the wikilink.log");
        });
      }
    });
  }


  /**
   * wikiSearch function definition
   *
   */
  let  wikiSearch = (searchTerm, options)  => {
      console.log("Searching "+ searchTerm + " ....");
      if (options.Interactive) {
        logUrl(searchTerm);
            while(true){
              var answer = readlineSync.question("Do you want to continue ?(y/n): ");

              if(answer === 'y' || answer === 'yes' || answer === 'yeah'){
                answer = readlineSync.question("Enter Search String : ");
                logUrl(answer);
              } else {
                break;
              }
            }
      } else{
        logUrl(searchTerm);
      }


  }

  commander.version("1.0.0"),
  commander.command(''),
  commander.command('["search-string"]'),
  commander.description("Search the given term and logs to wiki.log"),
  commander.option('-i, --Interactive',"Interactive mode"),
  commander.action(wikiSearch);

  commander.parse(process.argv);

  if(commander.args.length === 0) commander.help();
