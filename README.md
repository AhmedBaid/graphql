# graphql
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
                  grade
                  level
                  auditRatio
                  totalUp
                  totalDown
                  totalXP
                }
              }
            `
        })
    });

    const json = await response.json();
    const user = json.data.user[0]; // assuming it's an array of users

    const {
        login,
        level,
        auditRatio,
        totalUp,
        totalDown,
        grade,
        totalXP
    } = user;

    container.innerHTML = `
        <div class="header">
            <h1>Welcome ${login}</h1>
            <button id="logoutBtn">Logout</button>
        </div>

        <div class="stats">
            <div class="stat-card">
                <h3>Current Level</h3>
                <p>${level.toFixed(2)}</p>
            </div>
            <div class="stat-card">
                <h3>Total XP</h3>
                <p>${(totalXP / 1000).toFixed(1)} kb</p>
            </div>
            <div class="stat-card">
                <h3>Current Rank</h3>
                <p>${grade}</p>
            </div>
            <div class="stat-card">
                <h3>Audit Ratio</h3>
                <p>${auditRatio}</p>
            </div>
            <div class="stat-card">
                <h3>Validated Audits</h3>
                <p>${totalUp}</p>
            </div>
            <div class="stat-card">
                <h3>Failed Audits</h3>
                <p>${totalDown}</p>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        logout();
    });
}
