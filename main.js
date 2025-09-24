import { APIGraphql, logout } from "./config/config.js";
import { login } from "./pages/login.js";
import { showProfile } from "./pages/showProfile.js";

async function checkJWT() {
  const token = localStorage.getItem("token")
  if (!token) {
    return login()
  }
  const response = await fetch(APIGraphql, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
          query {
            user {
              login
            }
          }
        `
    })
  })

  const data = await response.json()


  if (response.ok && data.data?.user) {
    return showProfile(token)
  } else {
    return logout()
  }


}


window.addEventListener("DOMContentLoaded", checkJWT);
