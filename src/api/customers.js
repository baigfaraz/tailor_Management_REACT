import client from "./client";

const BASE = "/customerDetail";

export async function listCustomers() {
  const { data } = await client.get(`${BASE}/somedata`);
  return data;
}

export async function getCustomer(id) {
  const { data } = await client.get(`${BASE}/${id}`);
  return data;
}

export async function createCustomer(customer) {
  const { data } = await client.post(BASE, customer);
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await client.put(`${BASE}/orderStatus/${id}`, {
    customer_orderStatus: status,
  });
  return data;
}

export async function updatePaymentStatus(id, status) {
  const { data } = await client.put(`${BASE}/paymentStatus/${id}`, {
    customer_paymentStatus: status,
  });
  return data;
}

export async function deleteCustomer(id) {
  const { data } = await client.delete(`${BASE}/delete/${id}`);
  return data;
}
