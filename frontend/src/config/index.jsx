const {default:axios}=require("axios");
 
export const BASE_URL="https://linkedln-clone-lokc.onrender.com"


export const clientServer=axios.create({
    baseURL:BASE_URL,
});
