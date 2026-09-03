'use client';
import { useState } from 'react';
import { FileText, Download, ExternalLink, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { PdfResource } from '@/lib/lms/types';

export default function PdfViewer({ pdf, onClose }: { pdf: PdfResource; onClose?:()=>void }){
  const [zoom, setZoom] = useState(100);
  return (
    <div className="bg-white rounded-[20px] border border-neutral-200 overflow-hidden flex flex-col">
      <div className="h-12 px-4 flex items-center justify-between border-b border-neutral-100 bg-neutral-50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#e11d48] text-white flex items-center justify-center shrink-0"><FileText className="w-4 h-4"/></div>
          <div className="min-w-0">
            <div className="text-sm font-bold truncate">{pdf.title}</div>
            <div className="text-[11px] text-neutral-500">{pdf.pages} pages • {(pdf.sizeKB||0/1024).toFixed(1)} MB • PDF</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={()=>setZoom(z=>Math.max(60,z-10))} className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-white"><ZoomOut className="w-4 h-4"/></button>
          <span className="text-xs font-bold w-10 text-center">{zoom}%</span>
          <button onClick={()=>setZoom(z=>Math.min(160,z+10))} className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-white"><ZoomIn className="w-4 h-4"/></button>
          <a href={pdf.url} target="_blank" download className="hidden sm:flex items-center gap-1.5 bg-[#0f172a] text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-black"><Download className="w-3.5 h-3.5"/> Download</a>
          <a href={pdf.url} target="_blank" className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center hover:bg-neutral-50"><ExternalLink className="w-4 h-4"/></a>
          {onClose && <button onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center"><X className="w-4 h-4"/></button>}
        </div>
      </div>
      <div className="flex-1 bg-[#f8fafc] p-3 sm:p-6 overflow-auto" style={{zoom: `${zoom}%` as any}}>
        <div className="max-w-[760px] mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-neutral-200 min-h-[520px]">
          <iframe src={pdf.url} className="w-full h-[520px] sm:h-[640px]" title={pdf.title}/>
          <div className="p-4 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
            <span>Preview via browser PDF viewer. Download for offline reading & annotation.</span>
            <a href={pdf.url} target="_blank" className="text-[#4338ca] font-bold hover:underline">Open in new tab ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PdfCard({ pdf, onOpen }: { pdf: PdfResource; onOpen?:()=>void }){
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-3 flex items-center gap-3 hover:shadow-md hover:border-neutral-300 transition">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e11d48] to-[#be123c] text-white flex items-center justify-center shrink-0"><FileText className="w-6 h-6"/></div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold leading-tight line-clamp-2">{pdf.title}</div>
        <div className="text-[11px] text-neutral-500 mt-0.5">{pdf.pages ?? 12} pages • PDF • {new Date(pdf.uploadedAt).toLocaleDateString('en-IN')}</div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button onClick={onOpen} className="hidden sm:inline-flex bg-[#0f172a] text-white px-3 py-1.5 rounded-full text-xs font-black hover:bg-black">View</button>
        <a href={pdf.url} target="_blank" className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50"><Download className="w-4 h-4"/></a>
      </div>
    </div>
  );
}
