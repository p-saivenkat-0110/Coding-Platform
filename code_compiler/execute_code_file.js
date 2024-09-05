const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path  = require('path');
const fs = require('fs');
const { execSync } = require('child_process');


const testCasesDir = path.join(__dirname, '..', 'problems');   // HW_1_testCases.json
const executablePathDir = path.join(__dirname, '..', 'user_submitted_codes', 'outputs');

async function run_code(code_file_path, code_testCase){
    try{
        const codeId = path.basename(code_file_path).split('.')[0];
        const exe_path = path.join(executablePathDir,`${codeId}.exe`);
        await exec(`gcc ${code_file_path} -o ${exe_path}`)

        const testCaseFile = code_testCase.concat("_testCases");
        const tc_path = path.join(testCasesDir,`${testCaseFile}.json`);
        const testCases = JSON.parse(fs.readFileSync(tc_path, 'utf8'));

        try {
            let pass=0
            let fail=0
            for (const testCase of testCases) {
                const output = execSync(`${exe_path}`, { input: testCase.input }).toString();          
                const actualOutput = output.trim();
                const expectedOutput = testCase.expectedOutput.trim();
                
                console.log(`Test Case Input: ${testCase.input}`);
                console.log(`Expected Output: ${expectedOutput}`);
                console.log(`Actual Output: ${actualOutput}`);
                
                if (actualOutput === expectedOutput) {
                    pass++;
                    console.log('Test Case Result: Pass');
                } else {
                    fail++;
                    console.log('Test Case Result: Fail');
                }    
            }
            console.log(pass, fail);
            if(fail==0){
                return `${pass}/${pass+fail} : Accepted`;
            }
            else{
                return `${pass}/${pass+fail} : Wrong Answer`;
            }

        } catch (error) {
            console.error(`Error: ${error}`);
        }


    }catch(error){
        throw { error, stderr: error.stderr };
    }
}

module.exports = {run_code};