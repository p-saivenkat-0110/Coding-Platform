function getCookie(){
    let name = "Username=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(){
    if(getCookie()!=""){
        window.location.replace('./home.html');
    }
}

function viewPassLP(){
    let visiblePassword=document.getElementById("passwordLP");
    let hidebtnLP=document.getElementById("hide_iconLP").style;
    let showbtnLP=document.getElementById("show_iconLP").style;
    if(visiblePassword.type ==='password'){
        visiblePassword.type="text";
        showbtnLP.display = "inline";
        hidebtnLP.display = "none";
    }
    else{
        visiblePassword.type="password";
        showbtnLP.display = "none";
        hidebtnLP.display = "inline";
    }
}

function viewPassSP(){
    let visiblePasswordSP=document.getElementById("passwordSP");
    let hidebtnSP=document.getElementById("hide_iconSP").style;
    let showbtnSP=document.getElementById("show_iconSP").style;
    if(visiblePasswordSP.type ==='password'){
        visiblePasswordSP.type="text";
        showbtnSP.display = "inline";
        hidebtnSP.display = "none";
    }
    else{
        visiblePasswordSP.type="password"; 
        showbtnSP.display = "none";
        hidebtnSP.display = "inline";  
    }
}

function viewPassSPc(){
    let visiblePasswordSPc=document.getElementById("cpasswordSP");
    let hidebtnSPc=document.getElementById("hide_iconSPc").style;
    let showbtnSPc=document.getElementById("show_iconSPc").style;
    if(visiblePasswordSPc.type ==='password'){
        visiblePasswordSPc.type="text";
        showbtnSPc.display = "inline";
        hidebtnSPc.display = "none";
    }
    else{
        visiblePasswordSPc.type="password";
        showbtnSPc.display = "none";
        hidebtnSPc.display = "inline";    
    }
}

function viewPassNP(){
    let visiblePasswordNP=document.getElementById("passwordNP");
    let hidebtnNP=document.getElementById("hide_iconNP").style;
    let showbtnNP=document.getElementById("show_iconNP").style;
    if(visiblePasswordNP.type ==='password'){
        visiblePasswordNP.type="text";
        showbtnNP.display = "inline";
        hidebtnNP.display = "none";
    }
    else{
        visiblePasswordNP.type="password"; 
        showbtnNP.display = "none";
        hidebtnNP.display = "inline";  
    }
}
function viewPassNPc(){
    let visiblePasswordNPc=document.getElementById("cpasswordNP");
    let hidebtnNPc=document.getElementById("hide_iconNPc").style;
    let showbtnNPc=document.getElementById("show_iconNPc").style;
    if(visiblePasswordNPc.type ==='password'){
        visiblePasswordNPc.type="text";
        showbtnNPc.display = "inline";
        hidebtnNPc.display = "none";
    }
    else{
        visiblePasswordNPc.type="password";
        showbtnNPc.display = "none";
        hidebtnNPc.display = "inline";    
    }
}

function flip(){
    document.getElementById('Login').reset()
    document.getElementById('SignUP').reset()
    var divs = document.querySelectorAll('.in_box');
    [...divs].forEach((card)=>{card.classList.toggle('is-flipped')});
    document.getElementById('errorMSGLP').innerHTML="&nbsp";
    document.getElementById('errorMSGSP').innerHTML="&nbsp";
}

function giveAlert(s){
    alert(s);
    return false
}

function validateLogin(){
    let loginform=document.forms["Login"];
    let username_input  = loginform['usernameLP'].value;
    let password_input  = loginform['passwordLP'].value;
    if(username_input==""){
        return giveAlert("Enter valid username!!")
    }
    else if(password_input==""){
        return giveAlert("Enter Password !!")
    }
    else{
        var errorMSGLP = document.getElementById('errorMSGLP');
        var url = new URLSearchParams();
        url.append('usernameLP',username_input);
        url.append('passwordLP',password_input);
        fetch("http://localhost:8888/Login",{
            method : "post",
            body : url
        }).then(function (response){
            return response.text();
        }).then(function (text){
            if(text===""){
                errorMSGLP.innerHTML = "Incorrect details entered !!"
            }
            else{
                window.location.href="./home.html"
            }
        }).catch(function (err){
            alert('Something went wrong. Try again later!!');
            console.log(err);
        });
    }
}

function validateSignUp(){
    let signUPform=document.forms["SignUP"];
    const emailRegex =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    let email_input = signUPform['emailSP'].value;
    let username_input = signUPform['usernameSP'].value;
    let password_input = signUPform['passwordSP'].value;
    let cpassword_input = signUPform['cpasswordSP'].value;
    if(emailRegex.test(email_input)==false){
        return giveAlert("Enter valid email address!!")
    }
    else if(username_input==""){
        return giveAlert("Enter valid username!!")
    }
    else if(password_input=="" || cpassword_input==""){
        return giveAlert("Both Password & Confirm Password required!!")
    }
    else if(password_input!=cpassword_input){
        return giveAlert("Password & Confirm password must be same!!")
    }
    else{
        var errorMSGSP = document.getElementById('errorMSGSP');
        var url = new URLSearchParams();
        url.append('emailSP',email_input);
        url.append('usernameSP',username_input);
        url.append('passwordSP',password_input);

        fetch("http://localhost:8888/SignUP",{
            method : "post",
            body : url
        }).then(function (response){
            return response.text();
        }).then(function (text){
            if(text){
                errorMSGSP.innerHTML = text;
            }
            else{
                window.location.href="./home.html"
            }
        }).catch(function (err){
            alert('Something went wrong. Try again later!!');
            console.log(err);
        });
    }
}

function sendotp(email_input,otpCode){
    let msg = `<h1>Verification code is ${otpCode}.</h1> <br> <i>*This code is valid for 5 minutes</i>`;
    Email.send({
        SecureToken : "c2671ff9-0a80-4567-9f85-862ce77d3e29",
        To : email_input,
        From : "sma.assignment.2024@gmail.com",
        Subject : "Request to Reset Password",
        Body : msg,
    }).then(
      message => {
        if (message==='OK'){
            alert('OTP sent successfully...');
            document.getElementById('sendOTP').innerHTML="Resend OTP";
            document.getElementById('sendOTP').disabled=true;
            document.getElementById('OTP').disabled = false;
            document.getElementById('verifyOTP').disabled = false;
            setTimeout(async ()=>{
                document.getElementById('sendOTP').disabled=false;
            },20*1000);
        }
        else{
            alert('Something went wrong. Try again later!!');
        }
      }
    );
}

function verify_email_to_sentotp(){
    const emailRegex =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    const email_input = document.forms["forgotPasswordForm"]['emailFP'].value;
    if(emailRegex.test(email_input)==false){
        alert("Enter valid email address!!");
    }
    else{
        let otpCode = Math.floor((Math.random()*900000)+100000);
        var url = new URLSearchParams();
        url.append('email',email_input);
        url.append('code',otpCode);
        fetch("http://localhost:8888/send_otp",{
            method : "post",
            body : url
        }).then(function (response){
            return response.text();
        }).then(function (text){
            console.log(text)
            if(text===""){
                alert("Account doesn't exist!!");
                document.getElementById('sendOTP').innerHTML="Send OTP";
                document.getElementById('OTP').disabled = true;
                document.getElementById('verifyOTP').disabled = true;
            }
            else{
                sendotp(email_input,otpCode);
            }
        }).catch(function (err){
            alert('Something went wrong. Try again later!!');
            console.log(err);
        });
    }
}

function verifyotp(){
    const otpRegex =  /^[0-9]{6}$/
    const otp_input = document.forms["forgotPasswordForm"]['OTP'].value;
    if(otpRegex.test(otp_input)==false){
        alert("OTP must be 6 digit code...");
    }
    else{
        const email_input = document.forms["forgotPasswordForm"]['emailFP'].value;        
        var url = new URLSearchParams();
        url.append('email',email_input);
        url.append('code_input',otp_input);
        fetch("http://localhost:8888/verify_otp",{
            method : "post",
            body : url
        }).then(function (response){
            return response.text();
        }).then(function (text){
            if(text===""){
                alert("Enter valid OTP !!");
            }
            else{
                alert(text);
                document.querySelector('.newPasswordPage').style.visibility="visible";
                document.querySelector('.forgotPasswordPage').style.visibility="hidden";
            }
        }).catch(function (err){
            alert('Something went wrong. Try again later!!');
            console.log(err);
        });
    }
}

function update_password(){
    const email_input = document.forms["forgotPasswordForm"]['emailFP'].value;
    const new_password = document.forms["newPasswordForm"]['passwordNP'].value;
    const confirm_new_password = document.forms["newPasswordForm"]['cpasswordNP'].value;
    if(new_password==="" || confirm_new_password===""){
        alert("All fields are required !!")
        
    }
    else if (new_password!==confirm_new_password){
        alert("Password and Confirm password must be same !!")
    }
    else if (new_password.length<8 || new_password.length>16){
        alert("Password must be 8-16 length!!");
    }
    else{
        var url = new URLSearchParams();
        url.append('email',email_input);
        url.append('new_password',new_password);
        fetch("http://localhost:8888/update_password",{
            method : "post",
            body : url
        }).then(function (response){
            return response.text();
        }).then(function (text){
            if(text===""){
                alert("Something went wrong. Try again later !!");
            }
            else{
                alert(text);
            }
            back_to_login();
        }).catch(function (err){
            alert('Something went wrong. Try again later!!');
            console.log(err);
        });
    }
}

function back_to_login(){
    window.location.replace('./index.html')
}


