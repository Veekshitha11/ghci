import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCopy, FaDownload, FaShareAlt } from 'react-icons/fa';

const UpiDisplay = ({ upiId, qrCodeData }) => {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  const handleCopy = () => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrCodeData) return;
    const link = document.createElement('a');
    link.href = qrCodeData;
    link.download = `${upiId || 'saarthi'}-qr.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!upiId) return;
    const shareText = `My Saarthi UPI ID: ${upiId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Saarthi UPI', text: shareText });
      } else {
        navigator.clipboard.writeText(shareText);
        setShareFeedback('Details copied to clipboard!');
        setTimeout(() => setShareFeedback(''), 2000);
      }
    } catch (error) {
      setShareFeedback('Unable to share right now.');
      setTimeout(() => setShareFeedback(''), 2000);
    }
  };

  const renderPlaceholder = () => (
    <div className="card upi-simple-card">
      <h3>Saarthi UPI</h3>
      <p>Create your unique UPI ID to start receiving instant payments.</p>
      <Link to="/create-upi" className="btn-primary large">
        Create UPI ID
      </Link>
    </div>
  );

  if (!upiId || !qrCodeData) {
    return renderPlaceholder();
  }

  return (
    <>
      <div className="card upi-simple-card">
        <h3>Saarthi UPI</h3>
        <p>Share this ID or QR code to get paid instantly.</p>

        <div className="upi-id-row">
          <span>{upiId}</span>
          <button type="button" onClick={handleCopy} className="copy-btn">
            <FaCopy /> {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <button type="button" className="qr-preview" onClick={() => setShowQrModal(true)}>
          <img src={qrCodeData} alt="UPI QR preview" />
          <span>Tap to view details</span>
        </button>

        {shareFeedback && <small className="share-feedback">{shareFeedback}</small>}
      </div>

      {showQrModal && (
        <div className="qr-modal">
          <div className="modal-overlay" onClick={() => setShowQrModal(false)} />
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowQrModal(false)}>
              ×
            </button>
            <h3>Your QR Code</h3>
            <p className="modal-copy">
              UPI (Unified Payments Interface) lets anyone scan this QR to transfer money directly
              into your Saarthi account. Share it with people you trust to receive payments safely.
            </p>
            <div className="modal-qr">
              <img src={qrCodeData} alt="UPI QR enlarged" />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleShare}>
                <FaShareAlt /> Share
              </button>
              <button className="btn-primary" onClick={handleDownloadQR}>
                <FaDownload /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .upi-simple-card h3 {
          margin-bottom: 6px;
        }

        .upi-simple-card p {
          color: #475569;
          margin-bottom: 16px;
        }

        .upi-id-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.4);
          font-weight: 600;
          color: #0f172a;
        }

        .copy-btn {
          border: none;
          background: transparent;
          color: #2563eb;
          font-weight: 600;
          display: inline-flex;
          gap: 6px;
          align-items: center;
          cursor: pointer;
        }

        .qr-preview {
          margin-top: 18px;
          border: 1px dashed rgba(148, 163, 184, 0.6);
          border-radius: 18px;
          padding: 16px;
          width: 100%;
          background: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .qr-preview img {
          width: 160px;
          height: 160px;
        }

        .qr-preview span {
          font-size: 13px;
          color: #475569;
        }

        .share-feedback {
          display: block;
          margin-top: 10px;
          color: #16a34a;
          font-weight: 600;
        }

        .qr-modal {
          position: fixed;
          inset: 0;
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
        }

        .modal-content {
          position: relative;
          background: #fff;
          border-radius: 24px;
          padding: 32px;
          width: min(90vw, 420px);
          box-shadow: 0 35px 60px rgba(15, 23, 42, 0.35);
          text-align: center;
          z-index: 1;
        }

        .modal-copy {
          color: #475569;
          font-size: 14px;
          line-height: 1.6;
        }

        .modal-qr {
          margin: 20px 0;
          background: #f8fafc;
          padding: 16px;
          border-radius: 18px;
        }

        .modal-qr img {
          width: 220px;
          height: 220px;
        }

        .modal-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          border: none;
          background: rgba(15, 23, 42, 0.08);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          font-size: 20px;
        }
      `}</style>
    </>
  );
};

export default UpiDisplay;