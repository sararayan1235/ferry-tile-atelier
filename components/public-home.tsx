"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, Check, MoveUpRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { BookingForm } from "@/components/booking-form";
import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/client-controls";

type Language = "nl" | "en";

type HomeCopy = {
  navServices: string;
  navMaterials: string;
  navProcess: string;
  navWork: string;
  navContact: string;
  login: string;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroText: string;
  primaryCta: string;
  secondaryCta: string;
  facts: string[];
  imageCaption: string;
  statementEyebrow: string;
  statementTitle: string;
  statementText: string;
  statementLink: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesText: string;
  services: { title: string; text: string }[];
  materialsEyebrow: string;
  materialsTitle: string;
  materialsText: string;
  materials: { name: string; note: string; tone: string }[];
  processEyebrow: string;
  processTitle: string;
  processText: string;
  process: { title: string; text: string }[];
  workEyebrow: string;
  workTitle: string;
  workText: string;
  bookingEyebrow: string;
  bookingTitle: string;
  bookingText: string;
  privacy: string;
  footerPortal: string;
  footerAdmin: string;
  footerNote: string;
  scroll: string;
};

const copy: Record<Language, HomeCopy> = {
  nl: {
    navServices: "Diensten",
    navMaterials: "Materialen",
    navProcess: "Werkwijze",
    navWork: "Werk",
    navContact: "Contact",
    login: "Inloggen",
    heroEyebrow: "Mobiel tegelatelier · heel Nederland",
    heroTitle: "Vakwerk met",
    heroAccent: "aandacht.",
    heroText: "Tegelwerk, reparatie en afwerking met de precisie van een atelier. Bij u op locatie, waar u ook bent.",
    primaryCta: "Afspraak aanvragen",
    secondaryCta: "Bekijk ons werk",
    facts: ["Op locatie in heel NL", "Nederlands & Engels", "Direct contact"],
    imageCaption: "Marmer · licht en structuur",
    statementEyebrow: "Onze manier",
    statementTitle: "Details maken het verschil.",
    statementText: "Van een enkele gebarsten tegel tot een volledige afwerking. Wij combineren ervaren vakmanschap met een zuin oog voor vorm, materiaal en afwerking.",
    statementLink: "Vertel ons over uw project",
    servicesEyebrow: "Wat wij doen",
    servicesTitle: "Voor elke ruimte een passende oplossing.",
    servicesText: "Klein werk of een volledige afwerking: wij houden de lijnen strak en het resultaat prettig om mee te werken.",
    services: [
      { title: "Tegelreparatie", text: "Een beschadigde tegel terug in balans, zonder de hele ruimte over te doen." },
      { title: "Vervangen & plaatsen", text: "Nieuwe tegels nauwkeurig geselecteerd, gesneden en geplaatst." },
      { title: "Voegen & afwerken", text: "Een rustige, duurzame afwerking die de architectuur laat spreken." },
      { title: "Werkbladen & maatwerk", text: "Werkbladen en details op maat, afgestemd op uw dagelijks gebruik." },
    ],
    materialsEyebrow: "Materiaal & vakmanschap",
    materialsTitle: "Goed werk begint bij het juiste materiaal.",
    materialsText: "Wij werken met natuurlijke steen, keramiek en composiet. Het materiaal bepaalt de sfeer; de uitvoering bepaalt of het blijft moeiteloos.",
    materials: [
      { name: "Natuursteen", note: "marmer · graniet · kwartsiet", tone: "swatch-stone" },
      { name: "Keramiek", note: "kleur · formaat · afwerking", tone: "swatch-clay" },
      { name: "Composiet", note: "praktisch · veelzijdig · sterk", tone: "swatch-sand" },
      { name: "Voegen", note: "klein detail, grote indruk", tone: "swatch-ink" },
    ],
    processEyebrow: "Werkwijze",
    processTitle: "Duidelijk van begin tot eind.",
    processText: "Geen verrassingen. U weet wie er komt, waarom er gewerkt wordt en wat er daarna gebeurt.",
    process: [
      { title: "Aanvragen", text: "U vertelt wat er moet gebeuren en waar." },
      { title: "Wij beoordelen", text: "U ontvangt een reactie en een passende voorgestelde datum." },
      { title: "Uitvoering", text: "Wij voeren het werk zorgvuldig en netjes uit." },
      { title: "Oplevering", text: "Alles wordt gecontroleerd en met u doorgenomen." },
    ],
    workEyebrow: "Geselecteerd werk",
    workTitle: "Textuur, licht en precies één goede lijn.",
    workText: "Een kleine selectie uit ons werk. Elk project begint met luisteren naar de ruimte.",
    bookingEyebrow: "Afspraak aanvragen",
    bookingTitle: "Ruimte voor een mooi resultaat.",
    bookingText: "Vul het formulier in en log in of maak een gratis account. U ontvangt een referentie en volgt de status van uw aanvraag.",
    privacy: "Uw gegevens worden alleen gebruikt om deze aanvraag en de service te behandelen.",
    footerPortal: "Klantenportaal",
    footerAdmin: "Beheer",
    footerNote: "Fine tile atelier · Zoetermeer en heel Nederland",
    scroll: "Scroll",
  },
  en: {
    navServices: "Services",
    navMaterials: "Materials",
    navProcess: "Process",
    navWork: "Selected work",
    navContact: "Contact",
    login: "Sign in",
    heroEyebrow: "Mobile tile atelier · across the Netherlands",
    heroTitle: "Craft with",
    heroAccent: "care.",
    heroText: "Tiling, repair and finishing with the precision of an atelier. We come to you, wherever you are.",
    primaryCta: "Request an appointment",
    secondaryCta: "View our work",
    facts: ["On site across NL", "Dutch & English", "Direct contact"],
    imageCaption: "Marble · light and structure",
    statementEyebrow: "Our approach",
    statementTitle: "Details make the difference.",
    statementText: "From one cracked tile to a complete finish. We combine experienced craftsmanship with a sharp eye for form, material and detail.",
    statementLink: "Tell us about your project",
    servicesEyebrow: "What we do",
    servicesTitle: "The right solution for every room.",
    servicesText: "Small repairs or a complete finish: we keep the lines clean and the result easy to live with.",
    services: [
      { title: "Tile repair", text: "A damaged tile brought back into balance, without renewing the entire room." },
      { title: "Replace & install", text: "New tiles carefully selected, cut and installed." },
      { title: "Grout & finishing", text: "A calm, durable finish that lets the architecture speak." },
      { title: "Worktops & custom work", text: "Worktops and details made to measure for how you live." },
    ],
    materialsEyebrow: "Material & craft",
    materialsTitle: "Good work starts with the right material.",
    materialsText: "We work with natural stone, ceramic and composite. Material sets the mood; execution keeps it effortless.",
    materials: [
      { name: "Natural stone", note: "marble · granite · quartzite", tone: "swatch-stone" },
      { name: "Ceramic", note: "colour · format · finish", tone: "swatch-clay" },
      { name: "Composite", note: "practical · versatile · strong", tone: "swatch-sand" },
      { name: "Grout", note: "a small detail, a big impression", tone: "swatch-ink" },
    ],
    processEyebrow: "How it works",
    processTitle: "Clear from start to finish.",
    processText: "No surprises. You know who is coming, why the work is being done and what happens next.",
    process: [
      { title: "Request", text: "Tell us what needs to happen and where." },
      { title: "We assess", text: "You receive a response and a suitable proposed date." },
      { title: "Execution", text: "We carry out the work carefully and neatly." },
      { title: "Handover", text: "Everything is checked and reviewed with you." },
    ],
    workEyebrow: "Selected work",
    workTitle: "Texture, light and exactly one good line.",
    workText: "A small selection of our work. Every project starts by listening to the room.",
    bookingEyebrow: "Request an appointment",
    bookingTitle: "Make room for a beautiful result.",
    bookingText: "Complete the form and sign in or create a free account. You will receive a reference and follow the status of your request.",
    privacy: "Your details are only used to handle this request and provide the service.",
    footerPortal: "Customer portal",
    footerAdmin: "Admin",
    footerNote: "Fine tile atelier · Zoetermeer and across the Netherlands",
    scroll: "Scroll",
  },
};

export function PublicHome({ accountsEnabled }: { accountsEnabled: boolean }) {
  const [language, setLanguage] = useState<Language>("nl");
  const t = copy[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("sr-language");
    if (saved !== "en" && saved !== "nl") return;
    const timer = window.setTimeout(() => setLanguage(saved), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("sr-language", language);
  }, [language]);

  return (
    <div className="stone-site">
      <header className="stone-header">
        <div className="stone-container stone-header-inner">
          <Link href="/" aria-label="S.R. Klus- en Onderhoudswerk, home"><BrandMark /></Link>
          <nav className="stone-nav" aria-label={language === "nl" ? "Hoofdnavigatie" : "Main navigation"}>
            <Link href="/#diensten">{t.navServices}</Link>
            <Link href="/#materialen">{t.navMaterials}</Link>
            <Link href="/#proces">{t.navProcess}</Link>
            <Link href="/#werk">{t.navWork}</Link>
            <Link href="/#contact">{t.navContact}</Link>
          </nav>
          <div className="stone-header-actions">
            <LanguageToggle language={language} onChange={setLanguage} />
            <Link className="button button-dark button-small" href="/login">{t.login}</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="stone-hero" id="top">
          <div className="stone-container stone-hero-grid">
            <div className="stone-hero-copy">
              <p className="eyebrow eyebrow-dark reveal">{t.heroEyebrow}</p>
              <h1 className="reveal delay-1">{t.heroTitle}<br /><em>{t.heroAccent}</em></h1>
              <p className="hero-copy reveal delay-2">{t.heroText}</p>
              <div className="button-row reveal delay-3">
                <a className="button button-dark" href="#booking">{t.primaryCta} <ArrowRight aria-hidden="true" /></a>
                <a className="button button-line" href="#werk">{t.secondaryCta} <ArrowDownRight aria-hidden="true" /></a>
              </div>
              <div className="hero-facts reveal delay-4">{t.facts.map((fact) => <span key={fact}><Check aria-hidden="true" />{fact}</span>)}</div>
            </div>
            <div className="stone-hero-visual reveal delay-2">
              <Image src="/assets/hero-bathroom.jpg" alt="Verfijnd afgewerkt badkamer met marmer en natuurlijk licht" fill priority sizes="(max-width: 800px) 100vw, 54vw" />
              <div className="image-wash" />
              <span className="image-caption">{t.imageCaption}</span>
              <span className="image-index">01 / 03</span>
            </div>
          </div>
          <a className="scroll-cue scroll-cue-dark" href="#diensten"><span>{t.scroll}</span><i /></a>
        </section>

        <section className="statement section-pad reveal" id="diensten">
          <div className="stone-container statement-grid">
            <div className="delay-1"><p className="eyebrow">{t.statementEyebrow}</p><h2>{t.statementTitle}</h2></div>
            <div className="delay-2"><p className="lead">{t.statementText}</p><a className="text-link" href="#booking">{t.statementLink} <ArrowRight aria-hidden="true" /></a></div>
          </div>
        </section>

        <section className="services section-pad section-tint reveal" aria-labelledby="services-title">
          <div className="stone-container">
            <div className="section-heading section-heading-wide delay-1"><div><p className="eyebrow">{t.servicesEyebrow}</p><h2 id="services-title">{t.servicesTitle}</h2></div><p>{t.servicesText}</p></div>
            <div className="service-list delay-2">{t.services.map((service, index) => <article className="service-row" key={service.title}><span className="service-number">0{index + 1}</span><h3>{service.title}</h3><p>{service.text}</p><MoveUpRight aria-hidden="true" /></article>)}</div>
          </div>
        </section>

        <section className="materials section-pad reveal" id="materialen">
          <div className="stone-container materials-grid">
            <div className="materials-image delay-1"><Image src="/assets/green-kitchen.png" alt="Handgemaakte groene tegels in een keuken" fill sizes="(max-width: 800px) 100vw, 48vw" /><span>01 / green zellige</span></div>
            <div className="materials-copy delay-2"><p className="eyebrow">{t.materialsEyebrow}</p><h2>{t.materialsTitle}</h2><p className="lead">{t.materialsText}</p><div className="material-list">{t.materials.map((material) => <div className="material-row" key={material.name}><span className={`material-swatch ${material.tone}`} /><div><strong>{material.name}</strong><small>{material.note}</small></div></div>)}</div></div>
          </div>
        </section>

        <section className="process section-pad section-tint reveal" id="proces">
          <div className="stone-container"><div className="section-heading delay-1"><div><p className="eyebrow">{t.processEyebrow}</p><h2>{t.processTitle}</h2></div><p>{t.processText}</p></div><ol className="process-list delay-2">{t.process.map((step, index) => <li key={step.title}><span>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></div>
        </section>

        <section className="work section-pad reveal" id="werk">
          <div className="stone-container"><div className="section-heading section-heading-wide delay-1"><div><p className="eyebrow">{t.workEyebrow}</p><h2>{t.workTitle}</h2></div><p>{t.workText}</p></div><div className="work-gallery delay-2"><figure className="work-image work-image-large"><Image src="/assets/craft-detail.png" alt="Vakman legt een natuurlijke steen tegel" fill sizes="(max-width: 800px) 100vw, 58vw" /><figcaption>Precision / 01</figcaption></figure><figure className="work-image work-image-small"><Image src="/assets/green-kitchen.png" alt="Groene zellige in een keuken" fill sizes="(max-width: 800px) 100vw, 34vw" /><figcaption>Texture / 02</figcaption></figure></div></div>
        </section>

        <section className="booking-section section-pad reveal" id="booking">
          <div className="stone-container booking-grid"><div className="booking-intro"><p className="eyebrow eyebrow-light">{t.bookingEyebrow}</p><h2>{t.bookingTitle}</h2><p>{t.bookingText}</p><div className="booking-contact"><strong>S.R. Klus- & onderhoudswerk</strong><a href="tel:+31687153336">06 871 53 33</a><span>Groen-blauwlaan 153<br />2718 GS Zoetermeer</span></div><p className="secure-note"><Sparkles aria-hidden="true" />{t.privacy}</p></div><BookingForm enabled={accountsEnabled} language={language} /></div>
        </section>
      </main>

      <footer className="site-footer" id="contact"><div className="stone-container footer-inner"><Link className="footer-brand" href="#top"><Image src="/assets/logo-work.png" alt="S.R. Klus- en Onderhoudswerk" width={34} height={34} style={{border: '1px solid rgba(243,240,233,.55)', borderRadius: '2px', objectFit: 'cover'}} /><span>S.R. Klus- & onderhoudswerk<small>{t.footerNote}</small></span></Link><span>© {new Date().getFullYear()} S.R. Klus- en Onderhoudswerk</span><div className="footer-links"><Link href="/login">{t.footerPortal}</Link><Link href="/admin">{t.footerAdmin}</Link></div></div></footer>
    </div>
  );
}
