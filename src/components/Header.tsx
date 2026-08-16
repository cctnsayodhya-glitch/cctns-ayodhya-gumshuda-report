import React from 'react';
import { Shield, PhoneCall, Calendar, FileText, UserCheck, Building2, Lock, Table, Info } from 'lucide-react';
import { DateRange, AuthSession } from '../types/report';
import { GOOGLE_SHEET_URL } from '../utils/googleSheets';

interface HeaderProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  completedCount: number;
  totalCount: number;
  authSession: AuthSession | null;
  onOpenNotificationModal: () => void;
  onOpenSSPReport: () => void;
  onOpenLoginModal: () => void;
  onOpenAboutModal: () => void;
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
  onOpenAboutModal,
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
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Date Range Selector Pill with all 4 manual format inputs */}
            <div className="flex flex-wrap items-center bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 gap-2">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">अवधि:</span>
                <input
                  type="text"
                  value={dateRange.fromDate}
                  onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
                  className="bg-slate-900 border border-slate-700 text-white font-medium text-center w-20 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 text-xs"
                  placeholder="15.07.2026"
                  title="गुमशुदा अवधि प्रारम्भ दिनांक (Manual Date)"
                />
                <span className="text-slate-500 text-[11px]">से</span>
                <input
                  type="text"
                  value={dateRange.toDate}
                  onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
                  className="bg-slate-900 border border-slate-700 text-white font-medium text-center w-20 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 text-xs"
                  placeholder="31.07.2026"
                  title="गुमशुदा अवधि अंतिम दिनांक (Manual Date)"
                />
              </div>

              <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
                <span className="text-[10px] font-bold text-amber-400 uppercase">पत्र तिथि:</span>
                <input
                  type="text"
                  value={dateRange.letterDate}
                  onChange={(e) => setDateRange({ ...dateRange, letterDate: e.target.value })}
                  className="bg-slate-900 border border-slate-700 text-white font-medium text-center w-20 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 text-xs"
                  placeholder="01.08.2026"
                  title="रिपोर्ट पत्र दिनांक (Manual Date)"
                />
              </div>

              <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-slate-800">
                <span className="text-[10px] font-bold text-blue-400 uppercase">पत्र सं०:</span>
                <input
                  type="text"
                  value={dateRange.letterNo}
                  onChange={(e) => setDateRange({ ...dateRange, letterNo: e.target.value })}
                  className="bg-slate-900 border border-slate-700 text-white font-medium text-center w-24 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 text-xs"
                  placeholder="सी०गु०पा०/2026"
                  title="पत्र संख्या"
                />
              </div>
            </div>

            {/* Google Sheets Link Button */}
            <a
              href={GOOGLE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/70 rounded-lg text-xs font-bold text-emerald-300 transition-all shadow-sm"
              title="Open Google Sheet Data Sync"
            >
              <Table className="w-3.5 h-3.5 text-emerald-400" />
              <span>गूगल शीट</span>
            </a>

            {/* Notification Direct Alert Trigger */}
            <button
              onClick={onOpenNotificationModal}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 rounded-lg text-xs font-semibold text-blue-200 transition-all shadow-sm"
              title="Click to trigger notification dispatch"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
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

            {/* About Us Creator Info Button */}
            <button
              onClick={onOpenAboutModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg text-xs border border-amber-500/40 transition-all shadow-sm"
              title="About Us - Creator Info (Rahul Yadav, CCTNS Cell Ayodhya)"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>हमारे बारे में</span>
            </button>

            {/* Switch Role / Logout Trigger */}
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs border border-slate-700 transition-all"
              title="Switch role between SSP Admin and Police Station"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>लॉगिन / रोल</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
