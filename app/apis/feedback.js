import axios from "@/app/utilities/axios"

export const createFeedback = async (token, payload) => {
  const { data: response } = await axios.post("/api/feedback", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const updateFeedback = async (token, payload) => {
  const { data: response } = await axios.put("/api/feedback", payload, {
    headers: {
      "Token": token,
      "Content-Type": "multipart/form-data"
    }
  })

  return response
}

export const deleteFeedback = async (token, id) => {
  const { data: response } = await axios.delete("/api/feedback/" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getFeedbacks = async (token, query) => {
  const { data: response } = await axios.get("/api/feedbacks?" + query, {
    headers: {
      "Token": token
    }
  })

  return response
}

export const getFeedback = async (token, id) => {
  const { data: response } = await axios.get("/api/feedback?id=" + id, {
    headers: {
      "Token": token
    }
  })

  return response
}
