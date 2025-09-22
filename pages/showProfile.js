import { container } from "../config/config.js";

export function showProfile(jwt) {
    console.log(jwt);
    
    container.innerHTML="hello ahmed"
}