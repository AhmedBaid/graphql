import { APIGraphql } from "./config/config.js";
import { login } from "./pages/Login.js";
async function checkJWT() {
    const token = localStorage.getItem("token")
    if (!token) {
        return login()
    }
    try {
        const response = await fetch(APIGraphql, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${token}`
            },
            body: JSON.stringify({
                query: `
                  query {
                    user {
                      id
                    }
                  }
                `
            })
        })
        const data = await response.json()
        console.log(data);

    } catch (error) {

    }
}

checkJWT()
