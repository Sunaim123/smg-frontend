import axios from "@/utilities/axios"

export const createRole = async (token, payload) => {
  const { data: response } = await axios.post("/api/role", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const updateRole = async (token, payload) => {
  const { data: response } = await axios.put(`/api/role`, payload, {
    headers: {
      "Token": token,
    }
  })
  return response
}

export const getRoles = async (token, query) => {
  const { data: response } = await axios.get("/api/roles?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getRole = async (token, id) => {
  const { data: response } = await axios.get(`/api/role?id=${id}`, {
    headers: {
      "Token": token
    }
  })
  return response
}

export const deleteRole = async (token, id) => {
  const { data: response } = await axios.delete("/api/role/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}
