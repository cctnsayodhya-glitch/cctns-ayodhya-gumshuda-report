import React from 'react';
import { Shield, PhoneCall, Calendar, FileText, UserCheck, LogOut, Building2, Lock } from 'lucide-react';
import { DateRange, AuthSession } from '../types/report';

interface HeaderProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  completedCount: number;
  totalCount: number;
  authSession: AuthSession | null;
  onOpenNotificationModal: () => void;
  onOpenSSPReport: () => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dateRange,
  setDateRange,
  completedCount,
  totalCount,
  authSession,
  onOpenNotificationModal,
  onOpenSSPReport,
  onOpenLoginModal,
  onLogout,
}) => {
  const isAdmin = authSession?.role === 'ADMIN';
  const isPSUser = authSession?.role === 'PS_USER';

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Brand & Emblem */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-red-600 flex items-center justify-center p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center border border-amber-400/40">
                  <Shield className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900">
                UPP
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-red-900/60 text-red-300 text-xs font-semibold px-2 py-0.5 rounded border border-red-700/50">
                  CCTNS AYODHYA
                </span>
                <span className="bg-amber-900/40 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded border border-amber-700/50">
                  उत्तर प्रदेश पुलिस
                </span>

                {/* Role Badge Indicator */}
                {isAdmin && (
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>SSP ADMIN</span>
                  </span>
                )}

                {isPSUser && (
                  <span className="bg-blue-900/80 text-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-600 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-blue-400" />
                    <span>{authSession.stationName || 'थाना पोर्टल'}</span>
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                जनपद अयोध्या - 15 दिवसीय गुमशुदा एवं अज्ञात शव डैशबोर्ड
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>कार्यालय वरिष्ठ पुलिस अधीक्षक, जनपद अयोध्या</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">{totalCount} थाना सम्बद्ध</span>
              </p>
            </div>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Date Range Selector Pill */}
            <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={dateRange.fromDate}
                  onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
                  className="bg-transparent text-white font-medium text-center w-20 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1"
                  placeholder="15.07.2026"
                />
                <span className="text-slate-500">से</span>
                <input
                  type="text"
                  value={dateRange.toDate}
                  onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
                  className="bg-transparent text-white font-medium text-center w-20 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1"
                  placeholder="31.07.2026"
                />
              </div>
            </div>

            {/* Notification Direct Alert Trigger */}
            <button
              onClick={onOpenNotificationModal}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 rounded-lg text-xs font-semibold text-blue-200 transition-all shadow-sm hover:shadow-blue-500/20"
              title="Click to trigger notification dispatch"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span className="hidden sm:inline">CCTNS:</span>
              <strong className="text-white">9411626216</strong>
            </button>

            {/* SSP Report Trigger Button */}
            <button
              onClick={onOpenSSPReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md"
            >
              <FileText className="w-3.5 h-3.5 text-slate-950" />
              <span>SSP रिपोर्ट</span>
            </button>

            {/* Switch Role / Login Modal Trigger */}
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs border border-slate-700 transition-all"
              title="Switch role between SSP Admin and Police Station"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>लॉगिन / रोल बदलें</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
