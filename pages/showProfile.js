import { APIGraphql, container, logout } from "../config/config.js";

function formatXP(xp) {
    if (!xp) return "0 kb";

    if (xp.toString().length <= 6) {
        return `${(xp / 1000).toFixed(1)} kb`
    } else {
        return `${(xp / 1000000).toFixed(2)} mb`
    }
}

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
                  firstName
                  lastName
                }
                xp: transaction_aggregate(
                  where: { type: { _eq: "xp" }, event: { object: { name: { _eq: "Module" } } } }
                ) {
                  aggregate {
                    sum {
                      amount
                    }
                  }
                }
                level: transaction_aggregate(
                  where: { type: { _eq: "level" }, event: { object: { name: { _eq: "Module" } } } }
                ) {
                  aggregate {
                    max {
                      amount
                    }
                  }
                }
              }
            `
        })
    });

    const data = await response.json();
    console.log("Profile data:", data);

    const firstName = data.data.user[0].firstName;
    const lastName = data.data.user[0].lastName;
    const totalXP = data.data.xp.aggregate.sum.amount;
    const level = data.data.level.aggregate.max.amount;

    container.innerHTML = `
        <div class="header">
            <h1 class="logo">Welcome, ${firstName} ${lastName}</h1>
            <button id="logoutBtn">Logout</button>
        </div>
        <div class="stats">
            <div class="stat-card">
                <h3>Current Level</h3>
                <p>${level.toFixed(2)}</p>
            </div>
            <div class="stat-card">
                <h3>Total XP</h3>
                <p>${formatXP(totalXP)}</p>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        logout();
    });
}
