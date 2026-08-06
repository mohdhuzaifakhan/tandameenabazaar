import QRCode from 'qrcode';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_STORE_LOGO } from '../../utils/defaultAssets';

export default function ShopQRCodeTab({ shop, showToast }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [generatingDownload, setGeneratingDownload] = useState(false);
  const posterRef = useRef(null);

  const shopUrl = shop?.id ? `${window.location.origin}/shop/${shop.id}` : '';

  useEffect(() => {
    let isMounted = true;
    if (shop?.id && shopUrl) {
      QRCode.toDataURL(
        shopUrl,
        {
          width: 600,
          margin: 2,
          color: {
            dark: '#056839',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        },
        (err, url) => {
          if (!err && isMounted) {
            setQrDataUrl(url);
          }
        }
      );
    }
    return () => {
      isMounted = false;
    };
  }, [shop?.id, shopUrl]);

  if (!shop) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    if (showToast) showToast('Shop URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    setGeneratingDownload(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const width = 800;
      const height = 1100;
      canvas.width = width;
      canvas.height = height;

      // Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Outer Green Border
      ctx.strokeStyle = '#056839';
      ctx.lineWidth = 16;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Top Banner Background
      ctx.fillStyle = '#056839';
      ctx.fillRect(20, 20, width - 40, 160);

      // Header Brand Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DIGITAL MEENA BAZAAR', width / 2, 85);

      ctx.fillStyle = '#E2F8EC';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('OFFICIAL STORE QR CODE', width / 2, 125);

      // Load Shop Logo
      const shopLogo = new Image();
      shopLogo.crossOrigin = 'anonymous';
      shopLogo.src = shop.image || DEFAULT_STORE_LOGO;

      const finishCanvas = () => {
        // Shop Logo Drawing (circular or rounded box)
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#056839';
        ctx.lineWidth = 4;
        ctx.fillRect(width / 2 - 50, 210, 100, 100);
        ctx.strokeRect(width / 2 - 50, 210, 100, 100);

        try {
          ctx.drawImage(shopLogo, width / 2 - 46, 214, 92, 92);
        } catch (e) {
          // Fallback if image CORS blocks canvas
        }

        // Shop Name
        ctx.fillStyle = '#0F172A';
        ctx.font = 'black 42px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(shop.name || 'Store', width / 2, 365);

        // Shop Category & Market
        ctx.fillStyle = '#056839';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        const metaText = `${(shop.category || 'Store').toUpperCase()} • ${shop.market || 'Rampur'}`;
        ctx.fillText(metaText, width / 2, 405);

        // Subtitle / Prompt
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Scan QR Code with Phone Camera to View Catalog', width / 2, 455);

        // Load and draw QR code
        const qrImage = new Image();
        qrImage.onload = () => {
          // QR White Container Box
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 4;
          ctx.fillRect(width / 2 - 210, 485, 420, 420);
          ctx.strokeRect(width / 2 - 210, 485, 420, 420);

          ctx.drawImage(qrImage, width / 2 - 190, 505, 380, 380);

          // Footer info
          ctx.fillStyle = '#056839';
          ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('⚡ Direct WhatsApp Orders & Local Delivery', width / 2, 950);

          ctx.fillStyle = '#64748B';
          ctx.font = '18px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(shop.address || `${shop.market || 'Rampur'}, Uttar Pradesh`, width / 2, 990);

          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(shopUrl, width / 2, 1030);

          // Export as PNG
          const dataUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `${(shop.name || 'shop').replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          setGeneratingDownload(false);
          if (showToast) showToast('QR Code poster downloaded successfully!');
        };
        qrImage.src = qrDataUrl;
      };

      shopLogo.onload = finishCanvas;
      shopLogo.onerror = finishCanvas;
    } catch (err) {
      console.error('Error generating download image:', err);
      setGeneratingDownload(false);
      // Fallback simple download of raw QR code
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `${(shop.name || 'shop').replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (showToast) showToast('QR Code downloaded!');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Printable Area Wrapper */}
      <div className="border-slate-200/90 md:p-8 shadow-xs">

        {/* Top Control Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 print:hidden">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-qrcode text-[#056839]"></i>
              Shop QR Code
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Customers can scan this QR code using their camera app to open your shop page directly.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className={`fa-solid ${copied ? 'fa-check text-emerald-600' : 'fa-copy'}`}></i>
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQR}
              disabled={generatingDownload}
              className="px-4 py-2.5 bg-[#056839] hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <i className={`fa-solid ${generatingDownload ? 'fa-spinner fa-spin' : 'fa-download'}`}></i>
              <span>{generatingDownload ? 'Generating...' : 'Download QR'}</span>
            </button>

            {/* <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#056839] border border-emerald-200 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-print"></i>
              <span>Print Poster</span>
            </button> */}
          </div>
        </div>

        {/* The Branded Shop QR Code Poster Card */}
        <div className="pt-6 flex flex-col items-center">
          <div
            id="printable-qr-poster"
            ref={posterRef}
            className="w-full max-w-md bg-white border-2 border-[#056839] rounded-3xl overflow-hidden shadow-md flex flex-col items-center text-center relative print:border-4 print:max-w-none print:w-full print:shadow-none"
          >
            {/* Poster Header */}
            <div className="w-full bg-[#056839] text-white py-5 px-4 flex flex-col items-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-200">
                Meena Bazaar
              </span>
              <h3 className="text-lg md:text-xl font-black text-white mt-0.5 tracking-tight">
                Scan to Shop Online
              </h3>
            </div>

            {/* Shop Profile Details */}
            <div className="p-6 flex flex-col items-center w-full">
              <div className="relative mb-3">
                <img
                  src={shop.image || DEFAULT_STORE_LOGO}
                  alt={shop.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                />
                {shop.verified !== false && (
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#056839] text-white border-2 border-white flex items-center justify-center text-[10px]"
                    title="Verified Store"
                  >
                    <i className="fa-solid fa-check"></i>
                  </div>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {shop.name}
              </h2>

              <div className="flex items-center gap-2 mt-1 flex-wrap justify-center text-xs text-slate-600 font-extrabold">
                <span className="bg-emerald-50 text-[#056839] px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                  {shop.category || 'General Store'}
                </span>
                <span>•</span>
                <span className="text-slate-500 font-bold">
                  <i className="fa-solid fa-location-dot text-[#056839] mr-1"></i>
                  {shop.market || 'Main Market'}
                </span>
              </div>

              {/* QR Code Container */}
              <div className="my-6 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-xs flex flex-col items-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR code for ${shop.name}`}
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#056839]"></i>
                  </div>
                )}
                <span className="mt-2 text-[11px] font-extrabold text-[#056839] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <i className="fa-solid fa-camera text-[#056839] mr-1.5"></i>
                  Point Mobile Camera to Scan
                </span>
              </div>

              {/* Shop Address & Order Note */}
              <div className="w-full space-y-1.5 pt-2 border-t border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-800">
                  Browse products, view prices &amp; order directly on WhatsApp!
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {shop.address || `${shop.market || 'Main Market'}, Rampur, UP`}
                </p>
                <div className="pt-2 text-[10px] text-slate-400 font-bold font-mono tracking-tight break-all print:text-xs print:text-slate-800">
                  {shopUrl}
                </div>
              </div>
            </div>
          </div>

          {/* Test Link Button for Shop Owner */}
          <div className="mt-6 flex items-center gap-3 print:hidden">
            <a
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-xs text-[#056839]"></i>
              <span>Test Preview Customer Page</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
