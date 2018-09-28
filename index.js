const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendNotification = functions.database.ref('/status').onWrite((event) => {
    // Pegue o valor atual do que foi gravado no Realtime Database.
    var posicaoAlecerometro = event.after.val();

    console.log(posicaoAlecerometro);

    var status = "";
    
    switch (posicaoAlecerometro) {
        case -1:
           status = "Problema com acelerometro";
            break;
        case 'pescou':
            status = "Motorista apresenta sinais de cansaço";
            break;  
        default:
        break;
    }

    // Notification details.
    const payload = {
        notification: {
            title: 'Status do Motorista!',
            body: `${status}`,
            sound: 'default',
    },
    data: {
    extra: 'extra_data',
        },
    };

    const options = {
        collapseKey: 'temp',
        contentAvailable: true,
        priority: 'high',
        timeToLive: 60 * 60 * 24,
    };
        // Envie uma mensagem para dispositivos inscritos no tópico fornecido.
       
        const topic = 'motoristaiot'
    
        return admin.messaging().sendToTopic(topic, payload, options)
        .then((response) => {
         return console.log('Enviado com Sucesso Push:' , response);
        });
    

    
});