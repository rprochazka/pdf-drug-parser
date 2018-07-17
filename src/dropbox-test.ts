require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: 'MTEJHw2-iHMAAAAAAAAElMqOtOT05J7WARPLO0wmaW0mj2GLAVfwOZJo8JHg5Lbn' });
// dbx.filesListFolder({ path: '/ReceiptParser/input' })
//     .then(function (response) {
//         console.log(response);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });

dbx.filesDownload({ path: '/ReceiptParser/input/all-in-one.html' })
    .then(content => {
        console.log(content.fileBinary.toString('utf8'));
    })
    .catch(function (error) {
        console.log(error);
    });

