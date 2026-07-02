import { createFileRoute, Link } from "@tanstack/react-router";
import restaurantHero from "@/assets/restaurant-hero.png";
import dishAttieke from "@/assets/dish-attieke.jpg";
import dishSpaghetti from "@/assets/dish-spaghetti.jpg";
import dishRiz from "@/assets/dish-riz.jpg";
import chefNorbertNew from "@/assets/chef-norbert-new.png";
import { useCart, formatFCFA } from "@/hooks/use-cart";
import { CONTACT } from "@/lib/menu-data";

export const Route = createFileRoute("/")({
  component: Index,
});

const dishes = [
  {
    name: "Attiéké + Tilapia",
    price: "à partir de 2 500 FCFA",
    image: dishAttieke,
    description:
      "Semoule de manioc, alloco doré et tilapia grillé — sauce piment maison.",
  },
  {
    name: "Spaghetti Sauté",
    price: "à partir de 1 500 FCFA",
    image: dishSpaghetti,
    description:
      "Sauce tomate maison, viande de bœuf mijotée aux épices du terroir.",
  },
  {
    name: "Riz Cantonné Maison",
    price: "à partir de 2 000 FCFA",
    image: dishRiz,
    description:
      "Riz sauté aux légumes croquants et cuisse de poulet dorée façon Norbert.",
  },
];

function Index() {
  const cart = useCart();

  return (
    <div className="bg-bg-soft font-nunito text-sienne-dark">
      {/* Nav */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          to="/"
          className="font-lora text-2xl font-bold tracking-tight text-sienne-dark underline decoration-sienne-light underline-offset-4"
        >
          Les Délices de Norbert
        </Link>
        <div className="flex items-center gap-8">
          <div className="hidden gap-6 text-sm font-semibold uppercase tracking-widest md:flex">
            <Link to="/menu" className="transition-colors hover:text-sienne-light">
              Menu
            </Link>
            <a href="#histoire" className="transition-colors hover:text-sienne-light">
              Notre Histoire
            </a>
            <a
              href="#localisation"
              className="transition-colors hover:text-sienne-light"
            >
              Localisation
            </a>
          </div>
          <Link
            to="/menu"
            className="relative flex items-center rounded-full bg-sienne-dark p-2 text-white"
          >
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sienne-light text-[10px] font-bold text-sienne-dark">
              {cart.count}
            </span>
            <span className="px-2 text-xs font-bold">PANIER</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto mb-16 max-w-7xl px-6">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8 aspect-[21/9] w-full overflow-hidden rounded-2xl outline outline-1 -outline-offset-1 outline-sienne-dark/10">
              <img
                src={restaurantHero}
                alt="Terrasse du restaurant Les Délices de Norbert à Lomé"
                width={1600}
                height={896}
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="mb-4 font-lora text-5xl leading-[1.1] md:text-7xl">
              La saveur{" "}
              <span className="italic text-sienne-light">authentique</span> du Togo à
              Lomé.
            </h1>
          </div>
          <div className="pb-2 lg:col-span-4">
            <p className="mb-6 text-lg italic leading-relaxed text-sienne-mid">
              « Ici, on ne mange pas seulement, on voyage au cœur de nos traditions
              familiales. »
            </p>
            <Link
              to="/menu"
              className="block w-full rounded-lg bg-sienne-dark py-4 text-center font-bold uppercase tracking-widest text-sienne-cream transition-all hover:bg-sienne-mid"
            >
              Commander en ligne
            </Link>
            {cart.count > 0 && (
              <p className="mt-3 text-center text-xs font-semibold text-sienne-mid">
                {cart.count} article{cart.count > 1 ? "s" : ""} dans votre panier •{" "}
                {formatFCFA(cart.total)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Spécialités */}
      <section id="specialites" className="bg-sienne-dark py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="mb-2 font-lora text-4xl text-sienne-cream">
                Nos Spécialités
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest text-sienne-light">
                Cuisinées avec passion tous les jours
              </p>
            </div>
            <div className="flex gap-4">
              <span className="rounded-full border border-sienne-light/30 bg-sienne-light/20 px-4 py-2 text-xs font-bold text-sienne-light">
                Petit-Déjeuner dès 6h
              </span>
              <span className="rounded-full bg-sienne-cream px-4 py-2 text-xs font-bold text-sienne-dark">
                Déjeuner & Dîner
              </span>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish) => (
              <article key={dish.name} className="group">
                <div className="mb-4 aspect-square overflow-hidden rounded-xl outline outline-1 -outline-offset-1 outline-sienne-cream/10">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    width={800}
                    height={800}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="font-lora text-xl text-sienne-cream">{dish.name}</h3>
                  <span className="whitespace-nowrap text-sm font-bold text-sienne-light">
                    {dish.price}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-sienne-cream/60">
                  {dish.description}
                </p>
                <Link
                  to="/menu"
                  className="text-xs font-bold uppercase tracking-widest text-sienne-light hover:underline"
                >
                  Voir le menu →
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/menu"
              className="inline-block rounded-full bg-sienne-cream px-8 py-4 text-xs font-bold uppercase tracking-widest text-sienne-dark transition-all hover:bg-sienne-light"
            >
              Voir toute la carte →
            </Link>
          </div>
        </div>
      </section>

      {/* Histoire / Localisation */}
      <section id="histoire" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-sienne-mid">
              Notre Histoire
            </span>
            <h2 className="mb-6 font-lora text-4xl">
              À Klikamé, Norbert vous accueille chaque matin dès 6h.
            </h2>
            <p className="mb-8 leading-relaxed text-sienne-dark/80">
              Situé près de la station T Oil au cœur de Lomé, notre restaurant
              familial est devenu le point de rencontre de ceux qui cherchent la
              vraie cuisine togolaise. Pas de chichis, juste du goût — servi chaud,
              généreux, préparé chaque jour avec des produits frais.
            </p>
            <div
              id="localisation"
              className="rounded-2xl border border-sienne-cream bg-sienne-cream/30 p-6"
            >
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest">
                Où nous trouver ?
              </h3>
              <p className="mb-4 text-sm italic">{CONTACT.address}</p>
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase text-sienne-mid">
                    Ouvert
                  </p>
                  <p className="text-sm font-semibold">{CONTACT.hours}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-sienne-mid">
                    Contact
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">T-Money</span>
                    <a
                      href={`tel:+228${CONTACT.tmoneyNumber}`}
                      className="block text-sm font-semibold hover:text-sienne-light"
                    >
                      +228 {CONTACT.tmoneyNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4")}
                    </a>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">Flooz</span>
                    <a
                      href={`tel:+228${CONTACT.floozNumber}`}
                      className="block text-sm font-semibold hover:text-sienne-light"
                    >
                      +228 {CONTACT.floozNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4")}
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  💵 Espèces
                </span>
                <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  📲 T-Money · {CONTACT.tmoneyNumber}
                </span>
                <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  📲 Flooz · {CONTACT.floozNumber}
                </span>
                <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  🛵 Livraison
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl outline outline-1 -outline-offset-1 outline-sienne-dark/10">
              <img
                src={chefNorbertNew}
                alt="Portrait de Norbert, chef du restaurant"
                width={800}
                height={1000}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-sienne-light p-8 text-white md:block">
              <p className="font-lora text-3xl">« Bon appétit ! »</p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-2xl outline outline-1 -outline-offset-1 outline-sienne-dark/10">
          <iframe
            src="https://maps.google.com/maps?q=Klikam%C3%A9%2C+Lom%C3%A9%2C+Togo&output=embed&z=15"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation Les Délices de Norbert"
            className="w-full"
          />
        </div>
        <p className="mt-3 text-center text-xs text-sienne-dark/50">
          📍 Klikamé, près de la station T Oil — Lomé, Togo
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-sienne-dark px-6 py-12 text-sienne-cream/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-xs font-bold uppercase tracking-widest">
            © 2026 Les Délices de Norbert — {CONTACT.address}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest">
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-sienne-light"
            >
              WhatsApp
            </a>
            <a
              href={`tel:+228${CONTACT.tmoneyNumber}`}
              className="transition-colors hover:text-sienne-light"
            >
              T-Money · {CONTACT.tmoneyNumber}
            </a>
            <a
              href={`tel:+228${CONTACT.floozNumber}`}
              className="transition-colors hover:text-sienne-light"
            >
              Flooz · {CONTACT.floozNumber}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
