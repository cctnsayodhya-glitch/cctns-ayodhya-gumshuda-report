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
  ArrowRight,
  ArrowLeft,
  BadgeCheck
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

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Photo capture, Step 2: Form feeding
  const [formData, setFormData] = useState<StationData>({ ...station });
  const [localDateRange, setLocalDateRange] = useState<DateRange>({ ...dateRange });

  // Camera & Photo Capture States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(station.capturedPhoto || null);
  const [photoTimestamp, setPhotoTimestamp] = useState<string | null>(station.capturedPhotoTimestamp || null);

  // Initialize Camera Stream for Step 1
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (step === 1 && !capturedPhoto) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [step]);

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
      setCameraError("कैमरा एक्सेस उपलब्ध नहीं है। कृपया 'फाइल अपलोड' बटन का उपयोग करें या डिफ़ॉल्ट सील का चयन करें।");
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

    ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
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

  // Generate Demo Duty Officer Snapshot for testing without physical webcam
  const handleGenerateDemoPhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 640, 480);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    // Draw Badge Shield
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

    // Watermark Overlay
    const timestampStr = new Date().toLocaleString('hi-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
    ctx.fillRect(0, 435, 640, 45);

    ctx.textAlign = 'left';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`★ DEMO WEBCAM SNAPSHOT • ${formData.fullName}`, 15, 455);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`VERIFIED AT: ${timestampStr}`, 15, 472);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);
    setPhotoTimestamp(timestampStr);
    stopCamera();
  };

  // Retake Photo
  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setPhotoTimestamp(null);
    startCamera();
  };

  // Fallback File Upload
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{formData.fullName} - पाक्षिक रिपोर्ट प्रपत्र</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700 font-mono">
                  {formData.code}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                चरण {step} / 2: {step === 1 ? 'अधिकारी लाइव ड्यूटी फोटो सत्यापन' : '15 दिवसीय सूचना तालिका भरें'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 py-2.5 items-center justify-between text-xs">
          <div className={`flex items-center gap-2 font-bold ${step === 1 ? 'text-amber-400' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step === 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
              1
            </span>
            <span>चरण 1: फोटो कैप्चर सत्यापन</span>
          </div>

          <div className="h-0.5 flex-1 bg-slate-800 mx-4 max-w-xs rounded-full">
            <div className={`h-full bg-amber-500 transition-all ${step === 2 ? 'w-full' : 'w-1/2'}`} />
          </div>

          <div className={`flex items-center gap-2 font-bold ${step === 2 ? 'text-emerald-400' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step === 2 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
              2
            </span>
            <span>चरण 2: 15 दिवसीय विवरण भरें</span>
          </div>
        </div>

        {/* STEP 1: PHOTO CAPTURE WORKFLOW */}
        {step === 1 && (
          <div className="p-6 md:p-8 space-y-6">
            
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span>प्रथम चरण: ड्यूटी प्रभारी फोटो सत्यापन (Automatic Camera Capture)</span>
              </h3>
              <p className="text-slate-400">
                फीडिंग जमा करने से पूर्व ड्यूटी अधिकारी का लाइव फोटो अथवा आधिकारिक पहचान फोटो कैप्चर करना अनिवार्य है।
              </p>
            </div>

            {/* Hidden Canvas for Frame Processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Video Preview or Captured Photo View */}
            <div className="relative max-w-lg mx-auto bg-slate-950 border-2 border-dashed border-slate-700 rounded-2xl overflow-hidden shadow-2xl aspect-video flex flex-col items-center justify-center">
              
              {!capturedPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Camera overlay watermark indicator */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>LIVE WEBCAM STREAM Active</span>
                  </div>

                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3 px-4">
                    <button
                      type="button"
                      onClick={handleCapturePhoto}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-xl transition-all transform hover:scale-105"
                    >
                      <Camera className="w-4 h-4" />
                      <span>📸 फोटो कैप्चर करें (Capture Photo)</span>
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
                    <span>फोटो सफलतापूर्वक सत्यापित (Captured)</span>
                  </div>
                </div>
              )}

            </div>

            {cameraError && (
              <div className="p-3 bg-amber-950/50 border border-amber-600/60 text-amber-200 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Action Bar for Step 1 */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              
              <div className="flex flex-wrap items-center gap-2">
                {capturedPhoto ? (
                  <button
                    type="button"
                    onClick={handleRetakePhoto}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>पुनः फोटो लें (Retake)</span>
                  </button>
                ) : (
                  <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>गैलरी / फाइल से फोटो चुनें</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { stopCamera(); onClose(); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 font-medium rounded-xl text-xs transition-all"
                >
                  रद्द करें
                </button>

                <button
                  type="button"
                  onClick={() => { stopCamera(); setStep(2); }}
                  disabled={!capturedPhoto && !station.submitted}
                  className={`px-6 py-2.5 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                    capturedPhoto || station.submitted
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>अगला चरण: 15 दिवसीय सूचना भरें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* STEP 2: REPORT FEEDING DATA TABLE */}
        {step === 2 && (
          <div className="p-6 md:p-8 bg-slate-900 overflow-x-auto">
            <form onSubmit={handleSubmit}>
              
              {/* Printable Official Paper Card */}
              <div className="bg-white text-slate-950 p-6 md:p-8 rounded-lg shadow-xl border border-slate-300 font-serif print-paper space-y-6">
                
                {/* Header Title Line with Manual Date Inputs */}
                <div className="text-center md:text-left bg-slate-50/80 p-2.5 rounded-lg border border-slate-300">
                  <div className="flex flex-wrap items-center gap-1.5 text-sm md:text-base font-bold text-slate-900 leading-relaxed">
                    <span>दिनांक</span>
                    <input
                      type="text"
                      value={localDateRange.fromDate}
                      onChange={(e) => setLocalDateRange({ ...localDateRange, fromDate: e.target.value })}
                      className="bg-amber-50 border border-slate-400 text-blue-900 font-extrabold text-center w-28 rounded px-1.5 py-0.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="15.07.2026"
                      title="गुमशुदा अवधि प्रारम्भ दिनांक (Manual Date)"
                    />
                    <span>से दिनांक</span>
                    <input
                      type="text"
                      value={localDateRange.toDate}
                      onChange={(e) => setLocalDateRange({ ...localDateRange, toDate: e.target.value })}
                      className="bg-amber-50 border border-slate-400 text-blue-900 font-extrabold text-center w-28 rounded px-1.5 py-0.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="31.07.2026"
                      title="गुमशुदा अवधि अंतिम दिनांक (Manual Date)"
                    />
                    <span>तक गुमशुदा, अज्ञात व्यक्तियों के सम्बन्ध में {formData.fullName} से सूचना निम्नवत है:-</span>
                  </div>
                </div>

                {/* Main Feeding Table */}
                <div className="overflow-x-auto my-4">
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
                        
                        <td className="border border-slate-900 px-3 py-3 align-middle font-bold">
                          {formData.zone}
                        </td>

                        <td className="border border-slate-900 px-3 py-3 align-middle font-bold text-xs md:text-sm">
                          {formData.district}
                        </td>

                        {/* Inputs */}
                        <td className="border border-slate-900 p-1 align-middle bg-amber-50/50">
                          <input
                            type="number"
                            min="0"
                            value={formData.unknownBodiesMale}
                            onChange={(e) => handleChange('unknownBodiesMale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-1 align-middle bg-amber-50/50">
                          <input
                            type="number"
                            min="0"
                            value={formData.unknownBodiesFemale}
                            onChange={(e) => handleChange('unknownBodiesFemale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-1 align-middle bg-blue-50/50">
                          <input
                            type="number"
                            min="0"
                            value={formData.missingPersonsMale}
                            onChange={(e) => handleChange('missingPersonsMale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-1 align-middle bg-blue-50/50">
                          <input
                            type="number"
                            min="0"
                            value={formData.missingPersonsFemale}
                            onChange={(e) => handleChange('missingPersonsFemale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-1 align-middle bg-purple-50/50">
                          <input
                            type="number"
                            min="0"
                            value={formData.missingChildrenMale}
                            onChange={(e) => handleChange('missingChildrenMale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          />
                        </td>

                        <td className="border border-slate-900 p-1 align-middle bg-purple-50/50">
                          <input
                            type="number"
                            min="0"
                            value={formData.missingChildrenFemale}
                            onChange={(e) => handleChange('missingChildrenFemale', parseInt(e.target.value) || 0)}
                            className="w-full text-center font-bold text-slate-900 bg-white border border-slate-400 rounded py-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          />
                        </td>

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

                <div className="text-slate-900 font-medium">
                  <p className="text-base">रिपोर्ट सादर सेवा मे प्रेषित है।</p>
                </div>

                {/* Verification Photo Thumbnail & Seal Block */}
                <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-slate-300">
                  
                  {/* Duty Photo Badge */}
                  {capturedPhoto ? (
                    <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-300">
                      <img
                        src={capturedPhoto}
                        alt="Captured Officer"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-400 shadow-md"
                      />
                      <div className="text-xs font-sans">
                        <span className="font-bold text-emerald-700 block flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                          ड्यूटी अधिकारी फोटो सत्यापन
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono block">
                          {photoTimestamp || 'सत्यापित'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 font-sans">
                      ⚠️ फोटो सत्यापन संलग्न नहीं है
                    </div>
                  )}

                  {/* Stamp Signature Block with Manual Date */}
                  <div className="text-right space-y-1 relative pr-4">
                    <div className="font-serif italic font-bold text-blue-900 text-base md:text-lg border-b border-blue-900 inline-flex items-center justify-end gap-1 pb-0.5 px-2">
                      <span>Sho.</span>
                      <input
                        type="text"
                        value={localDateRange.letterDate}
                        onChange={(e) => setLocalDateRange({ ...localDateRange, letterDate: e.target.value })}
                        className="bg-amber-50/60 border border-slate-400 text-blue-900 font-bold text-center w-28 rounded px-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="01.08.2026"
                        title="थाना प्रपत्र दिनांक (Manual Date)"
                      />
                    </div>
                    <p className="font-bold text-slate-900 text-sm leading-snug">प्रभारी निरीक्षक</p>
                    <p className="font-bold text-slate-900 text-sm leading-snug">{formData.fullName}</p>
                    <p className="font-bold text-slate-900 text-sm leading-snug">जनपद अयोध्या</p>
                  </div>

                </div>

              </div>

              {/* Step 2 Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>चरण 1: फोटो बदलें</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all"
                  >
                    <Printer className="w-4 h-4 text-slate-400" />
                    <span>प्रिंट प्रपत्र</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-all"
                  >
                    रद्द करें
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>फीडिंग जमा करें (Submit & Turn GREEN)</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
