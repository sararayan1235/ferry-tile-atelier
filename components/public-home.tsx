"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { BookingForm } from "@/components/booking-form";
import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle, useLanguage } from "@/components/client-controls";
import { BUSINESS } from "@/lib/business";

type Material = { key: string; name: string; strengths: string; watch: string };

const copy = {
  nl: {
    skip: "Naar de inhoud",
    nav: { services: "Diensten", materials: "Materialen", process: "Werkwijze", contact: "Contact" },
    account: "Mijn account",
    cta: "Offerte aanvragen",
    heroEyebrow: "Tegelatelier · Zoetermeer",
    heroTitle: ["Vakwerk", "in steen."],
    heroLead: "Tegelwerk, natuursteen en onderhoud met de precisie van een kleermaker. Bij u thuis, in Zoetermeer en omgeving.",
    heroSecondary: "Bekijk materialen",
    facts: ["Op locatie", "Nederlands & Engels", "Direct contact"],
    heroCaption: "Marmer · licht en structuur",
    servicesEyebrow: "Wat wij doen",
    servicesTitle: "Vier vakgebieden, één standaard.",
    servicesText: "Klein werk of een complete ruimte: dezelfde zorg voor elke snede en elke voeg.",
    services: [
      ["Tegelwerk", "Wanden en vloeren, strak uitgezet en gezet."],
      ["Reparatie & onderhoud", "Eén gebarsten tegel of een hele voeg: we herstellen zonder te slopen."],
      ["Natuursteen op maat", "Werkbladen, dorpels en vensterbanken, gemeten en gezaagd voor uw ruimte."],
      ["Voegen & afwerking", "Nieuwe voegen, kitwerk en impregneren voor een rustig, duurzaam resultaat."],
    ],
    materialsEyebrow: "Materialen",
    materialsTitle: "Het juiste materiaal, eerlijk uitgelegd.",
    materialsText: "Elk materiaal heeft sterke punten en aandachtspunten. We helpen u kiezen wat past bij uw ruimte en gebruik.",
    strengths: "Sterk in",
    watch: "Let op",
    materials: [
      { key: "graniet", name: "Graniet", strengths: "Krasbestendig · Hittebestendig", watch: "Gevoelig voor zure middelen" },
      { key: "marmer", name: "Marmer", strengths: "Tijdloos · Elke plaat uniek", watch: "Vlek- en krasgevoelig" },
      { key: "kwartsiet", name: "Kwartsiet", strengths: "Zeer hard · Slijtvast", watch: "Gevoelig voor zure middelen" },
      { key: "composiet", name: "Composiet", strengths: "Veel kleuren · Stootvast", watch: "Niet hittebestendig" },
      { key: "keramiek", name: "Keramiek", strengths: "Onderhoudsarm · Hittebestendig", watch: "Minder stootvast" },
    ] as Material[],
    processEyebrow: "Werkwijze",
    processTitle: "Duidelijk van begin tot eind.",
    processText: "Geen verrassingen. U weet wie er komt, wat er gebeurt en wat het kost.",
    process: [
      ["Aanvragen", "U vertelt online wat er moet gebeuren en waar."],
      ["Beoordelen", "U ontvangt een reactie en een voorgestelde datum."],
      ["Uitvoeren", "Wij werken zorgvuldig, schoon en volgens afspraak."],
      ["Opleveren", "Alles wordt gecontroleerd en met u doorgelopen."],
    ],
    aboutEyebrow: "Over ons",
    aboutQuote: "Wij werken zoals een kleermaker: eerst meten, dan passen, dan pas afwerken.",
    aboutText: "S.R. Klus- & onderhoudswerk is een tegelatelier uit Zoetermeer. Van één gebarsten tegel tot een complete badkamer: dezelfde zorg voor elke voeg.",
    workLarge: "Vakmanschap / 01",
    workSmall: "Zellige in groen / 02",
    bookingEyebrow: "Offerte aanvragen",
    bookingTitle: "Vertel ons over uw ruimte.",
    bookingText: "Vul het formulier in en log in of maak gratis een account. U krijgt direct een referentie en volgt de status in uw portaal.",
    privacy: "Uw gegevens worden alleen gebruikt om deze aanvraag te behandelen.",
    footerPortal: "Klantportaal",
    footerNote: "Fine tile atelier · Zoetermeer en omgeving",
  },
  en: {
    skip: "Skip to content",
    nav: { services: "Services", materials: "Materials", process: "Process", contact: "Contact" },
    account: "My account",
    cta: "Get a quote",
    heroEyebrow: "Tile atelier · Zoetermeer",
    heroTitle: ["Craft", "in stone."],
    heroLead: "Tiling, natural stone and maintenance with a tailor's precision. At your home, in Zoetermeer and the surrounding area.",
    heroSecondary: "View materials",
    facts: ["On site", "Dutch & English", "Direct contact"],
    heroCaption: "Marble · light and texture",
    servicesEyebrow: "What we do",
    servicesTitle: "Four crafts, one standard.",
    servicesText: "A small repair or a complete room: the same care for every cut and every joint.",
    services: [
      ["Tiling", "Walls and floors, precisely set out and laid."],
      ["Repair & maintenance", "One cracked tile or a whole joint: we repair without tearing out."],
      ["Bespoke natural stone", "Worktops, sills and thresholds, measured and cut for your room."],
      ["Grouting & finishing", "New joints, sealant and impregnation for a calm, lasting finish."],
    ],
    materialsEyebrow: "Materials",
    materialsTitle: "The right material, honestly explained.",
    materialsText: "Every material has strengths and trade-offs. We help you choose what suits your room and how you use it.",
    strengths: "Strengths",
    watch: "Watch out for",
    materials: [
      { key: "graniet", name: "Granite", strengths: "Scratch-resistant · Heat-resistant", watch: "Sensitive to acidic cleaners" },
      { key: "marmer", name: "Marble", strengths: "Timeless · Every slab unique", watch: "Prone to stains and scratches" },
      { key: "kwartsiet", name: "Quartzite", strengths: "Very hard · Wear-resistant", watch: "Sensitive to acidic cleaners" },
      { key: "composiet", name: "Composite", strengths: "Many colours · Impact-resistant", watch: "Not heat-resistant" },
      { key: "keramiek", name: "Ceramic", strengths: "Low maintenance · Heat-resistant", watch: "Less impact-resistant" },
    ] as Material[],
    processEyebrow: "How it works",
    processTitle: "Clear from start to finish.",
    processText: "No surprises. You know who is coming, what will happen and what it costs.",
    process: [
      ["Request", "Tell us online what needs doing and where."],
      ["Assessment", "You receive a reply and a proposed date."],
      ["Execution", "We work carefully, cleanly and as agreed."],
      ["Handover", "Everything is checked and walked through with you."],
    ],
    aboutEyebrow: "About us",
    aboutQuote: "We work like a tailor: measure first, then fit, and only then finish.",
    aboutText: "S.R. Klus- & onderhoudswerk is a tile atelier from Zoetermeer. From one cracked tile to a complete bathroom: the same care for every joint.",
    workLarge: "Craftsmanship / 01",
    workSmall: "Green zellige / 02",
    bookingEyebrow: "Get a quote",
    bookingTitle: "Tell us about your space.",
    bookingText: "Fill in the form and sign in or create a free account. You get a reference straight away and can follow the status in your portal.",
    privacy: "Your details are only used to handle this request.",
    footerPortal: "Customer portal",
    footerNote: "Fine tile atelier · Zoetermeer and surroundings",
  },
};

export function PublicHome({ accountsEnabled }: { accountsEnabled: boolean }) {
  const [language, setLanguage] = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const t = copy[language];

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 40);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={loaded ? "is-loaded" : undefined}>
      <a className="skip-link" href="#main">{t.skip}</a>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" aria-label="S.R. Fine Tile Atelier, home"><BrandMark /></Link>
          <nav className="site-nav" aria-label={language === "nl" ? "Hoofdnavigatie" : "Main navigation"}>
            <a href="#diensten">{t.nav.services}</a>
            <a href="#materialen">{t.nav.materials}</a>
            <a href="#werkwijze">{t.nav.process}</a>
            <a href="#contact">{t.nav.contact}</a>
          </nav>
          <div className="header-actions">
            <LanguageToggle language={language} onChange={setLanguage} />
            <Link className="text-link" href="/login">{t.account}</Link>
            <a className="button button-primary button-small" href="#booking">{t.cta}</a>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="container hero" data-scroll-progress>
          <div className="hero-copy">
            <p className="eyebrow enter" style={{ "--d": ".1s" } as React.CSSProperties}>{t.heroEyebrow}</p>
            <h1 className="lines">
              <span><span style={{ "--d": ".15s" } as React.CSSProperties}>{t.heroTitle[0]}</span></span>
              <span><span style={{ "--d": ".28s" } as React.CSSProperties}>{t.heroTitle[1]}</span></span>
            </h1>
            <p className="lead enter" style={{ "--d": ".5s" } as React.CSSProperties}>{t.heroLead}</p>
            <div className="button-row enter" style={{ "--d": ".65s" } as React.CSSProperties}>
              <a className="button button-primary" href="#booking">{t.cta} <ArrowRight aria-hidden="true" /></a>
              <a className="button button-secondary" href="#materialen">{t.heroSecondary}</a>
            </div>
            <p className="hero-facts enter" style={{ "--d": ".8s" } as React.CSSProperties}>
              {t.facts.map((fact) => <span key={fact}><Check aria-hidden="true" />{fact}</span>)}
            </p>
          </div>
          <div className="hero-visual">
            <div className="tile-split" role="img" aria-label={language === "nl" ? "Badkamer met marmeren tegels en messing details" : "Bathroom with marble tiles and brass details"} style={{ "--img": "url(/assets/hero-bathroom.webp)" } as React.CSSProperties}>
              <span className="tile t1" /><span className="tile t2" /><span className="tile t3" /><span className="tile t4" />
            </div>
            <p className="hero-caption enter" style={{ "--d": ".9s" } as React.CSSProperties}><span>{t.heroCaption}</span><span>01 / 04</span></p>
          </div>
        </section>

        <section className="section" id="diensten" aria-labelledby="services-title">
          <div className="container">
            <div className="section-head">
              <div><p className="eyebrow" data-r="rise">{t.servicesEyebrow}</p><h2 id="services-title" data-r="rise" style={{ "--d": ".1s" } as React.CSSProperties}>{t.servicesTitle}</h2></div>
              <p data-r="rise" style={{ "--d": ".2s" } as React.CSSProperties}>{t.servicesText}</p>
            </div>
            <ol className="service-rows">
              {t.services.map(([title, text], i) => (
                <li className="service-row" key={title}>
                  <i data-r="draw" style={{ "--d": `${i * 0.08}s` } as React.CSSProperties} />
                  <span className="num" data-r="rise" style={{ "--d": `${0.15 + i * 0.08}s` } as React.CSSProperties}>0{i + 1}</span>
                  <h3 data-r="rise" style={{ "--d": `${0.2 + i * 0.08}s` } as React.CSSProperties}>{title}</h3>
                  <p data-r="rise" style={{ "--d": `${0.25 + i * 0.08}s` } as React.CSSProperties}>{text}</p>
                  <ArrowUpRight aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section-sunken" id="materialen" aria-labelledby="materials-title">
          <div className="container">
            <div className="section-head">
              <div><p className="eyebrow" data-r="rise">{t.materialsEyebrow}</p><h2 id="materials-title" data-r="rise" style={{ "--d": ".1s" } as React.CSSProperties}>{t.materialsTitle}</h2></div>
              <p data-r="rise" style={{ "--d": ".2s" } as React.CSSProperties}>{t.materialsText}</p>
            </div>
            <div className="material-grid">
              {t.materials.map((m, i) => (
                <article className="material" key={m.key} data-r="flip" style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}>
                  <div className={`swatch sw-${m.key}`} aria-hidden="true" />
                  <h3>{m.name}</h3>
                  <dl><dt>{t.strengths}</dt><dd>{m.strengths}</dd><dt>{t.watch}</dt><dd>{m.watch}</dd></dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="werkwijze" aria-labelledby="process-title">
          <div className="container">
            <div className="section-head">
              <div><p className="eyebrow" data-r="rise">{t.processEyebrow}</p><h2 id="process-title" data-r="rise" style={{ "--d": ".1s" } as React.CSSProperties}>{t.processTitle}</h2></div>
              <p data-r="rise" style={{ "--d": ".2s" } as React.CSSProperties}>{t.processText}</p>
            </div>
            <ol className="process-list">
              {t.process.map(([title, text], i) => (
                <li key={title} data-r="rise" style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section-sunken" aria-labelledby="about-title">
          <div className="container">
            <div className="about">
              <div className="about-copy">
                <p className="eyebrow" data-r="rise" id="about-title">{t.aboutEyebrow}</p>
                <blockquote data-r="rise" style={{ "--d": ".1s" } as React.CSSProperties}>{t.aboutQuote}</blockquote>
                <p data-r="rise" style={{ "--d": ".2s" } as React.CSSProperties}>{t.aboutText}</p>
                <p className="about-points" data-r="rise" style={{ "--d": ".3s" } as React.CSSProperties}>{t.facts.map((fact) => <span key={fact}>{fact}</span>)}</p>
              </div>
              <div className="about-photo" data-r="rise" style={{ "--d": ".15s" } as React.CSSProperties}>
                <Image src="/assets/craft-detail.webp" alt={language === "nl" ? "Vakman legt een natuurstenen tegel" : "Craftsman laying a natural stone tile"} fill sizes="(max-width: 900px) 100vw, 40vw" data-parallax />
              </div>
            </div>
            <div className="work-strip">
              <figure data-r="rise"><Image src="/assets/hero-bathroom.webp" alt={language === "nl" ? "Afgewerkte marmeren badkamer" : "Finished marble bathroom"} fill sizes="(max-width: 900px) 100vw, 58vw" /><figcaption>{t.workLarge}</figcaption></figure>
              <figure data-r="rise" style={{ "--d": ".12s" } as React.CSSProperties}><Image src="/assets/green-kitchen.webp" alt={language === "nl" ? "Groene zellige tegels in een keuken" : "Green zellige tiles in a kitchen"} fill sizes="(max-width: 900px) 100vw, 40vw" /><figcaption>{t.workSmall}</figcaption></figure>
            </div>
          </div>
        </section>

        <section className="section" id="booking" aria-labelledby="booking-title">
          <div className="container booking-grid">
            <div className="booking-intro" id="contact">
              <p className="eyebrow" data-r="rise">{t.bookingEyebrow}</p>
              <h2 id="booking-title" data-r="rise" style={{ "--d": ".1s" } as React.CSSProperties}>{t.bookingTitle}</h2>
              <p data-r="rise" style={{ "--d": ".2s" } as React.CSSProperties}>{t.bookingText}</p>
              <div className="contact-block" data-r="rise" style={{ "--d": ".3s" } as React.CSSProperties}>
                <strong>{BUSINESS.name}</strong>
                <a className="tel" href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>
                <address>{BUSINESS.addressLine1}<br />{BUSINESS.addressLine2}</address>
              </div>
              <p className="secure-note"><ShieldCheck aria-hidden="true" />{t.privacy}</p>
            </div>
            <BookingForm enabled={accountsEnabled} language={language} />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} {BUSINESS.name} · {t.footerNote}</span>
          <div className="footer-links"><Link href="/login">{t.footerPortal}</Link><a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a></div>
        </div>
      </footer>
    </div>
  );
}
