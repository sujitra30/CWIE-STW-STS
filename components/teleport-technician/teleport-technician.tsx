"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NocPage() {
  const [showTeleport, setShowTeleport] = useState(false);
  const [showOperator, setShowOperator] = useState(false);
  const router = useRouter();

  return (
    <div className="p-10 flex gap-10">
      {/* ================= Teleport Technician ================= */}
      <div>
        <div
          onClick={() => setShowTeleport((prev) => !prev)}
          className="w-[320px] bg-white rounded-[20px] shadow-lg 
                     flex flex-col items-center justify-center p-8
                     cursor-pointer hover:shadow-xl transition"
        >
          <Image
            src="/images/icons8-technician-50.png"
            alt="Teleport Technician"
            width={80}
            height={80}
          />
          <h2 className="text-[22px] font-semibold mt-4">
            Teleport Technician
          </h2>
        </div>

        {showTeleport && (
          <div
            className="mt-6 w-[320px] bg-white rounded-[20px] 
                       shadow-lg p-6 flex justify-center"
          >
            <button
              onClick={() => router.push("/teleport-technician/job-detail")}
              className="w-full py-3 bg-gray-100 rounded-[12px]
                         text-[20px] font-semibold
                         hover:bg-gray-200 transition"
            >
              TP Tech Monitor
            </button>
          </div>
        )}
      </div>

      <div>
        <div
          onClick={() => setShowOperator((prev) => !prev)}
          className="w-[320px] bg-white rounded-[20px] shadow-lg 
                           flex flex-col items-center justify-center p-8
                           cursor-pointer hover:shadow-xl transition"
        >
          <Image
            src="/images/icons8-product.png"
            alt="Inventory Control"
            width={80}
            height={80}
          />
          <h2 className="text-[22px] font-semibold mt-4">
            Inventory Control TP
          </h2>
        </div>

        {showOperator && (
          <div
            className="mt-6 w-[320px] bg-white rounded-[20px] 
               shadow-lg p-6 flex flex-col gap-4"
          >
            <button
              onClick={() => router.push("/teleport-technician/Inventory-control")}
              className="w-full py-3 bg-gray-100 rounded-[12px]
                 text-[20px] font-semibold
                 hover:bg-gray-200 transition"
            >
              การเบิกอุปกรณ์ (TP)
            </button>

            <button
              onClick={() => router.push("/teleport-technician/Inventory-control/return")}
              className="w-full py-3 bg-gray-100 rounded-[12px]
                 text-[20px] font-semibold
                 hover:bg-gray-200 transition"
            >
              การคืนอุปกรณ์ (TP)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
