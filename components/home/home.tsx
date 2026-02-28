import Image from "next/image";

export default function Page() {
  return (
    <div className="space-y-16">
      {/* ===== Section 1 : STS ===== */}
      <section className="bg-white rounded-[20px] p-12 grid grid-cols-2 gap-10">
        <div>
          <h1 className="text-[32px] font-medium text-[#13298C] leading-snug">
            ระบบติดตามบริหารงานลูกค้า
            <br />
            Service Tracking Systems V2.0 (STS)
          </h1>

          <p className="mt-6 text-[16px] leading-[30px] text-gray-800 indent-8 text-justify">
            ระบบ Service Tracking Systems V2.0 (STS)
            ถูกออกแบบเพื่อช่วยให้เจ้าหน้าที่สามารถรับแจ้งปัญหา มอบหมายงานติดตาม
            สถานะการทำงาน และสรุปรายงานผล
            ได้อย่างเป็นระบบครอบคลุมกระบวนการบริการหลังการขายและ งานซ่อมบำรุง
            โดยระบบเวอร์ชันเดิมยังมีข้อจำกัดในหลายๆ ด้านและขาดฐาน ข้อมูลกลาง
            ส่งผลให้การทำงานของเจ้าหน้า ที่ล่าช้าและขาดความต่อเนื่อง
          </p>

          <p className="mt-4 text-[16px] leading-[30px] text-gray-800 indent-8 text-justify">
            บริษัทฯ จึงพัฒนา STS V2.0 เพื่อรองรับการใช้งานทั้ง Web และ Mobile
            Application เพิ่มประสิทธิภาพการทำงานด้วย การแสดงผลแบบเรียลไทม์
            ระบบแจ้งเตือน อัตโนมัติ การจัดการ คลังอุปกรณ์ (Inventory Control)
            และฐานองค์ความรู้ (Knowledge Base)
            ช่วยให้เจ้าหน้าที่เข้าถึงข้อมูลและแก้ไขปัญหาได้รวดเร็ว
            และแม่นยำยิ่งขึ้น
          </p>
        </div>

        <div className="rounded-[20px] overflow-hidden">
          <Image
            src="/images/importance-of-sales-tracking.webp"
            alt="Service Tracking Systems V2.0"
            width={640}
            height={640}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </section>

      {/* ===== Section 2 : Company ===== */}
      <section className="bg-white rounded-[20px] p-12">
        <h2 className="text-[36px] font-medium text-center">
          บริษัท สมาร์ทเทอร์แวร์ จำกัด
        </h2>
        <p className="text-[24px] text-black/60 text-center mt-1">
          Smarterware Co., Ltd.
        </p>

        <div className="grid grid-cols-2 gap-16 mt-12">
          {/* Company Profile */}
          <div
            className="
        bg-white rounded-[15px] p-6 shadow-lg
        transition-all duration-300 ease-out
        hover:-translate-y-3 hover:shadow-2xl hover:scale-[1.02]
      "
          >
            <div className="flex justify-center mb-4">
              <Image
                src="/images/messageImage_1770709085007.jpg"
                alt="Company Profile"
                width={300}
                height={200}
                className="rounded"
              />
            </div>
            <h3 className="text-[20px] mb-2 text-center">Company Profile</h3>
            <p className="text-[16px] leading-[30px] text-justify indent-6">
              บริษัท สมาร์ทเทอร์แวร์ จำกัด ก่อตั้งในปี พ.ศ. 2550 แยกตัวจากบริษัท
              สามารถคอมเทค จำกัด และได้รับการสนับสนุนจาก กลุ่มบริษัทสามารถ
              มีความเชี่ยวชาญด้านการพัฒนาซอฟต์แวร์ และบริหารโครงการขนาดใหญ่
              มุ่งเน้นการส่งมอบสินค้าและบริการ
              ที่มีคุณภาพเพื่อสร้างมูลค่าทางธุรกิจให้ลูกค้า
            </p>
          </div>

          {/* Products & Services */}
          <div
            className="
        bg-white rounded-[15px] p-6 shadow-lg
        transition-all duration-300 ease-out
        hover:-translate-y-3 hover:shadow-2xl hover:scale-[1.02]
      "
          >
            <div className="flex justify-center mb-4">
              <Image
                src="/images/messageImage_1770709104028.jpg"
                alt="Products"
                width={300}
                height={200}
                className="rounded"
              />
            </div>
            <h3 className="text-[20px] mb-2 text-center">
              Products & Services
            </h3>
            <p className="text-[16px] leading-[30px] text-justify indent-6">
              สมาร์ทเทอร์แวร์ให้การบริการด้านการพัฒนาซอฟต์แวร์แบบ
              เบ็ดเสร็จครบวงจรทั้งภาครัฐและเอกชน โดยดำเนินการ วิเคราะห์
              ให้คำปรึกษา ตามความต้องการของลูกค้า การออกแบบ การพัฒนา ติดตั้ง
              ถ่ายโอน บำรุงรักษา และการฝึกอบรม
            </p>
          </div>
        </div>
      </section>

      {/* ===== Section 3 : Introduce ===== */}
      <section className="bg-white rounded-[20px] p-12 shadow">
        <h2 className="text-[36px] text-center">แนะนำตัวเอง</h2>
        <p className="text-[24px] text-center text-black/60">
          Introduce yourself
        </p>

        <div className="grid grid-cols-[300px_1fr] gap-12 mt-12">
          <Image
            src="/images/sujitra.png"
            alt="Profile"
            width={294}
            height={294}
            className="rounded-full object-cover"
          />

          <div>
            <h3 className="text-[32px]">สุจิตรา หุ่นงาม (จ๊ะจ๋า)</h3>
            <p className="text-[22px] text-[#F97216] mt-1">
              SUCHITRA HUNNGAM (JAJA)
            </p>

            <div className="grid grid-cols-2 gap-y-6 gap-x-10 mt-8 text-[22px]">
              {/* รหัสนักศึกษา */}
              <div className="flex items-start gap-3">
                <Image
                  src="/images/icons8-graduation-cap-50.png"
                  alt="Student ID"
                  width={28}
                  height={28}
                />
                <div>
                  <p className="text-gray-500">รหัสนักศึกษา</p>
                  <p>65010808</p>
                </div>
              </div>

              {/* สถานศึกษา */}
              <div className="flex items-start gap-3">
                <Image
                  src="/images/icons8-israeli-parliament-50.png"
                  alt="University"
                  width={28}
                  height={28}
                />
                <div>
                  <p className="text-gray-500">สถานศึกษา</p>
                  <p>มหาวิทยาลัยศรีปทุม (บางเขน)</p>
                </div>
              </div>

              {/* คณะ / สาขา */}
              <div className="flex items-start gap-3">
                <Image
                  src="/images/icons8-laurel-wreath-50.png"
                  alt="Faculty"
                  width={28}
                  height={28}
                />
                <div>
                  <p className="text-gray-500">คณะ / สาขา</p>
                  <p>เทคโนโลยีสารสนเทศ / วิศวกรรมคอมพิวเตอร์</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Image
                  src="/images/icons8-email-open-50.png"
                  alt="Email"
                  width={28}
                  height={28}
                />
                <div>
                  <p className="text-gray-500">Email</p>
                  <p>sujitra.hun@spumail.net</p>
                </div>
              </div>
            </div>

            <hr className="my-6" />

            <p className="text-[18px] text-gray-600">
              Computer Engineering Student at Faculty of Information Technology,
              Sripatum University
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
