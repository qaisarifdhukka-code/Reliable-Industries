import { useEffect, useState } from 'react';
import { Check, Copy, Mail, MessageSquare, Send } from 'lucide-react';

interface ContactInquiryFormProps {
  recipientEmail: string;
  whatsappBaseUrl: string;
}

export default function ContactInquiryForm({
  recipientEmail,
  whatsappBaseUrl,
}: ContactInquiryFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [inquiryType, setInquiryType] = useState('quote');
  const [message, setMessage] = useState('');
  const [submittedSummary, setSubmittedSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get('inquiry') || params.get('product');
    if (topic) {
      setMessage((prev) =>
        prev.trim()
          ? prev
          : `Regarding: ${topic}\nOperating conditions / quantity: `
      );
    }
  }, []);

  const buildSummaryText = () => {
    const typeLabels: Record<string, string> = {
      quote: 'Request a Quote',
      technical: 'Technical Support',
      partnership: 'Partnership / Distribution',
      other: 'General Inquiry',
    };
    return [
      `Name: ${firstName.trim()} ${lastName.trim()}`.trim(),
      `Business Email: ${email.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : '',
      `Company: ${company.trim()}`,
      `Inquiry Type: ${typeLabels[inquiryType] ?? inquiryType}`,
      `Message:\n${message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSummary(buildSummaryText());
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!submittedSummary) return;
    try {
      await navigator.clipboard.writeText(submittedSummary);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const mailtoHref = submittedSummary
    ? `mailto:${recipientEmail}?subject=${encodeURIComponent(
        `Inquiry from ${company.trim() || firstName.trim() || 'Website Visitor'}`
      )}&body=${encodeURIComponent(submittedSummary)}`
    : `mailto:${recipientEmail}`;

  const whatsappHref = submittedSummary
    ? `${whatsappBaseUrl}&text=${encodeURIComponent(submittedSummary)}`
    : whatsappBaseUrl;

  return (
    <div className="rounded-[2px] border border-[#e2e8f0] border-t-4 border-t-[#009FE3] bg-white p-[1.5rem] shadow-[0_10px_35px_rgba(0,43,73,0.06)] min-[577px]:p-[2.25rem]">
      <h2 className="mb-[0.4rem] text-[1.5rem] font-bold text-[#003B6D]">
        Send a Message
      </h2>
      <p className="mb-[1.5rem] text-[0.94rem] text-[#64748b]">
        Fill out the form below to prepare your technical inquiry or quote request for our engineering desk.
      </p>

      {submittedSummary && (
        <div
          role="status"
          className="mb-[1.5rem] rounded-[2px] border border-[#009FE3] bg-[#F4F6F8] p-[1.25rem]"
        >
          <p className="mb-[0.5rem] text-[0.95rem] font-bold text-[#003B6D]">
            Inquiry Ready to Dispatch
          </p>
          <p className="mb-[0.9rem] text-[0.86rem] leading-[1.5] text-[#334155]">
            Send your formatted request directly via email or WhatsApp below:
          </p>
          <div className="flex flex-wrap gap-[0.6rem]">
            <a
              href={mailtoHref}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-[4px] bg-[#003B6D] px-4 py-2 text-[0.85rem] font-semibold text-white transition-colors duration-200 hover:bg-[#002038]"
            >
              <Mail size={15} strokeWidth={2} aria-hidden="true" />
              <span>Open Email Draft</span>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-[4px] bg-[#009FE3] px-4 py-2 text-[0.85rem] font-semibold text-white transition-colors duration-200 hover:bg-[#007BB5]"
            >
              <MessageSquare size={15} strokeWidth={2} aria-hidden="true" />
              <span>Send on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-[4px] border border-[#003B6D] bg-white px-4 py-2 text-[0.85rem] font-semibold text-[#003B6D] transition-colors duration-200 hover:bg-[#003B6D] hover:text-white"
            >
              {copied ? (
                <Check size={15} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Copy size={15} strokeWidth={2} aria-hidden="true" />
              )}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-[1.1rem]">
        <div className="grid grid-cols-1 gap-[1rem] min-[577px]:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-[0.35rem] block text-[0.84rem] font-semibold text-[#003B6D]"
            >
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="w-full rounded-[2px] border border-[#cbd5e1] bg-[#F4F6F8] px-[0.85rem] py-[0.65rem] text-[0.94rem] text-[#334155] outline-none transition-colors focus:border-[#009FE3] focus:bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="mb-[0.35rem] block text-[0.84rem] font-semibold text-[#003B6D]"
            >
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="w-full rounded-[2px] border border-[#cbd5e1] bg-[#F4F6F8] px-[0.85rem] py-[0.65rem] text-[0.94rem] text-[#334155] outline-none transition-colors focus:border-[#009FE3] focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[1rem] min-[577px]:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="mb-[0.35rem] block text-[0.84rem] font-semibold text-[#003B6D]"
            >
              Business Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-[2px] border border-[#cbd5e1] bg-[#F4F6F8] px-[0.85rem] py-[0.65rem] text-[0.94rem] text-[#334155] outline-none transition-colors focus:border-[#009FE3] focus:bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-[0.35rem] block text-[0.84rem] font-semibold text-[#003B6D]"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 78880 00000"
              className="w-full rounded-[2px] border border-[#cbd5e1] bg-[#F4F6F8] px-[0.85rem] py-[0.65rem] text-[0.94rem] text-[#334155] outline-none transition-colors focus:border-[#009FE3] focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[1rem] min-[577px]:grid-cols-2">
          <div>
            <label
              htmlFor="company"
              className="mb-[0.35rem] block text-[0.84rem] font-semibold text-[#003B6D]"
            >
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company name"
              className="w-full rounded-[2px] border border-[#cbd5e1] bg-[#F4F6F8] px-[0.85rem] py-[0.65rem] text-[0.94rem] text-[#334155] outline-none transition-colors focus:border-[#009FE3] focus:bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="inquiryType"
              className="mb-[0.35rem] block text-[0.84rem] font-semibold text-[#003B6D]"
            >
              Reason for Inquiry *
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              required
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full rounded-[2px] border border-[#cbd5e1] bg-[#F4F6F8] px-[0.85rem] py-[0.65rem] text-[0.94rem] text-[#334155] outline-none transition-colors focus:border-[#009FE3] focus:bg-white"
            >
              <option value="quote">Request a Quote</option>
              <option value="technical">Technical Support</option>
              <option value="partnership">Partnership / Distribution</option>
              <option value="other">General Inquiry</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-[0.35rem] block text-[0.84rem] font-semibold text-[#003B6D]"
          >
            Message / Technical Details *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please describe your requirements, operating conditions, shaft size, or product model..."
            className="w-full rounded-[2px] border border-[#cbd5e1] bg-[#F4F6F8] px-[0.85rem] py-[0.65rem] text-[0.94rem] text-[#334155] outline-none transition-colors focus:border-[#009FE3] focus:bg-white"
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] border-2 border-[#009FE3] bg-[#009FE3] px-[1.8rem] py-[0.8rem] text-[0.95rem] font-semibold text-white transition-colors duration-300 hover:border-[#007BB5] hover:bg-[#007BB5]"
        >
          <span>Prepare &amp; Send Inquiry</span>
          <Send size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <p className="text-[0.8rem] text-[#64748b]">
          By submitting, you agree to our{' '}
          <a
            href="/privacy-policy"
            className="font-semibold text-[#009FE3] hover:text-[#003B6D]"
          >
            Privacy Policy
          </a>{' '}
          and consent to being contacted regarding your inquiry.
        </p>
      </form>
    </div>
  );
}
