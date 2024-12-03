import axios from "@/utilities/axios"

export const createProduct = async (token, payload) => {
  const { data: response } = await axios.post("/api/product", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const updateProduct = async (token, payload) => {
  const { data: response } = await axios.put("/api/product", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const deleteProduct = async (token, id) => {
  const { data: response } = await axios.delete("/api/product/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getProducts = async (token, query) => {
  const { data: response } = await axios.get("/api/products?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getProduct = async (token, id) => {
  const { data: response } = await axios.get("/api/product?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}