"use client";
import React, { useState, useEffect } from 'react';
import { Terminal, Check, Loader2 } from 'lucide-react';

const LOG_MESSAGES = [
  "Iniciando escaneo de SteamID...",
  "Conectando con Steam Web API...",
  "Descargando perfil del usuario...",
  "Extrayendo historial de partidas desde Faceit...",
  "Analizando métricas de rendimiento (ADR, K/D, HS%)...",
  "Calculando desviaciones estándar y Z-Scores...",
  "Ejecutando modelo de detección de anomalías...",
  "Generando reporte de riesgo final..."
];

export default function TerminalLoader({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < LOG_MESSAGES.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, LOG_MESSAGES[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, Math.random() * 800 + 400);
      return () => clearTimeout(timer);
    } else {
      setTimeout(onComplete, 1000);
    }
  }, [currentIndex, onComplete]);

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Scanner Terminal v1.0.4</span>
      </div>
      <div className="p-6 h-64 font-mono text-sm space-y-2 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-300">
            {i === logs.length - 1 && currentIndex < LOG_MESSAGES.length ? (
              <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5 text-green-500" />
            )}
            <span className="text-slate-300">{log}</span>
          </div>
        ))}
        {currentIndex < LOG_MESSAGES.length && (
          <div className="w-2 h-4 bg-blue-500/50 animate-pulse inline-block" />
        )}
      </div>
    </div>
  );
}
