const fs = require('fs'); //to use the file functions

let files = [];

fs.readdirSync('../unsorted').forEach(file=>{  //read images from unsorted folder
    files.push(file);  //push the read file to the file array
})

fs.writeFileSync('../json/file.json', JSON.stringify(files), 'utf8');  //write down the pushed file to JSON