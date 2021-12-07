const csv = require('csv-parser');
const fs = require('fs');
const crypto = require('crypto')
const converter = require('json-2-csv');

const src = [];

fs.createReadStream('Secret Santa Gift Exchange Sign-Up Form - 2021 (Responses).csv')
  .pipe(csv(["time", "email", "x", "name", "address", "mobile", "wish"]))
  .on('data', (data) => src.push(data))
  .on('end', () => {
    process()
  });

function process(){
    const santas = src.map((ele) => ({name: ele.name, email: ele.email, hash: crypto.createHash('md5').update(JSON.stringify(ele)).digest('hex')}))
                    .sort((a, b) => String(a.hash) < String(b.hash)? -1 : 0);
    const n = src.length;
    // console.log(santas)
    for(let i=0; i<n; i++)
    {
        src[i].santa_name = santas[i].name;
        src[i].santa_mail = santas[i].email
        delete src[i].x;
        delete src[i].time
        const find = '\n';
        const re = new RegExp(find, 'g');
        src[i].wish = String(src[i].wish).replace(re, " ")
    }
    console.log(src)
    converter.json2csv(src, (err, csv) => {
        if (err) {
            throw err;
        }
        fs.writeFileSync("santa.csv", csv)
    });
}