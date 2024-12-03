import axios from "@/utilities/axios"

export const createUser = async (token, payload) => {
  const { data: response } = await axios.post("/api/user", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const updateUser = async (token, payload) => {
  const { data: response } = await axios.put("/api/user", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const deleteUser = async (token, id) => {
  const { data: response } = await axios.delete("/api/user/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getUsers = async (token, query) => {
  const { data: response } = await axios.get("/api/users?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getUser = async (token, id) => {
  const { data: response } = await axios.get("/api/user?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const register = async (payload) => {
  const { data: response } = await axios.post("/api/user/register", payload)

  return response
}

export const onboard = async (token, payload) => {
  const { data: response } = await axios.post("/api/user/onboard", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const terms = async (token, payload) => {
  const { data: response } = await axios.post("/api/user/terms", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const login = async (payload) => {
  const { data: response } = await axios.post("/api/user/login", payload)

  return response
}

export const validateEmail = async (payload) => {
  const { data: response } = await axios.post("/api/user/validate-email", payload)

  return response
}

export const validateCode = async (payload) => {
  const { data: response } = await axios.post("/api/user/validate-code", payload)

  return response
}

export const resetPassword = async (payload) => {
  const { data: response } = await axios.post("/api/user/reset-password", payload)

  return response
}

export const changePassword = async (token, payload) => {
  const { data: response } = await axios.put("/api/change-password", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const updateCompany = async (token, payload) => {
  const { data: response } = await axios.put("/api/user/company", payload, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const logout = async (payload) => {
  const { data: response } = await axios.post("/api/user/logout", payload)

  return response
}
