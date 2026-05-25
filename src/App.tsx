/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Droplets,
  Wrench,
  ArrowRight,
  Construction,
  Info,
  BadgeCheck,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Analytics } from '@vercel/analytics/react';
import config from '../company_config.json';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SERVICES = [
  {
    title: 'Putkityöt & Korjaukset',
    description: 'Kaikki käyttövesi-, lämmitys- ja viemärijärjestelmien korjaukset. Vaihdamme hanat, wc-istuimet ja rikkoutuneet venttiilit nopeasti.',
    icon: Droplets,
    color: 'bg-cyan-950/40 text-brand-accent border border-brand-accent/20',
    tags: ['Hanan vaihto', 'WC-istuimet', 'Sulkuventtiilit']
  },
  {
    title: 'Viemärihuollot & Avaukset',
    description: 'Tukkeutuneiden viemäreiden mekaaniset avaukset, huuhtelut sekä diagnosointi. Ratkaisemme myös hajuhaitat ja toteutamme osittaiset viemärilinjojen uusinnat.',
    icon: Wrench,
    color: 'bg-emerald-950/40 text-emerald-400 border border-emerald-400/20',
    tags: ['Viemärin avaus', 'Huuhtelut', 'Linjakorjaukset']
  },
  {
    title: 'LVI-Asennukset & Laitteet',
    description: 'Hoidamme astian- ja pyykinpesukoneiden kytkennät sekä lämminvesivaraajien asennukset turvallisesti parhaalla ammattitaidolla vesivahinkoja ennaltaehkäisten.',
    icon: ShieldCheck,
    color: 'bg-blue-950/40 text-blue-400 border border-blue-400/20',
    tags: ['Varaajat', 'Konekytkennät', 'Vesiliitännät']
  },
  {
    title: 'Lämmitysjärjestelmät',
    description: 'Toimiva ja energiatehokas lämmitys kotiisi. Patteriverkoston ilmaus, tasapainotus, kiertovesipumppujen vaihdot sekä termostaattien asennukset.',
    icon: Coins,
    color: 'bg-purple-950/40 text-purple-400 border border-purple-400/20',
    tags: ['Termostaatit', 'Patterien ilmaus', 'Kiertovesipumput']
  },
  {
    title: 'Kylpyhuone- & Keittiösaneeraukset',
    description: 'Erikoistuneet saneerauspalvelut saman katon alta. Kylpyhuone- ja keittiöremontit sisältäen kaikki rakennus- ja LVI-työt ilman aikataulukoordinaation haasteita.',
    icon: Construction,
    color: 'bg-orange-950/40 text-orange-400 border border-orange-400/20',
    tags: ['Kylpyhuoneet', 'Keittiöt', 'Avaimet käteen']
  },
  {
    title: '24/7 Putkipäivystys',
    description: 'Äkilliset putkirikot ja viemäritukokset eivät odota. Päivystyksemme reagoi hätätilanteissa kaikkina vuorokauden aikoina vesivahinkojen minimoimiseksi.',
    icon: Clock,
    color: 'bg-red-950/40 text-red-400 border border-red-400/20',
    tags: ['Päivystys 24h', 'Vesivahingot', 'Päivystävä putkimies']
  }
];

const REVIEWS = [
  {
    name: 'Tomi L.',
    date: 'Eilen',
    rating: 5,
    text: 'Jani ja tiimi tekivät kylpyhuoneremonttimme LVI-työt ja rakennustyöt viimeisen päälle siististi. Aikataulu piti täysin ja laskutus oli juuri sitä mitä sovittiin. Suosittelen!',
    source: 'Google'
  },
  {
    name: 'Sanna M.',
    date: 'Viikko sitten',
    rating: 5,
    text: 'Markku tuli nopeasti paikan päälle, kun wc-istuin alkoi vuotaa vettä lattialle. Työ hoitui ripeästi, ja saatiin heti uusi istuin asennettuna tilalle. Huippupalvelua!',
    source: 'Google'
  },
  {
    name: 'Heikki K.',
    date: '3 viikkoa sitten',
    rating: 5,
    text: 'Erittäin asiantuntevaa LVI-palvelua Espoossa. Putkimies selvitti nopeasti patteriverkoston ongelmat ja teki tasapainotuksen. Lämmitys toimii taas täydellisesti.',
    source: 'Google'
  }
];

const FAQ = [
  {
    q: 'Miten Espoon Putki & Saneeraus Oy hinnoittelee työt?',
    a: 'Hinnoittelumme on täysin läpinäkyvää. Käytössä on alkavan tunnin veloitus 68 € / h (sis. alv 25.5%). Minimiveloituksemme on 2 tuntia eli 136 € (sis. alv 25.5%). Tarvikkeet laskutamme voimassaolevan tukkurihinnaston mukaisesti ilman piilokuluja.'
  },
  {
    q: 'Miten kotitalousvähennys haetaan ja paljonko voin säästää?',
    a: 'Kaikki tekemämme työt (LVI-työt, asennukset ja remontit) ovat kotitalousvähennyskelpoisia. Voit vähentää työn osuudesta 40 % verotuksessasi (maksimissaan 2100 € henkilöä kohden vuodessa, 150 € omavastuulla). Erittelemme työn osuuden laskussa selkeästi OmaVero-ilmoitusta varten.'
  },
  {
    q: 'Milloin kartoitus on ilmainen?',
    a: 'Tarjoamme ilmaisen kartoituksen kaikkiin yli 4 tuntia kestäviin LVI- tai saneeraustöihin. Voit pyytää meidät arvioimaan isompaa urakkaa (kuten linjasaneerausta tai kylpyhuoneremonttia) täysin sitoumuksetta.'
  },
  {
    q: 'Kuinka nopeasti saatte putkimiehen paikalle Espoossa ja lähialueilla?',
    a: 'Akuuteissa hätätilanteissa 24/7 päivystyksemme reagoi heti ja saavumme paikalle Espoon, Helsingin ja Vantaan alueilla mahdollisimman pian vesivahinkojen minimoimiseksi. Normaaleissa huoltotöissä pyrimme tarjoamaan ajan muutaman arkipäivän sisällä.'
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [tyonOsuus, setTyonOsuus] = useState(1200); // Laskin default arvo
  const [isCalculating, setIsCalculating] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GDPR Modals states
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'cookies' | null>(null);

  const rollingWords = ['Luotettavasti.', 'Sertifioidusti.', 'Ammattitaidolla.'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % rollingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSliderChange = (val: number) => {
    setTyonOsuus(val);
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 300);
    return () => clearTimeout(timer);
  };

  const vahennys = tyonOsuus * 0.40;
  const lopullinenKustannus = tyonOsuus - vahennys;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light text-brand-blue w-full overflow-x-hidden">
      <Analytics />

      {/* GDPR Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-brand-blue/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-brand-blue border border-white/10 rounded-[2.5rem] max-w-2xl w-full p-8 max-h-[85vh] overflow-y-auto shadow-2xl relative text-white"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                aria-label="Sulje dokumentti"
              >
                <X size={20} />
              </button>

              {activeModal === 'privacy' && (
                <div>
                  <h3 className="text-3xl font-bold font-display mb-6">Tietosuojaseloste / Rekisteriseloste</h3>
                  <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
                    <p className="font-bold text-white">1. Rekisterinpitäjä</p>
                    <p>Espoon Putki & Saneeraus Oy (Y-tunnus: 3502206-6)<br />Viherlaaksonranta 10 F 79 Talli e 4, 02710 Espoo</p>
                    <p className="font-bold text-white">2. Kerättävät henkilötiedot ja käsittelyn tarkoitukset</p>
                    <p>Keräämme ainoastaan yhteydenottolomakkeella lähettämiänne tietoja (Nimi, puhelinnumero, sähköposti, viesti) asiakaspalvelun toteuttamiseksi, tarjousten laatimiseksi ja sopimusten täyttämiseksi. Tietoja käsitellään luottamuksellisesti eikä niitä luovuteta kolmansille osapuolille ilman suostumustasi tai lakisääteistä velvoitetta.</p>
                    <p className="font-bold text-white">3. Tietojen säilytysaika</p>
                    <p>Säilytämme henkilötietoja vain niin kauan kuin se on tarpeen asiakassuhteen ylläpitämiseksi tai lakisääteisten velvoitteiden täyttämiseksi.</p>
                    <p className="font-bold text-white">4. Rekisteröidyn oikeudet</p>
                    <p>Sinulla on oikeus tarkastaa itseäsi koskevat tiedot, vaatia virheellisen tiedon oikaisua tai tietojen poistamista. Yhteydenotot tietosuoja-asioissa sähköpostitse: asiakaspalvelu@espoonputki.fi.</p>
                  </div>
                </div>
              )}

              {activeModal === 'terms' && (
                <div>
                  <h3 className="text-3xl font-bold font-display mb-6">Käyttöehdot</h3>
                  <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
                    <p className="font-bold text-white">1. Yleistä</p>
                    <p>Näitä käyttöehtoja sovelletaan Espoon Putki & Saneeraus Oy:n tarjoamiin LVI- ja saneerauspalveluihin sekä tämän verkkosivuston käyttöön.</p>
                    <p className="font-bold text-white">2. Tuntiveloitus ja minimiveloitus</p>
                    <p>LVI- ja saneeraustöissä käytetään alkavan tunnin veloitusta 68 € / h (sis. alv 25.5%). Minimiveloituksemme on aina 2 tuntia eli 136 € (sis. alv 25.5%). Tarvikkeet laskutetaan tukkuhinnaston mukaisesti.</p>
                    <p className="font-bold text-white">3. Maksuehdot ja peruutukset</p>
                    <p>Maksutapa on lasku (14 vrk maksuajalla) tai erikseen sovittu rahoitus. Peruutukset sovituille huoltotöille on tehtävä viimeistään 24 tuntia ennen työn alkua. Tämän jälkeen perutuista töistä veloitamme minimiveloituksen mukaisen maksun.</p>
                    <p className="font-bold text-white">4. Vastuu ja takuu</p>
                    <p>Kaikilla asennuksillamme on lakisääteinen ja sertifioitu asennustakuu. Noudatamme tarkasti Suomen rakentamismääräyksiä ja LVI-alan parhaita käytäntöjä.</p>
                  </div>
                </div>
              )}

              {activeModal === 'cookies' && (
                <div>
                  <h3 className="text-3xl font-bold font-display mb-6">Evästeet (Cookies)</h3>
                  <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
                    <p className="font-bold text-white">1. Mitä evästeet ovat?</p>
                    <p>Evästeet ovat pieniä tekstitiedostoja, joita verkkosivustot tallentavat tietokoneellesi tai mobiililaitteellesi parantaakseen käyttökokemusta.</p>
                    <p className="font-bold text-white">2. Käytettävät evästeet tällä sivustolla</p>
                    <p>Käytämme ainoastaan välttämättömiä evästeitä sivuston toimivuuden varmistamiseen sekä suorituskykyevästeitä (kuten Vercel Analytics) anonyymin kävijätilaston seuraamiseen. Emme kerää henkilötietoja markkinointitarkoituksiin emmekä jaa evästetietoja ulkopuolisille kumppaneille.</p>
                    <p className="font-bold text-white">3. Miten voit hallita evästeitä?</p>
                    <p>Voit halutessasi estää tai poistaa evästeet käytöstä selaimesi asetuksista. Välttämättömien evästeiden estäminen voi kuitenkin vaikuttaa sivuston toimintoihin.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-brand-blue text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-xl"
          >
            <div className="bg-brand-accent p-1 rounded-full text-brand-blue">
              <CheckCircle2 size={16} />
            </div>
            <span className="font-bold">Yhteydenottopyyntö vastaanotettu! Palaamme pian.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-blue/90 backdrop-blur-lg border-t border-white/10 p-4 flex md:hidden gap-3 shadow-2xl">
        <a
          href="tel:+358505546665"
          className="flex-1 bg-brand-accent hover:bg-brand-emerald text-brand-blue font-extrabold py-3.5 px-4 rounded-xl text-center text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-accent/25 active:scale-95 transition-all"
        >
          <Phone size={16} /> Markku (Putki)
        </a>
        <a
          href="tel:+358400996843"
          className="flex-1 bg-white/10 border border-white/20 text-white font-bold py-3.5 px-4 rounded-xl text-center text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Phone size={16} /> Jani (Remontit)
        </a>
      </div>

      {/* Top Header Bar */}
      <div className="bg-brand-blue text-white py-2.5 px-6 text-xs hidden md:block border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              Aukioloaika: <span className="text-white font-bold">Ark 8-16 / Päivystys 24/7</span>
            </span>
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
            <div className="flex items-center gap-2 text-brand-accent font-bold group">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 bg-brand-accent rounded-full animate-ping opacity-75" />
              </div>
              PÄIVYSTYS: <a href="tel:+358505546665" className="hover:underline text-white">050 554 6665</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-brand-accent/20 px-2 py-0.5 rounded border border-brand-accent/30 text-brand-accent">
              <BadgeCheck size={12} /> Sertifioitu LVI-urakoitsija
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-brand-accent" /> Toimialue: Espoo, Helsinki, Vantaa
            </div>
          </div>
        </div>
      </div>

      {/* Navbar Navigation */}
      <nav className={cn(
        "glass-nav transition-all duration-300",
        scrolled ? "py-3 shadow-2xl" : "py-5"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-brand-accent p-2 rounded-xl text-brand-blue shadow-lg shadow-brand-accent/20">
              <Wrench size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight font-display text-white leading-none">
                Espoon Putki
              </span>
              <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest mt-1">
                & Saneeraus
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-white">
            <a href="#palvelut" className="font-medium hover:text-brand-accent transition-colors">Palvelut</a>
            <a href="#ostopolku" className="font-medium hover:text-brand-accent transition-colors">Palvelun kulku</a>
            <a href="#saastot" className="font-medium hover:text-brand-accent transition-colors">Säästölaskin</a>
            <a href="#hinnasto" className="font-medium hover:text-brand-accent transition-colors">Hinnasto</a>
            <a href="#meista" className="font-medium hover:text-brand-accent transition-colors">Meistä</a>
            <a href="#yhteys" className="btn-primary py-2.5 px-6 text-sm">
              Pyydä kartoitus <ArrowRight size={16} />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Sulje valikko" : "Avaa valikko"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-blue border-t border-white/5 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4 text-white">
                <a href="#palvelut" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium py-2 border-b border-white/5">Palvelut</a>
                <a href="#ostopolku" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium py-2 border-b border-white/5">Palvelun kulku</a>
                <a href="#saastot" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium py-2 border-b border-white/5">Säästölaskin</a>
                <a href="#hinnasto" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium py-2 border-b border-white/5">Hinnasto</a>
                <a href="#meista" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium py-2 border-b border-white/5">Meistä</a>
                <a href="#yhteys" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full mt-2">Ota yhteyttä</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="w-full overflow-x-hidden">
        {/* Full-width breathing Hero Section */}
        <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-start md:items-center overflow-hidden bg-brand-blue">
          {/* Breathing Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero.webp"
              alt="Espoon Putki & Saneeraus Oy LVI-ammattilainen työssään"
              className="w-full h-full object-cover opacity-45 animate-kenburns"
            />
            {/* Elegant Radial/Linear Gradient Suodatin */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-transparent to-transparent" />
          </div>

          <div className="pt-6 pb-20 md:py-24 px-6 max-w-7xl mx-auto relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl bento-card-glass text-white border-white/5 shadow-2xl p-8 md:p-12"
            >
              {/* Google Reviews Capsule Badge */}
              <div className="flex items-center gap-2 mb-6 bg-white/5 border border-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-md">
                <div className="flex text-yellow-400" aria-hidden="true">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                {config.socialProof?.google?.count && config.socialProof.google.count !== "" && (
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                    {config.socialProof.google.count} Google-arvostelua | {config.socialProof.google.rating || "5.0"} / 5.0 Tähteä
                  </span>
                )}
              </div>

              {/* Kinetic typography using Plus Jakarta Sans display font */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display leading-tight mb-6">
                Älykästä lämpöä ja talotekniikkaa. <br />
                <span className="text-brand-accent block md:inline-block relative h-14 md:h-20 min-w-[290px] md:min-w-[550px] overflow-hidden mt-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeWordIndex}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -30, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute left-0 top-0 block w-full"
                    >
                      {rollingWords[activeWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              <p className="text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed">
                Espoon Putki & Saneeraus Oy on täyden palvelun sertifioitu putkiliike. Yli 20 vuoden kokemuksella hoidamme kaikki LVI-asennukset ja kodin saneeraukset kerralla kuntoon – takuuvarmasti.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-5 items-stretch sm:items-center">
                <a href="#yhteys" className="btn-primary text-md">
                  Aloita ilmaisella kartoituksella <ArrowRight size={18} />
                </a>
                <a href="#hinnasto" className="btn-secondary text-md flex items-center justify-center gap-2 group">
                  Katso hinnasto
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Stats Grid inside the full-screen card */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/5 text-center sm:text-left">
                <div>
                  <div className="text-2xl font-black text-brand-accent leading-none">20+</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Vuotta LVI-kokemusta</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-brand-accent leading-none">C-24108</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sertifioitu työn laatu</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-brand-accent leading-none">24/7</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">LVI-päivystystuki</div>
                </div>
              </div>

            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="palvelut" className="section-padding scroll-mt-offset">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-3">Monipuoliset palvelut</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">LVI- ja saneeraustyöt kerralla kuntoon</h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Toteutamme kaikki käyttövesi-, lämmitys- ja viemärijärjestelmiin liittyvät asennus- ja huoltotyöt turvallisesti sekä remontit saman katon alta.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl hover:shadow-slate-200 transition-all duration-300"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", service.color)}>
                  <service.icon size={26} aria-hidden="true" />
                </div>
                <h4 className="text-2xl font-bold mb-4 font-display text-brand-blue">{service.title}</h4>
                <p className="text-slate-600 mb-8 flex-grow leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                  {service.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-3 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline Process Flow Section */}
        <section id="ostopolku" className="bg-brand-blue text-white py-28 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-3">Miten palvelu etenee?</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Sujuva ja huoleton asiointipolku</h3>
              <p className="text-slate-300 max-w-xl mx-auto text-md leading-relaxed">
                Teemme asioinnista ja LVI-töiden tilaamisesta helppoa, selkeää ja täysin turvallista.
              </p>
            </div>

            <div className="relative space-y-12 md:space-y-16">
              
              {/* Timeline Flow Steps */}
              <div className="timeline-item flex flex-col md:flex-row gap-6 md:gap-12 relative pb-8 md:pb-12">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-accent text-brand-blue rounded-full flex items-center justify-center font-black text-lg shadow-lg shadow-brand-accent/30 z-10">
                  01
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-brand-accent/20 transition-colors flex-grow">
                  <h4 className="text-xl font-bold text-white mb-3">Kartoitus & Suunnittelu</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Kartoitamme tilanteen ja teemme tarvekartoituksen kohteessasi sitoumuksetta. Annamme selkeän, eritellyn toimintasuunnitelman ja kiinteän tarjouksen.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/20 px-3.5 py-1.5 rounded-lg text-brand-accent text-xs font-bold uppercase tracking-wider">
                    <Info size={14} /> Ilmainen kartoitus koskee yli 4 tunnin töitä
                  </div>
                </div>
              </div>

              <div className="timeline-item flex flex-col md:flex-row gap-6 md:gap-12 relative pb-8 md:pb-12">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-accent text-brand-blue rounded-full flex items-center justify-center font-black text-lg shadow-lg shadow-brand-accent/30 z-10">
                  02
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-brand-accent/20 transition-colors flex-grow">
                  <h4 className="text-xl font-bold text-white mb-3">Avaimet käteen -Asennus</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Sertifioidut ja kokeneet LVI-asentajamme suorittavat työn sovittuna ajankohtana. Pidämme työtilat siistinä, käytämme parhaita työkaluja ja materiaaleja sekä noudatamme tarkasti rakennusmääräyksiä.
                  </p>
                </div>
              </div>

              <div className="timeline-item flex flex-col md:flex-row gap-6 md:gap-12 relative">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-accent text-brand-blue rounded-full flex items-center justify-center font-black text-lg shadow-lg shadow-brand-accent/30 z-10">
                  03
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-brand-accent/20 transition-colors flex-grow">
                  <h4 className="text-xl font-bold text-white mb-3">Luovutus, Huolto & Säästöt</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Käymme lopputuloksen läpi yhdessä, annamme selkeät laitteiden käyttö- ja huolto-ohjeet ja luovutamme valmiin työn dokumentteineen.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-lg text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Coins size={14} /> Toimitamme kotitalousvähennystodistuksen suoraan sähköpostiisi!
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Dynamic Savings Calculator & Kotitalousvähennys Section */}
        <section id="saastot" className="py-24 bg-slate-50 border-b border-slate-100 scroll-mt-offset">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
              
              {/* Left Side: Calculator controls */}
              <div>
                <h2 className="text-sm font-bold text-brand-emerald uppercase tracking-widest mb-3">Säästä verotuksessa</h2>
                <h3 className="text-4xl font-extrabold text-brand-blue mb-6 tracking-tight">Kotitalousvähennys säästölaskin</h3>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  LVI-asennukset ja saneeraustyöt ovat merkittävä osa kodin arvon säilyttämistä. Työn verollisesta osuudesta saat peräti <span className="font-bold text-brand-blue">40 % takaisin</span> kotitalousvähennyksenä verotuksessasi! Kokeile laskuriamme ja katso todellinen säästösi.
                </p>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6 relative overflow-hidden">
                  
                  {isCalculating && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
                        <span className="text-xs font-extrabold text-brand-blue uppercase tracking-widest">Lasketaan...</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Työn arvioitu osuus (sis. alv)</label>
                      <div className="text-right">
                        <span className="text-3xl font-extrabold text-brand-blue">{tyonOsuus.toLocaleString('fi-FI')}</span>
                        <span className="text-slate-500 font-bold ml-1 text-md">€</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="136"
                      max="6000"
                      step="50"
                      value={tyonOsuus}
                      onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                      className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                      aria-label="Työn arvioitu osuus euroina"
                    />

                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>136 € (Minimi)</span>
                      <span>6 000 €</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kotitalousvähennyksen tiedot (2026):</div>
                    <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
                      <li>Korvausaste: 40% työn verollisesta osuudesta</li>
                      <li>Vuotuinen omavastuu: 150 € per henkilö</li>
                      <li>Maksimivähennys: 2 100 € per henkilö vuodessa</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Side: Beautiful receipt output */}
              <div className="flex justify-center">
                <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 relative overflow-hidden flex flex-col">
                  
                  {/* Decorative receipt cuts */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-accent via-emerald-400 to-brand-accent" />
                  
                  <div className="text-center pb-6 border-b border-dashed border-slate-200">
                    <h4 className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Hinta-arvio ja säästö</h4>
                    <span className="text-md font-bold text-brand-blue">Espoon Putki & Saneeraus Oy</span>
                  </div>

                  <div className="py-6 space-y-4 border-b border-dashed border-slate-200 flex-grow">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Työn osuus (brutto)</span>
                      <span className="font-semibold">{tyonOsuus.toLocaleString('fi-FI')} €</span>
                    </div>
                    <div className="flex justify-between text-sm text-emerald-600 font-bold">
                      <span>Kotitalousvähennys (-40%)</span>
                      <span>-{vahennys.toLocaleString('fi-FI')} €</span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-normal bg-slate-50 p-3 rounded-lg border border-slate-100">
                      ℹ️ Lopullisessa verotuksessa huomioidaan vuotuinen 150 € omavastuuosuus henkilökohtaisesti.
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Sinulle jäävä kulu työn osuudesta:</div>
                    <div className="text-4xl font-extrabold text-brand-emerald mb-8">
                      {lopullinenKustannus.toLocaleString('fi-FI')} €
                    </div>

                    <a href="#yhteys" className="btn-primary w-full text-center text-sm py-4 uppercase tracking-widest font-black">
                      Varaa asennus
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="hinnasto" className="section-padding scroll-mt-offset">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-3">Selkeä hinnasto</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Rehellistä ja läpinäkyvää LVI-hinnoittelua</h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Emme harrasta piilokuluja tai epäselviä palveluveloituksia. Tiedät aina etukäteen mitä maksat ja miten työmme hinnoitellaan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col shadow-sm">
              <h4 className="text-2xl font-bold font-display mb-2 text-brand-blue">Tuntiveloitus</h4>
              <div className="text-4xl font-extrabold text-brand-blue mb-4">68 € <span className="text-sm font-medium text-slate-500">/ h</span></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Sisältää alv 25,5 %</p>
              <ul className="space-y-4 mb-8 flex-grow text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-brand-accent flex-shrink-0" />
                  Käytössä alkavan tunnin veloitus
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-brand-accent flex-shrink-0" />
                  Laadukas LVI-ammattilaisen tuntityö
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-brand-accent flex-shrink-0" />
                  Soveltuu pieniin huoltotöihin
                </li>
              </ul>
              <a href="#yhteys" className="btn-outline w-full text-center">
                Varaa tuntityö
              </a>
            </div>

            <div className="bg-brand-blue border border-brand-accent/30 rounded-[2rem] p-8 flex flex-col shadow-2xl scale-[1.02] text-white relative">
              <div className="absolute top-5 right-5 bg-brand-accent text-brand-blue text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Pakollinen minimi
              </div>
              <h4 className="text-2xl font-bold font-display mb-2 text-white">Minimiveloitus</h4>
              <div className="text-4xl font-extrabold text-brand-accent mb-4">136 €</div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Minimi 2 tuntia, sis. alv 25,5 %</p>
              <ul className="space-y-4 mb-8 flex-grow text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-brand-accent flex-shrink-0" />
                  Aina vähintään 2 tunnin veloitus (136 €)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-brand-accent flex-shrink-0" />
                  Kattaa asentajan saapumisen ja aloituksen
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-brand-accent flex-shrink-0" />
                  Kattaa usein pienet korjaukset kokonaan
                </li>
              </ul>
              <a href="#yhteys" className="btn-primary w-full text-center">
                Tilaa käynti
              </a>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col shadow-sm">
              <h4 className="text-2xl font-bold font-display mb-2 text-brand-blue">Muut veloitukset</h4>
              <div className="text-xl font-bold text-slate-500 mb-6">Pienet lisät & tarvikkeet</div>
              <ul className="space-y-4 mb-8 flex-grow text-sm text-slate-600">
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Huoltoautomaksu (sis. 20km)</span>
                  <span className="font-extrabold text-brand-blue">45 €</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Pientarvikelisä</span>
                  <span className="font-extrabold text-brand-blue">15 €</span>
                </li>
                <li className="flex justify-between pb-2 leading-relaxed">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Tarvikkeet ja osat laskutetaan voimassaolevan tukkurihinnaston mukaisesti.</span>
                </li>
              </ul>
              <a href="#yhteys" className="btn-outline w-full text-center">
                Kysy tarjousta
              </a>
            </div>

          </div>
        </section>

        {/* Quality Proof & Before-After section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
              
              <div>
                <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-3">Laatua joka kestää katseet</h2>
                <h3 className="text-4xl font-extrabold text-brand-blue mb-6 tracking-tight">Tinkimätöntä ammattitaitoa</h3>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  Oikeaoppinen asennus, puhtaat ja siistit liitokset sekä laadukkaat materiaalit ovat paras vakuutuksesi vesivahinkoja vastaan. Haluamme tehdä asiat kerralla kuntoon, jotta sinä voit nukkua yösi rauhassa.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="text-brand-emerald font-black text-2xl mb-1">C-24108</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sertifioitu asentaja</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="text-brand-emerald font-black text-2xl mb-1">5 Vuotta</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Asennustakuu työlle</div>
                  </div>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50 max-w-sm w-full aspect-[3/4]">
                  <img
                    src="/images/before_after.png"
                    alt="Vertailukuva siististä putkiasennuksesta saneeraustyön jälkeen"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-6 left-6 bg-brand-blue/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-white/10">
                  Ennen
                </div>
                <div className="absolute top-6 right-6 bg-brand-accent text-brand-blue px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-accent/30">
                  Espoon Putki
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Entrepreneur Intro (Meistä) */}
        <section id="meista" className="section-padding border-t border-slate-100 scroll-mt-offset">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Story */}
            <div>
              <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-3">Yrittäjien tarina</h2>
              <h3 className="text-4xl font-extrabold text-brand-blue mb-8 tracking-tight">"Haluamme palvella luotettavasti ja läpinäkyvästi"</h3>
              
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  Espoon Putki & Saneeraus Oy on kahden kokeneen ammattilaisen, Markun ja Janin, perustama LVI- ja saneerausliike. Kyllästyimme alan epäselviin piilolaskuihin sekä siihen, että asentajaa tai remontin tekijää on vaikea saada kiinni hätätilanteessa.
                </p>
                <p>
                  Meille jokainen LVI-asennus, pieni huoltotyö tai laaja keittiö- ja kylpyhuoneremontti on kunnia-asia. Panostamme laadukkaisiin materiaaleihin, oikeaoppisiin asennustapoihin ja vesivahinkojen ennaltaehkäisyyn, jotta asiakkaamme voivat nukkua yönsä rauhassa.
                </p>
                
                <div className="pt-6 grid grid-cols-2 gap-8 border-t border-slate-50">
                  <div>
                    <div className="font-extrabold text-brand-blue text-xl">Markku Määttälä</div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">LVI-työt & Asiakaspalvelu</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-brand-blue text-xl">Jani Kemppainen</div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Saneeraukset & Remontit</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual image with specs */}
            <div className="relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white aspect-[3/2]">
                <img
                  src="/images/owner.png"
                  alt="Espoon Putki & Saneeraus Oy tiimi tekemässä asennustöitä"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 left-0 sm:-left-6 bg-brand-blue text-white p-6 rounded-2xl border border-white/10 shadow-2xl">
                <div className="text-3xl font-black text-brand-accent leading-none">C-24108</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Sertifikaattinumero</div>
              </div>
              <div className="absolute -top-6 right-0 sm:-right-6 bg-brand-accent text-brand-blue p-5 rounded-2xl shadow-2xl font-black text-sm uppercase tracking-wider">
                Y-Tunnus:<br />3502206-6
              </div>
            </div>

          </div>
        </section>

        {/* FAQ (UKK) Accordion Section */}
        <section className="py-24 bg-slate-50 border-t border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-6">
            
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-3">Usein kysyttyä</h2>
              <h3 className="text-4xl font-extrabold text-brand-blue tracking-tight">Asiantuntijan vastaukset LVI-kysymyksiin</h3>
            </div>

            <div className="space-y-4">
              {FAQ.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                    aria-expanded={openFaq === idx}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <h4 className="text-lg font-bold font-display text-brand-blue flex items-center gap-3">
                      <span className="text-brand-accent font-black">Q:</span> {faq.q}
                    </h4>
                    <ChevronRight
                      size={18}
                      className={cn(
                        "text-slate-400 transition-transform duration-300 flex-shrink-0",
                        openFaq === idx && "rotate-90 text-brand-accent"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        id={`faq-answer-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-50/50 pt-4">
                          <span className="font-bold text-brand-blue">A:</span> {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Contact Form Section */}
        <section id="yhteys" className="section-padding scroll-mt-offset px-4 sm:px-6">
          <div className="bg-brand-blue border border-white/10 rounded-[2.5rem] text-white grid lg:grid-cols-2 gap-10 p-5 sm:p-10 md:p-16 shadow-2xl overflow-hidden">
            
            {/* Left side: Contact Details */}
            <div className="flex flex-col justify-between space-y-8 lg:space-y-0">
              <div>
                <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-3">Ota yhteyttä heti</h2>
                <h3 className="text-4xl font-extrabold mb-6 tracking-tight text-white">Sertifioitua LVI- ja saneeraustukea kotiisi</h3>
                <p className="text-slate-200 text-md leading-relaxed mb-8">
                  Soita meille suoraan tai jätä tarjouspyyntö / yhteydenottopyyntö lomakkeella. Palaamme asiaan viimeistään muutaman arkipäivän tai hätätilanteissa heti päivystyksen kautta!
                </p>

                <div className="space-y-6">
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-brand-accent flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs text-brand-accent font-extrabold uppercase tracking-wider">LVI- & Putkityöt (Markku Määttälä)</h4>
                      <a href="tel:+358505546665" className="text-lg sm:text-xl font-bold hover:text-brand-accent transition-colors block text-white mt-0.5">050 554 6665</a>
                      <p className="text-xs text-slate-300 mt-1 break-all">markku.maattala@espoonputki.fi</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-brand-accent flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs text-brand-accent font-extrabold uppercase tracking-wider">Saneeraukset & Remontit (Jani Kemppainen)</h4>
                      <a href="tel:+358400996843" className="text-lg sm:text-xl font-bold hover:text-brand-accent transition-colors block text-white mt-0.5">040 099 6843</a>
                      <p className="text-xs text-slate-300 mt-1 break-all">asiakaspalvelu@espoonputki.fi</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-brand-accent flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs text-brand-accent font-extrabold uppercase tracking-wider">Yleinen Asiakaspalvelu sähköposti</h4>
                      <a href="mailto:asiakaspalvelu@espoonputki.fi" className="text-base sm:text-lg font-bold hover:text-brand-accent transition-colors break-all block text-white mt-0.5">asiakaspalvelu@espoonputki.fi</a>
                    </div>
                  </div>

                </div>
              </div>

              {/* Company Info Box */}
              <div className="pt-8 mt-8 border-t border-white/10 space-y-2 text-xs text-slate-200 font-medium">
                <div>Espoon Putki & Saneeraus Oy (Y-Tunnus: 3502206-6)</div>
                <div>Postiosoite: Viherlaaksonranta 10 F 79 Talli e 4, 02710 Espoo</div>
                <div>Sertifikaatti: C-24108-23-18 (sertifikaatti)</div>
              </div>
            </div>

            {/* Right side: High Conversion Form */}
            <div className="bg-[#132043] border border-white/10 p-5 sm:p-8 rounded-3xl shadow-xl">
              <h4 className="text-2xl font-bold mb-6 tracking-tight text-white">Pyydä tarjous tai kartoitus</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label htmlFor="form-name" className="block text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Nimi *</label>
                  <input
                    id="form-name"
                    required
                    type="text"
                    className="w-full px-5 py-4 rounded-xl bg-[#0b1530] border border-white/20 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white text-base placeholder-slate-400"
                    placeholder="Matti Meikäläinen"
                  />
                </div>

                <div>
                  <label htmlFor="form-phone" className="block text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Puhelinnumero *</label>
                  <input
                    id="form-phone"
                    required
                    type="tel"
                    className="w-full px-5 py-4 rounded-xl bg-[#0b1530] border border-white/20 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white text-base placeholder-slate-400"
                    placeholder="040 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="form-email" className="block text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Sähköposti *</label>
                  <input
                    id="form-email"
                    required
                    type="email"
                    className="w-full px-5 py-4 rounded-xl bg-[#0b1530] border border-white/20 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white text-base placeholder-slate-400"
                    placeholder="matti@esimerkki.fi"
                  />
                </div>

                <div>
                  <label htmlFor="form-message" className="block text-xs font-bold text-brand-accent uppercase tracking-widest mb-2">Viesti / Kuvaile LVI- tai saneeraustarvettasi *</label>
                  <textarea
                    id="form-message"
                    required
                    rows={4}
                    className="w-full px-5 py-4 rounded-xl bg-[#0b1530] border border-white/20 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all text-white text-base placeholder-slate-400 leading-relaxed"
                    placeholder="Kerro lyhyesti tarpeestasi..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full text-sm font-black uppercase tracking-widest py-4 mt-6 justify-center flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
                  ) : (
                    <>Lähetä pyyntö <ArrowRight size={16} /></>
                  )}
                </button>

              </form>
            </div>

          </div>
        </section>
      </main>

      {/* Footer & GDPR documents links */}
      <footer className="bg-brand-blue text-white py-16 mt-auto border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-12 border-b border-white/5">
            
            <div className="flex items-center gap-3">
              <div className="bg-brand-accent p-2 rounded-xl text-brand-blue shadow-lg shadow-brand-accent/20">
                <Wrench size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight font-display text-white leading-none">
                  Espoon Putki
                </span>
                <span className="text-[9px] text-brand-accent font-bold uppercase tracking-widest mt-1">
                  & Saneeraus
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-semibold">
              <a href="#palvelut" className="hover:text-white transition-colors">Palvelut</a>
              <a href="#ostopolku" className="hover:text-white transition-colors">Palvelun kulku</a>
              <a href="#saastot" className="hover:text-white transition-colors">Säästölaskin</a>
              <a href="#hinnasto" className="hover:text-white transition-colors">Hinnasto</a>
              <a href="#meista" className="hover:text-white transition-colors">Meistä</a>
            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 text-xs text-slate-500 font-medium">
            <div>
              © 2026 Espoon Putki & Saneeraus Oy. Kaikki oikeudet pidätetään.
            </div>
            
            {/* GDPR Modal triggers */}
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => setActiveModal('privacy')}
                className="hover:text-slate-300 transition-colors cursor-pointer text-xs font-medium"
              >
                Tietosuojaseloste
              </button>
              <button
                onClick={() => setActiveModal('terms')}
                className="hover:text-slate-300 transition-colors cursor-pointer text-xs font-medium"
              >
                Käyttöehdot
              </button>
              <button
                onClick={() => setActiveModal('cookies')}
                className="hover:text-slate-300 transition-colors cursor-pointer text-xs font-medium"
              >
                Evästeet
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
