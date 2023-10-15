const nodemailer = require("nodemailer");

class Email {
 
   constructor(user,subject){
      this.to = user.email;
      this.from = "Arshad Faiyaz <bastion@gmail.com>";
      this.subject = subject

   }

   transporter() {

      let transporter = nodemailer.createTransport({
         host:process.env.MAILTRAP_EMAIL_HOST,
         port:process.env.MAILTRAP_PORT,
         auth: {
            user:process.env.MAILTRAP_EMAIL_USERNAME,
            pass:process.env.MAILTRAP_EMAIL_PASSWORD
         }
      })
   


      // if(process.env.NODE_ENV==="production") {

      //    transporter = nodemailer.createTransport({
      //       service:"Gmail",
      //       auth: {
      //          user:process.env.EMAIL_USERNAME,
      //          pass:process.env.EMAIL_PASSWORD
      //       }
      //    })
      // } 
      
     
      return transporter;
   } 

   mailOptions(message) {
      return {
         to : this.to,
         from: this.from,
         subject: this.subject,
         text : message
      };
   }

   async resetPassword(message) {

      await this.transporter().sendMail(this.mailOptions(message));
   }
}


module.exports = Email;