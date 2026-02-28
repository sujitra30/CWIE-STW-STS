'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function NocPage() {
  const [showOpenJob, setShowOpenJob] = useState(false)
  const router = useRouter()

  return (
    <div className="p-10">
      {/* Teleport Head Card */}
      <div
        onClick={() => setShowOpenJob(prev => !prev)}
        className="w-[320px] bg-white rounded-[20px] shadow-lg 
                   flex flex-col items-center justify-center p-8
                   cursor-pointer hover:shadow-xl transition"
      >
        <Image
          src="/images/icons8-portal-50.png"
          alt="Noc"
          width={80}
          height={80}
        />
        <h2 className="text-[22px] font-semibold mt-4">Teleport Head</h2>
      </div>

      {/* TP Monitor */}
      {showOpenJob && (
        <div
          className="mt-6 w-[320px] bg-white rounded-[20px] 
                     shadow-lg p-6 flex justify-center"
        >
          <button
            onClick={() => router.push('/teleport-head/job-detail')}
            className="w-full py-3 bg-gray-100 rounded-[12px]
                       text-[20px] font-semibold
                       hover:bg-gray-200 transition"
          >
            TP Monitor
          </button>
        </div>
      )}
    </div>
  )
}
