import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Bikin Menu Digital Toko Anda dalam <span className="text-blue-600">Hitungan Menit</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Platform pembuat menu QR code termudah untuk UMKM, Kafe, dan Restoran. 
          Tingkatkan penjualan dengan menu digital yang modern dan responsif.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/register" 
            className="px-8 py-3 text-white bg-blue-600 rounded-full font-medium hover:bg-blue-700 transition"
          >
            Mulai Gratis Sekarang
          </Link>
          <Link 
            href="/login" 
            className="px-8 py-3 text-gray-700 bg-white border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition"
          >
            Masuk ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}