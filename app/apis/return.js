import axios from "@/app/utilities/axios"

export const createReturn = async (token, payload) => {
  const { data: response } = await axios.post("/api/return", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const updateReturn = async (token, payload) => {
  const { data: response } = await axios.put("/api/return", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const deleteReturn = async (token, id) => {
  const { data: response } = await axios.delete("/api/return/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getReturns = async (token, query) => {
  const { data: response } = await axios.get("/api/returns?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getReturn = async (token, id) => {
  const { data: response } = await axios.get("/api/return?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getReturnDetails = async (token, id) => {
  const { data: response } = await axios.get("/api/return-details?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const patchReturn = async (token, payload) => {
  const { data: response } = await axios.patch("/api/return", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const patchReturnRequest = async (token, payload) => {
  const { data: response } = await axios.patch("/api/return/request", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const createInspection = async (token, payload) => {
  const { data: response } = await axios.patch("/api/return/inspection", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const validateInvoice = async (token, payload) => {
  const { data: response } = await axios.post("/api/return/service/validate", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getCount = async (token) => {
  const { data: response } = await axios.get("/api/returns/count", {
    headers: {
      "Token": token
    }
  })

  return response
}

export const createReturnService = async (token, payload) => {
  const { data: response } = await axios.post("/api/return/service", payload, {
    headers: {
      "Token": token,
    }
  })

  return response
}

export const completeReturnService = async (token, payload) => {
  const { data: response } = await axios.put("/api/return/service/complete", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })
  return response
}

export const getReturnService = async (token, id) => {
  const { data: response } = await axios.get("/api/return_service?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const ValidateReturnService = async (token, payload) => {
  const { data: response } = await axios.post("/api/return/return_service/validate", payload, {
    headers: {
      "Token": token,
    }
  })

  return response
}

export const trashReturn = async (token, payload) => {
  const { data: response } = await axios.patch("/api/return/trash", payload, {
    headers: {
      "Token": token,
    }
  })

  return response
}

export const updateReturnService = async (token, payload) => {
  const { data: response } = await axios.put("/api/return/service", payload, {
    headers: {
      "Token": token,
    }
  })

  return response
}

export const returnReceived = async (token, payload) => {
  const { data: response } = await axios.post("/api/return-received", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}