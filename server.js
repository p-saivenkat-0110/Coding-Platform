const express = require('./app_modules/node_modules/express');
const bodyParser = require('./app_modules/node_modules/body-parser');
const cookieParser = require('./app_modules/node_modules/cookie-parser');
const multer = require('./app_modules/node_modules/multer');
const path = require('path')
const { run_code } = require('./code_compiler/execute_code_file');
const { connectToDB } = require('./database');

const app = express();
const port = 8888;
const link = 'http://localhost:8888/'


app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

let user_login_info;
let contests;
let problems;
connectToDB().then(myCollection => {
    console.log('Connected to MongoDB');
    user_login_info = myCollection[0];
    contests = myCollection[1];
    problems = myCollection[2];
	// console.log(user_login_info)
	// console.log(contests)
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});

const storage_for_profile = multer.diskStorage({
	destination: function(req, file, cb) {
	  cb(null, './users/user_profile_img'); // Directory where uploaded files will be saved
	},
	filename: function(req, file, cb) {
	  cb(null, Date.now() + path.extname(file.originalname)); // Renaming file with current timestamp
	}
  });
const upload_profile = multer({ storage: storage_for_profile });


const storage_for_user_code = multer.diskStorage({
	destination: function(req, file, cb) {
	  cb(null, './user_submitted_codes/codes'); // Directory where uploaded files will be saved
	},
	filename: function(req, file, cb) {
	  cb(null, Date.now() + path.extname(file.originalname)); // Renaming file with current timestamp
	}
  });
const upload_userCode = multer({ storage: storage_for_user_code });


app.post('/Login', async (req, res) => {
	const username = req.body.usernameLP;
	const password = req.body.passwordLP;
	console.log(req.body)
	try{
		if (!user_login_info) {
			res.status(500).send('Something went wrong...');
			return;
		}
		const query = {
			$or:[
					{Username : username},
					{Email : username}
				],
				Password: password
		}
		const user_found = await user_login_info.findOne(query);
		console.log(user_found)
		if(user_found){
			res.cookie("Username", user_found.Username,{ maxAge: 432000000 });
			// console.log(res.cookies)
			console.log("Login successfully");
			res.send("Login successfully")
		}
		else{
			console.log("Login failed!!")
			res.send(null)
		}
	}catch (error) {
		console.error('Error occurred while verifying login:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.post('/SignUP', async (req, res) => {
    const email = req.body.emailSP;
    const username = req.body.usernameSP;
    const password = req.body.passwordSP;
    try {
		if(!user_login_info){
			res.status(500).send('Something went wrong...');
			return;
		}
		const user_found1 = await user_login_info.findOne({Email : email});
		if(user_found1){
			// console.log("Account already exists with this Email !!");
			res.send('Account already exists with this Email !!');
			return;
		}
		const user_found2 = await user_login_info.findOne({Username : username});
		if(user_found2){
			// console.log("Account already exists with this Username !!");
			res.send('Account already exists with this Username !!');
			return;
		}

        const userDetails = {
            Email: email,
            Username : username,
            Password: password,
            security_code_for_update_password: null,
			user_submissions : {},
			solved_problems : [],
			overall_solved_problems_count : {
				easy : 0,
				medium : 0,
				hard : 0,
				total : 0
			},
			profileIMG : "profile.png",
            created_at : new Date()
        };

        const result = await user_login_info.insertOne(userDetails);
		if(!result){
			res.send('Something went wrong !! Try again..');
			return;
		}
		res.cookie("Username", userDetails.Username,{ maxAge: 432000000 });
		console.log("Registered successfully")
		// res.redirect(`${link}home.html`);
		res.send(null)


    } catch (error) {
        console.error('Error occurred during signup:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/send_otp', async (req,res)=>{
	const email_input = req.body.email;
	const otp_input = req.body.code;
	try{
		if (!user_login_info) {
			res.status(500).send('Something went wrong...');
			return;
		}
		const user_found = await user_login_info.findOne({Email : email_input});
		// console.log(user_found)
		if(user_found){
			const result = await user_login_info.updateOne({Email : email_input}, {$set:{security_code_for_update_password : otp_input}});
			if(!result){
				res.send(null)
				return;
			}
			console.log("OTP sent successfully...")
			res.send("OTP sent successfully...")

			setTimeout(async ()=>{
				await user_login_info.updateOne({Email : email_input},{$set:{security_code_for_update_password : null}});
			}, 5*60*1000);
		}
		else{
			console.log("OTP sent failed !!");
			res.send(null);
		}
	}
	catch{
		console.error('Error occurred while sending otp:', error);
        res.status(500).send('Internal Server Error');
	}
});


app.post('/verify_otp', async (req,res)=>{
	const email_input = req.body.email;
	const otp_input = req.body.code_input;
	try{
		if (!user_login_info) {
			res.status(500).send('Something went wrong...');
			return;
		}
		const user_found = await user_login_info.findOne({Email : email_input, security_code_for_update_password : otp_input});
		// console.log(user_found)
		if(user_found){
			const result = await user_login_info.updateOne({Email : email_input},{$set:{security_code_for_update_password : null}});
			if(!result){
				res.send(null)
				return;
			}
			res.send("OTP verified successfully !!");
		}
		else{
			res.send(null);
		}
	}
	catch{
		console.error('Error occurred while verifying otp:', error);
        res.status(500).send('Internal Server Error');
	}
});


app.post('/update_password', async (req,res)=>{
	const email_input = req.body.email;
	const new_password = req.body.new_password;
	try{
		if (!user_login_info) {
			res.status(500).send('Something went wrong...');
			return;
		}
		const result = await user_login_info.updateOne({Email : email_input},{$set:{Password : new_password}});
		// console.log(user_found)
		if(result){
			console.log("Password Updated Successfully !!")
			res.send("Password Updated Successfully !!")
		}
		else{
			console.log("Password Update failed !!")
			res.send(null);
		}
	}
	catch{
		console.error('Error occurred while changing password:', error);
        res.status(500).send('Internal Server Error');
	}
});

app.post('/contests', async(req,res)=>{
	try{
		if (!contests){
			res.status(500).send('Something went wrong...');
			return;
		}
		const result = await contests.find({},{projection:{_id:0}}).toArray();
		// console.log(result)
		res.send(result);
	}
	catch{
		// console.error('Error occurred loading contests:');
        res.status(500).send('Internal Server Error');
	}
});

app.post('/problems', async(req,res)=>{
	try{
		const ischecked = req.body.ischecked
		// console.log(ischecked)
		if (!user_login_info || !problems){
			res.status(500).send('Something went wrong...');
			return;
		}
		const sp = await user_login_info.find({Username : req.cookies.Username},{projection:{_id:0,solved_problems:1}}).toArray();
		if(ischecked){
			const result = await problems.find({problem_no:{$in : sp[0]['solved_problems']}},{projection:{_id:0}}).toArray();
			res.send([result]);
		}
		else{
			const result = await problems.find({},{projection:{_id:0}}).toArray();
			res.send([result,sp[0]['solved_problems']]);
		}
		// console.log(result)
	}
	catch{
		// console.error('Error occurred loading contests:', error);
        res.status(500).send('Internal Server Error');
	}
});

app.post('/upload_profile', upload_profile.single('file'), async (req, res) => {
	if (!req.file) {
	  return res.status(400).send({ message: 'No file uploaded' });
	}
	const profile_img = path.basename(req.file.path);

	const result = await user_login_info.updateOne({Username : req.cookies.Username},{$set:{profileIMG : profile_img}});
	if(!result){
		res.status(500).send('Failed upload');
	}
	res.status(200).send({ message: 'File uploaded successfully' });
});

// Display user information.

app.post('/profile_name', async (req,res)=>{
	try{
		if (!user_login_info){
			res.status(500).send('Something went wrong...');
			return;
		}
		const query = {
			Username : req.cookies.Username
		}
		// console.log(req.cookies)
		const result = await user_login_info.find(query,{projection:{_id:0}}).toArray();
		if(result){
			res.send(result)
		}else{
			res.status(500).send('Cannot fetch user info');
		}

	}catch{
		console.error('Error occurred loading profile details');
        res.status(500).send('Internal Server Error');
	}
})



app.post('/submitCode', upload_userCode.single('file'), async (req, res) => {
    const problemKey = req.body.problemId;
	const problemNo = "#".concat(problemKey.split('_')[1])
	// console.log(problem_no)
    // console.log(req.body.problemId)
	if (!req.file) {
	  return res.status(400).send({ message: 'No file uploaded' });
	}
	const sub_id = path.basename(req.file.path).split('.')[0];
	const language_extension = path.basename(req.file.path).split('.')[1];

    console.log(req.file.path)

	var result=''
	var hasErrors = false
    try{
        const output = await run_code(req.file.path, problemKey);
		result = output
		if(result.includes('Wrong')){
			hasErrors=true
		}
    }catch(error){
		result = error.stderr
		hasErrors = true
		result = result.replaceAll(req.file.path,'')
        // res.send(error.stderr.error)
    }
	console.log(result)

	if (!user_login_info){
		res.status(500).send('Something went wrong...');
		return;
	}
	const user = req.cookies.Username;
	const solved_problems_key = "user_submissions.".concat(problemKey)
	const solved_problems_key_subId = solved_problems_key.concat(".").concat(sub_id)
	// console.log(solved_problems_key,solved_problems_key_subId)
	const querySub = { $set :{
		[solved_problems_key_subId] : {
			language : language_extension,
			result : result,
			submitted_at : new Date()
		}
	}} 

	const problem_difficulty_res = await problems.findOne({problem_no:problemNo})
	const problem_difficulty = problem_difficulty_res.difficulty.length
	const problem_already_solved = await user_login_info.findOne({Username:user, solved_problems:{$in:[problemNo]}})
	// console.log(problem_already_solved)

	const update_user_submissions = await user_login_info.updateOne({Username : user}, querySub);

	if(update_user_submissions){
		if(!problem_already_solved){
			var update_solvedProblems=""
			if(problem_difficulty==1){
				update_solvedProblems = "overall_solved_problems_count.".concat('easy')
			}
			else if(problem_difficulty==2){
				update_solvedProblems = "overall_solved_problems_count.".concat('medium')
			}
			else{
				update_solvedProblems = "overall_solved_problems_count.".concat('hard')
			}
			if(!hasErrors)
			{
				await user_login_info.updateOne({Username:user}, {$inc:{ [update_solvedProblems]:1 } })
				await user_login_info.updateOne({Username:user}, {$inc:{ ["overall_solved_problems_count.total"]:1 }})
				await user_login_info.updateOne({Username:user}, {$push:{ solved_problems : problemNo }})
			}
		}
		res.status(200).send({ message: 'Submission successful' });
	}
	else{
		res.status(500).send('Submission failed');
	}	
})

app.post('/submissions', async(req,res)=>{
	const key = req.body.key;
	// console.log(key)
	try{
		if (!user_login_info){
			res.status(500).send('Something went wrong...');
			return;
		}
		const user = req.cookies.Username;
		const query = "user_submissions.".concat(key)
		// console.log(query)
		const result = await user_login_info.find({Username:user},{projection:{_id:0, [query]:1}}).toArray();
		// console.log(result[0].user_submissions)
		res.send(result[0].user_submissions);
	}
	catch{
		// console.error('Error occurred loading contests:', error);
        res.status(500).send('Internal Server Error');
	}
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});