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
    subject: "Tawk - Confirm Account",
    text: "Confirm your Accout here...",
    html: `<p>Hi: ${name} Confirm your account in Tawk</p>
      <p>Your OTP is ${newOtp}. This is valid for 10 Mins.</p> `,
  });
}

async function resetPasswordEmail(datos) {
  console.log(datos);
  const { email, name, resetURL } = datos;

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
    subject: "Tawk - Reset Password",
    text: "Reset your Accout here...",
    html: `<p>Hi: ${name} Reset your password in Tawk</p>
      <p>Click the Link . This is valid for 10 Mins.</p> 
      <a href="${resetURL}">Click Here</a>`,
  });
}

async function passwordChangedEmail(datos) {

  const { email, name } = datos;

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
    subject: "Tawk - Change of Password",
    text: "The password was changed",
    html: `<p>Hi: ${name} your password has been modified in Tawk</p>`,
  });
}

export { registerEmail, resetPasswordEmail, passwordChangedEmail };
