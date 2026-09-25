import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { PublicHeader } from "@/components/site-shell";
import { BookingForm } from "@/components/booking-form";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export default function Home() {
  const accountsEnabled = hasSupabaseConfig();
  return <>
    <PublicHeader />
    <main>
      <section className="hero" id="top">
        <div className="hero-media"><Image src="/assets/hero-bathroom.jpg" alt="Verfijnd afgewerkt badkamer met marmer en natuurlijk licht" fill priority sizes="100vw" /></div>
        <div className="hero-scrim" />
        <div className="container hero-content">
          <p className="eyebrow reveal">S.R. Klus- & onderhoudswerk · Zoetermeer</p>
          <h1 className="reveal delay-1">Vakwerk met<br /><em>aandacht.</em></h1>
          <p className="hero-copy reveal delay-2">Tegelwerk, reparatie en afwerking met de precisie van een atelier. Bij u op locatie, waar u ook bent in Nederland.</p>
          <div className="button-row reveal delay-3"><a className="button button-primary" href="#booking">Afspraak aanvragen <ArrowRight aria-hidden="true" /></a><a className="button button-ghost" href="#diensten">Bekijk ons werk <ArrowDownRight aria-hidden="true" /></a></div>
          <div className="hero-proof reveal delay-4"><span><Check />Op locatie heel NL</span><span><Check />Nederlands & Engels</span><span><Check />Direct contact</span></div>
        </div>
        <a className="scroll-cue" href="#diensten" aria-label="Naar diensten"><span>Scroll</span><i /></a>
      </section>

      <section className="intro-section section-pad" id="diensten">
        <div className="container intro-grid">
          <div><p className="eyebrow">Wat wij doen</p><h2>Details maken<br />het verschil.</h2></div>
          <div><p className="lead">Van een enkele gebarsten tegel tot een volledige afwerking. Wij combineren ervaren vakmanschap met een zuin oog voor vorm, materiaal en afwerking.</p><a className="text-link" href="#booking">Vertel ons over uw project <ArrowRight /></a></div>
        </div>
        <div className="container service-grid">
          {["Tegelreparatie", "Vervangen & plaatsen", "Voegen & afwerken", "Werkbladen & maatwerk"].map((service, index) => <article className="service-card" key={service}><span>0{index + 1}</span><Sparkles aria-hidden="true" /><h3>{service}</h3><p>Zorgvuldig uitgevoerd, mobiel en met aandacht voor uw ruimte.</p></article>)}
        </div>
      </section>

      <section className="showcase" id="werk">
        <div className="showcase-image showcase-large"><Image src="/assets/green-kitchen.png" alt="Handgemaakte groene tegels in een keuken" fill sizes="(max-width: 900px) 100vw, 60vw" /><span>Groene zellige</span></div>
        <div className="showcase-image"><Image src="/assets/craft-detail.png" alt="Vakman legt een natuurlijke steen tegel" fill sizes="(max-width: 900px) 100vw, 40vw" /><span>Vakmanschap</span></div>
        <div className="showcase-quote"><p>“Een mooi resultaat begint bij zorgvuldig luisteren naar wat de ruimte nodig heeft.”</p><small>S.R. Klus- & onderhoudswerk</small></div>
      </section>

      <section className="process section-pad" id="proces">
        <div className="container"><div className="section-heading"><div><p className="eyebrow">Werkwijze</p><h2>Duidelijk van begin<br />tot eind.</h2></div><p>Geen verrassingen. U weet wie er komt, waarom er gewerkt wordt en wat er daarna gebeurt.</p></div>
          <ol className="process-list"><li><span>01</span><div><h3>Aanvragen</h3><p>U vertelt wat er moet gebeuren en waar.</p></div></li><li><span>02</span><div><h3>Wij beoordelen</h3><p>U ontvangt een reactie en een passende voorgestelde datum.</p></div></li><li><span>03</span><div><h3>Uitvoering</h3><p>Wij voeren het werk zorgvuldig en netjes uit.</p></div></li><li><span>04</span><div><h3>Oplevering</h3><p>Alles wordt gecontroleerd en met u doorgenomen.</p></div></li></ol>
        </div>
      </section>

      <section className="booking-section section-pad" id="booking">
        <div className="container booking-grid">
          <div className="booking-intro">
            <p className="eyebrow">Afspraak aanvragen</p>
            <h2>Ruimte voor een<br />prachtig resultaat.</h2>
            <p>Vul het formulier in en log in of maak een gratis account. U ontvangt een referentie en volgt de status van uw aanvraag.</p>
            <div className="booking-contact">
              <strong>S.R. Klus- & onderhoudswerk</strong>
              <a href="tel:+31687153336">06 871 53 33</a>
              <span>Groen-blauwlaan 153<br />2718 GS Zoetermeer</span>
            </div>
            <div className="secure-note"><ShieldCheck /><span>Uw gegevens zijn beschermd en alleen zichtbaar voor u en de beheerder.</span></div>
          </div>
          <BookingForm enabled={accountsEnabled} />
        </div>
      </section>
    </main>
    <footer className="site-footer" id="contact"><div className="container footer-inner"><BrandFooter /><span>© {new Date().getFullYear()} S.R. Klus- en Onderhoudswerk</span><span>Groen-blauwlaan 153 · Zoetermeer</span><Link href="/login">Klantenportaal</Link></div></footer>
  </>;
}

function BrandFooter() { return <Link className="footer-brand" href="/top"><b>SR</b><span>S.R. Klus- & onderhoudswerk<small>Fine tile atelier</small></span></Link>; }
