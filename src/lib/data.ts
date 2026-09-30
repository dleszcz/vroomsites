import { Profile, Car } from "@/types/database";

// ============================================================
// SEED DATA - used for development before Supabase is connected
// ============================================================

export const seedProfileDCar: Profile = {
  id: "dcar-0000-41d4-a716-446655440001",
  slug: "d-car",
  custom_domain: "d-car.com.pl",
  business_name: "D-CAR / Dawid Woźniak",
  business_description:
    "Profesjonalny skup aut za gotówkę oraz komis w Topólce i okolicach. Odkupujemy samochody w każdym stanie - całe, uszkodzone i powypadkowe. Bezpłatny dojazd lawetą do 3 godzin, wycena online/tel, umowa na miejscu i natychmiastowa wypłata gotówki.",
  logo_url: "/images/dcar-logo.png",
  pixel_id: "1054598387214426",
  whatsapp_number: "48530826501",
  contact_phone: "+48 530 826 501",
  address: "Paniewo 3A",
  city: "Topólka",
  postal_code: "87-875",
  county: "radziejowski",
  region: "kujawsko-pomorskie",
  branding: {
    facebook: "https://www.facebook.com/profile.php?id=100068379260209",
    logoUrl: "/images/dcar-logo.png",
    faviconUrl: "/icon",
    colors: {
      primary: "#1686E0",
      primaryForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#090B0B",
      accent: "#1686E0",
      accentForeground: "#ffffff",
      surface: "#F1F3F5",
      muted: "#E2E8F0",
      headerBg: "#080808",
      footerBg: "#080808",
    },
    media: {
      heroImageUrl: "/images/dcar-hero.jpg",
    },
  },
  services: [
    {
      id: "srv-buying",
      type: "car_buying",
      enabled: true,
      title: "Skup Samochodów Za Gotówkę",
      description: "Kupujemy auta w każdym stanie - bezpłatny dojazd, wycena w 15 minut i gotówka od ręki.",
      ctaLabel: "Wyceń swoje auto",
      ctaType: "lead_form",
    },
    {
      id: "srv-sales",
      type: "car_sales",
      enabled: true,
      title: "Sprzedaż Aut z Gwarancją",
      description: "Pewne samochody osobowe sprawdzone technicznie. Raport historii pojazdu w cenie.",
      ctaLabel: "Przeglądaj ofertę",
      ctaType: "link",
      ctaValue: "#vehicles",
    },
    {
      id: "srv-towing",
      type: "towing",
      enabled: true,
      title: "Pomoc Drogowa & Laweta 24/7",
      description: "Transport awaryjny i powypadkowy na terenie całego powiatu radziejowskiego i okolic.",
      ctaLabel: "Zadzwoń po pomoc",
      ctaType: "phone",
      ctaValue: "+48 530 826 501",
    },
  ],
  page_config: {
    sections: [
      { id: "sec-hero", type: "hero", enabled: true, title: "Sprzedaj nam swoje auto", subtitle: "Szybko, bezpiecznie i bez zbędnych formalności w Topólce i okolicach." },
      { id: "sec-trust", type: "trust", enabled: true, title: "Dlaczego warto nam zaufać?" },
      { id: "sec-process", type: "process", enabled: true, title: "Jak to działa?" },
      { id: "sec-services", type: "services", enabled: true, title: "Nasza Oferta (Usługi)" },
      { id: "sec-reviews", type: "reviews", enabled: true, title: "Opinie naszych klientów" },
      { id: "sec-vehicles", type: "vehicles", enabled: true, title: "Aktualna Oferta Samochodów" },
      { id: "sec-about", type: "about", enabled: true, title: "Komis i skup aut" },
      { id: "sec-service-areas", type: "service_areas", enabled: true, title: "Skup aut w Topólce i okolicach" },
      { id: "sec-lead", type: "lead_form", enabled: true, title: "Darmowa, błyskawiczna wycena auta" },
      { id: "sec-faq", type: "faq", enabled: true, title: "Najczęściej zadawane pytania" },
      { id: "sec-contact", type: "contact", enabled: true, title: "Kontakt i lokalizacja" },
    ],
  },
  business_rules: {
    tradeIn: {
      enabled: true,
      title: "Auto w rozliczeniu",
      description: "Możliwość pozostawienia swojego obecnego samochodu w rozliczeniu przy zakupie auta z naszej oferty.",
    },
    purchasePriceLimit: {
      enabled: true,
      maxAmount: 10000,
      currency: "PLN",
      description: "Skupujemy również samochody budżetowe do 10 000 zł - zapytaj o szybką wycenę.",
    },
  },
  local_seo: {
    primaryLocation: {
      city: "Topólka",
      locality: "Paniewo",
      county: "radziejowski",
      region: "kujawsko-pomorskie",
      postalCode: "87-875",
    },
    serviceAreas: [
      { city: "Topólka", slug: "topolka", enabled: true, indexable: true, priority: 1 },
      { city: "Radziejów", slug: "radziejow", enabled: true, indexable: true, priority: 2 },
      { city: "Lubraniec", slug: "lubraniec", enabled: true, indexable: true, priority: 3 },
      { city: "Izbica Kujawska", slug: "izbica-kujawska", enabled: true, indexable: true, priority: 4 },
      { city: "Brześć Kujawski", slug: "brzesc-kujawski", enabled: true, indexable: true, priority: 5 },
      { city: "Piotrków Kujawski", slug: "piotrkow-kujawski", enabled: true, indexable: true, priority: 6 },
      { city: "Osięciny", slug: "osieciny", enabled: true, indexable: true, priority: 7 },
      { city: "Bytoń", slug: "byton", enabled: true, indexable: true, priority: 8 },
      { city: "Włocławek", slug: "wloclawek", enabled: true, indexable: true, priority: 9 },
      { city: "Inowrocław", slug: "inowroclaw", enabled: true, indexable: true, priority: 10 },
      { city: "Kruszwica", slug: "kruszwica", enabled: true, indexable: true, priority: 11 },
      { city: "Konin", slug: "konin", enabled: true, indexable: true, priority: 12 },
    ],
    localPages: [
      {
        slug: "skup-aut-topolka",
        city: "Topólka",
        enabled: true,
        indexable: true,
        priority: 1,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-radziejow", "skup-aut-lubraniec", "skup-aut-izbica-kujawska"],
        seo: {
          title: "Skup aut Topólka | D-CAR - skup samochodów za gotówkę",
          metaDescription: "D-CAR oferuje skup aut w Topólce i okolicach. Bezpłatna wycena, natychmiastowa wypłata gotówki i darmowy odbiór pojazdu. Sprawdź naszą ofertę skupu samochodów.",
          h1: "Skup aut w Topólce - D-CAR",
        },
        content: {
          intro: "Szukasz rzetelnego skupu aut w Topólce lub okolicach Paniewa? D-CAR to lokalny skup samochodów za gotówkę. Kupujemy auta w każdym stanie technicznym, oferując bezpłatną wycenę i szybką realizację transakcji.",
          serviceDescription: "Obsługujemy mieszkańców Topólki oraz okolicznych miejscowości w powiecie radziejowskim. Zapewniamy pełne wsparcie formalne, umowę kupna-sprzedaży i wypłatę gotówki od ręki.",
          locationNote: "Nasza główna siedziba i plac znajdują się pod adresem Paniewo 3A w gminie Topólka. Zapraszamy do kontaktu telefonicznego lub złożenia darmowego formularza wyceny online.",
          faq: [
            { q: "Czy D-CAR skupuje auta w Topólce?", a: "Tak, nasza główna siedziba znajduje się w Paniewie (gmina Topólka). Skupujemy auta bezpośrednio na placu oraz z dojazdem do klienta." },
            { q: "Czy mogę zostawić obecne auto w rozliczeniu przy zakupie innego pojazdu?", a: "Tak! Umożliwiamy pozostawienie dotychczasowego samochodu w rozliczeniu przy zakupie auta z naszej oferty." },
            { q: "Czy D-CAR skupuje auta budżetowe do 10 000 zł?", a: "Tak, skupujemy również auta w segmencie budżetowym do kwoty 10 000 zł - zapytaj o naszą propozycję cenową." },
            { q: "Czy odbiór samochodu z Topólki jest darmowy?", a: "Tak, zapewniamy bezpłatny odbiór pojazdu własną lawetą z terenu gminy Topólka i całego powiatu radziejowskiego." },
          ],
        },
      },
      {
        slug: "skup-aut-radziejow",
        city: "Radziejów",
        enabled: true,
        indexable: true,
        priority: 2,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-topolka", "skup-aut-lubraniec"],
        seo: {
          title: "Skup aut Radziejów | D-CAR - szybki skup samochodów za gotówkę",
          metaDescription: "Szukasz skupu samochodów w Radziejowie? D-CAR zapewnia szybki skup aut za gotówkę z dojazdem do Radziejowa. Bezpłatna wycena w 15 minut.",
          h1: "Skup aut w Radziejowie - D-CAR",
        },
        content: {
          intro: "Planujesz sprzedać samochód w Radziejowie? D-CAR oferuje ekspresowy skup samochodów z bezpłatnym dojazdem do klienta w Radziejowie i okolicach.",
          serviceDescription: "Dojeżdżamy do Radziejowa w kilkanaście minut. Płacimy gotówką od ręki i sporządzamy bezpieczną umowę kupna-sprzedaży na miejscu.",
          locationNote: "D-CAR posiada plac w pobliskim Paniewie (gmina Topólka, ok. 15 km od Radziejowa). Oferujemy jednak pełną obsługę mobilną na terenie Radziejowa.",
          faq: [
            { q: "Czy D-CAR dojeżdża po auto do Radziejowa?", a: "Tak, dojeżdżamy do Radziejowa bezpłatnie i wyceniamy auto na miejscu u klienta." },
            { q: "Jak szybko można sprzedać auto z Radziejowa?", a: "Zazwyczaj realizujemy transakcję tego samego dnia - wycena i wypłata gotówki trwają około 15–30 minut." },
          ],
        },
      },
      {
        slug: "skup-aut-lubraniec",
        city: "Lubraniec",
        enabled: true,
        indexable: true,
        priority: 3,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-topolka", "skup-aut-izbica-kujawska"],
        seo: {
          title: "Skup aut Lubraniec | D-CAR - skup samochodów za gotówkę",
          metaDescription: "D-CAR skupuje samochody osobowe i dostawcze w Lubrańcu. Bezpłatna wycena, darmowa laweta i natychmiastowa wypłata gotówki. Zadzwoń!",
          h1: "Skup aut w Lubrańcu - D-CAR",
        },
        content: {
          intro: "Potrzebujesz szybko sprzedać auto w Lubrańcu? D-CAR kupuje samochody za gotówkę od mieszkańców Lubrańca i okolicznych miejscowości.",
          serviceDescription: "Skupujemy auta sprawne, powypadkowe, uszkodzone oraz bez ważnego przeglądu lub OC. Zapewniamy własny transport lawetą.",
          locationNote: "Siedziba D-CAR mieści się w Paniewie 3A k. Topólki, skąd sprawnie dojeżdżamy do Lubrańca i całego powiatu.",
          faq: [
            { q: "Czy D-CAR kupuje auta uszkodzone w Lubrańcu?", a: "Tak, skupujemy pojazdy w każdym stanie technicznym, w tym powypadkowe i uszkodzone mechanicznie." },
          ],
        },
      },
      {
        slug: "skup-aut-izbica-kujawska",
        city: "Izbica Kujawska",
        enabled: true,
        indexable: true,
        priority: 4,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-topolka", "skup-aut-lubraniec"],
        seo: {
          title: "Skup aut Izbica Kujawska | D-CAR - bezpieczna sprzedaż auta",
          metaDescription: "Skup samochodów za gotówkę w Izbicy Kujawskiej. D-CAR gwarantuje bezpłatną wycenę, umowę na miejscu i szybki dojazd lawetą.",
          h1: "Skup aut w Izbicy Kujawskiej - D-CAR",
        },
        content: {
          intro: "Oferujemy profesjonalny skup aut dla mieszkańców Izbicy Kujawskiej i sąsiednich miejscowości. Gwarantujemy uczciwe ceny i natychmiastową płatność.",
          serviceDescription: "Odbieramy auta prosto spod domu klienta w Izbicy Kujawskiej, regulujemy należność w gotówce lub przelewem natychmiastowym.",
          locationNote: "D-CAR działa w powiecie radziejowskim i włocławskim. Nasz główny plac znajduje się w Paniewie 3A (Topólka).",
          faq: [
            { q: "Czy muszę przyjeżdżać z Izbicy Kujawskiej na plac?", a: "Nie, nasz przedstawiciel może przyjechać pod wskazany adres w Izbicy Kujawskiej i sfinalizować transakcję na miejscu." },
          ],
        },
      },
      {
        slug: "skup-aut-brzesc-kujawski",
        city: "Brześć Kujawski",
        enabled: true,
        indexable: true,
        priority: 5,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-lubraniec", "skup-aut-wloclawek"],
        seo: {
          title: "Skup aut Brześć Kujawski | D-CAR - skup samochodów za gotówkę",
          metaDescription: "D-CAR oferuje szybki skup aut za gotówkę w Brześciu Kujawskim. Bezpłatna wycena, natychmiastowa płatność i darmowy odbiór pojazdu lawetą.",
          h1: "Skup aut w Brześciu Kujawskim - D-CAR",
        },
        content: {
          intro: "Chcesz sprzedać samochód w Brześciu Kujawskim? D-CAR kupuje auta za gotówkę od mieszkańców Brześcia Kujawskiego i okolic. Gwarantujemy uczciwą wycenę i odbiór własną lawetą.",
          serviceDescription: "Kupujemy samochody w każdym stanie technicznym - sprawne, uszkodzone i powypadkowe z dojazdem do Brześcia Kujawskiego.",
          locationNote: "Siedziba D-CAR znajduje się w pobliskim Paniewie k. Topólki. Oferujemy bezpłatny dojazd do Brześcia Kujawskiego.",
          faq: [
            { q: "Czy odbiór auta z Brześcia Kujawskiego jest darmowy?", a: "Tak, zapewniamy bezpłatny odbiór pojazdu własną lawetą z terenu Brześcia Kujawskiego." },
          ],
        },
      },
      {
        slug: "skup-aut-piotrkow-kujawski",
        city: "Piotrków Kujawski",
        enabled: true,
        indexable: true,
        priority: 6,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-topolka", "skup-aut-radziejow"],
        seo: {
          title: "Skup aut Piotrków Kujawski | D-CAR - skup samochodów za gotówkę",
          metaDescription: "D-CAR kupuje auta w Piotrkowie Kujawskim i okolicach. Gotówka od ręki, bezpłatna wycena i dojazd lawetą.",
          h1: "Skup aut w Piotrkowie Kujawskim - D-CAR",
        },
        content: {
          intro: "Oferujemy sprawny i bezpieczny skup samochodów w Piotrkowie Kujawskim. Płacimy gotówką od ręki i załatwiamy formalności na miejscu.",
          serviceDescription: "Dojeżdżamy do Piotrkowa Kujawskiego bez zbędnej zwłoki, oferując bezpieczną transakcję kupna-sprzedaży.",
          locationNote: "D-CAR posiada plac w Paniewie 3A (Topólka), obsługując cały powiat radziejowski.",
          faq: [
            { q: "Czy kupujecie auta bez ważnego przeglądu w Piotrkowie Kujawskim?", a: "Tak, skupujemy również auta bez ważnych badań technicznych i OC." },
          ],
        },
      },
      {
        slug: "skup-aut-osieciny",
        city: "Osięciny",
        enabled: true,
        indexable: true,
        priority: 7,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-radziejow", "skup-aut-topolka"],
        seo: {
          title: "Skup aut Osięciny | D-CAR - szybki skup samochodów za gotówkę",
          metaDescription: "Skup samochodów za gotówkę w Osięcinach i okolicach. D-CAR gwarantuje wycenę w 15 minut, umowę na miejscu i bezpłatny dojazd.",
          h1: "Skup aut w Osięcinach - D-CAR",
        },
        content: {
          intro: "Planujesz sprzedaż auta w Osięcinach? D-CAR oferuje skup samochodów za gotówkę w Osięcinach z dojazdem do klienta w kilkanaście minut.",
          serviceDescription: "Zapewniamy profesjonalną obsługę, darmowy dojazd i wycenę auta na miejscu.",
          locationNote: "D-CAR działa mobilnie na terenie Osięcin i okolicznych gmin.",
          faq: [
            { q: "Jak szybko dojeżdżacie do Osięcin?", a: "Zazwyczaj jesteśmy na miejscu w ciągu 20–40 minut od zgłoszenia." },
          ],
        },
      },
      {
        slug: "skup-aut-wloclawek",
        city: "Włocławek",
        enabled: true,
        indexable: true,
        priority: 8,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-brzesc-kujawski", "skup-aut-lubraniec"],
        seo: {
          title: "Skup aut Włocławek | D-CAR - bezpieczna sprzedaż auta za gotówkę",
          metaDescription: "Skup aut za gotówkę we Włocławku. D-CAR kupuje samochody osobowe i dostawcze z Włocławka. Bezpłatna wycena i darmowy odbiór.",
          h1: "Skup aut we Włocławku - D-CAR",
        },
        content: {
          intro: "Szukasz sprawdzonego skupu aut we Włocławku? D-CAR obsługuje mieszkańców Włocławka, oferując wycenę online i natychmiastową wypłatę gotówki.",
          serviceDescription: "Skupujemy auta we Włocławku niezależnie od stanu technicznego. Transport własną lawetą jest darmowy.",
          locationNote: "D-CAR sprawnie dojeżdża do Włocławka z placu w Paniewie.",
          faq: [
            { q: "Czy D-CAR kupuje auta we Włocławku?", a: "Tak, regularnie odbieramy samochody od mieszkańców Włocławka." },
          ],
        },
      },
      {
        slug: "skup-aut-kruszwica",
        city: "Kruszwica",
        enabled: true,
        indexable: true,
        priority: 9,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-radziejow", "skup-aut-inowroclaw"],
        seo: {
          title: "Skup aut Kruszwica | D-CAR - skup samochodów za gotówkę",
          metaDescription: "Szybki skup aut w Kruszwicy. D-CAR gwarantuje darmowy dojazd lawetą, gotówkę od ręki i legalną umowę.",
          h1: "Skup aut w Kruszwicy - D-CAR",
        },
        content: {
          intro: "Skupujemy auta osobowe i dostawcze w Kruszwicy i okolicach. Zapewniamy dojazd do klienta oraz płatność w gotówce.",
          serviceDescription: "Wyceniamy pojazd uczciwie i natychmiastowo spłacamy uzgodnioną kwotę.",
          locationNote: "D-CAR świadczy usługi skupu aut na terenie gminy Kruszwica.",
          faq: [
            { q: "Czy wycena w Kruszwicy jest darmowa?", a: "Tak, wycena i dojazd w Kruszwicy są całkowicie bezpłatne." },
          ],
        },
      },
      {
        slug: "skup-aut-inowroclaw",
        city: "Inowrocław",
        enabled: true,
        indexable: true,
        priority: 10,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-kruszwica", "skup-aut-radziejow"],
        seo: {
          title: "Skup aut Inowrocław | D-CAR - skup samochodów za gotówkę",
          metaDescription: "D-CAR oferuje skup aut w Inowrocławiu. Bezpłatna wycena, natychmiastowa wypłata gotówki i darmowy transport lawetą.",
          h1: "Skup aut w Inowrocławiu - D-CAR",
        },
        content: {
          intro: "Potrzebujesz pilnie sprzedać auto w Inowrocławiu? D-CAR kupuje samochody używane za gotówkę z dojazdem na terenie Inowrocławia.",
          serviceDescription: "Oferujemy bezpieczny skup pojazdów z natychmiastową płatnością w gotówce lub przelewem.",
          locationNote: "Zapewniamy pełną obsługę mobilną w Inowrocławiu.",
          faq: [
            { q: "Czy kupujecie auta powypadkowe w Inowrocławiu?", a: "Tak, skupujemy samochody uszkodzone i po wypadkach." },
          ],
        },
      },
      {
        slug: "skup-aut-konin",
        city: "Konin",
        enabled: true,
        indexable: true,
        priority: 11,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-izbica-kujawska", "skup-aut-piotrkow-kujawski"],
        seo: {
          title: "Skup aut Konin | D-CAR - skup samochodów za gotówkę",
          metaDescription: "Skup samochodów za gotówkę w Koninie. D-CAR oferuje bezpłatną wycenę, płatność na miejscu i bezpieczną transakcję.",
          h1: "Skup aut w Koninie - D-CAR",
        },
        content: {
          intro: "Oferujemy profesjonalny skup aut dla mieszkańców Konina. Szybka wycena, dojazd lawetą i płatność w gotówce od ręki.",
          serviceDescription: "Kupujemy samochody bez zbędnych formalności i długiego oczekiwania.",
          locationNote: "D-CAR realizuje dojazdy po samochody na terenie Konina i okolic.",
          faq: [
            { q: "Czy dojeżdżacie do Konina?", a: "Tak, dojeżdżamy do Konina i okolicznych miejscowości po wcześniejszym kontakcie." },
          ],
        },
      },
      {
        slug: "skup-aut-byton",
        city: "Bytoń",
        enabled: true,
        indexable: true,
        priority: 8,
        showInLocalAreaLinks: true,
        showInFooter: true,
        relatedLocations: ["skup-aut-topolka", "skup-aut-radziejow"],
        seo: {
          title: "Skup aut Bytoń | D-CAR - skup samochodów za gotówkę",
          metaDescription: "Skup aut w Bytoniu k. Radziejowa. D-CAR kupuje samochody za gotówkę. Szybka wycena i bezpłatny odbiór pojazdu.",
          h1: "Skup aut w Bytoniu - D-CAR",
        },
        content: {
          intro: "Oferujemy profesjonalny skup aut w gminie Bytoń. Płacimy gotówką od ręki i odbieramy auto własną lawetą.",
          serviceDescription: "Obsługujemy gminę Bytoń oraz sąsiednie miejscowości. Załatwiamy formalności na miejscu.",
          locationNote: "Gmina Bytoń sąsiaduje z gminą Topólka. Zapewniamy dojazd w kilkanaście minut.",
          faq: [
            { q: "Czy dojazd do Bytonia jest darmowy?", a: "Tak, dojeżdżamy i odbieramy auta bezpłatnie." },
          ],
        },
      },
    ],
  },

  created_at: new Date().toISOString(),
};


export const seedProfile: Profile = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  slug: "komis-maciek",
  business_name: "Auto Komis Maciek",
  business_description:
    "Sprawdzony komis samochodowy w Krakowie. Oferujemy samochody osobowe i dostawcze z gwarancją. Każde auto przechodzi szczegółową kontrolę techniczną przed sprzedażą.",
  logo_url: null,
  pixel_id: "1636959447346992",
  whatsapp_number: "48123456789",
  contact_phone: "+48 123 456 789",
  address: "ul. Krakowska 123",
  city: "Kraków",
  branding: {
    logoUrl: null,
    colors: {
      primary: "#0f172a",
      primaryForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#020617",
      accent: "#2563eb",
      accentForeground: "#ffffff",
      surface: "#f8fafc",
      muted: "#f1f5f9",
    },
    media: {
      heroImageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=800&fit=crop",
    },
  },
  created_at: new Date().toISOString(),
};

export const allSeedProfiles: Profile[] = [seedProfileDCar, seedProfile];

export const seedCars: Car[] = [
  {
    id: "car-007",
    profile_id: seedProfileDCar.id,
    slug: "mitsubishi-outlander-lift-2007-lpg",
    make: "Mitsubishi",
    model: "Outlander Lift",
    year: 2007,
    price: 8300,
    mileage: 263900,
    fuel_type: "Benzyna + LPG",
    engine_capacity: "2.0 136KM",
    transmission: "Manualna",
    color: "Srebrny",
    description:
      "Sprzedam zadbane Mitsubishi Outlander\nRok produkcji 2007\n2.0 benzyna+ LPG\nOC i PT sierpień 2027r\nStan blacharski bdb, brak korozji, normalne ślady użytkowania\nŁadnie się prezentuje\nMechanicznie bez wkładu finansowego\nKlimatyzacja mrozi\n4 x elektryczne szyby\nPodgrzewane fotele itp\nDobrze jeździ na benzynie i gazie\nCena 8300 zł\nPozdrawiam",
    images: [
      "https://ireland.apollo.olxcdn.com:443/v1/files/847mkdurwqdn3-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/vzh9i1jt0fzg-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/3kbci89l6wue-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/p2zy5kr6n9202-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/bq2o7wdbyadg-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/iub6e3m9mywk-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/okinff3245fm2-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/zk8m0wl3tvy91-PL/image",
    ],
    is_sold: false,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-001",
    profile_id: seedProfileDCar.id,
    slug: "opel-astra-ii-1-6-8v-2000-benzyna",
    make: "Opel",
    model: "Astra II 1.6 8V",
    year: 2000,
    price: 3300,
    mileage: 146000,
    fuel_type: "Benzyna",
    engine_capacity: "1.6 8V 84KM",
    transmission: "Manualna",
    color: "Srebrny",
    description:
      "Sprzedam Opel Astra II, rok produkcji 2000, silnik 1.6 8V benzyna. Przebieg oryginalny 146 tys. km. Opłaty aktualne do przyszłego roku. Mechanicznie bez wkładu finansowego! Stan blacharski oceniam na dobry z plusem, ładnie się prezentuje. Klimatyzacja mrozi! Elektryczne szyby, hak holowniczy. Pozdrawiam.",
    images: [
      "https://ireland.apollo.olxcdn.com:443/v1/files/0ynomnj3m2gc3-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/gbjzemfg8p9n2-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/6y7byu176nuv2-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/csdoahbsx2se-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/mjw3iq6u6kxb3-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/8pecuaw9hyw62-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/rn7ma36n74vd3-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/nt1t0l3ajl2t2-PL/image",
    ],
    is_sold: false,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-002",
    profile_id: seedProfileDCar.id,
    slug: "audi-a38p-2-0-tdi-2003-diesel",
    make: "Audi",
    model: "A3 8P 2.0 TDI",
    year: 2003,
    price: 2700,
    mileage: 210000,
    fuel_type: "Diesel",
    engine_capacity: "2.0 TDI 140KM",
    transmission: "Manualna",
    color: "Czarny",
    description:
      "Sprzedam Audi A3 8P. Rok produkcji 2003, 2.0 diesel 140km. Silnik, skrzynia, zawieszenie w dobrym stanie. Blacharsko do drobnych poprawek i lakier do polerki. OC aktualne, PT wyszedł na dniach. Lokalizacja Topólka 87-875. Cena 2700 zł adekwatna do stanu pojazdu. Autem można wracać na kołach bądź mogę dostarczyć pod wskazany adres po oględzinach. Pozdrawiam.",
    images: [
      "https://ireland.apollo.olxcdn.com:443/v1/files/084a38g4ub2o-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/sbfqrj9vqrsn-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/5dbrotpttk611-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/f21glet2oxq11-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/ilub181qtjks2-PL/image",
    ],
    is_sold: false,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-004",
    profile_id: seedProfileDCar.id,
    slug: "hyundai-i30-2015-lift-1-4-crdi",
    make: "Hyundai",
    model: "i30 Lift",
    year: 2015,
    price: 22500,
    mileage: 165000,
    fuel_type: "Diesel",
    engine_capacity: "1.4 CRDi 90KM",
    transmission: "Manualna",
    color: "Biały",
    description:
      "Sprzedam Hyundai i30 2015r 1.4 CRDi polift. OC, AC, PT świeżo wykupione na rok. Stan blacharski wzorowy. Mechanicznie bez wkładu finansowego. Bogate wyposażenie, klimatyzacja mrozi! Jesteśmy właścicielami od 2019r. Cena 22 500 zł do negocjacji po oględzinach auta. Pozdrawiam.",
    images: [
      "https://ireland.apollo.olxcdn.com:443/v1/files/kglaocjlrnge1-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/nqfw0fxdn2w92-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/det4pf68zpn61-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/90xa9fbfkd4i3-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/yb3obcmet74w1-PL/image",
    ],
    is_sold: false,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-005",
    profile_id: seedProfileDCar.id,
    slug: "audi-a3-sportback-2-0-tfsi-2004-benzyna",
    make: "Audi",
    model: "A3 Sportback 2.0 TFSI",
    year: 2004,
    price: 12800,
    mileage: 198000,
    fuel_type: "Benzyna",
    engine_capacity: "2.0 TFSI 200KM",
    transmission: "Automatyczna (z łopatkami)",
    color: "Czarny",
    description:
      "Sprzedam Audi A3 Sportback z silnikiem benzynowym 2.0 TFSI o mocy 200 KM w połączeniu z automatyczną skrzynią biegów. Autko ze sportowym charakterem oraz bogatym wyposażeniem. Mechanicznie w bdb stanie bez wkładu. Blacharsko bez korozji! Łopatki przy kierownicy, przelot, alufelgi z oponami zimowymi. Cena 12 800 zł do negocjacji. Możliwość zamiany na tańsze. Pozdrawiam.",
    images: [
      "https://ireland.apollo.olxcdn.com:443/v1/files/i3a6q9kvq7t81-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/lycj1gyadcyg3-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/nf781m8q62xc-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/1u8kk360t8uh3-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/nr2hu5hbhmyc2-PL/image",
    ],
    is_sold: false,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-006",
    profile_id: seedProfileDCar.id,
    slug: "opel-astra-h-lift-1-6-2007-benzyna",
    make: "Opel",
    model: "Astra H Lift 1.6",
    year: 2007,
    price: 4300,
    mileage: 185000,
    fuel_type: "Benzyna",
    engine_capacity: "1.6 16V 105KM",
    transmission: "Manualna",
    color: "Srebrny",
    description:
      "Sprzedam Opel Astra H 2007r polift 1.6 benzyna. Klimatyzacja mrozi! Mechanicznie w bdb stanie. Blacharsko do poprawek jak na zdjęciach. Cena 4300 zł. Pozdrawiam.",
    images: [
      "https://ireland.apollo.olxcdn.com:443/v1/files/75lcjthguw6c1-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/yhuvbbfyf0t01-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/jkyd99warkad1-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/p8nlbpo8gzt01-PL/image",
      "https://ireland.apollo.olxcdn.com:443/v1/files/fbxnjnv1r666-PL/image",
    ],
    is_sold: false,
    is_featured: false,
    created_at: new Date().toISOString(),
  },
];

// ============================================================
// Data fetching functions - use seed data or Supabase
// ============================================================

const USE_SEED =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export async function getProfile(slug: string): Promise<Profile | null> {
  if (USE_SEED) {
    const found = allSeedProfiles.find((p) => p.slug === slug);
    return found || null;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      const found = allSeedProfiles.find((p) => p.slug === slug);
      return found || null;
    }
    return data;
  } catch {
    const found = allSeedProfiles.find((p) => p.slug === slug);
    return found || null;
  }
}

export async function getCars(profileId: string): Promise<Car[]> {
  if (USE_SEED) {
    const matched = seedCars.filter((c) => c.profile_id === profileId);
    return matched.length > 0 ? matched : seedCars;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("cars")
      .select("*")
      .eq("profile_id", profileId)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (!data || data.length === 0) {
      return seedCars;
    }
    return data;
  } catch {
    return seedCars;
  }
}

export async function getCar(carSlug: string): Promise<Car | null> {
  if (USE_SEED) {
    return seedCars.find((c) => c.slug === carSlug) || seedCars.find((c) => c.id === carSlug) || null;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("cars")
      .select("*")
      .eq("slug", carSlug)
      .single();

    if (!data) {
      return seedCars.find((c) => c.slug === carSlug) || seedCars.find((c) => c.id === carSlug) || null;
    }
    return data;
  } catch {
    return seedCars.find((c) => c.slug === carSlug) || seedCars.find((c) => c.id === carSlug) || null;
  }
}

export async function getAllProfiles(): Promise<Profile[]> {
  if (USE_SEED) {
    return allSeedProfiles;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("*");

    if (!data || data.length === 0) {
      return allSeedProfiles;
    }
    return data;
  } catch {
    return allSeedProfiles;
  }
}

export async function getAllCars(): Promise<Car[]> {
  if (USE_SEED) {
    return seedCars;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("cars")
      .select("*")
      .eq("is_sold", false);

    if (!data || data.length === 0) {
      return seedCars;
    }
    return data;
  } catch {
    return seedCars;
  }
}
