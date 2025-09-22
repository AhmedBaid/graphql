import { APISingIn, container, FormLogin } from "../config/config.js"
import { showToast } from "../config/showToast.js"
import { showProfile } from "./showProfile.js"


export async function login() {
    container.innerHTML = FormLogin

    const form = document.querySelector(".login-form")

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const username = document.getElementById("username").value
        const password = document.getElementById("password").value


        const credentials = btoa(`${username}:${password}`)

        const response = await fetch(APISingIn, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`
            }
        })

        const data = await response.json()

        if (response.ok) {
            showToast("green", "Login success")
            localStorage.setItem("token", data)
            showProfile(data)
        } else {
            showToast("red", "invalid credentials")
        }
    })
}