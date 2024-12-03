import axios from "@/utilities/axios"

export const createFba = async (token, payload) => {
  const { data: response } = await axios.post("/api/fba", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const updateFba = async (token, payload) => {
  const { data: response } = await axios.put("/api/fba", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const deleteFba = async (token, id) => {
  const { data: response } = await axios.delete("/api/fba/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getFbas = async (token, query) => {
  const { data: response } = await axios.get("/api/fbas?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getFba = async (token, id) => {
  const { data: response } = await axios.get("/api/fba?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getCount = async (token) => {
  const { data: response } = await axios.get("/api/fbas/count", {
    headers: {
      "Token": token
    }
  })

  return response
}

export const updateFbaStatus = async (token, payload) => {
  const { data: response } = await axios.patch(`/api/fba/status`, payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const validateInvoice = async (token, payload) => {
  const { data: response } = await axios.post("/api/fba/validate", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const trashFba = async (token, payload) => {
  const { data: response } = await axios.patch("/api/fba/trash", payload, {
    headers: {
      "Token": token,
    }
  })

  return response
}