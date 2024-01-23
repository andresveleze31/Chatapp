import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SG_KEY);

const sendSGMail = async ({
  recipient,
  sender,
  subject,
  html,
  text,
  attachments,
}) => {

  try {
    const from = sender || "andresvelezecheverry@gmail.com";

    const msg = {
        to: recipient, //Email o reciever
        from: from, //Verified Sender.
        subject,
        html: html,
        text: text,
        attachments
    }

    return sgMail.send(msg);

  } catch (error) {
    console.log(error);
  }
};

async function sendEmail(args){

    if(process.env.NODE_ENV === "development"){
        return new Promise.resolve();
    }
    else{
        return sendSGMail;(args);
    }


}

export{
    sendEmail
}
