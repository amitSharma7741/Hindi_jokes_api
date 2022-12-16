
var otp = 0;

const emailInput = document.getElementById('exampleInputEmail2');
const sendOtpButton = document.getElementById('sendOtpButton');
const submitNew = document.getElementById('submitNew');

const sendOTP = async () => {
    // change otp button text to sent and disable it
    const email = emailInput.value;
    // check email is valid or not
    // like this test@gmail.com is valid
    const emailContains = "@gmail.com"
    const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/; //
    if (emailRegex.test(email) && email.includes(emailContains)) {
        // send post request to the server to send otp to the user
        const response = await fetch('/sendOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        });

        const data = await response.json();
        otp = data.otp;
        // console.log(data);
        sendOtpButton.innerHTML = '<i class="fa-sharp fa-solid fa-check"></i> Sent';
        sendOtpButton.disabled = true;
        // also change the class of the button to btn-success
        sendOtpButton.classList.remove('btn-info');
        sendOtpButton.classList.add('btn-success');
    }
    else {
        sendOtpButton.innerText = 'Invalid Email';
        sendOtpButton.disabled = true;
    }
    // console.log(emailInput);

    // console.log(email);
    // console.log(otp);

}

const verifyOTP = () => {

    const otpInput = document.getElementById('otp');
    const otpVal = otpInput.value;
    const verifyOtpButton = document.getElementById('verifyOtpButton');

    // change otp button text to sent and disable it


    if (otp == otpVal) {
        verifyOtpButton.innerHTML = '<i class="fa-sharp fa-solid fa-check"></i> Verified';
        verifyOtpButton.disabled = true;
        // also change the class of the button to btn-success
        verifyOtpButton.classList.remove('btn-info');
        verifyOtpButton.classList.add('btn-success');
        // enable submit button
        submitNew.disabled = false;

    }
    else {
        verifyOtpButton.innerText = 'Invalid OTP';
        verifyOtpButton.disabled = true;
    }

    // console.log(otp);
}

//  generating api key
submitNew.addEventListener('click', async (e) => {
    e.preventDefault();
    submitNew.innerText = 'Generating api key';
    const email = document.getElementById('exampleInputEmail2').value;
    const newIdBox = document.getElementById('newIdBox');
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email
        })
    });

    const data = await response.json();
    const anchorTag1 = document.getElementById('firstEndpoint');
    anchorTag1.href = `https://hindi-jokes-api.onrender.com/jokes?api_key=${data.apiKey}`;
    anchorTag1.innerText = `https://hindi-jokes-api.onrender.com/jokes?api_key=${data.apiKey}`;

    const anchorTag2 = document.getElementById('secondEndpoint');
    anchorTag2.href = `https://hindi-jokes-api.onrender.com/jokes/2?api_key=${data.apiKey}`;
    anchorTag2.innerText = `https://hindi-jokes-api.onrender.com/jokes/2?api_key=${data.apiKey}`;

    submitNew.innerText = "Success !";
    // also change the class of the button to btn-success
    submitNew.classList.remove('btn-primary');
    submitNew.classList.add('btn-success');
    submitNew.disabled = true;

    // console.log(data);


    // remove the previous div if any
    if (newIdBox.firstChild) {
        newIdBox.removeChild(newIdBox.firstChild);
    }


    // create a new div
    const div = document.createElement('div');
    div.classList.add('card');
    div.style.background = 'cornsilk';
    div.style.borderRadius = '20px';
    div.style.boxShadow = '0 0 10px 0 rgba(0,0,0,0.2)';
    div.style.marginTop = '20px';
    div.innerHTML = `
    <div class="card-body ">
    <h4 class="text-center">Your Api Key</h4>
    <p class="card-text text-center">${data.apiKey}</p>
 
    <div class="d-grid gap-2 col-6 mx-auto">
        <button class="btn btn-primary" id="copyToClipBoardId" onclick="copyToClipboard()">
            Copy to clipboard 
        </button>
    </div>
    <p class="mx-3 mt-2"> Note : ${data.message} </p>
    </div> `;
    newIdBox.appendChild(div);
    // console.log(email);
    // console.log(otp);
    // change the text of submit button to generate api key
    // submitNew.innerText = 'Success !';
    // submitNew.disabled = true;

    // reset the form
    document.getElementById('contact-form').reset();
})

