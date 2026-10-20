import client from "./client";

export async function getSession() {
  const { data } = await client.get("/session");
  return data;
}

export async function unlockDevice(pin) {
  const { data } = await client.post("/session", { pin });
  return data;
}
