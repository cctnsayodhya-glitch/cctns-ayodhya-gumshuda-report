import React, { useState } from 'react';
import { StationData, DateRange, AuthSession } from '../types/report';
import { PSCard } from './PSCard';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Zap, 
  RotateCcw, 
  FileText, 
  PhoneCall, 
  BellRing,
  Users,
  Building2,
  UserCheck,
  Lock,
  Camera
} from 'lucide-react';

interface DashboardProps {
  stations: StationData[];
  dateRange: DateRange;
  authSession: AuthSession | null;
  onOpenForm: (station: StationData) => void;
  onQuickToggleStatus: (stationId: string) => void;
  onAutoFillAll: () => void;
  onResetAll: () => void;
  onOpenSSPReport: () => void;
  onOpenNotificationModal: () => void;
  onOpenLoginModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stations,
  dateRange,
  authSession,
  onOpenForm,
  onQuickToggleStatus,
  onAutoFillAll,
  onResetAll,
  onOpenSSPReport,
  onOpenNotificationModal,
  onOpenLoginModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'GREEN' | 'RED'>('ALL');

  const isAdmin = authSession?.role === 'ADMIN';
  const isPSUser = authSession?.role === 'PS_USER';

  // Calculated Stats
  const totalStations = stations.length;
  const completedCount = stations.filter((s) => s.submitted).length;
  const pendingCount = totalStations - completedCount;
  const is100PercentCompleted = completedCount === totalStations && totalStations > 0;

  const myStation = isPSUser ? stations.find((s) => s.id === authSession.stationId) : null;

  const totals = stations.reduce(
    (acc, st) => {
      acc.unknownBodies += st.unknownBodiesMale + st.unknownBodiesFemale;
      acc.missingPersons += st.missingPersonsMale + st.missingPersonsFemale;
      acc.missingChildren += st.missingChildrenMale + st.missingChildrenFemale;
      return acc;
    },
    { unknownBodies: 0, missingPersons: 0, missingChildren: 0 }
  );

  // Filtered List
  const filteredStations = stations.filter((st) => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          st.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === 'GREEN') return matchesSearch && st.submitted;
    if (statusFilter === 'RED') return matchesSearch && !st.submitted;
    return matchesSearch;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 no-print">
      
      {/* PS USER DASHBOARD FOCUS BANNER */}
      {isPSUser && myStation && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 rounded-2xl border-2 border-blue-500/70 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-blue-900/80 border-2 border-blue-400 flex items-center justify-center shrink-0 shadow-lg">
                <Building2 className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-blue-900/80 text-blue-200 rounded-full border border-blue-500/60 text-xs font-black uppercase tracking-wider mb-1">
                  <span>थाना यूजर सम्बद्ध: {myStation.fullName}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {myStation.fullName} ({myStation.code}) - 15 दिवसीय पाषिक प्रपत्र
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  स्थिति: {myStation.submitted ? <strong className="text-emerald-400">फीडिंग पूर्ण (GREEN ✓)</strong> : <strong className="text-red-400">फीडिंग बाकी (RED ⏳)</strong>}
                  {myStation.capturedPhoto && ' • फोटो सत्यापित 📷'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenForm(myStation)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all transform hover:scale-105"
              >
                <Camera className="w-4 h-4" />
                <span>{myStation.submitted ? 'संशोधन / फोटो बदलें' : 'Step 1: फोटो लें & रिपोर्ट भरें'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GREEN BLINK ALERT BANNER - Triggered when all 19 PS complete submission */}
      {is100PercentCompleted && (
        <div className="rounded-2xl p-6 border-2 border-emerald-400 green-blink-active text-white shadow-2xl relative overflow-hidden transition-all">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-emerald-900/80 border-2 border-emerald-300 flex items-center justify-center shrink-0 shadow-lg animate-pulse">
                <BellRing className="w-9 h-9 text-emerald-200" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/90 text-emerald-200 rounded-full border border-emerald-300/60 text-xs font-black uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  GREEN BLINK ALERT: 19/19 THANA FEEDING COMPLETE!
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  बधाई! जनपद अयोध्या के समस्त 19 थानों की 15 दिवसीय सूचना दर्ज हो चुकी है!
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium">
                  सभी थानों की स्थिति <strong>GREEN (फीडिंग पूर्ण)</strong> हो गई है। संकलित SSP रिपोर्ट तैयार है।
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={onOpenNotificationModal}
                className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg border border-blue-400 transition-all transform hover:scale-105"
              >
                <PhoneCall className="w-4 h-4 text-blue-300 animate-bounce" />
                <span>CCTNS 9411626216 पर अलर्ट भेजें</span>
              </button>

              <button
                onClick={onOpenSSPReport}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg border border-amber-400 transition-all transform hover:scale-105"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>SSP जिला रिपोर्ट देखें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total PS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>कुल थाने</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{totalStations}</span>
            <span className="text-[10px] text-slate-500 font-mono">100%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-400 h-full w-full" />
          </div>
        </div>

        {/* GREEN Submitted PS */}
        <div className="bg-slate-900/90 border border-emerald-800/60 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
            <span>फीडिंग पूर्ण (GREEN)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">{completedCount}</span>
            <span className="text-[10px] text-emerald-500 font-mono">
              {Math.round((completedCount / totalStations) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-400 h-full transition-all duration-500" 
              style={{ width: `${(completedCount / totalStations) * 100}%` }}
            />
          </div>
        </div>

        {/* RED Pending PS */}
        <div className="bg-slate-900/90 border border-red-800/60 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-400 text-xs font-semibold">
            <span>फीडिंग बाकी (RED)</span>
            <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-red-400">{pendingCount}</span>
            <span className="text-[10px] text-red-500 font-mono">
              {Math.round((pendingCount / totalStations) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-red-500 h-full transition-all duration-500" 
              style={{ width: `${(pendingCount / totalStations) * 100}%` }}
            />
          </div>
        </div>

        {/* Total Unknown Bodies */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="text-slate-400 text-xs font-semibold">कुल अज्ञात शव</div>
          <div className="mt-2 text-2xl font-bold text-amber-400">
            {totals.unknownBodies}
          </div>
          <span className="text-[10px] text-slate-500 mt-1">पुरुष एवं महिला योग</span>
        </div>

        {/* Total Missing Persons */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="text-slate-400 text-xs font-semibold">कुल गुमशुदा व्यक्ति</div>
          <div className="mt-2 text-2xl font-bold text-blue-400">
            {totals.missingPersons}
          </div>
          <span className="text-[10px] text-slate-500 mt-1">पुरुष एवं महिला योग</span>
        </div>

        {/* Total Missing Children */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="text-slate-400 text-xs font-semibold">गुमशुदा बच्चे</div>
          <div className="mt-2 text-2xl font-bold text-purple-400">
            {totals.missingChildren}
          </div>
          <span className="text-[10px] text-slate-500 mt-1">बालक एवं बालिका योग</span>
        </div>

      </div>

      {/* Control Toolbar: Filters, Demo Auto-Fill, and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="थाना खोजें (Search PS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 w-full md:w-auto justify-center">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            सभी 19 थाना ({totalStations})
          </button>
          <button
            onClick={() => setStatusFilter('GREEN')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'GREEN'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>फीड पूर्ण GREEN ({completedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('RED')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'RED'
                ? 'bg-red-950 text-red-300 border border-red-700'
                : 'text-slate-400 hover:text-red-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>शेष RED ({pendingCount})</span>
          </button>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={onAutoFillAll}
            className="flex-1 md:flex-none px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition-all"
            title="Auto fill all 19 PS to trigger 100% Green Blink Alert state"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>सभी 19 थाना हरा करें (Auto Fill All 19)</span>
          </button>

          <button
            onClick={onResetAll}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 transition-colors"
            title="Reset All Submissions"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Grid of 19 Police Station Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredStations.map((station) => (
          <PSCard
            key={station.id}
            station={station}
            authSession={authSession}
            onOpenForm={onOpenForm}
            onQuickToggleStatus={onQuickToggleStatus}
          />
        ))}
      </div>

      {filteredStations.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 space-y-2">
          <Search className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="font-semibold text-sm">कोई भी थाना नहीं मिला</p>
          <p className="text-xs text-slate-500">कृपया सर्च या फ़िल्टर बदलकर पुनः प्रयास करें</p>
        </div>
      )}

    </main>
  );
};
