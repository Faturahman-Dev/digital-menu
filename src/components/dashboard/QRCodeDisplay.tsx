"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState, useEffect } from "react";

interface QRCodeDisplayProps {
  slug: string;
  storeName: string;
}

export default function QRCodeDisplay({ slug, storeName }: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [menuUrl, setMenuUrl] = useState("");

  // Mengambil URL website saat ini (berjalan setelah komponen dimuat di browser)
  useEffect(() => {
    setMenuUrl(`${window.location.origin}/${slug}`);
  }, [slug]);

  // Fungsi untuk mengunduh QR Code sebagai gambar PNG
  const downloadQR = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    // Ubah canvas menjadi URL gambar
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    // Buat link rahasia untuk memicu download browser
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    // Nama file otomatis: QR-Menu-Kopi-Senja.png
    downloadLink.download = `QR-Menu-${storeName.replace(/\s+/g, "-")}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Mencegah error 'hydration' Next.js dengan menunggu URL siap
  if (!menuUrl) return null; 

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
      <h3 className="text-lg font-bold text-gray-900 mb-2">QR Code Menu Anda</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Cetak QR ini dan letakkan di meja agar pelanggan bisa memindai menu.
      </p>

      {/* Area QR Code */}
      <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl mb-4">
        <QRCodeCanvas
          id="qr-code"
          ref={qrRef}
          value={menuUrl}
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"} // Level H (High) bagus jika QR mau dicetak & dilaminating
          includeMargin={true}
        />
      </div>

      {/* Link Teks */}
      <a 
        href={menuUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 text-sm hover:underline mb-6 break-all text-center"
      >
        {menuUrl}
      </a>

      {/* Tombol Download */}
      <button
        onClick={downloadQR}
        className="w-full px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
      >
        Download QR (PNG)
      </button>
    </div>
  );
}