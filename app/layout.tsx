// // app/layout.tsx
// import Sidebar from '@/components/Sidebar'
// import "./globals.css";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="th">
//       <body className="min-h-screen">
//         <Sidebar />

//         {/* content ด้านขวา */}
//         <main className="ml-[270px] p-8 bg-gray-100 min-h-screen">
//           {children}
//         </main>
//       </body>
//     </html>
//   )
// }


// app/layout.tsx
// 'use client'

// import { usePathname } from 'next/navigation'
// import Sidebar from '@/components/Sidebar'
// import "./globals.css";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const pathname = usePathname()
//   const hideSidebar = pathname === '/export-job/export-job' // ระบุ path ที่ไม่ต้องการ sidebar

//   return (
//     <html lang="th">
//       <body className="min-h-screen">
//         {!hideSidebar && <Sidebar />}

//         <main className={`p-8 bg-gray-100 min-h-screen ${!hideSidebar ? 'ml-[270px]' : ''}`}>
//           {children}
//         </main>
//       </body>
//     </html>
//   )
// }

// app/layout.tsx
'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideSidebar = pathname === '/export-job/export-job' ||
  pathname === '/noc/noc-open-job' ||
  pathname === '/teleport-head/job-detail' ||
  pathname === '/login' ||
  pathname === '/teleport-technician/job-detail' ||
  pathname ===  '/teleport-technician/Inventory-control' ||
  pathname === '/teleport-head/Inventory-control' ||
  pathname === '/Inventory-control' ||
  pathname === '/teleport-technician/Inventory-control/return' ||
  pathname === '/PM/GenerateRawData'
  

  return (
    <html lang="th">
      <body className="min-h-screen m-0">
        {!hideSidebar && <Sidebar />}

        <main
          className={`
            bg-gray-100 min-h-screen
            ${!hideSidebar ? 'ml-[270px] p-8' : 'p-0'}
          `}
        >
          {children}
        </main>
      </body>
    </html>
  )
}

