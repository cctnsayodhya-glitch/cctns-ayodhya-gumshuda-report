import React, { useState } from 'react';
import { StationData, DateRange } from '../types/report';
import { X, Printer, Download, Share2, ShieldCheck, Edit3, Eye, FileCheck, Check } from 'lucide-react';

interface SSPReportViewProps {
  stations: StationData[];
  dateRange: DateRange;
  onClose: () => void;
  onSendAlert: () => void;
  onUpdateStationData: (updatedStations: StationData[]) => void;
}

export const SSPReportView: React.FC<SSPReportViewProps> = ({
  stations,
  dateRange,
  onClose,
  onSendAlert,
  onUpdateStationData,
}) => {
  const [includeSignatureAndDate, setIncludeSignatureAndDate] = useState<boolean>(false); // Default: Without sign & date as requested
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editableStations, setEditableStations] = useState<StationData[]>([...stations]);
  const [localDateRange, setLocalDateRange] = useState<DateRange>({ ...dateRange });

  // Handle cell edits in table
  const handleCellChange = (stationId: string, field: keyof StationData, value: any) => {
    const updated = editableStations.map((st) => {
      if (st.id === stationId) {
        return {
          ...st,
          [field]: value,
          submitted: true,
        };
      }
      return st;
    });
    setEditableStations(updated);
    onUpdateStationData(updated);
  };

  // Aggregate Calculations
  const totals = editableStations.reduce(
    (acc, st) => {
      acc.unknownBodiesMale += Number(st.unknownBodiesMale) || 0;
      acc.unknownBodiesFemale += Number(st.unknownBodiesFemale) || 0;
      acc.missingPersonsMale += Number(st.missingPersonsMale) || 0;
      acc.missingPersonsFemale += Number(st.missingPersonsFemale) || 0;
      acc.missingChildrenMale += Number(st.missingChildrenMale) || 0;
      acc.missingChildrenFemale += Number(st.missingChildrenFemale) || 0;
      return acc;
    },
    {
      unknownBodiesMale: 0,
      unknownBodiesFemale: 0,
      missingPersonsMale: 0,
      missingPersonsFemale: 0,
      missingChildrenMale: 0,
      missingChildrenFemale: 0,
    }
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-4">
        
        {/* Top Controls Toolbar */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>कार्यालय वरिष्ठ पुलिस अधीक्षक, जनपद अयोध्या - रिपोर्ट (Image 2 Format)</span>
              </h2>
              <p className="text-xs text-slate-400">
                समस्त 19 थानों की संकलित गुमशुदा एवं अज्ञात शव रिपोर्ट
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Toggle Signature & Date */}
            <label className="flex items-center space-x-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200 cursor-pointer hover:border-amber-500/60 transition-colors">
              <input
                type="checkbox"
                checked={includeSignatureAndDate}
                onChange={(e) => setIncludeSignatureAndDate(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded bg-slate-950 border-slate-700 focus:ring-amber-500"
              />
              <span className="font-semibold">
                {includeSignatureAndDate ? 'हस्ताक्षर एवं दिनांक सहित' : 'बिना हस्ताक्षर एवं दिनांक (Clean)'}
              </span>
            </label>

            {/* Toggle Edit Mode */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isEditMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isEditMode ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isEditMode ? 'संपादन पूर्ण करें (Done Editing)' : 'डेटा एडिट करें (Manual Edit)'}</span>
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>PDF / Print (एक ही PDF प्रपत्र)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* Printable Official Paper Container (Recreating Image 1 & Image 2 exact combined PDF page) */}
        <div className="p-4 sm:p-8 bg-slate-950 overflow-x-auto">
          
          <div className="bg-white text-slate-950 p-6 sm:p-10 rounded-lg shadow-2xl border border-slate-300 font-serif print-paper max-w-4xl mx-auto space-y-8">
            
            {/* PAGE 1: OFFICIAL COVER LETTER (Image 1 of second attachment) */}
            <div className="space-y-6">
              
              {/* Main Header Title */}
              <div className="text-center border-b-2 border-slate-900 pb-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-slate-950">
                  कार्यालय वरिष्ठ पुलिस अधीक्षक जनपद अयोध्या।
                </h1>
                <div className="flex flex-wrap justify-between items-center text-sm sm:text-base font-bold pt-3 text-slate-900 gap-2">
                  <div className="flex items-center gap-1">
                    <span>पत्र संख्या-</span>
                    <input
                      type="text"
                      value={localDateRange.letterNo}
                      onChange={(e) => setLocalDateRange({ ...localDateRange, letterNo: e.target.value })}
                      className="bg-amber-50 border border-slate-400 text-blue-900 font-bold text-center w-36 rounded px-1 text-xs sm:text-sm focus:outline-none"
                      placeholder="सी०गु०पा०/2026"
                      title="पत्र संख्या मैनुअल दर्ज करें"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>दिनांक-</span>
                    <input
                      type="text"
                      value={localDateRange.letterDate}
                      onChange={(e) => setLocalDateRange({ ...localDateRange, letterDate: e.target.value })}
                      className="bg-amber-50 border border-slate-400 text-blue-900 font-bold text-center w-28 rounded px-1 text-xs sm:text-sm focus:outline-none"
                      placeholder="01.08.2026"
                      title="पत्र दिनांक मैनुअल दर्ज करें"
                    />
                  </div>
                </div>
              </div>

              {/* Addressed To */}
              <div className="space-y-1 text-sm sm:text-base font-semibold leading-snug text-slate-900">
                <p>सेवा में,</p>
                <p className="pl-6 font-bold underline">श्रीमान पुलिस उपमहानिरीक्षक,</p>
                <p className="pl-6 font-bold underline">अयोध्या परिक्षेत्र, अयोध्या।</p>
              </div>

              {/* Letter Paragraphs */}
              <div className="text-sm sm:text-base leading-relaxed text-justify space-y-3 text-slate-900">
                <p className="indent-8">
                  कृपया अपने पत्र संख्या-सीसीटीएनएस-फीडिंग-2024 का संदर्भ ग्रहण करने का कष्ट करें, जिसके माध्यम से सी०सी०टी०एन०एस० पोर्टल पर अज्ञात शवों तथा गुमशुदा व्यक्तियों एवं बच्चों के सम्बन्ध में फीडिंग की अद्यावधिक स्थिति से अवगत कराते हुये कितनी फीडिंग की गयी है तथा कितनी शेष है के सम्बन्ध में वांछित सूचना उपलब्ध कराये जाने विषयक है।
                </p>
                <div className="indent-8 flex flex-wrap items-center gap-1">
                  <span>उपरोक्त सम्बन्ध में जनपद अयोध्या से दिनांक</span>
                  <input
                    type="text"
                    value={localDateRange.fromDate}
                    onChange={(e) => setLocalDateRange({ ...localDateRange, fromDate: e.target.value })}
                    className="bg-amber-50 border border-slate-400 text-blue-900 font-bold text-center w-28 rounded px-1 text-xs sm:text-sm focus:outline-none"
                    placeholder="15.07.2026"
                    title="प्रारम्भ दिनांक मैनुअल फॉर्मैट"
                  />
                  <span>से</span>
                  <input
                    type="text"
                    value={localDateRange.toDate}
                    onChange={(e) => setLocalDateRange({ ...localDateRange, toDate: e.target.value })}
                    className="bg-amber-50 border border-slate-400 text-blue-900 font-bold text-center w-28 rounded px-1 text-xs sm:text-sm focus:outline-none"
                    placeholder="31.07.2026"
                    title="अंतिम दिनांक मैनुअल फॉर्मैट"
                  />
                  <span>तक की सूचना प्रारूपानुसार निम्नवत् है –</span>
                </div>
              </div>

              {/* Table 1: Aggregate Summary Table (Exact replica of Image 1 top table) */}
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse border-2 border-slate-900 text-center text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b-2 border-slate-900 text-slate-900">
                      <th className="border border-slate-900 px-3 py-2 w-1/5">कमिश्नरेट/जोन</th>
                      <th className="border border-slate-900 px-3 py-2 w-1/6">जनपद</th>
                      <th className="border border-slate-900 px-2 py-2" colSpan={2}>अज्ञात शव</th>
                      <th className="border border-slate-900 px-2 py-2" colSpan={2}>गुमशुदा व्यक्ति</th>
                      <th className="border border-slate-900 px-2 py-2" colSpan={2}>
                        गुमशुदा बच्चों की<br/>संख्या
                      </th>
                      <th className="border border-slate-900 px-3 py-2 w-1/6">
                        शेष<br/>विवरण
                      </th>
                    </tr>
                    <tr className="bg-slate-50 font-bold border-b-2 border-slate-900 text-slate-800 text-[11px] sm:text-xs">
                      <th className="border border-slate-900"></th>
                      <th className="border border-slate-900"></th>
                      <th className="border border-slate-900 px-2 py-1">पुरुष</th>
                      <th className="border border-slate-900 px-2 py-1">महिला</th>
                      <th className="border border-slate-900 px-2 py-1">पुरुष</th>
                      <th className="border border-slate-900 px-2 py-1">महिला</th>
                      <th className="border border-slate-900 px-2 py-1">पुरुष</th>
                      <th className="border border-slate-900 px-2 py-1">महिला</th>
                      <th className="border border-slate-900"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-bold text-slate-900 text-sm sm:text-base">
                      <td className="border border-slate-900 px-2 py-3">लखनऊ/अयोध्या</td>
                      <td className="border border-slate-900 px-2 py-3">अयोध्या</td>
                      <td className="border border-slate-900 px-2 py-3">{totals.unknownBodiesMale}</td>
                      <td className="border border-slate-900 px-2 py-3">{totals.unknownBodiesFemale}</td>
                      <td className="border border-slate-900 px-2 py-3">{totals.missingPersonsMale}</td>
                      <td className="border border-slate-900 px-2 py-3">{totals.missingPersonsFemale}</td>
                      <td className="border border-slate-900 px-2 py-3">{totals.missingChildrenMale}</td>
                      <td className="border border-slate-900 px-2 py-3">{totals.missingChildrenFemale}</td>
                      <td className="border border-slate-900 px-2 py-3">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Enclosure & Signature Block */}
              <div className="flex justify-between items-start pt-6">
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  संलग्नक:- (01 वर्क)
                </div>
                
                <div className="text-right space-y-1 relative pr-2 min-w-[200px]">
                  
                  {/* Show Digital Stamp ONLY if includeSignatureAndDate is checked */}
                  {includeSignatureAndDate ? (
                    <div className="inline-block border border-blue-900/50 p-2 rounded bg-blue-50/50 text-left mb-1">
                      <p className="font-bold text-blue-950 text-xs">Vikas Rai</p>
                      <p className="text-[9px] text-blue-900 font-sans leading-none">Digitally signed by Vikas Rai</p>
                      <p className="text-[9px] text-blue-900 font-sans leading-none">Date: 2026.08.01 17:23:06 +05'30'</p>
                    </div>
                  ) : (
                    /* Blank space for physical seal/signature */
                    <div className="h-16" />
                  )}

                  <p className="font-bold text-slate-900 text-sm sm:text-base">
                    /वरिष्ठ पुलिस अधीक्षक
                  </p>
                  <p className="font-bold text-slate-900 text-sm sm:text-base">
                    जनपद अयोध्या।
                  </p>
                </div>
              </div>

            </div>

            {/* PAGE BREAK FOR MERGED SINGLE PDF */}
            <div className="page-break-before py-4 border-t-2 border-dashed border-slate-300 no-print text-center text-xs text-slate-400">
              --- पृष्ठ 2: समस्त 19 थानों का विवरण (Page 2 Breakdown Table) ---
            </div>

            {/* PAGE 2: 19 POLICE STATIONS DETAILED BREAKDOWN TABLE (Image 2 of second attachment) */}
            <div className="space-y-4 pt-2">
              
              <div className="text-center font-bold text-slate-950 underline text-sm sm:text-base leading-snug flex flex-wrap items-center justify-center gap-1">
                <span>दिनांक</span>
                <input
                  type="text"
                  value={localDateRange.fromDate}
                  onChange={(e) => setLocalDateRange({ ...localDateRange, fromDate: e.target.value })}
                  className="bg-amber-50 border border-slate-400 text-blue-900 font-bold text-center w-28 rounded px-1 text-xs sm:text-sm focus:outline-none"
                  placeholder="15.07.2026"
                  title="प्रारम्भ दिनांक"
                />
                <span>से</span>
                <input
                  type="text"
                  value={localDateRange.toDate}
                  onChange={(e) => setLocalDateRange({ ...localDateRange, toDate: e.target.value })}
                  className="bg-amber-50 border border-slate-400 text-blue-900 font-bold text-center w-28 rounded px-1 text-xs sm:text-sm focus:outline-none"
                  placeholder="31.07.2026"
                  title="अंतिम दिनांक"
                />
                <span>तक अज्ञात शव, गुमशुदा व्यक्ति, गुमशुदा बच्चों से सम्बन्धित सूचना जनपद अयोध्या</span>
              </div>

              {isEditMode && (
                <div className="p-2 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 font-sans font-semibold text-center no-print">
                  ✏️ मैन्युअल संपादन मोड सक्रिय है। आप नीचे दी गई तालिका में किसी भी थाने की संख्या बदल सकते हैं।
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-slate-900 text-center text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b-2 border-slate-900 text-slate-900">
                      <th className="border border-slate-900 px-3 py-2 w-1/4">थाना</th>
                      <th className="border border-slate-900 px-2 py-2" colSpan={2}>अज्ञात शव</th>
                      <th className="border border-slate-900 px-2 py-2" colSpan={2}>गुमशुदा व्यक्ति</th>
                      <th className="border border-slate-900 px-2 py-2" colSpan={2}>गुमशुदा बच्चों की संख्या</th>
                      <th className="border border-slate-900 px-3 py-2">शेष का विवरण</th>
                    </tr>
                    <tr className="bg-slate-50 font-bold border-b-2 border-slate-900 text-slate-800 text-[11px] sm:text-xs">
                      <th className="border border-slate-900"></th>
                      <th className="border border-slate-900 px-2 py-1">पुरुष</th>
                      <th className="border border-slate-900 px-2 py-1">महिला</th>
                      <th className="border border-slate-900 px-2 py-1">पुरुष</th>
                      <th className="border border-slate-900 px-2 py-1">महिला</th>
                      <th className="border border-slate-900 px-2 py-1">पुरुष</th>
                      <th className="border border-slate-900 px-2 py-1">महिला</th>
                      <th className="border border-slate-900"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableStations.map((st) => (
                      <tr key={st.id} className="border-b border-slate-900 font-medium text-slate-900">
                        
                        {/* Station Name */}
                        <td className="border border-slate-900 px-3 py-1.5 text-left font-semibold">
                          {st.name}
                        </td>

                        {/* Unknown Bodies Male */}
                        <td className="border border-slate-900 px-2 py-1">
                          {isEditMode ? (
                            <input
                              type="number"
                              min="0"
                              value={st.unknownBodiesMale}
                              onChange={(e) => handleCellChange(st.id, 'unknownBodiesMale', e.target.value)}
                              className="w-12 text-center font-bold bg-amber-50 border border-slate-400 rounded focus:ring-1 focus:ring-amber-500"
                            />
                          ) : (
                            st.unknownBodiesMale
                          )}
                        </td>

                        {/* Unknown Bodies Female */}
                        <td className="border border-slate-900 px-2 py-1">
                          {isEditMode ? (
                            <input
                              type="number"
                              min="0"
                              value={st.unknownBodiesFemale}
                              onChange={(e) => handleCellChange(st.id, 'unknownBodiesFemale', e.target.value)}
                              className="w-12 text-center font-bold bg-amber-50 border border-slate-400 rounded focus:ring-1 focus:ring-amber-500"
                            />
                          ) : (
                            st.unknownBodiesFemale
                          )}
                        </td>

                        {/* Missing Persons Male */}
                        <td className="border border-slate-900 px-2 py-1">
                          {isEditMode ? (
                            <input
                              type="number"
                              min="0"
                              value={st.missingPersonsMale}
                              onChange={(e) => handleCellChange(st.id, 'missingPersonsMale', e.target.value)}
                              className="w-12 text-center font-bold bg-blue-50 border border-slate-400 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            st.missingPersonsMale
                          )}
                        </td>

                        {/* Missing Persons Female */}
                        <td className="border border-slate-900 px-2 py-1">
                          {isEditMode ? (
                            <input
                              type="number"
                              min="0"
                              value={st.missingPersonsFemale}
                              onChange={(e) => handleCellChange(st.id, 'missingPersonsFemale', e.target.value)}
                              className="w-12 text-center font-bold bg-blue-50 border border-slate-400 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            st.missingPersonsFemale
                          )}
                        </td>

                        {/* Missing Children Male */}
                        <td className="border border-slate-900 px-2 py-1">
                          {isEditMode ? (
                            <input
                              type="number"
                              min="0"
                              value={st.missingChildrenMale}
                              onChange={(e) => handleCellChange(st.id, 'missingChildrenMale', e.target.value)}
                              className="w-12 text-center font-bold bg-purple-50 border border-slate-400 rounded focus:ring-1 focus:ring-purple-500"
                            />
                          ) : (
                            st.missingChildrenMale
                          )}
                        </td>

                        {/* Missing Children Female */}
                        <td className="border border-slate-900 px-2 py-1">
                          {isEditMode ? (
                            <input
                              type="number"
                              min="0"
                              value={st.missingChildrenFemale}
                              onChange={(e) => handleCellChange(st.id, 'missingChildrenFemale', e.target.value)}
                              className="w-12 text-center font-bold bg-purple-50 border border-slate-400 rounded focus:ring-1 focus:ring-purple-500"
                            />
                          ) : (
                            st.missingChildrenFemale
                          )}
                        </td>

                        {/* Remarks */}
                        <td className="border border-slate-900 px-2 py-1">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={st.remarks}
                              onChange={(e) => handleCellChange(st.id, 'remarks', e.target.value)}
                              className="w-16 text-center font-medium bg-slate-50 border border-slate-400 rounded focus:ring-1 focus:ring-slate-500"
                            />
                          ) : (
                            st.remarks || '0'
                          )}
                        </td>

                      </tr>
                    ))}

                    {/* GRAND TOTAL ROW: Kul Yog = (Exact match Image 2) */}
                    <tr className="bg-slate-200 font-black text-slate-950 text-sm sm:text-base border-t-2 border-slate-900">
                      <td className="border border-slate-900 px-3 py-2 text-left font-black">
                        कुल योग =
                      </td>
                      <td className="border border-slate-900 px-2 py-2">{totals.unknownBodiesMale}</td>
                      <td className="border border-slate-900 px-2 py-2">{totals.unknownBodiesFemale}</td>
                      <td className="border border-slate-900 px-2 py-2">{totals.missingPersonsMale}</td>
                      <td className="border border-slate-900 px-2 py-2">{totals.missingPersonsFemale}</td>
                      <td className="border border-slate-900 px-2 py-2">{totals.missingChildrenMale}</td>
                      <td className="border border-slate-900 px-2 py-2">{totals.missingChildrenFemale}</td>
                      <td className="border border-slate-900 px-2 py-2">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
