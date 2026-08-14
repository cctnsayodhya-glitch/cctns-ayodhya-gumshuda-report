import React, { useState, useEffect } from 'react';
import { StationData, DateRange, NotificationLog, AuthSession } from './types/report';
import { INITIAL_POLICE_STATIONS } from './data/policeStations';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PSFormModal } from './components/PSFormModal';
import { SSPReportView } from './components/SSPReportView';
import { NotificationModal } from './components/NotificationModal';
import { LoginModal } from './components/LoginModal';
import { syncToGoogleSheet } from './utils/googleSheets';

export const App: React.FC = () => {
  // Auth Session State - Defaults to null so Login Page shows FIRST
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem('ayodhya_cctns_auth_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved auth session", e);
      }
    }
    return null; // Require login first
  });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(!authSession);

  // Load stations from localStorage or use initial data
  const [stations, setStations] = useState<StationData[]>(() => {
    const saved = localStorage.getItem('ayodhya_cctns_stations_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved stations", e);
      }
    }
    return INITIAL_POLICE_STATIONS;
  });

  const [dateRange, setDateRange] = useState<DateRange>({
    fromDate: '15.07.2026',
    toDate: '31.07.2026',
    letterDate: '01.08.2026',
    letterNo: 'सी०गु०पा०/2026',
  });

  const [activeFormStation, setActiveFormStation] = useState<StationData | null>(null);
  const [showSSPReport, setShowSSPReport] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);

  // Save to localStorage on stations update
  useEffect(() => {
    localStorage.setItem('ayodhya_cctns_stations_v2', JSON.stringify(stations));
  }, [stations]);

  // Save Auth session
  useEffect(() => {
    if (authSession) {
      localStorage.setItem('ayodhya_cctns_auth_v1', JSON.stringify(authSession));
    } else {
      localStorage.removeItem('ayodhya_cctns_auth_v1');
    }
  }, [authSession]);

  const handleLogin = (session: AuthSession) => {
    setAuthSession(session);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setAuthSession(null);
    setShowLoginModal(true);
  };

  // Handle PS Form Save & Sync to Google Sheet
  const handleSaveStation = async (updatedStation: StationData) => {
    setStations((prev) =>
      prev.map((s) => (s.id === updatedStation.id ? updatedStation : s))
    );

    // Sync to Google Sheet
    await syncToGoogleSheet(updatedStation);

    setActiveFormStation(null);
  };

  // Bulk update stations from manual edit mode in SSP Report
  const handleUpdateStationData = (updatedStations: StationData[]) => {
    setStations(updatedStations);
  };

  // Quick toggle status between Green (Submitted) and Red (Pending)
  const handleQuickToggleStatus = (stationId: string) => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id === stationId) {
          const isSubmittedNow = !s.submitted;
          const updated = {
            ...s,
            submitted: isSubmittedNow,
            submittedAt: isSubmittedNow
              ? new Date().toLocaleString('hi-IN', { dateStyle: 'short', timeStyle: 'short' })
              : undefined,
          };
          if (isSubmittedNow) {
            syncToGoogleSheet(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Auto Fill All 19 PS
  const handleAutoFillAll = () => {
    setStations((prev) =>
      prev.map((s) => {
        const updated = {
          ...s,
          submitted: true,
          submittedAt: new Date().toLocaleString('hi-IN', { dateStyle: 'short', timeStyle: 'short' }),
          submittedBy: `प्रभारी निरीक्षक ${s.fullName}`,
        };
        syncToGoogleSheet(updated);
        return updated;
      })
    );
  };

  // Reset All Submissions
  const handleResetAll = () => {
    if (window.confirm("क्या आप समस्त 19 थानों की फीडिंग रिसेट करना चाहते हैं?")) {
      setStations(INITIAL_POLICE_STATIONS.map((s) => ({ ...s, submitted: false })));
    }
  };

  // Notification Handler
  const handleSendNotification = (log: NotificationLog) => {
    setNotificationLogs((prev) => [log, ...prev]);
  };

  const completedCount = stations.filter((s) => s.submitted).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header Bar */}
      <Header
        dateRange={dateRange}
        setDateRange={setDateRange}
        completedCount={completedCount}
        totalCount={stations.length}
        authSession={authSession}
        onOpenNotificationModal={() => setShowNotificationModal(true)}
        onOpenSSPReport={() => setShowSSPReport(true)}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Dashboard View (Only visible when logged in) */}
      <Dashboard
        stations={stations}
        dateRange={dateRange}
        authSession={authSession}
        onOpenForm={(st) => setActiveFormStation(st)}
        onQuickToggleStatus={handleQuickToggleStatus}
        onAutoFillAll={handleAutoFillAll}
        onResetAll={handleResetAll}
        onOpenSSPReport={() => setShowSSPReport(true)}
        onOpenNotificationModal={() => setShowNotificationModal(true)}
        onOpenLoginModal={() => setShowLoginModal(true)}
      />

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-900 py-4 text-center text-xs text-slate-500 no-print">
        <p>कार्यालय वरिष्ठ पुलिस अधीक्षक, जनपद अयोध्या • सी०सी०टी०एन०एस० (CCTNS) पाक्षिक गुमशुदा पोर्टल</p>
      </footer>

      {/* Login Modal Landing View (Shown first when not authenticated or switching role) */}
      {(showLoginModal || !authSession) && (
        <LoginModal
          stations={stations}
          onLogin={handleLogin}
          onClose={authSession ? () => setShowLoginModal(false) : undefined}
        />
      )}

      {activeFormStation && (
        <PSFormModal
          station={activeFormStation}
          dateRange={dateRange}
          onClose={() => setActiveFormStation(null)}
          onSave={handleSaveStation}
        />
      )}

      {showSSPReport && (
        <SSPReportView
          stations={stations}
          dateRange={dateRange}
          onClose={() => setShowSSPReport(false)}
          onSendAlert={() => {
            setShowSSPReport(false);
            setShowNotificationModal(true);
          }}
          onUpdateStationData={handleUpdateStationData}
        />
      )}

      {showNotificationModal && (
        <NotificationModal
          stations={stations}
          dateRange={dateRange}
          logs={notificationLogs}
          onClose={() => setShowNotificationModal(false)}
          onSendNotification={handleSendNotification}
        />
      )}

    </div>
  );
};
