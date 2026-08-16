import React, { useState } from 'react';
import { StationData, AuthSession } from '../types/report';
import { Shield, Building2, UserCheck, Lock, ArrowRight, ShieldAlert, Sparkles, KeyRound, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  stations: StationData[];
  onLogin: (session: AuthSession) => void;
  onClose?: () => void;
  onOpenAboutModal?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ stations, onLogin, onClose, onOpenAboutModal }) => {
  const [activeTab, setActiveTab] = useState<'ADMIN' | 'PS_USER'>('ADMIN');
  const [selectedStationId, setSelectedStationId] = useState<string>(stations[0]?.id || 'ps-1');
  const [adminPin, setAdminPin] = useState<string>('');
  const [psPin, setPsPin] = useState<string>('');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);
  const [showPsPassword, setShowPsPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ADMIN_PASSWORD = 'Rahul@6216';
  const PS_PASSWORD = 'cctns@1234';

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (adminPin.trim() !== ADMIN_PASSWORD) {
      setErrorMessage(`अमान्य पासकोड! कृपया SSP Admin सही पासवर्ड दर्ज करें।`);
      return;
    }

    onLogin({
      role: 'ADMIN',
    });
  };

  const handlePSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (psPin.trim() !== PS_PASSWORD) {
      setErrorMessage(`अमान्य पासकोड! कृपया थाना पासवर्ड सही दर्ज करें।`);
      return;
    }

    const station = stations.find((s) => s.id === selectedStationId);
    if (!station) {
      setErrorMessage('कृपया मान्य थाना चुनें');
      return;
    }

    onLogin({
      role: 'PS_USER',
      stationId: station.id,
      stationName: station.fullName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-md overflow-y-auto no-print min-h-screen">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Brand Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 text-center border-b border-slate-800 relative">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-red-600 flex items-center justify-center p-0.5 shadow-xl shadow-amber-500/20 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center border border-amber-400/40">
              <Shield className="w-9 h-9 text-amber-400" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-[11px] font-bold text-amber-300 mb-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>CCTNS AYODHYA SECURE PORTAL</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            कार्यालय वरिष्ठ पुलिस अधीक्षक, जनपद अयोध्या
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            15 दिवसीय पाक्षिक गुमशुदा एवं अज्ञात शव पोर्टल - प्रवेश द्वार
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5">
          <button
            onClick={() => { setActiveTab('ADMIN'); setErrorMessage(null); }}
            className={`flex-1 py-3 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ADMIN'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SSP ADMIN लॉगिन</span>
          </button>

          <button
            onClick={() => { setActiveTab('PS_USER'); setErrorMessage(null); }}
            className={`flex-1 py-3 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'PS_USER'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>थाना (PS) लॉगिन</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6">
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/90 border border-red-600 text-red-200 text-xs rounded-xl flex items-center gap-2 font-medium">
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SSP ADMIN FORM */}
          {activeTab === 'ADMIN' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <UserCheck className="w-4 h-4" />
                  <span>वरिष्ठ पुलिस अधीक्षक / नोडल अधिकारी पासकोड पोर्टल</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  SSP Admin डैशबोर्ड खोलने के लिए आधिकारिक पासकोड दर्ज करें।
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  प्रशासक पासवर्ड (ADMIN PASSWORD) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    placeholder="पासवर्ड दर्ज करें"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    title={showAdminPassword ? "पासवर्ड छिपाएं" : "पासवर्ड देखें"}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.01]"
              >
                <span>SSP ADMIN लॉगिन करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* PS USER FORM */}
          {activeTab === 'PS_USER' && (
            <form onSubmit={handlePSSubmit} className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>थाना प्रभारी / सी०सी०टी०एन०एस० ऑपरेटर पोर्टल</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  अपना थाना एवं पासवर्ड दर्ज कर ड्यूटी फोटो कैप्चर एवं 15 दिवसीय सूचना सबमिट करें।
                </p>
              </div>

              {/* Station Select Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  थाना का चयन करें (Select Police Station) <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedStationId}
                  onChange={(e) => setSelectedStationId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id} className="bg-slate-900 text-white">
                      {st.fullName} ({st.code}) {st.submitted ? ' - GREEN ✓' : ' - RED ⏳'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  थाना पासवर्ड (PS PASSWORD) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPsPassword ? 'text' : 'password'}
                    required
                    placeholder="थाना पासवर्ड दर्ज करें"
                    value={psPin}
                    onChange={(e) => setPsPin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPsPassword(!showPsPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    title={showPsPassword ? "पासवर्ड छिपाएं" : "पासवर्ड देखें"}
                  >
                    {showPsPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all transform hover:scale-[1.01]"
              >
                <span>थाना लॉगिन & फोटो सत्यापन शुरू करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {onClose && (
            <div className="mt-4 pt-3 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                रद्द करें
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
          <span>CCTNS UP POLICE AYODHYA DISTRICT • SECURE AUTHENTICATION SYSTEM</span>
          {onOpenAboutModal && (
            <button
              type="button"
              onClick={onOpenAboutModal}
              className="text-amber-400 font-bold hover:underline"
            >
              हमारे बारे में (About Us)
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

