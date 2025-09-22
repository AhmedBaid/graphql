import { API, container, FormLogin } from "./config/config.js";
import { showToast } from "./config/showToast.js";

container.innerHTML = FormLogin

async function main() {
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
            showToast("green","Login success")
            localStorage.setItem("token",data)
        } else {
            showToast("red",data.message)
        }
    })
}

main()
