'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'




export default function ExportPage() {
  const [showOpenJob, setShowOpenJob] = useState(false)
  const router = useRouter()

  return (
    <div className="p-10">
      {/* export-job */}
      <div
        onClick={() => setShowOpenJob(prev => !prev)}
        className="w-[320px] bg-white rounded-[20px] shadow-lg 
                   flex flex-col items-center justify-center p-8
                   cursor-pointer hover:shadow-xl transition"
      >
        <Image
          src="/images/icons8-export-excel-50.png"
          alt="Noc"
          width={80}
          height={80}
        />
        <h2 className="text-[22px] font-semibold mt-4">
          Export Job
        </h2>
      </div>

      {/* Export Job Button */}
      {showOpenJob && (
        <div
          className="mt-6 w-[320px] bg-white rounded-[20px] 
                     shadow-lg p-6 flex justify-center"
        >
          <button
            onClick={() => router.push('/export-job/export-job')}
            className="w-full py-3 bg-gray-100 rounded-[12px]
                       text-[20px] font-semibold
                       hover:bg-gray-200 transition"
          >
            Export Job
          </button>
        </div>
      )}
    </div>
  )
}


