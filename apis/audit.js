import axios from "@/utilities/axios"

export const createAudit = async (token, payload) => {
    const { data: response } = await axios.post("/api/audit", payload, {
      headers: {
        "Token": token
      }
    })
  
    return response
  }
  
  export const updateAudit = async (token, payload) => {
    const { data: response } = await axios.put("/api/audit", payload, {
      headers: {
        "Token": token
      }
    })
  
    return response
  }
  
  export const deleteAudit = async (token, id) => {
    const { data: response } = await axios.delete("/api/audit/" + id, {
      headers: {
        "Token": token
      }
    })
  
    return response
  }

export const getAudits = async (token, query) => {
    const { data: response } = await axios.get("/api/audits?" + query, {
        headers: {
            "Token": token
        }
    })

    return response
}

export const getAudit = async (token, id) => {
    const { data: response } = await axios.get("/api/audit?id=" + id, {
        headers: {
            "Token": token
        }
    })

    return response
}