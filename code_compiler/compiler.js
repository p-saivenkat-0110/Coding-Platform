const express = require('../app_modules/node_modules/express');
const bodyParser = require('../app_modules/node_modules/body-parser');
const { generate_program_file } = require('./generate_code_file');
// const { run_code } = require('./execute_code_file');

const cors = require('../app_modules/node_modules/cors')
const app = express();
const port = 8050;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.post('/run', async (req,res)=>{
    const program = req.body.program;
    const language = req.body.language;
    console.log(req.body)
    try{
        if(program===""){
            res.status(400).send('Code editor empty!!');
        }
        const filepath = await generate_program_file(program,language);
        res.send(filepath);

    }catch(error){
        console.log(error.stderr)
        res.send(error.stderr.error)
    }
})

app.listen(port,()=>{
    console.log(`Listening on ${port}`)
})