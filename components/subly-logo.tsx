import Image from "next/image"

export function SublyLogo({ className = "w-12 h-12" }: { className?: string }) {
  return <Image src="/subly-logo.svg" alt="Subly Logo" width={48} height={48} className={className} priority />
}
