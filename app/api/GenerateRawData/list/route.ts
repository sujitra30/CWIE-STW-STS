import { NextRequest, NextResponse } from "next/server";
import { mockJobData } from "@/lib/mockExportData";

export async function POST(req: NextRequest) {
  const { startDate, endDate } = await req.json();

  // กรองตามวันที่ (mockup ใช้ทุกแถวเสมอ)
  const filtered = mockJobData.filter((row) => {
    const d = row.open_datetime.split(" ")[0];
    return d >= startDate && d <= endDate;
  });

  return NextResponse.json(filtered);
}