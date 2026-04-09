"use client";
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot 
} from 'recharts';
import { 
  ShieldAlert, ShieldCheck, TrendingUp, Target, 
  BarChart3, User, Calendar, ExternalLink 
} from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
    <div className="flex justify-between items-start mb-2">
      <span className="text-slate-400 text-sm font-medium">{title}</span>
      <Icon className={cn("w-4 h-4", colorClass)} />
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
  </div>
);

const RiskGauge = ({ probability, color }) => {
  const rotation = (probability / 100) * 180 - 90;
  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-6">
      <div className="w-48 h-24 overflow-hidden relative">
        <div className="w-48 h-48 border-[12px] border-slate-800 rounded-full" />
        <div 
          className="absolute top-0 left-0 w-48 h-48 border-[12px] rounded-full transition-all duration-1000 ease-out"
          style={{ 
            borderColor: color, 
            clipPath: `polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)`,
            transform: `rotate(${rotation}deg)`
          }}
        />
      </div>
      <div className="absolute top-[60%] flex flex-col items-center">
        <span className="text-4xl font-black text-white">{probability}%</span>
        <span className="text-sm font-bold tracking-widest uppercase opacity-80" style={{ color }}>
          Riesgo Detectado
        </span>
      </div>
    </div>
  );
};

export default function Dashboard({ report }) {
  if (!report) return null;

  const { profile, risk_analysis, overall_stats, history } = report;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-950/40 p-6 rounded-2xl border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img 
              src={profile.avatar_url} 
              alt={profile.personaname} 
              className="w-20 h-20 rounded-2xl border-2 border-slate-700 object-cover shadow-2xl" 
            />
            {profile.faceit_level && (
              <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md border-2 border-slate-950">
                Lvl {profile.faceit_level}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              {profile.personaname}
              <a href={`https://steamcommunity.com/profiles/${profile.steam_id}`} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
              </a>
            </h1>
            <div className="flex gap-4 mt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {profile.account_age_days}d antiguo
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> {profile.total_cs2_hours} hrs
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className={cn(
            "px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2",
            profile.vac_banned ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-green-500/10 border-green-500/50 text-green-500"
          )}>
            {profile.vac_banned ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            {profile.vac_banned ? "VAC Banned" : "Clean History"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Column */}
        <div className="lg:col-span-1 space-y-6">
          <RiskGauge probability={risk_analysis.probability} color={risk_analysis.color} />
          
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Señales de Alerta</h3>
            {risk_analysis.flags.map(flag => (
              <div key={flag.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    flag.severity === "HIGH" ? "bg-red-500" : flag.severity === "MEDIUM" ? "bg-orange-500" : "bg-blue-500"
                  )} />
                  <span className="font-bold text-white text-sm">{flag.title}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{flag.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard 
              title="K/D Ratio" 
              value={overall_stats.avg_kd.toFixed(2)} 
              subtext="Promedio global" 
              icon={TrendingUp}
              colorClass="text-blue-500"
            />
            <StatCard 
              title="Headshot %" 
              value={`${overall_stats.avg_hs_percent}%`} 
              subtext="Precisión letal" 
              icon={Target}
              colorClass="text-orange-500"
            />
            <StatCard 
              title="Impacto ADR" 
              value={overall_stats.avg_adr.toFixed(1)} 
              subtext="Daño por ronda" 
              icon={BarChart3}
              colorClass="text-purple-500"
            />
          </div>

          {/* Chart */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl h-[400px]">
            <h3 className="text-lg font-bold text-white mb-6">Progresión de Rendimiento</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="kd" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={<CustomDot />} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="hs" 
                  stroke="#f97316" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4 justify-center">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-3 h-0.5 bg-blue-500" /> K/D Ratio
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-3 h-0.5 bg-orange-500 border-t border-dashed" /> HS %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload.is_anomaly) {
    return (
      <Dot cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#ef4444" />
    );
  }
  return <Dot cx={cx} cy={cy} r={4} fill="#3b82f6" />;
};
