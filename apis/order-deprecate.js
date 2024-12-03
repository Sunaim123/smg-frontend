import axios from "@/utilities/axios"

export const createOrder = async (token, payload) => {
  const { data: response } = await axios.post("/api/order", payload, {
    headers: {
      "Token": token,
      "Content-Type": "application/json"
    }
  })

  return response
}

export const updateOrder = async (token, payload) => {
  const { data: response } = await axios.put("/api/order", payload, {
    headers: {
      "Token": token,
      "Content-Type": "application/json"
    }
  })

  return response
}

export const deleteOrder = async (token, id) => {
  const { data: response } = await axios.delete("/api/order/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getOrders = async (token, query) => {
  const { data: response } = await axios.get("/api/orders?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getOrder = async (token, id) => {
  const { data: response } = await axios.get("/api/order?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const createInvoice = async (token, payload) => {
  const { data: response } = await axios.post("/api/order/invoice", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getInvoice = async (token, id) => {
  const { data: response } = await axios.get("/api/order/invoice?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const deleteInvoice = async (token, id) => {
  const { data: response } = await axios.delete("/api/order/invoice/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const trashOrder = async (token, payload) => {
  const { data: response } = await axios.patch("/api/order/trash", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const updateOrderLineItem = async (token, payload) => {
  const { data: response } = await axios.put("/api/order/lineitem", payload, {
    headers: {
      "Token": token,
      "Content-Type": "application/json"
    }
  })

  return response
}

export const getCount = async (token) => {
  const { data: response } = await axios.get("/api/orders/count", {
    headers: {
      "Token": token
    }
  })

  return response
}
