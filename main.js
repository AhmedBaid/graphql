import { container, FormLogin } from "./config/config.js";
container.innerHTML=FormLogin
async function main() {
    const username = document.getElementById("username")
    const password = document.getElementById("password")
    const response = await fetch("https://learn.zone01oujda.ma/api/auth/signin",)

}
main()