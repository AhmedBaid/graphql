import { container } from "../config/config.js";
import { login } from "./login.js";

export function showProfile(data) {
    const username = data?.data?.user?.login
    container.innerHTML = `
        <div>
            <h1>Welcome ${username}</h1>
            <button id="logoutBtn">Logout</button>
        </div>
    `;

    // Logout handler
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        login()
    });
}
