import nodemailer from "nodemailer";

export const sendLogInMail = async(email,fullName) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "sandisingha@gmail.com",
      pass: "xdzsqtjpathusscd",
    },
  });

   const textToSend = `Hi ${fullName},

Welcome to ChatAppVin – we’re thrilled to have you join our community! 🎊

You’ve successfully created your account, and you’re just one step away from connecting with people in real time.

Here’s what you can do next:
✅ Set up your profile and add a display picture
✅ Start chatting and make meaningful connections instantly!

If you ever need help, our support team is always here for you – just reply to this email

Thanks for joining us – we can’t wait to see what conversations you’ll start! 💬

Warm regards,
ChatAppVin
chatappvin.netlify.app`


    const info = await transporter.sendMail({
      from:'"ChatAppVin" <sandisingha@gmail.com>',
      to:email,
      subject: "Welcome to ChatAppVin , Let’s Get the Conversation Started!",
      text: textToSend, // plain‑text body
      
    });

    console.log("Message sent:", info.messageId);
};
