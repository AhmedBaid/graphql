import { APISingIn, container, FormLogin } from "../config/config.js";
import { showToast } from "../helpers/showToast.js";
import { showProfile } from "./showProfile.js";

export async function login() {
    container.innerHTML = FormLogin;

    const form = document.querySelector(".login-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            return showToast("green", "Please fill all fields");
        }

        const credentials = btoa(`${username}:${password}`);
        const response = await fetch(APISingIn, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`
            }
        });

        const token = await response.json();
        if (response.ok) {
            localStorage.setItem("token", token);
            showToast("green", "Login success");
            showProfile(token);
        } else {
            showToast("red", "Invalid credentials");
        }
    });
}
