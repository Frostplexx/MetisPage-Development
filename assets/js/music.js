"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
async function login() {
    const input = document.getElementById("sessionInput");
    const password = input.value;
    let loginwindow = document.getElementById("login");
    let dashboardwindow = document.getElementById("dashboard");
    let response = await (0, api_1.authenticate)(password);
    if (response) {
        loginwindow.style.display = "none";
        document.getElementById("btn-spinner").style.display = "none";
        dashboardwindow.style.display = "inline-block";
        (0, api_1.setToken)(password);
    }
    else {
        document.getElementById("btn-spinner").style.display = "none";
        alert("Wrong Session ID");
    }
}
const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", login);
