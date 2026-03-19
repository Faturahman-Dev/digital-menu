"use client";

import { useState } from "react";
import { deleteMenu } from "@/actions/menu-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MenuActionButtons({ menuId }: { menuId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    // Munculkan popup konfirmasi bawaan browser
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus menu ini?");
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteMenu(menuId);

    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
    } else {
      // Refresh halaman agar data terbaru muncul
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Link 
        href={`/dashboard/menu/${menuId}`} 
        className="text-gray-400 hover:text-blue-600 transition-colors font-medium text-sm"
      >
        Edit
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className={`${isDeleting ? 'text-red-300' : 'text-gray-400 hover:text-red-600'} transition-colors font-medium text-sm disabled:cursor-not-allowed`}
      >
        {isDeleting ? "Menghapus..." : "Hapus"}
      </button>
    </div>
  );
}