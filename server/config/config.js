//==================================
//   Puerto
//==================================
process.env.PORT = process.env.PORT || 3000;

//==================================
//   Entorno
//==================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==================================
//   Vencimiento del token
//==================================

process.env.CADUCIDAD_TOKEN = '48h'; //60 * 60 * 24 * 30; //Expira en 30 días


//==================================
//   SEED de autenticación
//==================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==================================
//   Base de datos
//==================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL; //MONGODB_URL
}
process.env.URLDB = urlDB;


//==================================
//   Client ID
//==================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '49366928428-2hhv317g8gka7o86jk649j4f0e1pu5rc.apps.googleusercontent.com';