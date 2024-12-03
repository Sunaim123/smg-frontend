import Image from "next/image"
import Link from "next/link"

export default function SitemarkIcon() {
  return (
    <Link href="/" style={{ display: "flex" }}>
      <Image
        src="/smg-light-rounded.png"
        alt="Stock my Goods Logo"
        width={32}
        height={32}
        style={{
          marginRight: "12px"
        }}
      />
    </Link>
  )
}
