import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileImage, FileText, ShieldCheck } from 'lucide-react';

interface IDCardProps {
  member: {
    fullName: string;
    designation: string;
    dob: string;
    bloodGroup: string;
    keyword: string;
    photoURL: string;
    status: string;
  };
}

export default function IDCard({ member }: IDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, member.keyword, {
        format: "CODE128",
        width: 1.5,
        height: 30,
        displayValue: false,
        margin: 0
      });
    }
  }, [member.keyword]);

  const downloadPNG = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
      const link = document.createElement('a');
      link.download = `ID_Card_${member.keyword}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const downloadPDF = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ID_Card_${member.keyword}.pdf`);
    }
  };

  const profileUrl = `${window.location.origin}/member/${member.keyword}`;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* ID Card UI */}
      <div 
        ref={cardRef}
        className="w-[350px] h-[550px] bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-indigo-900 relative flex flex-col"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-indigo-900 p-4 text-center text-white">
          <img 
            src="https://i.ibb.co.com/PzhQk3qP/Beauty-Plus-IMAGE-ENHANCER-1772627025020.png" 
            alt="Logo" 
            className="h-12 mx-auto mb-2"
            referrerPolicy="no-referrer"
          />
          <h3 className="text-xs font-bold leading-tight uppercase tracking-wider">
            শ্রী শ্রী গনেশ পূজা উদযাপন পরিষদ ২০২৬
          </h3>
          <p className="text-[10px] opacity-80 mt-1">গণরাজ একতা সংঘ, কক্সবাজার</p>
        </div>

        {/* Body */}
        <div className="flex-grow flex flex-col items-center p-6 space-y-4">
          <div className="w-32 h-32 rounded-lg border-4 border-indigo-100 overflow-hidden shadow-md">
            <img 
              src={member.photoURL} 
              alt={member.fullName} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-indigo-900 uppercase">{member.fullName}</h2>
            <p className="text-sm font-semibold text-orange-600 mt-1">{member.designation}</p>
          </div>

          <div className="w-full space-y-2 text-xs">
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500 font-medium">Date of Birth:</span>
              <span className="text-gray-900 font-bold">{member.dob}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500 font-medium">Blood Group:</span>
              <span className="text-gray-900 font-bold text-red-600">{member.bloodGroup}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500 font-medium">ID Number:</span>
              <span className="text-gray-900 font-bold">{member.keyword}</span>
            </div>
          </div>

          {/* QR and Barcode */}
          <div className="flex justify-between items-end w-full mt-auto pt-4">
            <div className="flex flex-col items-center">
              <QRCodeSVG value={profileUrl} size={60} />
              <span className="text-[8px] mt-1 text-gray-400">Scan to Verify</span>
            </div>
            <div className="flex flex-col items-end">
              <svg ref={barcodeRef}></svg>
              <span className="text-[8px] mt-1 text-gray-400">Member ID Barcode</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-indigo-900 py-2 px-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-orange-400" />
            <span className="text-[8px] font-bold uppercase tracking-widest">Verified Member</span>
          </div>
          <span className="text-[8px] opacity-70">www.ganeshpuja2026.com</span>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-4">
        <button
          onClick={downloadPNG}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-sm font-medium"
        >
          <FileImage className="h-4 w-4" /> Download PNG
        </button>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md text-sm font-medium"
        >
          <FileText className="h-4 w-4" /> Download PDF
        </button>
      </div>
    </div>
  );
}
