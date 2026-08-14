import React, { useState } from 'react';
import { NotificationLog, StationData, DateRange } from '../types/report';
import { X, PhoneCall, Send, MessageSquare, CheckCircle2, History, AlertTriangle } from 'lucide-react';

interface NotificationModalProps {
  stations: StationData[];
  dateRange: DateRange;
  logs: NotificationLog[];
  onClose: () => void;
  onSendNotification: (log: NotificationLog) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  stations,
  dateRange,
  logs,
  onClose,
  onSendNotification,
}) => {
  const completedCount = stations.filter((s) => s.submitted).length;
  const is100Percent = completedCount === stations.length && stations.length > 0;
  const targetPhone = '9411626216';

  const defaultMessage = is100Percent
    ? `[CCTNS AYODHYA COMPLETE ALERT] 🚨\nसमस्त 19 थानों की 15 दिवसीय पाक्षिक गुमशुदा एवं अज्ञात शव रिपोर्ट (अवधि: ${dateRange.fromDate} से ${dateRange.toDate}) सफलता पूर्वक CCTNS पोर्टल पर फीड हो चुकी है।\nवरिष्ठ पुलिस अधीक्षक जनपद अयोध्या की रिपोर्ट जारी की जा चुकी है।`
    : `[CCTNS AYODHYA ALERT]\nजनपद अयोध्या 15 दिवसीय गुमशुदा रिपोर्ट स्थिति: ${completedCount}/${stations.length} थानों की फीडिंग पूर्ण। ${stations.length - completedCount} थाने लंबित (RED) हैं।`;

  const [message, setMessage] = useState(defaultMessage);
  const [lastSent, setLastSent] = useState<string | null>(null);

  const handleSimulatedSend = (type: 'SMS' | 'WHATSAPP' | 'SYSTEM_ALERT') => {
    const newLog: NotificationLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      recipientPhone: targetPhone,
      message: message,
      type: type,
      status: 'DELIVERED',
    };
    onSendNotification(newLog);
    setLastSent(type);

    if (type === 'SMS') {
      const smsUri = `sms:${targetPhone}?body=${encodeURIComponent(message)}`;
      window.open(smsUri, '_self');
    } else if (type === 'WHATSAPP') {
      const waUri = `https://wa.me/91${targetPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUri, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto no-print">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>CCTNS सूचना प्रेषण (Send Alert)</span>
                <span className="text-xs bg-blue-900/60 text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-700">
                  {targetPhone}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                19 थानों की रिपोर्ट स्थिति का नोटिफिकेशन CCTNS मोबाइल नंबर पर भेजें
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

        <div className="p-6 space-y-6">
          
          {/* Completion Status Alert Card */}
          <div className={`p-4 rounded-xl border flex items-center space-x-4 ${
            is100Percent
              ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200'
              : 'bg-amber-950/50 border-amber-500/60 text-amber-200'
          }`}>
            {is100Percent ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 animate-bounce" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
            )}
            <div>
              <h4 className="font-bold text-sm">
                {is100Percent
                  ? '🎉 समस्त 19 थानों की फीडिंग पूर्ण हो चुकी है! (100% GREEN COMPLETED)'
                  : `प्रगति: 19 में से ${completedCount} थानों ने फीडिंग पूरी की है`}
              </h4>
              <p className="text-xs opacity-90 mt-0.5">
                प्राप्तकर्ता: CCTNS नोडल अधिकारी (मोबाइल: <strong className="text-white">{targetPhone}</strong>)
              </p>
            </div>
          </div>

          {/* Editable SMS Body */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              संदेश सामग्री (Message Content)
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-sans"
            />
          </div>

          {/* Direct Send Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleSimulatedSend('SMS')}
              className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              <span>SMS अलर्ट भेजें (SMS to {targetPhone})</span>
            </button>

            <button
              onClick={() => handleSimulatedSend('WHATSAPP')}
              className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp पर भेजें ({targetPhone})</span>
            </button>
          </div>

          {lastSent && (
            <div className="p-3 bg-emerald-900/40 border border-emerald-700/60 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lastSent} अलर्ट सफलतापूर्वक मोबाइल नंबर <strong>{targetPhone}</strong> पर प्रेषित किया गया!</span>
            </div>
          )}

          {/* Log History */}
          {logs.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>हाल ही के प्रेषित अलर्ट लॉग (Sent Logs)</span>
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                {logs.map((log) => (
                  <div key={log.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs flex justify-between items-center text-slate-300">
                    <div>
                      <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded mr-2 text-slate-400">
                        {log.timestamp}
                      </span>
                      <span>{log.type}: <strong>{log.recipientPhone}</strong></span>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-bold">DELIVERED</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
