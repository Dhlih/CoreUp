// src/components/ui/Spinner.js
'use client'

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 bg-white/80 flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    </div>
  )
}
