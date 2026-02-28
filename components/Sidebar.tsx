'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Network,
  Users,
  Wrench,
  FileDown,
  Package,
  LogOut,
} from 'lucide-react'

const menuItems = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Noc', href: '/noc', icon: Network },
  { label: 'Teleport Head', href: '/teleport-head', icon: Users },
  { label: 'Teleport Technician', href: '/teleport-technician', icon: Wrench },
  { label: 'Export Job', href: '/export-job', icon: FileDown },
  { label: 'Inventory Control', href: '/Inventory-control', icon: Package },
  //{ label: 'Account Management', href: '/account-management', icon: Package },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-[270px] bg-gradient-to-b from-[#0B2A7B] to-[#0A1F5C] text-white flex flex-col">
      {/* ===== Header ===== */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-[14px] font-semibold leading-snug">
          ระบบติดตามบริการด้านการบริการลูกค้า
        </h1>
        <p className="text-[11px] text-white/60 mt-0.5">
          Service Tracking Systems V2.0
        </p>

        <div className="mt-4">
          <div className="h-[34px] rounded bg-white/10 px-3 flex items-center text-[12px] text-white/70">
            สิทธิ์การใช้งาน : -
          </div>
        </div>
      </div>

      {/* ===== Menu ===== */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3
                px-4 py-2.5
                rounded
                text-[14px]
                transition-all
                ${
                  isActive
                    ? 'bg-[#FF7A00] text-white shadow-md'
                    : 'text-white/80 hover:bg-white/10'
                }
              `}
            >
              <Icon size={17} className="shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* ===== Footer ===== */}
      <div className="px-4 pb-4">
        <div className="border-t border-white/10 mb-3" />

        <button className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-white/80 hover:bg-white/10 rounded w-full transition">
          <LogOut size={17} />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}
