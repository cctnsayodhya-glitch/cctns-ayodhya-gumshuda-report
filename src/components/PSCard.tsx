import React from 'react';
import { StationData } from '../types/report';
import { CheckCircle2, Clock, FileEdit, AlertCircle, Eye, Check } from 'lucide-react';

interface PSCardProps {
  station: StationData;
  onOpenForm: (station: StationData) => void;
  onQuickToggleStatus: (stationId: string) => void;
}

export const PSCard: React.FC<PSCardProps> = ({
  station,
  onOpenForm,
  onQuickToggleStatus
}) => {
  const isGreen = station.submitted;
  const totalCases = 
    station.unknownBodiesMale + 
    station.unknownBodiesFemale + 
    station.missingPersonsMale + 
    station.missingPersonsFemale + 
    station.missingChildrenMale + 
    station.missingChildrenFemale;

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isGreen
          ? 'bg-slate-900/90 border-emerald-500/70 shadow-lg shadow-emerald-950/40 hover:border-emerald-400'
          : 'bg-slate-900/80 border-red-500/70 shadow-lg shadow-red-950/40 hover:border-red-400'
      }`}
    >
      {/* Top Status Header Ribbon */}
      <div className={`px-4 py-2 flex items-center justify-between text-xs font-bold ${
        isGreen ? 'bg-emerald-950/90 text-emerald-300 border-b border-emerald-800/60' : 'bg-red-950/90 text-red-300 border-b border-red-800/60'
      }`}>
        <div className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${isGreen ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-red-500 animate-ping'}`} />
          <span className="uppercase tracking-wider">
            {isGreen ? 'फीडिंग पूर्ण (COMPLETED)' : 'फीडिंग लंबित (PENDING)'}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
          isGreen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
        }`}>
          {isGreen ? 'GREEN' : 'RED'}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* PS Title & Code */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
              {station.name}
            </h3>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
              {station.code}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{station.fullName}</p>
        </div>

        {/* Stats Preview Box */}
        {isGreen ? (
          <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-800 text-xs space-y-1.5">
            <div className="grid grid-cols-3 text-center gap-1">
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">अज्ञात शव</span>
                <span className="font-bold text-amber-400 text-sm">
                  {station.unknownBodiesMale + station.unknownBodiesFemale}
                </span>
                <span className="text-[9px] text-slate-500 block">({station.unknownBodiesMale}M/{station.unknownBodiesFemale}F)</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">गुमशुदा</span>
                <span className="font-bold text-blue-400 text-sm">
                  {station.missingPersonsMale + station.missingPersonsFemale}
                </span>
                <span className="text-[9px] text-slate-500 block">({station.missingPersonsMale}M/{station.missingPersonsFemale}F)</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">बच्चे</span>
                <span className="font-bold text-purple-400 text-sm">
                  {station.missingChildrenMale + station.missingChildrenFemale}
                </span>
                <span className="text-[9px] text-slate-500 block">({station.missingChildrenMale}M/{station.missingChildrenFemale}F)</span>
              </div>
            </div>

            {station.submittedAt && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {station.submittedAt}
                </span>
                <span className="text-emerald-400 font-medium">सत्यापित</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-950/30 rounded-lg p-3 border border-red-900/40 text-center space-y-1">
            <AlertCircle className="w-5 h-5 text-red-400 mx-auto animate-bounce" />
            <p className="text-xs font-medium text-red-200">सूचना दर्ज करना बाकी है</p>
            <p className="text-[10px] text-red-300/70">15 दिवसीय पाक्षिक रिपोर्ट तुरंत भरें</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onOpenForm(station)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
              isGreen
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-900/30'
            }`}
          >
            {isGreen ? (
              <>
                <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                <span>रिपोर्ट देखें / संशोधन</span>
              </>
            ) : (
              <>
                <FileEdit className="w-3.5 h-3.5 text-white" />
                <span>पत्र प्रपत्र भरें (Fill Form)</span>
              </>
            )}
          </button>

          {/* Quick toggle checkmark */}
          <button
            onClick={() => onQuickToggleStatus(station.id)}
            title={isGreen ? "Mark as Pending (लाल करें)" : "Mark as Filled (हरा करें)"}
            className={`p-2 rounded-lg border transition-all ${
              isGreen
                ? 'bg-emerald-950 text-emerald-400 border-emerald-700/60 hover:bg-red-950 hover:text-red-400 hover:border-red-700'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-950 hover:text-emerald-400 hover:border-emerald-700'
            }`}
          >
            <Check className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
