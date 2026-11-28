import { useState } from 'react';
import { FileDown, X } from 'lucide-react';

interface CatalogueDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfHref?: string;
  pdfDownloadName?: string;
}

const WEB3FORMS_KEY = 'd64382d4-5728-4ffa-a253-65d334d054d1';

export default function CatalogueDownloadModal({
  isOpen,
  onClose,
  pdfHref = '/brochures/mech-seal-catalogue.pdf',
  pdfDownloadName = 'Reliable-Industries-Mech-Seal-Catalogue.pdf',
}: CatalogueDownloadModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [partyName, setPartyName] = useState('');
  const [partyMobile, setPartyMobile] = useState('');
  const [partyAddress, setPartyAddress] = useState('');
  const [partyEmail, setPartyEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Mechanical Seal Catalogue Download Lead',
          from_name: partyName,
          email: partyEmail,
          company_name: companyName,
          contact_person: partyName,
          mobile_number: partyMobile,
          company_address: partyAddress,
          business_email: partyEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Submission failed. Please try again.');
      }

      setSuccess(true);
      const link = document.createElement('a');
      link.href = pdfHref;
      link.download = pdfDownloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setSuccess(false);
        setCompanyName('');
        setPartyName('');
        setPartyMobile('');
        setPartyAddress('');
        setPartyEmail('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalogue-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[460px] rounded-[4px] border border-[#e2e8f0] border-t-4 border-t-[#009FE3] bg-white p-6 shadow-[0_20px_50px_rgba(0,43,73,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 rounded-[2px] p-1 text-[#64748b] transition-colors hover:bg-[#F4F6F8] hover:text-[#003B6D]"
        >
          <X size={18} />
        </button>

        <div className="mb-4">
          <span className="mb-1 block text-[0.72rem] font-bold uppercase tracking-[1.2px] text-[#009FE3]">
            TECHNICAL CATALOGUE
          </span>
          <h2 id="catalogue-modal-title" className="text-[1.25rem] font-bold text-[#003B6D]">
            Download Mechanical Seal Catalogue
          </h2>
          <p className="mt-1 text-[0.84rem] text-[#64748b]">
            Please fill in your details to download the full PDF catalogue.
          </p>
        </div>

        {success ? (
          <div className="rounded-[2px] border border-emerald-200 bg-emerald-50 p-4 text-center text-[0.9rem] font-semibold text-emerald-800">
            Thank you! Your catalogue download has started.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-[0.78rem] font-semibold text-[#334155]">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Reliable Industries"
                className="w-full rounded-[2px] border border-[#cbd5e1] px-3 py-2 text-[0.86rem] text-[#0f172a] outline-none focus:border-[#009FE3]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[0.78rem] font-semibold text-[#334155]">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-[2px] border border-[#cbd5e1] px-3 py-2 text-[0.86rem] text-[#0f172a] outline-none focus:border-[#009FE3]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[0.78rem] font-semibold text-[#334155]">
                  Mobile / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={partyMobile}
                  onChange={(e) => setPartyMobile(e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full rounded-[2px] border border-[#cbd5e1] px-3 py-2 text-[0.86rem] text-[#0f172a] outline-none focus:border-[#009FE3]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[0.78rem] font-semibold text-[#334155]">
                Business Email *
              </label>
              <input
                type="email"
                required
                value={partyEmail}
                onChange={(e) => setPartyEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-[2px] border border-[#cbd5e1] px-3 py-2 text-[0.86rem] text-[#0f172a] outline-none focus:border-[#009FE3]"
              />
            </div>

            <div>
              <label className="mb-1 block text-[0.78rem] font-semibold text-[#334155]">
                Company Address *
              </label>
              <textarea
                rows={2}
                required
                value={partyAddress}
                onChange={(e) => setPartyAddress(e.target.value)}
                placeholder="City, State, Country"
                className="w-full rounded-[2px] border border-[#cbd5e1] px-3 py-2 text-[0.86rem] text-[#0f172a] outline-none focus:border-[#009FE3]"
              />
            </div>

            {error && (
              <p className="text-[0.82rem] font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#003B6D] px-4 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-[#009FE3] disabled:opacity-60"
            >
              <FileDown size={16} />
              <span>{submitting ? 'Submitting...' : 'Submit & Download PDF'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
