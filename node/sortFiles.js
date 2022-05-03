const fs = require ('fs');

let sorted = JSON.parse(fs.readFileSync('../json/sorted.json'));

 for(let image in sorted){
     let writeDir = '../sorted/' + sorted[image];

     if(!fs.existsSync(writeDir)){
         fs.mkdirSync(writeDir);
     }

     fs.copyFileSync('../unsorted/' + image, writeDir + '/' + image);
 }