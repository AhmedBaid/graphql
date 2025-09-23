import { APIGraphql, container, logout } from "../config/config.js";

export async function showProfile(token) {   

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
    });

    const data = await response.json();
    
    const username = data.data.user[0].login
    
    container.innerHTML = `
        <div class="header">
            <h1>Welcome ${username}</h1>
            <button id="logoutBtn">Logout</button>
        </div>
    `;
     const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        logout()
    });
}
