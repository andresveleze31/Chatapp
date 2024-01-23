import nodemailer from "nodemailer";

async function registerEmail(datos) {

  console.log(datos); 
  const { email, name, newOtp } = datos;

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9adc90a6ea3f90",
      pass: "123962e759e6d6",
    },
  });

  //Informacon EMAIL.
  const info = await transport.sendMail({
    from: "Tawk - Your Chat Application",
    to: email,
    subject: "Tawk - Confirm Confirm",
    text: "Confirma you Accout here...",
    html: `<p>Hi: ${name} Confirm your account in Tawk</p>
      <p>Your OTP is ${newOtp}. This is valid for 10 Mins.</p> `,
  });
}

export { registerEmail };
