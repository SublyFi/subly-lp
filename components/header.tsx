import { SublyLogo } from "./subly-logo"

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-6">
      <div className="flex items-center gap-2">
        <SublyLogo className="w-12 h-12" />
        <span className="text-3xl font-bold text-white">Subly</span>
      </div>
    </header>
  )
}
