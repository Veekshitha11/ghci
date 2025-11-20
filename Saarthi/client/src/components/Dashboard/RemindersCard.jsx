// ========== client/src/components/Dashboard/RemindersCard.jsx ==========
import { useEffect, useMemo, useState } from 'react';
import { FaBell, FaTrash, FaPlus, FaMicrophone } from 'react-icons/fa';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';

const defaultForm = {
  payee: '',
  amount: '',
  dueDate: '',
  note: '',
};

const RemindersCard = ({
  reminders = [],
  isLoading = false,
  isSaving = false,
  deletingId = '',
  onCreateReminder,
  onDeleteReminder,
}) => {
  const [formValues, setFormValues] = useState(defaultForm);
  const [error, setError] = useState('');
  const [voicePreview, setVoicePreview] = useState('');

  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      const parsed = parseVoiceTranscript(transcript);
      setFormValues((prev) => ({
        ...prev,
        ...parsed,
        note: prev.note || parsed.note || transcript,
        payee: parsed.payee || prev.payee,
      }));
      setVoicePreview(transcript);
    }
  }, [transcript]);

  const sortedReminders = useMemo(
    () =>
      [...reminders].sort(
        (a, b) => new Date(a.dueDate || a.createdAt || 0) - new Date(b.dueDate || b.createdAt || 0)
      ),
    [reminders]
  );

  const handleInputChange = (field) => (event) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formValues.payee.trim()) {
      setError('Who should we remind you to pay?');
      return;
    }

    try {
      const payload = {
        payee: formValues.payee.trim(),
        amount: formValues.amount ? Number(formValues.amount) : null,
        note: formValues.note?.trim(),
        dueDate: formValues.dueDate ? new Date(formValues.dueDate).toISOString() : null,
        rawTranscript: voicePreview,
        source: voicePreview ? 'voice' : 'dashboard',
      };
      await onCreateReminder?.(payload);
      setFormValues(defaultForm);
      setVoicePreview('');
      resetTranscript();
    } catch (submitError) {
      const apiMessage =
        submitError?.response?.data?.message || submitError?.message || 'Unable to save reminder';
      setError(apiMessage);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await onDeleteReminder?.(id);
    } catch (deleteError) {
      const apiMessage =
        deleteError?.response?.data?.message ||
        deleteError?.message ||
        'Unable to delete reminder right now.';
      setError(apiMessage);
    }
  };

  const handleVoiceToggle = () => {
    if (!browserSupportsSpeechRecognition) {
      setError('Voice recognition is not supported in this browser.');
      return;
    }
    setError('');
    if (isListening) {
      stopListening();
    } else {
      setVoicePreview('');
      startListening();
    }
  };

  const displayDateLabel = (reminder) => {
    if (reminder.dueDateLabel) return reminder.dueDateLabel;
    if (!reminder.dueDate) return 'Soon';
    return new Date(reminder.dueDate).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="card reminders-card">
      <div className="reminders-header">
        <div>
          <h3>
            <FaBell /> Payment Reminders
          </h3>
          <p className="helper">
            Set payment nudges via text or mic and keep them pinned on your dashboard.
          </p>
        </div>
      </div>

      <form className="reminder-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Payee / Purpose
            <input
              type="text"
              placeholder="e.g. Rahul rent"
              value={formValues.payee}
              onChange={handleInputChange('payee')}
              required
            />
          </label>
        </div>

        <div className="form-row duo">
          <label>
            Amount (₹)
            <input
              type="number"
              min="1"
              placeholder="1500"
              value={formValues.amount}
              onChange={handleInputChange('amount')}
            />
          </label>

          <label>
            Due date & time
            <input
              type="datetime-local"
              value={formValues.dueDate}
              onChange={handleInputChange('dueDate')}
            />
          </label>
        </div>

        <div className="form-row note-row">
          <label>
            Notes
            <textarea
              placeholder="Optional details (account, bill type, etc.)"
              value={formValues.note}
              onChange={handleInputChange('note')}
              rows={2}
            />
          </label>
          <button
            type="button"
            className={`mic-btn ${isListening ? 'active' : ''}`}
            onClick={handleVoiceToggle}
            aria-label="Dictate reminder"
          >
            <FaMicrophone />
            {isListening ? 'Listening…' : 'Voice'}
          </button>
        </div>

        {voicePreview && (
          <p className="voice-preview">
            🎙️ <strong>Heard:</strong> {voicePreview}
          </p>
        )}

        {speechError && (
          <p className="error">
            Voice input error: {speechError === 'no-speech' ? 'No speech detected.' : speechError}
          </p>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary large" disabled={isSaving}>
          <FaPlus /> {isSaving ? 'Saving…' : 'Add Reminder'}
        </button>
      </form>

      <div className="reminders-list">
        {isLoading ? (
          <div className="empty-state">
            <p>Fetching your reminders…</p>
          </div>
        ) : sortedReminders.length === 0 ? (
          <div className="empty-state">
            <p>No reminders yet.</p>
            <p className="hint-text">
              Try saying “Remind me to pay Rahul ₹2500 on Friday at 6 PM”.
            </p>
          </div>
        ) : (
          sortedReminders.map((reminder) => (
            <div key={reminder.id} className="reminder-item">
              <div className="reminder-icon">
                <FaBell />
              </div>
              <div className="reminder-content">
                <div className="reminder-title">
                  Pay {reminder.payee || reminder.billType || 'someone'}
                </div>
                <div className="reminder-meta">
                  {reminder.amount && (
                    <span className="meta-chip">
                      ₹{Number(reminder.amount).toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="meta-chip">{displayDateLabel(reminder)}</span>
                </div>
                {reminder.note && <p className="reminder-note">{reminder.note}</p>}
              </div>
              <button
                className="btn-delete"
                onClick={() => handleDelete(reminder.id)}
                disabled={deletingId === reminder.id}
              >
                <FaTrash />
                {deletingId === reminder.id ? 'Removing…' : 'Delete'}
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        .reminders-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .reminders-card h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--dark-color);
          margin-bottom: 4px;
        }

        .reminders-card .helper {
          color: #475569;
          font-size: 14px;
        }

        .reminder-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }

        .reminder-form label {
          font-weight: 600;
          font-size: 14px;
          color: var(--dark-color);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .reminder-form input,
        .reminder-form textarea {
          width: 100%;
          border-radius: 14px;
          border: 2px solid #e5e7eb;
          padding: 12px 14px;
          font-size: 15px;
          transition: border-color 0.2s ease;
        }

        .reminder-form input:focus,
        .reminder-form textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(95, 37, 159, 0.15);
        }

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-row.duo {
          flex-direction: row;
          gap: 16px;
        }

        .form-row.duo label {
          flex: 1;
        }

        .note-row {
          flex-direction: row;
          gap: 12px;
          align-items: flex-end;
        }

        .note-row label {
          flex: 1;
        }

        .note-row textarea {
          min-height: 70px;
          resize: vertical;
        }

        .mic-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 14px;
          padding: 12px 16px;
          font-weight: 600;
          background: #e0f2fe;
          color: #0369a1;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mic-btn.active {
          background: #fee2e2;
          color: #b91c1c;
          box-shadow: 0 0 0 6px rgba(248, 113, 113, 0.2);
        }

        .voice-preview {
          background: #ecfeff;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: #0f172a;
        }

        .reminders-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reminder-item {
          display: flex;
          gap: 16px;
          padding: 18px;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.35);
        }

        .reminder-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: rgba(251, 191, 36, 0.2);
          color: #b45309;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .reminder-content {
          flex: 1;
        }

        .reminder-title {
          font-weight: 600;
          color: var(--dark-color);
          margin-bottom: 4px;
        }

        .reminder-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 6px;
        }

        .meta-chip {
          background: white;
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 13px;
          color: #334155;
          border: 1px solid rgba(148, 163, 184, 0.4);
        }

        .reminder-note {
          font-size: 13px;
          color: #475569;
          margin: 0;
        }

        .btn-delete {
          align-self: center;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #dc2626;
          font-weight: 600;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .btn-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-delete:not(:disabled):hover {
          background: rgba(248, 113, 113, 0.15);
        }

        .empty-state {
          text-align: center;
          padding: 24px;
          color: #64748b;
          border: 1px dashed rgba(148, 163, 184, 0.6);
          border-radius: 16px;
        }

        .hint-text {
          font-size: 13px;
          margin-top: 6px;
        }

        @media (max-width: 768px) {
          .form-row.duo {
            flex-direction: column;
          }

          .note-row {
            flex-direction: column;
            align-items: stretch;
          }

          .mic-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

const STOP_WORD_REGEX = /\b(on|by|at|before|after|within|in|next|tomorrow|today|tonight|this|upcoming)\b/i;

function parseVoiceTranscript(transcript) {
  const parsed = { note: transcript };

  const amountMatch = transcript.match(/(?:₹|rs\.?|rupees)?\s*(\d+(?:[\d,]*)(?:\.\d+)?)/i);
  if (amountMatch) {
    parsed.amount = amountMatch[1].replace(/,/g, '');
  }

  const payeeFromTranscript = extractPayeeFromTranscript(transcript);
  if (payeeFromTranscript) {
    parsed.payee = capitalizeWords(payeeFromTranscript);
  }

  const dateMatch = transcript.match(/on\s+([a-z0-9\s:/-]+)/i);
  if (dateMatch) {
    const sanitized = dateMatch[1].replace(/(st|nd|rd|th)/gi, '').trim();
    const parsedDate = new Date(sanitized);
    if (!Number.isNaN(parsedDate.getTime())) {
      parsed.dueDate = parsedDate.toISOString().slice(0, 16);
    }
  } else if (transcript.toLowerCase().includes('tomorrow')) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    parsed.dueDate = tomorrow.toISOString().slice(0, 16);
  }

  return parsed;
}

function extractPayeeFromTranscript(transcript = '') {
  if (!transcript) return '';
  const patterns = [
    /\b(?:to|for)\s+([a-zA-Z][a-zA-Z\s]{1,40})/i,
    /pay(?:ing)?\s+[a-zA-Z\s]*?(?:to|for)\s+([a-zA-Z][a-zA-Z\s]{1,40})/i,
  ];

  for (const pattern of patterns) {
    const match = transcript.match(pattern);
    if (match && match[1]) {
      const cleaned = cleanPayeeSegment(match[1]);
      if (cleaned) {
        return cleaned;
      }
    }
  }

  return '';
}

function cleanPayeeSegment(segment = '') {
  const normalized = segment.replace(/[,.;]/g, ' ').replace(/\s{2,}/g, ' ').trim();
  if (!normalized) return '';

  const stopMatch = normalized.match(STOP_WORD_REGEX);
  const trimmed = stopMatch ? normalized.slice(0, stopMatch.index).trim() : normalized;
  const strippedNumbers = trimmed.replace(/\d.+$/g, '').trim();
  return strippedNumbers;
}

function capitalizeWords(text = '') {
  return text
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default RemindersCard;

