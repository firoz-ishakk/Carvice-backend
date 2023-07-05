const serviceId = process.env.SERVICESID
const token = process.env.TOKEN
const AccountSID = process.env.AccountSID
const client = require('twilio')(AccountSID, token);

const sendOtp=(mob)=> {
    console.log("mob",mob);
    client.verify.v2.services(serviceId)
        .verifications
        .create({ to: `+91${mob}`, channel: 'sms' })
        .then(verification => console.log(verification.status,"hihihihi"));
}

const verifyOtp = (mob, otp) =>{
    console.log(mob,otp,"hihi");
    return new Promise((resolve, reject) => {
        client.verify.v2.services(serviceId)
            .verificationChecks
            .create({ to: `+91${mob}`, code : otp })
            .then((verification_check) => {
                console.log(verification_check.status,"hihihiihhihihihih")
                resolve(verification_check)
            }
            );
    })
}

module.exports= {
    sendOtp,
    verifyOtp
}