import React from 'react';
import { Shield, PhoneCall, Calendar, FileText, UserCheck, Building2, Lock, Table, Info, Download } from 'lucide-react';
import { DateRange, AuthSession, StationData } from '../types/report';
import { GOOGLE_SHEET_URL, downloadSpreadsheetCSV } from '../utils/googleSheets';

interface HeaderProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  stations: StationData[];
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
  stations,
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
    <header className="bg-slate-900 border-b-2 border-red-800/80 sticky top-0 z-40 shadow-2xl no-print">
      {/* Top Police Red & Blue Ribbon Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-amber-500 to-blue-600" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Brand & Emblem */}
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="w-13 h-13 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-blue-600 flex items-center justify-center p-0.5 shadow-lg shadow-red-900/40">
                <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center border border-amber-400/60 relative overflow-hidden">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-red-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-slate-950 shadow">
                UPP
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-red-900/80 text-red-200 text-[11px] font-black px-2 py-0.5 rounded border border-red-600/70 shadow-sm">
                  CCTNS AYODHYA
                </span>
                <span className="bg-blue-900/70 text-blue-200 text-[11px] font-extrabold px-2 py-0.5 rounded border border-blue-600/60 shadow-sm">
                  उत्तर प्रदेश पुलिस
                </span>

                {/* Role Badge Indicator */}
                {isAdmin && (
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>SSP ADMIN</span>
                  </span>
                )}

                {isPSUser && (
                  <span className="bg-blue-900/90 text-blue-100 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-blue-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-blue-300" />
                    <span>{authSession.stationName || 'थाना पोर्टल'}</span>
                  </span>
                )}
              </div>

              <h1 className="text-base sm:text-xl font-black tracking-tight text-white mt-0.5">
                जनपद अयोध्या - 15 दिवसीय गुमशुदा एवं अज्ञात शव पोर्टल
              </h1>
            </div>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Date Range Selector Pill with all 4 manual format inputs */}
            <div className="flex flex-wrap items-center bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-slate-300 gap-1.5">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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

              <div className="flex items-center space-x-1 pl-1.5 border-l border-slate-800">
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

              <div className="hidden sm:flex items-center space-x-1 pl-1.5 border-l border-slate-800">
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

            {/* Direct CSV Spreadsheet Download Button with Headers */}
            <button
              onClick={() => downloadSpreadsheetCSV(stations, dateRange)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950 hover:bg-blue-900 border border-blue-600/80 rounded-lg text-xs font-bold text-blue-200 transition-all shadow-sm"
              title="Download 19 Police Stations CSV Spreadsheet with Header Row"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>CSV स्प्रेडशीट</span>
            </button>

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
