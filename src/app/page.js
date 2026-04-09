"use client";
import React, { useState } from 'react';
import { Search, Shield, Info, Link } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import TerminalLoader from '@/components/TerminalLoader';
import { generateMockReport } from '@/lib/mockData';

export default function Home() {
  const [steamId, setSteamId] = useState("");
  const [status, setStatus] = useState("IDLE"); // IDLE, SCANNING, RESULT
  const [report, setReport] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!steamId) return;
    setStatus("SCANNING");
  };

  const onScanComplete = () => {
    // In Mock Mode, we just generate the data here
    const mockData = generateMockReport(steamId);
    setReport(mockData);
    setStatus("RESULT");
  };

  return (
    <main className="min-h-screen">
      {/* Navbar Minimalista */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" />
            <span className="font-black text-xl tracking-tighter text-white">
              CS2<span className="text-blue-500">TRUST</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Metodología</a>
            <a href="https://github.com/Ro0oman" target="_blank" rel="noreferrer">
              <Link className="w-5 h-5 text-slate-500 hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero / Hero Search Area */}
      {status === "IDLE" && (
        <div className="max-w-4xl mx-auto pt-32 px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight text-balance">
              Detección de Cheaters <br />
              <span className="text-blue-500 italic">Nivel Profesional</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Analiza el SteamID para detectar comportamientos anómalos, inconsistencias en estadísticas y patrones de puntería inhumanos.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-2 pl-6">
                <Search className="w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Pega el SteamID64 o Perfil de Steam..."
                  className="bg-transparent border-none outline-none flex-1 px-4 text-white font-medium placeholder:text-slate-600 h-12"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95 whitespace-nowrap"
                >
                  Analizar Usuario
                </button>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-full">
                <Info className="w-3 h-3" /> Basado en Z-Scores
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-full">
                <Info className="w-3 h-3" /> Análisis de Deriva CUSUM
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Scanning State */}
      {status === "SCANNING" && (
        <div className="pt-24 px-6">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Procesando Identidad</h2>
            <p className="text-slate-500 text-sm">Ejecutando algoritmos de detección avanzada...</p>
          </div>
          <TerminalLoader onComplete={onScanComplete} />
        </div>
      )}

      {/* Result State */}
      {status === "RESULT" && (
        <div className="pb-24 animate-in fade-in duration-500">
          <Dashboard report={report} />
          <div className="max-w-6xl mx-auto px-8 mt-12">
            <button 
              onClick={() => setStatus("IDLE")}
              className="text-slate-500 hover:text-white text-sm font-bold transition-colors flex items-center gap-2"
            >
              ← Realizar otro análisis
            </button>
          </div>
        </div>
      )}

      {/* Footer Minimalista */}
      <footer className="mt-auto py-12 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">
          Diseñado para el Portfolio de Producción • v1.0.4
        </p>
      </footer>
    </main>
  );
}
