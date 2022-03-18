"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToken = exports.authenticate = exports.playsong = exports.code = void 0;
const topURL = "http://8184-2a02-810d-d40-65a0-d180-1fe0-37b0-dac8.ngrok.io";
exports.code = "";
function playsong(_url) {
    const postURL = topURL + "/api/music/play";
    //generate random id
    const id = Math.floor(Math.random() * 1000000);
    const body = {
        "pairing_code": exports.code,
        "songs": [
            {
                "song_id": id,
                "url": _url,
                "state": "playing",
                "volume": "1",
                "start_time": "0",
            }
        ]
    };
    runRequest("POST", body, postURL);
}
exports.playsong = playsong;
function runRequest(type, data, url) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open(type, url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
        xhr.onload = function () {
            resolve(JSON.parse(xhr.response));
        };
        xhr.onerror = function () {
            reject(xhr.statusText);
        };
    });
}
//check if token is valid
async function authenticate(token) {
    const __url = topURL + "/api/session/pair";
    document.getElementById("btn-spinner").style.display = "inline-block";
    const body = {
        "pairing_code": token,
    };
    const response = await runRequest("POST", body, __url);
    return response.status;
}
exports.authenticate = authenticate;
function setToken(token) {
    exports.code = token;
}
exports.setToken = setToken;
