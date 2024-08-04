const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQU9tVllJVkpUdVlLRVFDUHI2ZzVBTENGT3Y4SFFhQ0xIeHU2d3Npb2VVQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUWdSaUgwczgyRHREWmFBM01UN2hmeC9vOHRSY2E3Qkxjd3M3WnRIZlhCbz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrQ1R4TGVHZUloanA1OWNaWERBQXlIdlZPRXpYa0o1TWFOU2VkVUVWbGt3PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJQR1Q1d2NsaXNwU1dycmFpRVZWY1FBOTVtU202YWRDNkY4Y09uNmJtOVNRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InFQMnVIZWpPOTgyb2VicTUvZWs2S29WRjA1SnNPd2t5OGE2WUlETmJDVlU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhQWS84TWJ6SFM4WUNrRHU3ZzNDNmVtcTlMTXFzdjdxNEtQV3RrK2g1bGs9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieUI3TTNqdGIzNXgyMDJKV2xTbDYwNEVYNmVneWs1N1hud1pYZnorajZucz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic3pyQ1lucERaZGFzaU5uM1RDZnFlbFFDN3EzQUprQzJDbHc0ZlBSN2czVT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkxjMDFYSER6eTFXRTZlNHo2dVNEV3NTd2pFYXhHWjlyMitZNVRMRHFRYUNNM3V3UHF5dVE5NDYrY3BoUkJvWEkzK3Rld2RzR1U2OC9IQTdiaUY5K0JBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTg3LCJhZHZTZWNyZXRLZXkiOiJ1NVBUUDFTYU8yMnlCRlJROS93VjBLK1pvNDlMUCtreldEWUgrTUpPeXIwPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJOcEFMT1p2aVFYeUNfRE5lcXdBVlB3IiwicGhvbmVJZCI6ImZjZmJjZjUzLTE2NDctNGExMC04NTkwLWU1ZmRlMDlhY2I5MCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFcWlFU29jOVVXRUV5TThVVGVSZTV3L01WakU9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidjdieDlEQWlXanNYTGxxSTFodUwyTXdRMmF3PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkpHM1M3NUhUIiwibWUiOnsiaWQiOiI5MjMwMTY4ODMwODk6NjVAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoi4pyI4oKA4bew4oKDzavigoDNo+KCgeG3ouKChuKCiOK3qOKCiOG3tOKCg+G3m+KCgM2q4oKIzaPigonht57im7kifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ082ZXBiQURFSnJ2dmJVR0dBMGdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6ImhYV2hnTHlOMGlQQTNYVkYvQUdEbVZzYUxrNEJ0NG9iaFNNWjA5M1h0MU09IiwiYWNjb3VudFNpZ25hdHVyZSI6ImhDcFVQNXVhbDZFaTlyZm5mWEw3TmhPalV2L2grakdlQ0IvaWdOaFVOTGJTenhyaENMS0NNTGVoR2hsRGhQOEU4M0hSTjFSWE0wcWo5c0FFZk5rK0J3PT0iLCJkZXZpY2VTaWduYXR1cmUiOiIxQmVaeUpNSmZnd0RpYk1xRVJmU1Vya0l4UmlnZTJJdlhLRFV0OXBRS1hLdmhIM0lQZ0ppekdTcW5BZ2dvdDdxbEpQSUlHTjRabU91T0gyNEErSW5CUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzAxNjg4MzA4OTo2NUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJZVjFvWUM4amRJandOMTFSZndCZzVsYkdpNU9BYmVLRzRVakdkUGQxN2RUIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzIyNzc1NDYzfQ==',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "umar Mughal",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "923016883089",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || '𝐀𝐋𝐏𝐇𝐀-𝐌𝐃',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/0c351a67f1dffd1f34cf5.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
