import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useCallback } from "react";
import {
  ShoppingCart, X, Coffee, Fish, Utensils, GlassWater,
  UtensilsCrossed, Truck, ShoppingBag, Banknote, Smartphone,
  Send, CheckCircle, AlertCircle, Loader2, Navigation,
  MapPin, MessageSquare, User, Phone, CreditCard, ChefHat,
  Wheat, Minus, Plus, ArrowLeft,
} from "lucide-react";
import { menu, CONTACT } from "@/lib/menu-data";
import { useCart, formatFCFA } from "@/hooks/use-cart";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Les Délices de Norbert" },
      {
        name: "description",
        content:
          "Le menu complet : petit déjeuner, spaghetti, attiéké, couscous, riz cantonné, jus bio et boissons traditionnelles. Commande sur place, à emporter ou en livraison.",
      },
      { property: "og:title", content: "Menu — Les Délices de Norbert" },
      {
        property: "og:description",
        content:
          "Attiéké, spaghetti, couscous, riz cantonné, jus bissape et baobab — le menu complet de Norbert à Lomé.",
      },
    ],
  }),
  component: MenuPage,
});

type Mode = "sur-place" | "livraison" | "emporter";
type Payment = "especes" | "t-money" | "flooz";
type PayStep = "idle" | "loading" | "success" | "error";

// Map category id → Lucide icon
const CAT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "petit-dejeuner": Coffee,
  "spaghetti": UtensilsCrossed,
  "attieke": Fish,
  "couscous": ChefHat,
  "riz-cantonne": Wheat,
  "boissons": GlassWater,
};

// FedaPay API integration
const FEDAPAY_BASE = "https://api.fedapay.com/v1";

async function initiateFedaPayPayment(params: {
  phone: string;
  amount: number;
  network: "flooz" | "tmoney";
  customerName: string;
  description: string;
  apiKey: string;
}): Promise<{ success: boolean; transactionId?: string; message?: string }> {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    };

    const txRes = await fetch(`${FEDAPAY_BASE}/transactions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        description: params.description,
        amount: params.amount,
        currency: { iso: "XOF" },
        customer: {
          firstname: params.customerName.split(" ")[0] || params.customerName,
          lastname: params.customerName.split(" ").slice(1).join(" ") || "-",
          phone_number: { number: params.phone, country: "TG" },
        },
      }),
    });
    const txData = await txRes.json();
    const txId: number = txData?.v1?.transaction?.id;
    if (!txId) {
      return { success: false, message: txData?.message || "Création transaction échouée." };
    }

    const payRes = await fetch(`${FEDAPAY_BASE}/transactions/${txId}/pay`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        currency: { iso: "XOF" },
        mode: params.network,
        mobile_money: { number: params.phone },
      }),
    });
    const payData = await payRes.json();
    if (payData?.v1?.transaction?.status === "pending" || payRes.ok) {
      return { success: true, transactionId: String(txId) };
    }
    return { success: false, message: payData?.message || "Paiement échoué." };
  } catch {
    return { success: false, message: "Erreur réseau. Vérifiez votre connexion." };
  }
}

function MenuPage() {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<Mode>("sur-place");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<Payment>("especes");
  const [note, setNote] = useState("");
  const [activeCat, setActiveCat] = useState(menu[0].id);

  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const [payStep, setPayStep] = useState<PayStep>("idle");
  const [payError, setPayError] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const FEDAPAY_API_KEY = import.meta.env.VITE_FEDAPAY_KEY ?? "";

  const captureGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("Géolocalisation non supportée par votre navigateur.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      () => {
        setGpsError("Impossible d'obtenir votre position. Activez la géolocalisation.");
        setGpsLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  const canSubmit = useMemo(() => {
    if (cart.items.length === 0) return false;
    if (!name.trim() || !phone.trim()) return false;
    if (mode === "livraison" && !address.trim()) return false;
    return true;
  }, [cart.items.length, name, phone, mode, address]);

  const mapsLink = gpsCoords
    ? `https://maps.google.com/?q=${gpsCoords.lat},${gpsCoords.lng}`
    : null;

  const whatsappUrl = useMemo(() => {
    const lines: string[] = [];
    lines.push("*Nouvelle commande — Les Délices de Norbert*");
    lines.push("");
    lines.push(`Nom : ${name}`);
    lines.push(`Tel : ${phone}`);
    lines.push(`Mode : ${mode === "sur-place" ? "Sur place" : mode === "livraison" ? "Livraison" : "À emporter"}`);
    if (mode === "livraison") {
      lines.push(`Adresse : ${address}`);
      if (mapsLink) lines.push(`Position GPS : ${mapsLink}`);
    }
    lines.push(`Paiement : ${payment === "especes" ? "Espèces" : payment === "t-money" ? `T-Money (${CONTACT.tmoneyNumber})` : `Flooz (${CONTACT.floozNumber})`}`);
    if (transactionId) lines.push(`Transaction FedaPay : ${transactionId}`);
    lines.push("");
    lines.push("*Articles :*");
    cart.items.forEach((i) => {
      lines.push(`- ${i.qty} x ${i.name} : ${formatFCFA(i.qty * i.price)}`);
    });
    lines.push("");
    lines.push(`*Total : ${formatFCFA(cart.total)}*`);
    if (note.trim()) lines.push(`\nNote : ${note}`);
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [cart.items, cart.total, name, phone, mode, address, payment, note, mapsLink, transactionId]);

  const handleOnlinePayment = useCallback(async () => {
    if (!canSubmit) return;
    if (!phone.trim()) {
      setPayError("Entrez votre numéro de téléphone mobile money.");
      return;
    }
    setPayStep("loading");
    setPayError("");

    const network = payment === "flooz" ? "flooz" : "tmoney";
    const cleanPhone = phone.replace(/\s/g, "").replace("+228", "").replace("00228", "");

    const result = await initiateFedaPayPayment({
      phone: cleanPhone,
      amount: cart.total,
      network,
      customerName: name,
      description: `Commande Les Délices de Norbert — ${name}`,
      apiKey: FEDAPAY_API_KEY,
    });

    if (result.success) {
      setTransactionId(result.transactionId ?? "");
      setPayStep("success");
    } else {
      setPayError(result.message ?? "Paiement échoué.");
      setPayStep("error");
    }
  }, [canSubmit, phone, payment, cart.total, name, FEDAPAY_API_KEY]);

  const resetPay = () => {
    setPayStep("idle");
    setPayError("");
    setTransactionId("");
  };

  const isOnlinePayment = payment === "t-money" || payment === "flooz";

  return (
    <div className="min-h-screen bg-bg-soft font-nunito text-sienne-dark">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-sienne-dark/10 bg-bg-soft/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="font-lora text-xl font-bold tracking-tight text-sienne-dark underline decoration-sienne-light underline-offset-4 md:text-2xl"
          >
            Les Délices de Norbert
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <Link
              to="/"
              className="hidden text-sm font-semibold uppercase tracking-widest hover:text-sienne-light md:inline"
            >
              Accueil
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 rounded-full bg-sienne-dark px-4 py-2.5 text-white"
            >
              <ShoppingCart size={15} />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sienne-light text-[10px] font-bold text-sienne-dark">
                {cart.count}
              </span>
              <span className="text-xs font-bold">{formatFCFA(cart.total)}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Category tabs */}
      <div className="sticky top-[73px] z-30 border-b border-sienne-dark/10 bg-bg-soft/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {menu.map((cat) => {
              const Icon = CAT_ICONS[cat.id] ?? Utensils;
              return (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  onClick={() => setActiveCat(cat.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCat === cat.id
                      ? "bg-sienne-dark text-sienne-cream"
                      : "bg-sienne-cream/40 hover:bg-sienne-cream"
                  }`}
                >
                  <Icon size={13} />
                  {cat.title}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu items */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {menu.map((cat) => {
          const Icon = CAT_ICONS[cat.id] ?? Utensils;
          return (
            <section key={cat.id} id={cat.id} className="mb-14 scroll-mt-32">
              <h2 className="mb-6 flex items-center gap-3 font-lora text-3xl">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sienne-dark text-sienne-cream">
                  <Icon size={18} />
                </span>
                {cat.title}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between gap-3 rounded-2xl border border-sienne-dark/10 bg-white p-5"
                  >
                    <div>
                      <h3 className="mb-1 font-lora text-lg leading-tight">{item.name}</h3>
                      <p className="mb-2 text-sm leading-relaxed text-sienne-dark/60">
                        {item.description}
                      </p>
                      <p className="text-sm font-bold text-sienne-light">
                        {item.priceLabel ?? formatFCFA(item.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => cart.add({ id: item.id, name: item.name, price: item.price })}
                      className="w-full rounded-xl border border-sienne-dark/15 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:border-sienne-dark hover:bg-sienne-dark hover:text-sienne-cream"
                    >
                      Ajouter
                    </button>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Sticky floating cart (mobile) */}
      {cart.count > 0 && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-sienne-dark px-6 py-4 text-sienne-cream shadow-xl transition-transform hover:scale-105"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sienne-light text-xs font-bold text-sienne-dark">
            {cart.count}
          </span>
          <span className="text-sm font-bold uppercase tracking-widest">
            Panier · {formatFCFA(cart.total)}
          </span>
        </button>
      )}

      {/* Cart drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Fermer"
            className="absolute inset-0 bg-sienne-dark/60 backdrop-blur-sm"
            onClick={() => { setOpen(false); setCheckout(false); resetPay(); }}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-bg-soft shadow-2xl">
            <header className="flex items-center justify-between border-b border-sienne-dark/10 px-6 py-5">
              <h2 className="flex items-center gap-2 font-lora text-2xl">
                <ShoppingCart size={20} />
                {checkout ? "Finaliser la commande" : "Ma commande"}
              </h2>
              <button
                type="button"
                onClick={() => { setOpen(false); setCheckout(false); resetPay(); }}
                aria-label="Fermer"
                className="rounded-full p-1 text-sienne-dark/60 hover:bg-sienne-cream hover:text-sienne-dark"
              >
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cart.items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingCart size={48} className="mb-4 text-sienne-dark/20" />
                  <p className="mb-2 font-lora text-xl">Panier vide</p>
                  <p className="text-sm text-sienne-dark/60">Ajoutez des plats pour commander</p>
                </div>
              ) : !checkout ? (
                <ul className="space-y-4">
                  {cart.items.map((i) => (
                    <li key={i.id} className="flex items-start justify-between gap-3 border-b border-sienne-dark/5 pb-4">
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 font-lora text-base leading-tight">{i.name}</p>
                        <p className="text-sm text-sienne-mid">{formatFCFA(i.price)} l'unité</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => cart.setQty(i.id, i.qty - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full border border-sienne-dark/20 hover:bg-sienne-cream/40"
                          aria-label="Diminuer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                        <button
                          type="button"
                          onClick={() => cart.setQty(i.id, i.qty + 1)}
                          className="grid h-8 w-8 place-items-center rounded-full border border-sienne-dark/20 hover:bg-sienne-cream/40"
                          aria-label="Augmenter"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-5">
                  <Field label="Nom complet" icon={<User size={14} />} value={name} onChange={setName} placeholder="Kokou Norbert" />
                  <Field label="Téléphone" icon={<Phone size={14} />} value={phone} onChange={setPhone} placeholder="+228 90 00 00 00" type="tel" />

                  {/* Mode */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest">Mode de commande</p>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { v: "sur-place", label: "Sur place", Icon: UtensilsCrossed },
                        { v: "livraison", label: "Livraison", Icon: Truck },
                        { v: "emporter", label: "À emporter", Icon: ShoppingBag },
                      ] as { v: Mode; label: string; Icon: React.ComponentType<{ size?: number }> }[]).map((o) => (
                        <button
                          key={o.v}
                          type="button"
                          onClick={() => setMode(o.v)}
                          className={`rounded-xl border p-3 text-center text-xs font-bold transition-all ${
                            mode === o.v
                              ? "border-sienne-dark bg-sienne-dark text-sienne-cream"
                              : "border-sienne-dark/15 bg-white hover:border-sienne-light"
                          }`}
                        >
                          <div className="mb-1 flex justify-center"><o.Icon size={18} /></div>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {mode === "livraison" && (
                    <div>
                      <Field label="Adresse de livraison" icon={<MapPin size={14} />} value={address} onChange={setAddress} placeholder="Quartier, repère…" />
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={captureGps}
                          disabled={gpsLoading}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-sienne-dark/20 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:border-sienne-dark disabled:opacity-60"
                        >
                          {gpsLoading ? (
                            <><Loader2 size={14} className="animate-spin" /> Localisation…</>
                          ) : gpsCoords ? (
                            <><CheckCircle size={14} className="text-green-600" /> Position capturée</>
                          ) : (
                            <><Navigation size={14} /> Partager ma position GPS</>
                          )}
                        </button>
                        {gpsError && <p className="mt-1 text-[11px] text-red-500">{gpsError}</p>}
                        {gpsCoords && (
                          <p className="mt-1 text-[11px] text-green-700">
                            {gpsCoords.lat.toFixed(5)}, {gpsCoords.lng.toFixed(5)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Paiement */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest">Paiement</p>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { v: "especes", label: "Espèces", Icon: Banknote },
                        { v: "t-money", label: "T-Money", Icon: Smartphone },
                        { v: "flooz", label: "Flooz", Icon: CreditCard },
                      ] as { v: Payment; label: string; Icon: React.ComponentType<{ size?: number }> }[]).map((o) => (
                        <button
                          key={o.v}
                          type="button"
                          onClick={() => { setPayment(o.v); resetPay(); }}
                          className={`rounded-xl border p-3 text-center text-xs font-bold transition-all ${
                            payment === o.v
                              ? "border-sienne-dark bg-sienne-dark text-sienne-cream"
                              : "border-sienne-dark/15 bg-white hover:border-sienne-light"
                          }`}
                        >
                          <div className="mb-1 flex justify-center"><o.Icon size={18} /></div>
                          {o.label}
                        </button>
                      ))}
                    </div>
                    {payment === "t-money" && (
                      <p className="mt-2 text-[11px] text-sienne-dark/60">
                        Paiement T-Money vers <strong>{CONTACT.tmoneyNumber}</strong>
                      </p>
                    )}
                    {payment === "flooz" && (
                      <p className="mt-2 text-[11px] text-sienne-dark/60">
                        Paiement Flooz vers <strong>{CONTACT.floozNumber}</strong>
                      </p>
                    )}
                  </div>

                  {/* FedaPay status */}
                  {isOnlinePayment && payStep === "success" && (
                    <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                      <CheckCircle size={18} className="mt-0.5 shrink-0 text-green-600" />
                      <div>
                        <p className="text-sm font-bold text-green-700">Paiement initié</p>
                        <p className="text-xs text-green-600">
                          Validez la demande sur votre téléphone.
                          {transactionId && <> Réf : {transactionId}</>}
                        </p>
                      </div>
                    </div>
                  )}
                  {isOnlinePayment && payStep === "error" && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                      <div>
                        <p className="text-sm font-bold text-red-700">{payError}</p>
                        <button type="button" onClick={resetPay} className="mt-1 text-xs font-bold text-red-600 underline">
                          Réessayer
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                      <MessageSquare size={13} /> Note (optionnel)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-sienne-dark/15 bg-white p-3 text-sm outline-none focus:border-sienne-light"
                      placeholder="Sans piment, bien cuit…"
                    />
                  </div>
                </div>
              )}
            </div>

            {cart.items.length > 0 && (
              <footer className="border-t border-sienne-dark/10 bg-white px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-sienne-mid">Total</span>
                  <span className="font-lora text-2xl">{formatFCFA(cart.total)}</span>
                </div>
                {!checkout ? (
                  <button
                    type="button"
                    onClick={() => setCheckout(true)}
                    className="w-full rounded-xl bg-sienne-dark py-4 text-sm font-bold uppercase tracking-widest text-sienne-cream transition-all hover:bg-sienne-mid"
                  >
                    Passer commande
                  </button>
                ) : (
                  <div className="space-y-2">
                    {isOnlinePayment && payStep === "idle" && (
                      <button
                        type="button"
                        disabled={!canSubmit}
                        onClick={handleOnlinePayment}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold uppercase tracking-widest transition-all ${
                          canSubmit
                            ? "bg-sienne-dark text-sienne-cream hover:bg-sienne-mid"
                            : "cursor-not-allowed bg-sienne-dark/20 text-sienne-dark/40"
                        }`}
                      >
                        <CreditCard size={16} />
                        Payer {payment === "flooz" ? "Flooz" : "T-Money"} · {formatFCFA(cart.total)}
                      </button>
                    )}
                    {isOnlinePayment && payStep === "loading" && (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-sienne-dark/10 py-4 text-sm font-bold text-sienne-dark/50">
                        <Loader2 size={16} className="animate-spin" /> Traitement en cours…
                      </div>
                    )}

                    {(!isOnlinePayment || payStep === "success") && (
                      <a
                        href={canSubmit ? whatsappUrl : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={!canSubmit}
                        onClick={(e) => {
                          if (!canSubmit) { e.preventDefault(); return; }
                          setTimeout(() => { cart.clear(); setCheckout(false); setOpen(false); resetPay(); }, 400);
                        }}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-center text-sm font-bold uppercase tracking-widest transition-all ${
                          canSubmit
                            ? "bg-sienne-light text-sienne-dark hover:bg-sienne-cream"
                            : "cursor-not-allowed bg-sienne-dark/20 text-sienne-dark/40"
                        }`}
                      >
                        <Send size={15} /> Confirmer via WhatsApp
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => { setCheckout(false); resetPay(); }}
                      className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sienne-dark/50 hover:text-sienne-dark"
                    >
                      <ArrowLeft size={13} /> Retour au panier
                    </button>
                  </div>
                )}
              </footer>
            )}
          </aside>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-sienne-dark/10 bg-sienne-dark px-6 py-12 text-sienne-cream/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-xs font-bold uppercase tracking-widest">
            © 2026 Les Délices de Norbert — {CONTACT.address}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest">
            <a href={`tel:+228${CONTACT.tmoneyNumber}`} className="flex items-center gap-1.5 transition-colors hover:text-sienne-light">
              <Smartphone size={13} /> T-Money · {CONTACT.tmoneyNumber}
            </a>
            <a href={`tel:+228${CONTACT.floozNumber}`} className="flex items-center gap-1.5 transition-colors hover:text-sienne-light">
              <CreditCard size={13} /> Flooz · {CONTACT.floozNumber}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
        {icon} {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-sienne-dark/15 bg-white p-3 text-sm outline-none focus:border-sienne-light"
      />
    </div>
  );
}
