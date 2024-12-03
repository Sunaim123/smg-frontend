import Link from "next/link"

export default function Copyright(props) {
  return (
    <p variant="body2" color="text.secondary" align="center" {...props}>
      {"By continuing, you agree to our "}
      <Link href="/terms">Terms &amp; Conditions</Link>
      {" & "}
      <Link href="/privacy">Privacy Policies</Link>
    </p>
  )
}