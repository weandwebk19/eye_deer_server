const { text } = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, subject, content, link, rejectLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      service: process.env.MAIL_SERVICE,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let body = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: subject,
      text: text,
      html: `
            <!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Verify your email - Eye Deer</title>
    <meta name="description" content="Verfify email template.">
    <style type="text/css">
        a:hover {
            text-decoration: underline !important;
        }
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #292929;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#292929"
        style="@import url(https://fonts.googleapis.com/css2?family=IM+Fell+English&family=Ibarra+Real+Nova:wght@400;600;700&family=Poppins:wght@200;300;700); font-family: 'Poppins', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #292929; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <a href="https://eyedeer.vercel.app" title="logo" target="_blank">
                                <img width="60"
                                    src="https://res.cloudinary.com/dbaulxzoc/image/upload/v1668929604/WeAndWeb/logo_emmseh.png?fbclid=IwAR3aZAnV7ZvK997GG84tkdou6m234HrS5JlOoKmfWrWHu_hkr1yLFWR9ELs"
                                    title="logo" alt="logo">
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#E6E6E6; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">

                                        <h1
                                            style="color:#292929; font-weight:400; margin:0;font-size:32px;font-family:'Ibarra Real Nova', serif;">
                                            <span style="color:#292929; font-weight:600; margin:0;font-size:120px;font-family:'Ibarra Real Nova', serif; letter-spacing: -10px;">H</span>
                                            ail fellow,
                                            welcome to </h1>
                                            <h1 style="color:#292929; font-weight:600; margin:0;font-size:48px;font-family:'Ibarra Real Nova', serif; letter-spacing: 0.1em;">eyedeer.</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#292929; font-size:15px;line-height:24px; margin:0;">
                                            ${content}
                                        </p>
                                        <a href="${link}"
                                            style="background:#292929;text-decoration:none !important; font-weight:500; margin-top:35px; color:#e6e6e6;text-transform:lowercase; font-size:14px;padding:10px 24px;display:inline-block; border: 3px double #e6e6e6">
                                            Click Here!
                                        </a>

                                        ${
                                          rejectLink
                                            ? '<p style="color:#292929; font-size:15px;line-height:24px; margin-top:35px;">' +
                                              '<strong style="color:#ef414c">' +
                                              "Important!" +
                                              "</strong>" +
                                              "If it is not you, kindly cancel by" +
                                              `<a href="${rejectLink}"> click here</a>.` +
                                              "</p>" +
                                              '<p style="color:#292929; font-size:13px;line-height:24px; margin-top:35px;">' +
                                              "If you do not cancel your account information is still saved on our application. You will not be able to cancel after 7 days from the time we email you." +
                                              "</p > "
                                            : ""
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>`,
    };

    await transporter.sendMail(body, (err, result) => {
      if (err) {
        console.log(err);
        return false;
      }
      console.log(result);
      console.log("email sent sucessfully");
    });
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
