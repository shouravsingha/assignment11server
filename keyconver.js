const fs = require('fs');
const key = fs.readFileSync('./blood-donate-f8736-firebase-adminsdk-fbsvc-3ad558857a.json', 'utf8')
const base64 = Buffer.from(key).toString('base64')
console.log(base64)