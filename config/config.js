import { login } from "../pages/login.js"

export const APISingIn = 'https://learn.zone01oujda.ma/api/auth/signin'
export const APIGraphql= 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql'
export const container = document.getElementById('main')
export const errorDiv = document.querySelector(".error")
export const FormLogin = `
    <div class="combine">
    <div class="login">
            <form class="login-form">
                <h1 class="logg">Welcome Back</h1>
                <input type="text" placeholder="Username"  id="username">
                <input type="password" placeholder="Password"  id="password">
                <button type="submit">Login</button>
            </form>
    </div>
    </div>
`
export function logout() {
    localStorage.removeItem("token")
    login()
}