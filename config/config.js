export const container = document.getElementById('main')
export const FormLogin = `
    <div class="login">
            <form class="login-form">
                <h1>Welcome Back</h1>
                <input type="text" placeholder="Username"  id="username">
                <input type="password" placeholder="Password"  id="password">
                <button type="submit">Login</button>
            </form>
    </div>
`
export const errorDiv = document.querySelector(".error")
export const API = "https://learn.zone01oujda.ma/api/auth/signin"