import React from 'react';
import { Shield, PhoneCall, Calendar, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { DateRange } from '../types/report';

interface HeaderProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  completedCount: number;
  totalCount: number;
  onOpenNotificationModal: () => void;
  onOpenSSPReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dateRange,
  setDateRange,
  completedCount,
  totalCount,
  onOpenNotificationModal,
  onOpenSSPReport
}) => {
  const isAllCompleted = completedCount === totalCount && totalCount > 0;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
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
              <div className="flex items-center space-x-2">
                <span className="bg-red-900/60 text-red-300 text-xs font-semibold px-2 py-0.5 rounded border border-red-700/50">
                  CCTNS AYODHYA
                </span>
                <span className="bg-amber-900/40 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded border border-amber-700/50">
                  उत्तर प्रदेश पुलिस
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                जनपद अयोध्या - 15 दिवसीय गुमशुदा एवं अज्ञात शव डैशबोर्ड
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>कार्यालय वरिष्ठ पुलिस अधीक्षक, जनपद अयोध्या</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">19 थाना सम्बद्ध</span>
              </p>
            </div>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Date Range Selector Pill */}
            <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={dateRange.fromDate}
                  onChange={(e) => setDateRange({ ...dateRange, fromDate: e.target.value })}
                  className="bg-transparent text-white font-medium text-center w-24 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1"
                  placeholder="15.07.2026"
                />
                <span className="text-slate-500">से</span>
                <input
                  type="text"
                  value={dateRange.toDate}
                  onChange={(e) => setDateRange({ ...dateRange, toDate: e.target.value })}
                  className="bg-transparent text-white font-medium text-center w-24 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1"
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
              <span>CCTNS: <strong className="text-white">9411626216</strong></span>
            </button>

            {/* SSP Report Trigger Button */}
            <button
              onClick={onOpenSSPReport}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md hover:shadow-amber-500/20"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>SSP जिला रिपोर्ट बनाएं</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
