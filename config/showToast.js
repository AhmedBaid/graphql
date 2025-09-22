import { errorDiv } from "./config.js";

export function showToast(color, message) {
    errorDiv.style.display = "block"
    errorDiv.style.backgroundColor = color
    errorDiv.textContent = message
    setTimeout(() => {
        errorDiv.style.display = "none"
        errorDiv.textContent = ""
    }, 2000);
}
