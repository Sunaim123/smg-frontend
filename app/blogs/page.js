import Container from "@mui/material/Container"
import Layout from "@/app/components/Layout"
import MainContent from "./components/MainContent"
import Latest from "./components/Latest"

export default function Blog() {
  return (
    <Layout>
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", gap: 4, py: 4 }}
      >
        <MainContent />
        <Latest />
      </Container>
    </Layout>
  )
}