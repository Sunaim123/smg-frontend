import axios from "@/app/utilities/axios"

export const createOrder = async (token, payload) => {
  const { data: response } = await axios.post("/api/inventory-order", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const updateOrder = async (token, payload) => {
  const { data: response } = await axios.put("/api/inventory-order", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const deleteOrder = async (token, id) => {
  const { data: response } = await axios.delete("/api/inventory-order/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getOrders = async (token, query) => {
  const { data: response } = await axios.get("/api/inventory-orders?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getOrder = async (token, id) => {
  const { data: response } = await axios.get("/api/inventory-order?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const createInvoice = async (token, payload) => {
  const { data: response } = await axios.post("/api/inventory-order/invoice", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getInvoice = async (token, id) => {
  const { data: response } = await axios.get("/api/inventory-order/invoice?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const deleteInvoice = async (token, id) => {
  const { data: response } = await axios.delete("/api/inventory-order/invoice/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const trashOrder = async (token, payload) => {
  const { data: response } = await axios.patch("/api/inventory-order/trash", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}
