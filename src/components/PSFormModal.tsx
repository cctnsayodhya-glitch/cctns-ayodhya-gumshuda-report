import React, { useState } from 'react';
import { StationData, DateRange } from '../types/report';
import { X, CheckCircle, Printer, Save, Stamp, ShieldCheck } from 'lucide-react';

interface PSFormModalProps {
  station: StationData | null;
  dateRange: DateRange;
  onClose: () => void;
  onSave: (updatedStation: StationData) => void;
}

export const PSFormModal: React.FC<PSFormModalProps> = ({
  station,
  dateRange,
  onClose,
  onSave,
}) => {
  if (!station) return null;

  const [formData, setFormData] = useState<StationData>({ ...station });

  const handleChange = (field: keyof StationData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StationData = {
      ...formData,
      submitted: true,
      submittedAt: new Date().toLocaleString('hi-IN', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      submittedBy: `प्रभारी निरीक्षक ${formData.fullName}`,
    };
    onSave(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                थाना प्रपत्र रिपोर्ट (Image 1 format) - {formData.fullName}
              </h2>
              <p className="text-xs text-slate-400">
                15 दिवसीय पाक्षिक गुमशुदा एवं अज्ञात शव विवरण प्रपत्र
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Official Paper Area */}
        <div className="p-6 md:p-8 bg-slate-900 overflow-x-auto">
          <form onSubmit={handleSubmit} id="ps-submission-form">
            
            {/* The Official Printable Letterhead Card (Styled like Image 1) */}
            <div className="bg-white text-slate-950 p-8 rounded-lg shadow-xl border border-slate-300 font-serif print-paper">
              
              {/* Header Title Line */}
              <div className="text-center md:text-left mb-6">
                <p className="text-base md:text-lg font-bold underline leading-relaxed text-slate-900">
                  दिनांक <span className="font-semibold text-blue-900">{dateRange.fromDate}</span> से दिनांक <span className="font-semibold text-blue-900">{dateRange.toDate}</span> तक गुमशुदा, अज्ञात व्यक्तियों के सम्बन्ध में {formData.fullName} से सूचना निम्नवत है:-
                </p>
              </div>

              {/* Main Hindi Table matching Image 1 */}
              <div className="overflow-x-auto my-6">
                <table className="w-full border-collapse border-2 border-slate-900 text-center text-sm md:text-base">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold border-b-2 border-slate-900">
                      <th className="border border-slate-900 px-3 py-2.5 w-1/6">कमिश्नरेट/जोन</th>
                      <th className="border border-slate-900 px-3 py-2.5 w-1/5">जनपद</th>
                      <th className="border border-slate-900 px-2 py-2.5" colSpan={2}>
                        अज्ञात शव
                      </th>
                      <th className="border border-slate-900 px-2 py-2.5" colSpan={2}>
                        गुमशुदा व्यक्ति
                      </th>
                      <th className="border border-slate-900 px-2 py-2.5" colSpan={2}>
                        गुमशुदा बच्चों की संख्या
                      </th>
                      <th className="border border-slate-900 px-3 py-2.5 w-1/6">शेष विवरण</th>
                    </tr>
                    <tr className="bg-slate-50 text-slate-800 font-semibold border-b-2 border-slate-900 text-xs md:text-sm">
                      <th className="border border-slate-900 px-2 py-1"></th>
                      <th className="border border-slate-900 px-2 py-1"></th>
                      <th className="border border-slate-900 px-2 py-1 bg-amber-50">पुरुष</th>
                      <th className="border border-slate-900 px-2 py-1 bg-amber-50">महिला</th>
                      <th className="border border-slate-900 px-2 py-1 bg-blue-50">पुरुष</th>
                      <th className="border border-slate-900 px-2 py-1 bg-blue-50">महिला</th>
                      <th className="border border-slate-900 px-2 py-1 bg-purple-50">पुरुष</th>
                      <th className="border border-slate-900 px-2 py-1 bg-purple-50">महिला</th>
                      <th className="border border-slate-900 px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-slate-900 font-medium border-b border-slate-900">
                      
                      {/* Commissionrate / Zone */}
                      <td className="border border-slate-900 px-3 py-3 align-middle font-bold">
                        {formData.zone}
                      </td>

                      {/* District / PS Name */}
                      <td className="border border-slate-900 px-3 py-3 align-middle font-bold text-xs md:text-sm">
                        {formData.district}
                      </td>

                      {/* Unknown Bodies Male */}
                      <td className="border border-slate-900 p-1 align-middle bg-amber-50/50">
                        <input
                          type="number"
                          min="0"
                          value={formData.unknownBodiesMale}
                          onChange={(e) => handleChange('unknownBodiesMale', parseInt(e.target.value) || 0)}
                          className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </td>

                      {/* Unknown Bodies Female */}
                      <td className="border border-slate-900 p-1 align-middle bg-amber-50/50">
                        <input
                          type="number"
                          min="0"
                          value={formData.unknownBodiesFemale}
                          onChange={(e) => handleChange('unknownBodiesFemale', parseInt(e.target.value) || 0)}
                          className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </td>

                      {/* Missing Persons Male */}
                      <td className="border border-slate-900 p-1 align-middle bg-blue-50/50">
                        <input
                          type="number"
                          min="0"
                          value={formData.missingPersonsMale}
                          onChange={(e) => handleChange('missingPersonsMale', parseInt(e.target.value) || 0)}
                          className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* Missing Persons Female */}
                      <td className="border border-slate-900 p-1 align-middle bg-blue-50/50">
                        <input
                          type="number"
                          min="0"
                          value={formData.missingPersonsFemale}
                          onChange={(e) => handleChange('missingPersonsFemale', parseInt(e.target.value) || 0)}
                          className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>

                      {/* Missing Children Male */}
                      <td className="border border-slate-900 p-1 align-middle bg-purple-50/50">
                        <input
                          type="number"
                          min="0"
                          value={formData.missingChildrenMale}
                          onChange={(e) => handleChange('missingChildrenMale', parseInt(e.target.value) || 0)}
                          className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </td>

                      {/* Missing Children Female */}
                      <td className="border border-slate-900 p-1 align-middle bg-purple-50/50">
                        <input
                          type="number"
                          min="0"
                          value={formData.missingChildrenFemale}
                          onChange={(e) => handleChange('missingChildrenFemale', parseInt(e.target.value) || 0)}
                          className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </td>

                      {/* Remarks */}
                      <td className="border border-slate-900 p-1 align-middle">
                        <input
                          type="text"
                          value={formData.remarks}
                          onChange={(e) => handleChange('remarks', e.target.value)}
                          className="w-full text-center font-medium text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                          placeholder="निल"
                        />
                      </td>

                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Courtesy Line */}
              <div className="mt-8 mb-12 text-slate-900 font-medium">
                <p className="text-base">रिपोर्ट सादर सेवा मे प्रेषित है।</p>
              </div>

              {/* Inspector Seal & Signature Block (Matching Image 1) */}
              <div className="flex justify-end items-end pt-4">
                <div className="text-right space-y-2 relative pr-4">
                  
                  {/* Round Police Seal Graphic */}
                  <div className="absolute -left-32 -top-8 w-28 h-28 border-2 border-dashed border-blue-900 rounded-full flex flex-col items-center justify-center p-1 opacity-85 rotate-12 pointer-events-none">
                    <div className="w-full h-full border border-blue-900 rounded-full flex flex-col items-center justify-center text-blue-950 font-bold text-[9px] text-center leading-tight">
                      <span>★ {formData.name} ★</span>
                      <span className="text-[8px] my-0.5">उत्तर प्रदेश पुलिस</span>
                      <span>जनपद अयोध्या</span>
                    </div>
                  </div>

                  {/* Inspector Signature Graphic */}
                  <div className="font-serif italic font-bold text-blue-900 text-lg border-b border-blue-900 inline-block pb-0.5 px-4">
                    Sho. {dateRange.letterDate}
                  </div>

                  <p className="font-bold text-slate-900 text-sm leading-snug">
                    प्रभारी निरीक्षक
                  </p>
                  <p className="font-bold text-slate-900 text-sm leading-snug">
                    {formData.fullName}
                  </p>
                  <p className="font-bold text-slate-900 text-sm leading-snug">
                    जनपद अयोध्या
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs md:text-sm flex items-center gap-2 border border-slate-700 transition-all"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>प्रपत्र प्रिंट करें (Print Image 1)</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs md:text-sm transition-all"
                >
                  रद्द करें (Cancel)
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>फीडिंग जमा करें (Submit & Turn GREEN)</span>
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
