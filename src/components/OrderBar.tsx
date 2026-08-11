import { useState } from 'react';
import QRCode from 'qrcode';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  MessageCircle,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Pencil,
  Loader2
} from 'lucide-react';
import { BRAND } from '../data/products';
import { createOrder, updateOrderPhone } from '../app/actions/checkout';

type Props = {
  quantities: Record<string, number>;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onClear: () => void;
  products?: any[];
};

type Screen = 'summary' | 'checkout' | 'success' | 'qr';

export default function OrderBar({ quantities, onIncrement, onDecrement, onClear, products = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>('summary');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const items = products.filter((p) => (quantities[p.id] ?? 0) > 0).map((p) => ({
    product: p,
    qty: quantities[p.id],
  }));
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.product.price * i.qty), 0);
  const hasItems = totalItems > 0;

  const buildWhatsAppUrl = (id?: string) => {
    const lines = items.map((i) => `• ${i.qty}x ${i.product.name}`).join('\n');
    const orderRef = id ? `(Order Ref: #${id.slice(0, 8)})\n` : '';
    const message = `Hi Choco Ember! I'd like to fast-track my order ${orderRef}\n${lines}\n\nPlease confirm availability and pricing.`;
    return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleShowQr = async () => {
    const url = buildWhatsAppUrl(orderId);
    const qr = await QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: '#1c1208', light: '#faf7f2' },
      errorCorrectionLevel: 'M',
    });
    setWhatsappUrl(url);
    setQrDataUrl(qr);
    setScreen('qr');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createOrder({
      customerName,
      customerPhone,
      total: totalPrice,
      items: items.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.qty,
        price: i.product.price
      }))
    });
    setLoading(false);
    if (res.success && res.orderId) {
      setOrderId(res.orderId);
      setScreen('success');
      onClear();
    } else {
      alert('Failed to place order. Please try again.');
    }
  };

  const openDrawer = (s: Screen = 'summary') => {
    setScreen(s);
    setOpen(true);
  };

  const closeAll = () => {
    setOpen(false);
    setWhatsappUrl('');
    setQrDataUrl('');
    setTimeout(() => setScreen('summary'), 300);
  };

  return (
    <>
      {/* Floating bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ${
          hasItems ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 pb-4 sm:pb-6">
          <div className="flex items-center justify-between gap-4 rounded-full border border-gold-200/15 bg-choco-400 px-5 py-3 shadow-warm-lg sm:px-6 sm:py-4">
            <button onClick={() => openDrawer('summary')} className="flex items-center gap-3 text-cream-100">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gold-200 text-choco-600">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-cream-100 px-1 font-label text-[10px] font-bold text-choco-600">
                    {totalItems}
                  </span>
                )}
              </span>
              <span className="font-label text-sm font-semibold uppercase tracking-wider">
                {totalItems === 1 ? '1 item' : `${totalItems} items`} · View order
              </span>
            </button>
            <button
              onClick={() => openDrawer('checkout')}
              className="flex items-center gap-2 rounded-full bg-gold-200 px-5 py-3 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 transition-all hover:bg-gold-100 active:scale-95 sm:px-7"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-choco-600/70 backdrop-blur-sm" onClick={closeAll} />

          <div className="relative w-full max-w-lg animate-[slideUp_0.3s_ease-out] rounded-t-3xl bg-choco-400 shadow-warm-xl sm:rounded-3xl">

            {/* ── QR Screen ── */}
            {screen === 'qr' && (
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="section-label">Ready to order</p>
                    <h3 className="font-display text-2xl font-semibold text-cream-100">
                      Send via WhatsApp
                    </h3>
                  </div>
                  <button
                    onClick={closeAll}
                    aria-label="Close"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-200/20 text-gold-200 transition-colors hover:bg-gold-200 hover:text-choco-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative mb-5 rounded-3xl border-2 border-gold-200/25 bg-cream-100 p-4 shadow-warm-md">
                    <div className="absolute left-2 top-2 h-5 w-5 rounded-tl-lg border-l-2 border-t-2 border-gold-300" />
                    <div className="absolute right-2 top-2 h-5 w-5 rounded-tr-lg border-r-2 border-t-2 border-gold-300" />
                    <div className="absolute bottom-2 left-2 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-gold-300" />
                    <div className="absolute bottom-2 right-2 h-5 w-5 rounded-br-lg border-b-2 border-r-2 border-gold-300" />
                    <img
                      src={qrDataUrl}
                      alt="WhatsApp QR code"
                      className="h-52 w-52 rounded-xl sm:h-60 sm:w-60"
                    />
                  </div>

                  <div className="mb-6 flex items-center gap-3 text-cream-200/50">
                    <Smartphone className="h-4 w-4 shrink-0" />
                    <p className="font-body text-sm leading-snug">
                      Scan with your phone camera or WhatsApp to send your order
                    </p>
                  </div>

                  <div className="mb-5 flex w-full items-center gap-4">
                    <div className="h-px flex-1 bg-gold-200/15" />
                    <span className="font-label text-xs font-semibold uppercase tracking-wider text-cream-200/40">or</span>
                    <div className="h-px flex-1 bg-gold-200/15" />
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gold-200 px-6 py-4 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 transition-all hover:bg-gold-100 hover:shadow-glow-gold active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Open WhatsApp directly
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </a>

                  <button
                    onClick={() => { onClear(); closeAll(); }}
                    className="mt-4 w-full font-label text-xs font-semibold uppercase tracking-wider text-cream-200/40 transition-colors hover:text-gold-200"
                  >
                    Done - clear order
                  </button>
                </div>
              </div>
            )}

            {/* ── Checkout Screen ── */}
            {screen === 'checkout' && (
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="section-label">Checkout</p>
                    <h3 className="font-display text-2xl font-semibold text-cream-100">
                      Your Details
                    </h3>
                  </div>
                  <button
                    onClick={closeAll}
                    aria-label="Close"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-200/20 text-gold-200 transition-colors hover:bg-gold-200 hover:text-choco-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Order recap */}
                <div className="mb-6 max-h-40 overflow-y-auto space-y-2 rounded-2xl border border-gold-200/10 bg-choco-300/40 px-4 py-4">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-9 w-9 rounded-xl object-cover"
                        />
                        <span className="font-body text-sm text-cream-200/90">{product.name}</span>
                      </div>
                      <span className="font-label text-xs font-semibold uppercase tracking-wider text-gold-200">
                        {qty}×
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-gold-200/10 pt-2 font-label text-sm text-cream-100">
                    <span>Pricing</span>
                    <span className="text-gold-200 tracking-wider text-xs">Confirmed via WhatsApp</span>
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="mb-1 block font-label text-xs uppercase tracking-wider text-gold-200">Name</label>
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full rounded-xl border border-gold-200/30 bg-choco-500 p-3 font-body text-cream-100 focus:border-gold-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-label text-xs uppercase tracking-wider text-gold-200">Add your WhatsApp number</label>
                    <input
                      required
                      type="tel"
                      pattern="^(\+91[\-\s]?)?[6-9]\d{9}$"
                      title="Please enter a valid 10-digit Indian mobile number"
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full rounded-xl border border-gold-200/30 bg-choco-500 p-3 font-body text-cream-100 focus:border-gold-200 focus:outline-none placeholder:text-cream-200/30"
                    />
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gold-200 px-6 py-4 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 transition-all hover:bg-gold-100 hover:shadow-glow-gold active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                      Place Order
                    </button>
                    <button
                      type="button"
                      onClick={() => setScreen('summary')}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-gold-200/25 px-6 py-4 font-label text-sm font-semibold uppercase tracking-wider text-gold-200 transition-all hover:bg-gold-200/10 active:scale-95"
                    >
                      <Pencil className="h-4 w-4" />
                      Back to Menu
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Success Screen ── */}
            {screen === 'success' && (
              <div className="flex flex-col items-center p-6 text-center sm:p-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mb-2 font-display text-2xl font-semibold text-cream-100">
                  Order Received!
                </h3>
                <p className="mb-6 font-body text-cream-200/70">
                  Your order #{orderId.slice(0, 8)} has been saved. We will get back to you with pricing and availability to your WhatsApp number.
                </p>

                {isEditingPhone ? (
                  <form 
                    className="w-full space-y-4 mb-6 rounded-2xl border border-gold-200/20 bg-choco-500 p-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setLoading(true);
                      await updateOrderPhone(orderId, customerPhone);
                      setLoading(false);
                      setIsEditingPhone(false);
                    }}
                  >
                    <div className="text-left">
                      <label className="mb-1 block font-label text-xs uppercase tracking-wider text-gold-200">Add your WhatsApp number</label>
                      <input
                        required
                        type="tel"
                        pattern="^(\+91[\-\s]?)?[6-9]\d{9}$"
                        title="Please enter a valid 10-digit Indian mobile number"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        className="w-full rounded-xl border border-gold-200/30 bg-choco-400 p-3 font-body text-cream-100 focus:border-gold-200 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingPhone(false)}
                        className="flex-1 rounded-full border border-gold-200/20 py-2.5 font-label text-xs uppercase text-gold-200 transition hover:bg-gold-200/10"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-full bg-gold-200 py-2.5 font-label text-xs uppercase text-choco-600 transition hover:bg-gold-100 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mb-6 flex w-full items-center justify-between rounded-xl border border-gold-200/10 bg-choco-300/40 px-4 py-3 text-left">
                    <div>
                      <p className="font-label text-[10px] uppercase tracking-widest text-cream-200/50">WhatsApp Number</p>
                      <p className="font-body text-sm font-semibold text-cream-100">{customerPhone}</p>
                    </div>
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="flex items-center gap-1.5 rounded-full border border-gold-200/20 px-3 py-1.5 font-label text-xs uppercase text-gold-200 transition-colors hover:bg-gold-200/10"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                )}

                <div className="w-full space-y-3">
                  <button
                    onClick={handleShowQr}
                    className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gold-200 px-6 py-4 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 transition-all hover:bg-gold-100 hover:shadow-glow-gold active:scale-95"
                  >
                    <Smartphone className="h-5 w-5" />
                    Fast-track via WhatsApp
                  </button>
                  <button
                    onClick={closeAll}
                    className="w-full rounded-full border border-gold-200/25 px-6 py-4 font-label text-sm font-semibold uppercase tracking-wider text-gold-200 transition-all hover:bg-gold-200/10 active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* ── Summary Screen ── */}
            {screen === 'summary' && (
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="section-label">Your Order</p>
                    <h3 className="font-display text-2xl font-semibold text-cream-100">
                      {totalItems === 1 ? '1 item' : `${totalItems} items`}
                    </h3>
                  </div>
                  <button
                    onClick={closeAll}
                    aria-label="Close"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-200/20 text-gold-200 transition-colors hover:bg-gold-200 hover:text-choco-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-[50vh] space-y-3 overflow-y-auto">
                  {items.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 rounded-2xl border border-gold-200/10 bg-choco-300/40 p-3"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-display text-base font-semibold text-cream-100">
                          {product.name}
                        </p>
                        <p className="font-label text-xs uppercase tracking-wider text-gold-200/70">
                          Qty {qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDecrement(product.id)}
                          aria-label={`Decrease ${product.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-200/25 text-gold-200 transition-all hover:bg-gold-200 hover:text-choco-600 active:scale-90"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[2ch] text-center font-display text-base font-semibold text-cream-100">
                          {qty}
                        </span>
                        <button
                          onClick={() => onIncrement(product.id)}
                          aria-label={`Increase ${product.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-200 text-choco-600 transition-all hover:bg-gold-100 active:scale-90"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => setScreen('checkout')}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-200 px-6 py-4 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 transition-all hover:bg-gold-100 active:scale-95"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={onClear}
                    className="w-full font-label text-xs font-semibold uppercase tracking-wider text-cream-200/50 transition-colors hover:text-gold-200"
                  >
                    Clear order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
