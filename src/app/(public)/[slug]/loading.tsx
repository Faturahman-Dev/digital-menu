export default function LoadingMenu() {
  return (
    <div className='min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center'>
      {/* Animasi Spinner Putar */}
      <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4'></div>
      <p className='text-gray-500 font-medium animate-pulse'>
        Menyiapkan buku menu...
      </p>
    </div>
  );
}
