const fs = require('fs');
// const {v4 : uuid} = require('../app_modules/node_modules/uuid');
const path = require('path');
// const util = require('util');
// const outputFilePromise = util.promisify(fs.outputFile);

// const dir = 'C:\\xampp\\htdocs\\project\\user_submitted_codes\\codes';
const dir = path.join(__dirname, '..', 'user_submitted_codes', 'codes');


function generate_program_file(code, extension){
    const codeId = Date.now();
    const filename = `${codeId}.${extension}`;
    const filepath = path.join(dir,filename);
    // await fs.outputFile(filepath, code, (err)=>{
    //     if (err) {
    //         console.error('Error writing to file:', err);
    //     }
    // });

    try {
        fs.writeFileSync(filepath, code);
        console.log('File written successfully');
    } catch (err) {
        console.error('Error writing to file:', err);
    }
    return filepath;
}

module.exports = { generate_program_file };