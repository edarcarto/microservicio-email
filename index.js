// var => varialbles const => constantes    let => varibles
const express = require('express');
const bodyParser = require('body-parser'); // middleware
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls:{
        ciphers: 'SSLv3'
    }
});

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res ){
    res.json({
        message: 'Bienvenido al envio de correos'
    });
});

// EMCMA SCRITP 2015
app.post('/send', (req, res) => { 
    try {
        let formName = (req.body.formName || process.env.FORM_NAME);
        let email = req.body.email;
        let subject = req.body.subject;
        let textBody = req.body.textBody;
        let htmlBody = req.body.htmlBody;

        // !   NO
        // ||  O
        // && Y
        //  !== diferente
        // > o >=  mayor
        // < o <= signo menor
        //  ==   igual
        if(!subject || typeof subject !== 'string'){
            throw new TypeError('No ingresaste un subject');
        }
        if(!email || typeof email !== 'string'){
            throw new TypeError('No ingresaste un correo');
        }

        let options = {
            form: `${formName} <${process.env.FROM_EMAIL}>`,
            to: email,
            subject: subject,
            text: textBody,
            html: htmlBody
        };

        transport.sendMail(options, (err, info) => {
            if(err){
                throw new TypeError(err.message);
            }
            console.log('Mensaje %s enviado: %s', info.messageId, info.response);
            res.json({
                message: 'Mensaje se envió exitosamente'
            });
        });

    } catch (error) {
        res.status(500);
        res.json({
            message: error.message
        });
        console.error('Ocurrio un error');
        console.error(error.message);
    }
});

const server = app.listen(app.get('port'), function() {
    const port = server.address().port;
    console.log(`La aplicación se está ejecutando en el puerto http://localhost:${port}/`);
    // console.log('La aplicación se está ejecutando en el puerto http://localhost:' + port + '/');
});
