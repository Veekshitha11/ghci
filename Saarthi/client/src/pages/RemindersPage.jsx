import { useEffect, useMemo, useRef, useState } from 'react';
import { FaBell, FaTrash, FaMicrophone } from 'react-icons/fa';
import Navbar from '../components/Layout/Navbar';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import api from '../utils/api';

const DEFAULT_REMINDER_OFFSET_MS = 60 * 60 * 1000; // 1 hour

const RemindersPage = () => {
  const [note, setNote] = useState('');
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const {
    isListening,
    transcript,
    error: micError,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const timersRef = useRef({});
  const notifiedRef = useRef(new Set());

  useEffect(() => {
    fetchReminders();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  useEffect(() => {
    if (!isListening && transcript) {
      setNote(transcript);
    }
  }, [isListening, transcript]);

  useEffect(() => {
    Object.values(timersRef.current).forEach(clearTimeout);
    timersRef.current = {};

    reminders.forEach((reminder) => {
      if (!reminder.remindAt) return;
      const remindTime = new Date(reminder.remindAt).getTime();
      const delay = remindTime - Date.now();

      if (delay <= 0) {
        triggerNotification(reminder);
        return;
      }

      timersRef.current[reminder.id] = setTimeout(() => {
        triggerNotification(reminder);
      }, delay);
    });

    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, [reminders]);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/reminders');
      setReminders(response.data.reminders || []);
    } catch (fetchError) {
      console.error('Unable to fetch reminders:', fetchError);
      setError('Unable to load reminders.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (body) => {
    if (typeof window === 'undefined') return;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Saarthi Reminder', { body, tag: body });
    } else {
      alert(`Reminder: ${body}`);
    }
  };

  const triggerNotification = (reminder) => {
    if (notifiedRef.current.has(reminder.id)) {
      return;
    }
    notifiedRef.current.add(reminder.id);
    showNotification(reminder.note);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');

    if (!note.trim()) {
      setError('Please enter a reminder note.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        note: note.trim(),
        remindAt: new Date(Date.now() + DEFAULT_REMINDER_OFFSET_MS).toISOString()
      };
      const response = await api.post('/user/reminders', payload);
      setReminders((prev) => [response.data.reminder, ...prev]);
      setNote('');
      resetTranscript();
    } catch (saveError) {
      console.error('Unable to save reminder:', saveError);
      const apiMessage =
        saveError?.response?.data?.message || saveError?.message || 'Unable to save reminder.';
      setError(apiMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await api.delete(`/user/reminders/${id}`);
      setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
      notifiedRef.current.delete(id);
    } catch (deleteError) {
      console.error('Unable to delete reminder:', deleteError);
      const apiMessage =
        deleteError?.response?.data?.message || deleteError?.message || 'Unable to delete reminder.';
      setError(apiMessage);
    }
  };

  const handleMicToggle = () => {
    if (!browserSupportsSpeechRecognition) {
      setError('Voice recognition is not supported in this browser.');
      return;
    }

    resetTranscript();
    setError('');

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const remindersByDate = useMemo(() => {
    return reminders.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [reminders]);

  return (
    <div className="page">
      <Navbar />
      <div className="container reminders-page">
        <div className="page-header">
          <FaBell size={40} color="white" />
          <h2 style={{ color: 'white' }}>Reminders</h2>
        </div>

        <div className="reminders-shell">
          <form className="reminder-form-single" onSubmit={handleSave}>
            <label htmlFor="reminder-note">Reminder Note</label>
            <div className="input-wrapper">
              <input
                id="reminder-note"
                type="text"
                placeholder="e.g. Call the bank tomorrow morning"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <button
                type="button"
                className={`mic-toggle ${isListening ? 'active' : ''}`}
                onClick={handleMicToggle}
                aria-label="Dictate reminder"
              >
                <FaMicrophone />
              </button>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save Reminder'}
              </button>
              {micError && (
                <span className="listening-chip error">
                  Mic error: {micError}
                </span>
              )}
              {isListening && <span className="listening-chip">Listening…</span>}
            </div>
            {error && <p className="error">{error}</p>}
            {notificationPermission === 'denied' && (
              <p className="error">
                Browser notifications are blocked. Enable them to receive alerts when a reminder is
                due.
              </p>
            )}
            {notificationPermission === 'unsupported' && (
              <p className="error">
                This browser does not support notifications. You will still see reminders listed
                below.
              </p>
            )}
          </form>

          <div className="reminders-list-shell">
            {loading ? (
              <div className="empty-state">
                <p>Loading reminders…</p>
              </div>
            ) : remindersByDate.length === 0 ? (
              <div className="empty-state">
                <p>No reminders yet.</p>
                <p className="hint-text">
                  Use the note box above or dictate a reminder with the microphone button.
                </p>
              </div>
            ) : (
              remindersByDate.map((reminder) => (
                <div key={reminder.id} className="reminder-card">
                  <div className="reminder-content">
                    <p className="reminder-note">{reminder.note}</p>
                    {reminder.remindAt && (
                      <span className="reminder-meta">
                        Due{' '}
                        {new Date(reminder.remindAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(reminder.id)}
                    aria-label="Delete reminder"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .reminders-page {
          max-width: 840px;
          margin: 0 auto;
        }

        .reminders-shell {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 15px 40px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .reminder-form-single {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .reminder-form-single label {
          font-weight: 600;
          color: var(--dark-color);
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper input {
          width: 100%;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 16px 52px 16px 16px;
          font-size: 16px;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(95, 37, 159, 0.15);
        }

        .mic-toggle {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #475569;
          font-size: 18px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .mic-toggle.active {
          color: #b91c1c;
          animation: pulse-speak 1s infinite;
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .reminders-list-shell {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reminder-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          background: #f8fafc;
        }

        .reminder-note {
          font-weight: 600;
          color: var(--dark-color);
          margin: 0;
        }

        .reminder-meta {
          display: inline-flex;
          margin-top: 6px;
          font-size: 13px;
          color: #475569;
        }

        .btn-delete {
          border: none;
          background: transparent;
          color: #dc2626;
          font-size: 18px;
          cursor: pointer;
          padding: 6px;
          border-radius: 10px;
        }

        .btn-delete:hover {
          background: rgba(220, 38, 38, 0.1);
        }

        .empty-state {
          padding: 30px;
          text-align: center;
          border: 1px dashed rgba(148, 163, 184, 0.6);
          border-radius: 16px;
          color: #475569;
        }

        .listening-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ecfeff;
          color: #0369a1;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .listening-chip.error {
          background: #fee2e2;
          color: #b91c1c;
        }

        @keyframes pulse-speak {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @media (max-width: 640px) {
          .reminders-shell {
            padding: 20px;
          }

          .reminder-card {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default RemindersPage;

