import { APIGraphql } from "../config/config.js";

export async function FetchGraphqlapi(query, token) {
  const response = await fetch(APIGraphql, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ query })
  });

  return await response.json();
}