import axios from "@/app/utilities/axios"

export const createInvoice = async (token, payload) => {
  const { data: response } = await axios.post("/api/invoice", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const updateInvoice = async (token, payload) => {
  const { data: response } = await axios.put("/api/invoice", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const deleteInvoice = async (token, id) => {
  const { data: response } = await axios.delete("/api/invoice/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getInvoices = async (token, query) => {
  const { data: response } = await axios.get("/api/invoices?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getInvoice = async (token, id) => {
  const { data: response } = await axios.get("/api/invoice?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const trashInvoice = async (token, payload) => {
  const { data: response } = await axios.patch("/api/invoice/trash", payload, {
    headers: {
      "Token": token,
    }
  })

  return response
}

export const createPayment = async (token, payload) => {
  const { data: response } = await axios.post("/api/invoice/payment", payload, {
    headers: {
      "Token": token,
    }
  })

  return response
}
