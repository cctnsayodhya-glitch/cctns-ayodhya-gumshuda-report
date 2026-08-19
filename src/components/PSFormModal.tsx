import React, { useState, useRef, useEffect } from 'react';
import { StationData, DateRange } from '../types/report';
import { 
  X, 
  CheckCircle, 
  Printer, 
  ShieldCheck, 
  Camera, 
  RefreshCw, 
  Upload, 
  Check, 
  AlertTriangle,
  BadgeCheck,
  Zap,
  Sparkles
} from 'lucide-react';

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
  const [localDateRange, setLocalDateRange] = useState<DateRange>({ ...dateRange });

  // Camera & Photo Capture States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(station.capturedPhoto || null);
  const [photoTimestamp, setPhotoTimestamp] = useState<string | null>(station.capturedPhotoTimestamp || null);

  // Initialize Camera Stream automatically if photo not yet captured
  useEffect(() => {
    if (!capturedPhoto) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn("Camera access failed:", err);
      setCameraError("कैमरा एक्सेस उपलब्ध नहीं है। कृपया 'फाइल से अपलोड' करें या 'डेमो फोटो' चुनें।");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture Photo with Timestamp Watermark
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Draw Video Frame to Canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Overlay Watermark Badge
    const timestampStr = new Date().toLocaleString('hi-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
    ctx.fillRect(0, canvas.height - 45, canvas.width, 45);

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`★ CCTNS AYODHYA • ${formData.fullName}`, 12, canvas.height - 25);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`TIME: ${timestampStr}`, 12, canvas.height - 8);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    setPhotoTimestamp(timestampStr);
    stopCamera();
  };

  // Generate Demo Duty Officer Snapshot
  const handleGenerateDemoPhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 640, 480);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    ctx.beginPath();
    ctx.arc(320, 200, 90, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👮', 320, 215);

    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(formData.fullName, 320, 310);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('CCTNS उत्तर प्रदेश पुलिस • जनपद अयोध्या', 320, 335);

    const timestampStr = new Date().toLocaleString('hi-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
    ctx.fillRect(0, 435, 640, 45);

    ctx.textAlign = 'left';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`★ DEMO SNAPSHOT • ${formData.fullName}`, 15, 455);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`VERIFIED AT: ${timestampStr}`, 15, 472);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);
    setPhotoTimestamp(timestampStr);
    stopCamera();
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setPhotoTimestamp(null);
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCapturedPhoto(result);
        const timestampStr = new Date().toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'medium' });
        setPhotoTimestamp(timestampStr);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: keyof StationData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionTime = new Date().toLocaleString('hi-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const updated: StationData = {
      ...formData,
      submitted: true,
      submittedAt: submissionTime,
      submittedBy: `प्रभारी निरीक्षक ${formData.fullName}`,
      capturedPhoto: capturedPhoto || undefined,
      capturedPhotoTimestamp: photoTimestamp || submissionTime,
    };
    onSave(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto no-print">
      <div className="relative w-full max-w-7xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden my-4">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-950 to-blue-950 px-6 py-3 border-b-2 border-amber-500/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0 shadow">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                <span>{formData.fullName} - पाक्षिक रिपोर्ट प्रपत्र (Live Data Filling View)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900 text-blue-200 border border-blue-500 font-mono font-bold">
                  {formData.code}
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                बाईं ओर लाइव फोटो सत्यापन एवं दाईं ओर प्रपत्र में लाइव डेटा प्रविष्ट करें।
              </p>
            </div>
          </div>

          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Hidden Canvas for Processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* SPLIT SCREEN MAIN CONTENT (Left: Live Camera Stream | Right: Live Form Paper & Table) */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/60">
          
          {/* LEFT COLUMN (5/12): LIVE CAMERA CAPTURE & VERIFICATION STREAM */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>चरण 1: ड्यूटी फोटो सत्यापन (Live Camera Stream)</span>
                </h3>
                {capturedPhoto ? (
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3 text-emerald-400" />
                    <span>सत्यापित</span>
                  </span>
                ) : (
                  <span className="bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    कैमरा लाइव
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                फीडिंग सबमिट करने से पूर्व ड्यूटी अधिकारी का लाइव फोटो लें।
              </p>
            </div>

            {/* Video Viewfinder or Captured Photo View */}
            <div className="relative w-full bg-slate-950 border-2 border-dashed border-slate-700 rounded-xl overflow-hidden shadow-2xl aspect-video flex flex-col items-center justify-center">
              
              {!capturedPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-3 left-3 bg-slate-950/90 px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 shadow">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>WEBCAM STREAM LIVE</span>
                  </div>

                  <div className="absolute bottom-3 inset-x-0 flex justify-center px-4">
                    <button
                      type="button"
                      onClick={handleCapturePhoto}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-xl transition-all transform hover:scale-105"
                    >
                      <Camera className="w-4 h-4" />
                      <span>📸 फोटो कैप्चर करें (Capture)</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                  <img
                    src={capturedPhoto}
                    alt="Duty Officer Verification"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-950/90 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/60 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    <span>फोटो सत्यापित</span>
                  </div>
                </div>
              )}

            </div>

            {cameraError && (
              <div className="p-2.5 bg-amber-950/60 border border-amber-600/60 text-amber-200 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Photo Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              {capturedPhoto ? (
                <button
                  type="button"
                  onClick={handleRetakePhoto}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>पुनः फोटो लें (Retake Photo)</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 w-full">
                  <label className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 border border-slate-700 cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>फाइल अपलोड</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={handleGenerateDemoPhoto}
                    className="py-2 px-3 bg-amber-950 hover:bg-amber-900 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-amber-700/60 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>डेमो फोटो</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN (7/12): LIVE FORM PAPER & DATA FEEDING TABLE */}
          <div className="lg:col-span-7 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Printable Official Paper Card (Updates Live as user types) */}
              <div className="bg-white text-slate-950 p-4 sm:p-6 rounded-2xl shadow-2xl border border-slate-300 font-serif print-paper space-y-4">
                
                <div className="border-b border-slate-300 pb-2">
                  <h3 className="font-sans font-black text-sm text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>चरण 2: 15 दिवसीय पाक्षिक रिपोर्ट प्रपत्र (Live Data Entry)</span>
                  </h3>
                </div>

                {/* Header Title Line with Manual Date Inputs */}
                <div className="text-center md:text-left bg-slate-50 p-2.5 rounded-lg border border-slate-300">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                    <span>दिनांक</span>
                    <input
                      type="text"
                      value={localDateRange.fromDate}
                      onChange={(e) => setLocalDateRange({ ...localDateRange, fromDate: e.target.value })}
                      className="bg-amber-50 border border-slate-400 text-blue-900 font-extrabold text-center w-24 rounded px-1 py-0.5 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      placeholder="15.07.2026"
                      title="प्रारम्भ दिनांक"
                    />
                    <span>से दिनांक</span>
                    <input
                      type="text"
                      value={localDateRange.toDate}
                      onChange={(e) => setLocalDateRange({ ...localDateRange, toDate: e.target.value })}
                      className="bg-amber-50 border border-slate-400 text-blue-900 font-extrabold text-center w-24 rounded px-1 py-0.5 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      placeholder="31.07.2026"
                      title="अंतिम दिनांक"
                    />
                    <span>तक गुमशुदा, अज्ञात व्यक्तियों के सम्बन्ध में {formData.fullName} से सूचना निम्नवत है:-</span>
                  </div>
                </div>

                {/* Main Live Feeding Table */}
                <div className="overflow-x-auto my-2">
                  <table className="w-full border-collapse border-2 border-slate-900 text-center text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold border-b-2 border-slate-900">
                        <th className="border border-slate-900 px-2 py-2 w-1/6">कमिश्नरेट/जोन</th>
                        <th className="border border-slate-900 px-2 py-2 w-1/5">जनपद</th>
                        <th className="border border-slate-900 px-1 py-2" colSpan={2}>
                          अज्ञात शव
                        </th>
                        <th className="border border-slate-900 px-1 py-2" colSpan={2}>
                          गुमशुदा व्यक्ति
                        </th>
                        <th className="border border-slate-900 px-1 py-2" colSpan={2}>
                          गुमशुदा बच्चों की संख्या
                        </th>
                        <th className="border border-slate-900 px-2 py-2 w-1/6">शेष विवरण</th>
                      </tr>
                      <tr className="bg-slate-50 text-slate-800 font-semibold border-b-2 border-slate-900 text-[11px] sm:text-xs">
                        <th className="border border-slate-900"></th>
                        <th className="border border-slate-900"></th>
                        <th className="border border-slate-900 px-1 py-1 bg-amber-50">पुरुष</th>
                        <th className="border border-slate-900 px-1 py-1 bg-amber-50">महिला</th>
                        <th className="border border-slate-900 px-1 py-1 bg-blue-50">पुरुष</th>
                        <th className="border border-slate-900 px-1 py-1 bg-blue-50">महिला</th>
                        <th className="border border-slate-900 px-1 py-1 bg-purple-50">पुरुष</th>
                        <th className="border border-slate-900 px-1 py-1 bg-purple-50">महिला</th>
                        <th className="border border-slate-900"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-slate-900 font-medium border-b border-slate-900">
                        
                        <td className="border border-slate-900 px-2 py-2.5 align-middle font-bold text-xs">
                          {formData.zone}
                        </td>

                        <td className="border border-slate-900 px-2 py-2.5 align-middle font-bold text-xs">
                          {formData.district}
                        </td>

                        {/* Interactive Data Inputs updating paper live */}
                        <td className="border border-slate-900 p-0.5 align-middle bg-amber-50/60">
                          <input
                            type="number"
                            min="0"
                            value={formData.unknownBodiesMale}
                            onChange={(e) => handleChange('unknownBodiesMale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-black text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-0.5 align-middle bg-amber-50/60">
                          <input
                            type="number"
                            min="0"
                            value={formData.unknownBodiesFemale}
                            onChange={(e) => handleChange('unknownBodiesFemale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-black text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-0.5 align-middle bg-blue-50/60">
                          <input
                            type="number"
                            min="0"
                            value={formData.missingPersonsMale}
                            onChange={(e) => handleChange('missingPersonsMale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-black text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-0.5 align-middle bg-blue-50/60">
                          <input
                            type="number"
                            min="0"
                            value={formData.missingPersonsFemale}
                            onChange={(e) => handleChange('missingPersonsFemale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-black text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-0.5 align-middle bg-purple-50/60">
                          <input
                            type="number"
                            min="0"
                            value={formData.missingChildrenMale}
                            onChange={(e) => handleChange('missingChildrenMale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-black text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-0.5 align-middle bg-purple-50/60">
                          <input
                            type="number"
                            min="0"
                            value={formData.missingChildrenFemale}
                            onChange={(e) => handleChange('missingChildrenFemale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-black text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-0.5 align-middle">
                          <input
                            type="text"
                            value={formData.remarks}
                            onChange={(e) => handleChange('remarks', e.target.value)}
                            className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-slate-500 focus:outline-none text-xs"
                            placeholder="निल"
                          />
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-slate-900 font-medium text-xs">
                  <p>रिपोर्ट सादर सेवा मे प्रेषित है।</p>
                </div>

                {/* Verification Photo Thumbnail & Seal Block */}
                <div className="flex flex-wrap items-end justify-between gap-3 pt-3 border-t border-slate-300">
                  
                  {/* Duty Photo Badge Thumbnail */}
                  {capturedPhoto ? (
                    <div className="flex items-center space-x-2.5 bg-slate-50 p-1.5 rounded-xl border border-slate-300">
                      <img
                        src={capturedPhoto}
                        alt="Captured Officer"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-400 shadow-sm"
                      />
                      <div className="text-[11px] font-sans">
                        <span className="font-bold text-emerald-700 block flex items-center gap-1">
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                          फोटो सत्यापन संलग्न
                        </span>
                        <span className="text-[9px] text-slate-600 font-mono block">
                          {photoTimestamp || 'सत्यापित'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-sans">
                      ⚠️ फोटो सत्यापन संलग्न करें
                    </div>
                  )}

                  {/* Stamp Signature Block */}
                  <div className="text-right space-y-0.5 relative pr-2">
                    <div className="font-serif italic font-bold text-blue-900 text-xs sm:text-sm border-b border-blue-900 inline-flex items-center justify-end gap-1 pb-0.5 px-2">
                      <span>Sho.</span>
                      <input
                        type="text"
                        value={localDateRange.letterDate}
                        onChange={(e) => setLocalDateRange({ ...localDateRange, letterDate: e.target.value })}
                        className="bg-amber-50/60 border border-slate-400 text-blue-900 font-bold text-center w-24 rounded px-1 focus:outline-none"
                        placeholder="01.08.2026"
                      />
                    </div>
                    <p className="font-bold text-slate-900 text-xs leading-snug">प्रभारी निरीक्षक</p>
                    <p className="font-bold text-slate-900 text-xs leading-snug">{formData.fullName}</p>
                  </div>

                </div>

              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>प्रिंट प्रपत्र (Print)</span>
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => { stopCamera(); onClose(); }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-all"
                  >
                    रद्द करें
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all transform hover:scale-[1.01]"
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
    </div>
  );
};
