import { container } from "../config/config"
import { showToast } from "../config/showToast"
import { showProfile } from "./showProfile"

container.innerHTML = FormLogin

export async function login() {
    const form = document.querySelector(".login-form")

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const username = document.getElementById("username").value
        const password = document.getElementById("password").value


        const credentials = btoa(`${username}:${password}`)

        const response = await fetch(API, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`
            }
        })

        const data = await response.json()

        if (response.ok) {
            showToast("green", "Login success")
            localStorage.setItem("token", data)
            showProfile()
        } else {
            showToast("red", "invalid credentials")
        }
    })
}