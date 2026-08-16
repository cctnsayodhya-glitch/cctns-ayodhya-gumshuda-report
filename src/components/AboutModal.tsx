import React from 'react';
import { X, Shield, UserCheck, PhoneCall, Building2, Sparkles, Code, Award, ExternalLink, Heart } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const creatorName = "Rahul Yadav";
  const mobileNo = "9411626216";
  const department = "CCTNS Cell Ayodhya";
  const hindiDepartment = "सी०सी०टी०एन०एस० सेल, जनपद अयोध्या";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto no-print">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 text-center border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-red-600 flex items-center justify-center p-0.5 shadow-xl shadow-amber-500/20 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center border border-amber-400/40">
              <Shield className="w-9 h-9 text-amber-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-[11px] font-bold text-amber-300 mb-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>PORTAL CREATOR & DEVELOPER</span>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">
            हमारे बारे में (About Us)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            CCTNS पाक्षिक गुमशुदा एवं अज्ञात शव पोर्टल जनपद अयोध्या
          </p>
        </div>

        {/* Creator Info Body */}
        <div className="p-6 space-y-5">
          
          {/* Main Creator Card */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 rounded-xl p-5 space-y-4 shadow-lg relative overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shrink-0">
                <UserCheck className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                  पोर्टल निर्माता (Developer & System Designer)
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {creatorName}
                </h3>
                <p className="text-xs text-slate-300 font-semibold flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{department} ({hindiDepartment})</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Phone Contact */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium block">संपर्क मोबाइल नंबर:</span>
                <a
                  href={`tel:${mobileNo}`}
                  className="font-mono text-sm font-bold text-amber-400 hover:underline flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>{mobileNo}</span>
                </a>
              </div>

              {/* Department Contact */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-medium block">सम्बद्ध इकाई:</span>
                <span className="font-semibold text-white block">
                  CCTNS CELL AYODHYA
                </span>
              </div>

            </div>
          </div>

          {/* About System Purpose */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span>पोर्टल उद्देश्य एवं विशेषताएं</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              यह पोर्टल जनपद अयोध्या के समस्त 19 थानों की 15 दिवसीय गुमशुदा व्यक्तियों तथा अज्ञात शवों की पाक्षिक रिपोर्ट CCTNS व्यवस्था के अंतर्गत त्वरित, पारदर्शी एवं सटीक संकलन हेतु विकसित किया गया है।
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${mobileNo}`}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>कॉल करें ({mobileNo})</span>
            </a>

            <a
              href={`https://wa.me/91${mobileNo}?text=${encodeURIComponent('नमस्ते Rahul Yadav जी, CCTNS पाक्षिक पोर्टल सम्बन्धी जानकारी हेतु संपर्क।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>WhatsApp मैसेज</span>
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
          <span>CREATED WITH EXCELLENCE BY</span>
          <strong className="text-amber-400">{creatorName}</strong>
          <span>• {department}</span>
        </div>

      </div>
    </div>
  );
};
