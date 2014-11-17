module.exports  =  { 

    sendMail: function(type, email, code, first_name, last_name, organismo, dni, sector, phone, consultation, filename, callback) {

        var nodemailer = require('nodemailer');
        var fs         = require('fs');

        // create reusable transporter object using SMTP transport
        var transporter = nodemailer.createTransport();

            var body = "<h3>Gracias <b>" + first_name + " " + last_name + "</b> por enviar tu consulta. A la brevedad te contestaremos</h3>" +
                        "<p>Tu número de inscripción de " + code + "</p>";

            var replyto = "aguspivetta@gmail.com";

            // NB! No need to recreate the transporter object. You can use
            // the same transporter object for all e-mails

            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: "Consulta del digesto jurídico <" + replyto + ">\r\n", // sender address
                to: 'aguspivetta@gmail.com', // list of receivers
                subject: 'Consulta del digesto jurídico ✔', // Subject line
                html: body, // html body
            };

            if (filename){
                mailOptions.attachments = [
                    {   // stream as an attachment
                        filename: filename.replace(/^.*[\\\/]/, ''),
                        content: fs.createReadStream(filename)
                    }
                ];
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, callback);
    }
};