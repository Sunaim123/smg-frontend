import axios from "@/app/utilities/axios"

export const createInventory = async (token, payload) => {
  const { data: response } = await axios.post("/api/inventory", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const updateInventory = async (token, payload) => {
  const { data: response } = await axios.put("/api/inventory", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const deleteInventory = async (token, id) => {
  const { data: response } = await axios.delete("/api/inventory/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getInventories = async (token, query) => {
  const { data: response } = await axios.get("/api/inventorys?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getInventory = async (token, id) => {
  const { data: response } = await axios.get("/api/inventory?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getInventoryCount = async (token, query) => {
  const { data: response } = await axios.get("/api/inventory-count?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}
