# 💡 VroomSites & VroomDealer — Pomysły na Rozwój Modułów (Product Roadmap & Ideas)

Dokument zawiera zbiór propozycji i pomysłów na rozwój poszczególnych modułów platformy VroomSites / VroomDealer, podzielonych według komponentów systemu oraz priorytetów wdrożenia (**Quick Wins**, **Średnioterminowe**, **Game Changery**).

---

## 🚗 1. Moduł Katalogu Pojazdów (`Inventory` & `VehiclesSection`)
*Aktualny stan: siatka aut, podstawowe filtry (napęd, wyszukiwarka tekstowa, sortowanie po cenie/dacie, filtry stanu dostępne/sprzedane).*

### ⚡ Quick Wins
- **Filtrowanie wielokryterialne:**
  - Suwaki lub widełki cenowe (Cena od / do) oraz rocznika (np. 2010 - 2020).
  - Filtr skrzyni biegów (Manualna / Automatyczna) oraz typu nadwozia (Kombi, Sedan, SUV, Hatchback).
- **Zapisywanie filtrów w URL (Query params):**
  - Umożliwienie dzielenia się linkiem z konkretnymi filtrami (np. `/samochody?fuel=diesel&maxPrice=30000`).
- **Licznik wyników na żywo:**
  - Dynamiczny wskaźnik: „Znaleziono 8 aut spełniających kryteria” z przyciskiem „Wyczyść filtry”.

### 🚀 Średnioterminowe
- **Odznaka „Nowość” / „Obniżka ceny”:**
  - Etykieta „Nowość” dla aut dodanych w ciągu ostatnich 7 dni.
  - Jeśli cena została obniżona w panelu admina, pokazywanie przekreślonej starej ceny i oszczędności (zgodnie z dyrektywą Omnibus).
- **Wyszukiwarka hybrydowa (Fuzzy search):**
  - Obsługa literówek i synonimów (np. „audi a 4”, „golf 7”, „kombi diesel”).
- **Widok kafelkowy vs. lista:**
  - Przełącznik widoku: siatka dużych kart vs kompaktowa lista tabelaryczna z parametrami.

### 🌟 Game Changery
- **Powiadomienia „Szukasz takiego auta?” (Car Alert):**
  - Gdy klient nie znajdzie interesującego go auta, zostawia numer telefonu / e-mail i kryteria (np. „Passat B8 do 50k”). Właściciel komisu dostaje leada, a klient powiadomienie, gdy auto pojawi się na placu.
- **Porównywarka aut (Side-by-side comparison):**
  - Możliwość zaznaczenia 2–3 aut i porównania ich parametrów technicznych w przejrzystej tabeli.

---

## 🏎️ 2. Karta Szczegółów Pojazdu (`SingleCarPage` & `CarGallery`)
*Aktualny stan: galeria ze slajderem i miniaturami, dane techniczne, opis auta, sticky sidebar z kontaktem i gwarancjami, sekcja polecanych aut.*

### ⚡ Quick Wins
- **Bezpośrednie CTA do WhatsApp z kontekstem auta:**
  - Przycisk „Zapytaj o to auto na WhatsApp” otwierający czat z predefiniowaną wiadomością:  
    *„Dzień dobry, interesuje mnie ogłoszenie: [Marka Model Rok] (Cena: XX PLN). Czy jest jeszcze dostępne? [Link do oferty]”*.
- **Kopiowanie linku / Udostępnij ogłoszenie:**
  - Przycisk szybkiego udostępniania (Facebook, WhatsApp, skopiuj link) z toastem informacyjnym.
- **Klawisze strzałek w galerii zdjęć:**
  - Obsługa nawigacji klawiaturą (lewo/prawo) oraz gestów swipe na mobile.

### 🚀 Średnioterminowe
- **Kalkulator raty finansowania / kredytu:**
  - Prosty suwak: wkład własny + okres (np. 12–48 mies.) wyliczający orientacyjną ratę miesięczną (np. *„Od 450 zł / miesięcznie”*).
  - Przycisk „Zapytaj o finansowanie”.
- **Generowanie karty pojazdu do druku / PDF:**
  - Jeden klik generujący elegancką, jednostronicową ulotkę PDF z danymi, zdjęciem i numerem telefonu (do wywieszenia za szybą auta na placu).
- **Tryb pełnoekranowy galerii (Lightbox / Fullscreen Zoom):**
  - Możliwość powiększenia zdjęć w wysokiej rozdzielczości z widokiem szczegółów (stan lakieru, opon, wnętrza).

### 🌟 Game Changery
- **Prezentacja Wideo / Wideo 360° / Rolka:**
  - Możliwość dodania linku do YouTube Shorts / TikToka lub krótkiego wideo z odpalania silnika i obchodu auta.
- **Rezerwacja auta online z zadatkiem (BLIK / Przelewy24):**
  - Opcja zablokowania auta na 24-48h za opłatą rezerwacyjną (np. 200 zł przez PayU/Stripe), co drastycznie odfiltrowuje niezdecydowanych klientów.

---

## 📝 3. Moduł Skupu Aut & Formularz Leadów (`MultiStepLeadForm` / `/skup-aut`)
*Aktualny stan: 3-krokowy formularz wyceny, walidacja Zod, honeypot antyspamowy, zapis do bazy i powiadomienia e-mail przez Resend.*

### ⚡ Quick Wins
- **Możliwość dołączenia zdjęć pojazdu:**
  - Drag & drop lub zrobienie zdjęcia aparatem z telefonu (do 5 zdjęć), upload bezpośrednio do Supabase Storage z kompresją w locie.
- **Wycena przez wklejenie linku do OLX / Otomoto / Marketplace:**
  - Opcja: *„Masz już wystawione auto na portalu? Wklej link do ogłoszenia, a rzucimy konkretną ofertę bez marudzenia!”*.
- **Etykieta „Zero rękojmi i pretensji po sprzedaży” (Tarcza Spokoju):**
  - Kluczowy psychologiczny punkt bólu osób prywatnych: obawa przed telefonami po sprzedaży od kupujących z roszczeniami o ukryte wady.
  - Wyraźny komunikat: *„Sprzedajesz firmie, nie osobie prywatnej – nie musisz się bać telefonów z pretensjami po sprzedaży”*.
  - ⚠️ Uwaga prawna: rękojmię można wyłączyć w umowie (kupującym jest firma), ale wyłączenie nie działa przy świadomym zatajeniu wady przez sprzedającego. Unikać obietnic typu „100% spokoju”.
- **Zapamiętywanie stanu formularza (Local Storage):**
  - Jeśli użytkownik przypadkowo odświeży stronę, formularz przywraca wcześniej wpisane dane.
- **Dynamiczny licznik czasu wyceny & Dostępności lawety:**
  - Informacja: *„Średni czas odpowiedzi: 14 minut | Wolna laweta w Twojej okolicy dostępna dzisiaj”*.

### 🚀 Średnioterminowe
- **Kalkulator „Ukrytych oszczędności” i zwrotu polisy OC:**
  - Pomysł: pokazać sprzedającemu, ile realnie kosztuje go trzymanie auta (OC, utrata wartości, przegląd) i ewentualny zwrot niewykorzystanej składki.
  - ⚠️ **Do weryfikacji przed użyciem w reklamach:** przy sprzedaży polisa OC przechodzi na nabywcę, a zasady zwrotu składki nie są oczywiste. Potwierdzić u ubezpieczyciela / prawnika.
- **Przełącznik „Problemy z autem? Dla nas to żaden problem”:**
  - Szybkie checkboxy dla aut problematycznych:
    - `[ ] Brak ważnego OC / badania technicznego`
    - `[ ] Auto powypadkowe / uszkodzone / nie odpala (potrzebna laweta)`
    - `[ ] Zgubiłem kartę pojazdu / dowód rejestracyjny`
    - `[ ] Spadek / współwłasność`
  - Daje klientowi ulgę, że nie musi się tłumaczyć, bo komis rozwiązuje te sprawy codziennie.
- **Szybka ścieżka WhatsApp Audio & Foto (Zero-friction valuation):**
  - Alternatywny przycisk obok formularza: *„Wolisz WhatsApp? Wyślij nam 2 zdjęcia i krótką wiadomość głosową, a odeślemy wycenę w 5 minut”*.
- **Wstępna wycena szacunkowa na żywo (Instant Price Range):**
  - Po podaniu marki, modelu i roku – wyświetlenie orientacyjnego przedziału rynkowego (np. *„Średnia cena rynkowa tego modelu: 14 000 – 18 500 zł. Dokładną kwotę podamy po rozmowie”*), co drastycznie zwiększa współczynnik ukończenia formularza.
- **Powiadomienia SMS dla klienta i dealera (Speed-to-lead):**
  - W branży skupu aut wygrywa ten, kto pierwszy zadzwoni do klienta (badania pokazują 7x wyższą szansę zakupu w ciągu 10 minut od zgłoszenia).
  - Natychmiastowy SMS do właściciela komisu + SMS do klienta z potwierdzeniem.

### 🌟 Game Changery
- **Program Partnerski / Poleceń „Zarób 200–500 zł za cynk o aucie” (Scout Program):**
  - Moduł poleceń dla lokalnych mechaników, wulkanizatorów, diagnostów SKP czy sąsiadów:
  - Formularz „Zgłoś auto znajomego / klienta” – jeśli komis odkupi samochód, polecający otrzymuje 200–500 zł premii w gotówce lub przelewem. Buduje to potężną lokalną siatkę dostawców aut.
- **Wycena AI na podstawie numeru VIN i zdjęć (Zintegrowana z CEPiK):**
  - Integracja z bazą CEPiK / dekoderem VIN – klient wpisuje tylko VIN, a system automatycznie uzupełnia markę, model, rok, pojemność silnika i historię.
  - Model wizyjny AI oceniający stan blacharki ze zdjęć i sugerujący optymalną kwotę ofertową dla kupującego z uwzględnieniem marży komisu.
- **Kreator Wypowiedzenia OC i Zgłoszenia Zbycia (Doc Auto-Generator):**
  - W momencie podpisania umowy kupna-sprzedaży klient otrzymuje na maila/SMS gotowy plik PDF ze zgłoszeniem zbycia do wydziału komunikacji oraz wnioskiem o zwrot składki OC – maksimum wygody i zaufania.

---

## ⚙️ 4. Panel Administracyjny Dealera (`/admin`)
*Aktualny stan: lista aut, formularz dodawania/edycji, tabela leadów ze statusami, zarządzanie ustawieniami i kolorami.*

### ⚡ Quick Wins
- **Szybka zmiana statusu z poziomu listy:**
  - Przełącznik (Switch/Dropdown) bezpośrednio w tabeli aut: *Dostępne ⇄ Zarezerwowane ⇄ Sprzedane* bez wchodzenia w pełną edycję.
- **Masowe akcje na autach:**
  - Zaznacz kilka aut → *Oznacz jako sprzedane* / *Usuń* / *Zmień wyróżnienie*.
- **Wyszukiwarka i filtry w liście aut:**
  - Szybkie znajdowanie auta po marce, modelu lub numerze rejestracyjnym.

### 🚀 Średnioterminowe
- **Import ogłoszeń z OLX / Otomoto / Facebook Marketplace:**
  - Dealer wkleja link do swojego ogłoszenia na OLX, a scraper automatycznie pobiera tytuł, cenę, przebieg, opis i zdjęcia w pełnej rozdzielczości.
- **Optymalizacja i automatyczny Watermark na zdjęciach:**
  - Przy uploadzie zdjęć automatyczne nakładanie subtelnego logo dealera w narożniku oraz kompresja do formatu WebP.
- **Zarządzanie leadami w widoku Kanban (Tablica CRM):**
  - Kolumny: *Nowy lead* ➔ *Próba kontaktu* ➔ *Wyceniono* ➔ *Umówione oględziny* ➔ *Kupione / Zakończone*. Możliwość przeciągania kart (Drag & Drop).

### 🌟 Game Changery
- **Multi-komis & Uprawnienia pracowników:**
  - Konta pracownicze z ograniczonym dostępem (np. handlowiec może tylko dodawać auta i edytować leady, ale nie ma dostępu do ustawień domeny i rozliczeń).
- **Auto-publikacja na portale:**
  - Jedno kliknięcie w panelu eksportujące ogłoszenie przez API na Otomoto / Gratka / OLX lub fanpage na Facebooku.

---

## 🎨 5. Silnik Szablonów, Branding & Personalizacja (`Branding` & `SectionRenderer`)
*Aktualny stan: dynamiczny `BrandProvider` (CSS vars), obsługa kolorów akcentów i tła, podział na tryby `car_buying` (D-Car) i `car_sales` (Wadera).*

### ⚡ Quick Wins
- **Przełącznik stylu motywu w panelu:**
  - Wybór zdefiniowanych presetów: *Dark Sport (Wadera), Modern Clean (D-Car), Luxury Black & Gold, Classic Navy Blue*.
- **Wybór fontów Google Fonts:**
  - Możliwość wyboru stylu typografii (np. Inter, Montserrat, Outfit, Plus Jakarta Sans) z poziomu konfiguracji brandingowej.
- **Własny Favicon i Apple Touch Icon generator:**
  - Automatyczne wycinanie ikony z logo komisu i serwowanie optymalnych rozmiarów.

### 🚀 Średnioterminowe
- **Kreator kolejności sekcji (Drag & Drop Section Builder):**
  - Właściciel komisu może sam układać sekcje na stronie głównej (np. przenieść opinie wyżej, ukryć proces, dodać sekcję wideo).
- **Dynamiczne generowanie grafik OpenGraph (Social Share Image):**
  - Każde auto ma automatycznie generowany obrazek podglądu na Facebooka/Twittera: zdjęcie auta + cena na czerwonym pasku + logo komisu.

### 🌟 Game Changery
- **Tryb PWA (Progressive Web App):**
  - Możliwość zainstalowania strony komisu jako aplikacji na telefonie klienta z ikoną na pulpicie.

---

## 📍 6. Moduł SEO Lokalnego & GEO (`LocalSeoPage` & `/skup-aut-[miasto]`)
*Aktualny stan: dedykowane strony per miasto (np. Włocławek, Toruń, Lipno), schematy JSON-LD LocalBusiness i FAQ.*

### ⚡ Quick Wins
- **Interaktywna mapa zasięgu (Obszar działania):**
  - Wektorowa mapa lub dynamiczna mapa Leaflet/Google Maps pokazująca promień dojazdu lawetą (np. do 100 km) z zaznaczonymi głównymi miastami.
- **Tabela odległości i czasu dojazdu:**
  - Np. *„Dojazd do Włocławka: ~25 min | Dojazd do Torunia: ~40 min | Darmowa laweta na całym obszarze”*.

### 🚀 Średnioterminowe
- **Automatyczny generator podstron powiatowych:**
  - Kreator w panelu admina: zaznacz powiaty/gminy, a system automatycznie wygeneruje zoptymalizowane strony SEO z unikalnymi nagłówkami, danymi demograficznymi i dostosowanym tekstem.
- **Zintegrowany widget opinii Google (Google Places API):**
  - Automatyczna synchronizacja najnowszych 5-gwiazdkowych opinii z profilu Google Moja Firma ze znacznikiem weryfikacji.

### 🌟 Game Changery
- **Wykrywanie lokalizacji użytkownika (GeoIP):**
  - Gdy klient wchodzi z Torunia, nagłówek automatycznie wyświetla: *„Skup aut z bezpłatnym dojazdem do Torunia i okolic”*.

---

## 📊 7. Analityka, Tracking i Prywatność (`MetaPixel`, `Analytics`, `CookieConsent`)
*Aktualny stan: baner RODO z blokowaniem skryptów, Meta Pixel z PageView na zgodę.*

### ⚡ Quick Wins
- **Śledzenie kluczowych zdarzeń konwersji (Event Tracking):**
  - Wysłanie formularza skupu (`Lead`).
  - Kliknięcie numeru telefonu (`Contact`).
  - Kliknięcie w przycisk WhatsApp (`InitiateCheckout` / `Contact`).
  - Obejrzenie szczegółów auta (`ViewContent`).
- **Dashboard analityczny w panelu dealera:**
  - Podstawowe statystyki: liczba odwiedzin w tym tygodniu, najpopularniejsze auta, liczba kliknięć w telefon.

### 🚀 Średnioterminowe
- **Meta Conversions API (CAPI po stronie serwera):**
  - Przesyłanie zdarzeń konwersji bezpośrednio z serwera Next.js do API Meta, omijające blokady przeglądarek (iOS 14.5+, AdBlocki, uBlock).
- **Google Tag Manager / GA4 Server-Side:**
  - Możliwość wpięcia własnego GTM-ID lub GA4 Measurement ID per tenant.

### 🌟 Game Changery
- **Kalkulator zwrotu z marketingu (Lead ROI):**
  - Śledzenie kosztu pozyskania samochodu: zestawienie wydatków na reklamy Meta Ads z liczbą sfinalizowanych zakupów aut.

---

## ⏱️ 8. Moduł „Auta w przygotowaniu” / Wkrótce w ofercie (`/w-przygotowaniu` & `ComingSoonCars`)
*Kontekst biznesowy:* Komisy sprowadzające auta z zagranicy (np. z Niemiec jak Wadera) kupują partiami po kilka pojazdów na raz. Od momentu zakupu do wystawienia na placu mija od kilku dni do 2–3 tygodni (transport lorą, opłaty akcyzowe, badanie techniczne, detailing, pranie tapicerki, serwis olejowy). Zamiast czekać, komis może sprzedać auto jeszcze przed oficjalną premierą na placu!

### ⚡ Quick Wins
- **Nowy status pojazdu w systemie: `W przygotowaniu` (`in_preparation`):**
  - Obok statusów *Dostępne* i *Sprzedane* dodanie statusu *W przygotowaniu / W transporcie*.
  - Widoczny badge na karcie auta: `⏳ W PRZYGOTOWANIU` z estetycznym oznaczeniem (np. kolor bursztynowy / pomarańczowy).
- **Filtr statusu w katalogu:**
  - Dodanie zakładki w filtrach: *Dostępne* | *W przygotowaniu* | *Sprzedane*.
- **Przycisk szybkiego kontaktu z prawem pierwszeństwa:**
  - CTA na karcie takiego auta: **„Zapytaj o to auto przed premierą”** (kierujące do WhatsApp lub telefonu).

### 🚀 Średnioterminowe
- **Dedykowana podstrona `/[dealerSlug]/w-przygotowaniu`:**
  - Oddzielny widok prezentujący wyłącznie nadchodzące samochody.
  - Wyświetlanie przewidywanej daty dostępności (np. *„Dostępne na placu od: 22 października”*) lub orientacyjnych widełek cenowych (*„Cena szacunkowa: 38 000 – 41 000 zł z opłatami”*).
- **Lista prac przygotowawczych (Status Checklist):**
  - Przejrzysty postęp przygotowania auta budujący zaufanie klienta:
    - `[✓] Zakupione i sprowadzone`
    - `[✓] Opłacona akcyza i tłumaczenia`
    - `[✓] Badanie techniczne SKP`
    - `[⏳] Detailing i pranie wnętrza`
    - `[⏳] Sesja zdjęciowa i finalna wycena`
- **Formularz „Obserwuj / Powiadom mnie jako pierwszego” (Lead Magnet):**
  - Klient podaje numer telefonu lub e-mail przy wybranym aucie.
  - Informacja: *„Zapisz się na powiadomienie – poinformujemy Cię SMS-em, zanim auto trafi na Otomoto i OLX!”*.

### 🌟 Game Changery
- **Automatyczne powiadomienia SMS (Zero-day Sale):**
  - W momencie, gdy właściciel komisu w panelu admina przełączy status z *W przygotowaniu* na *Dostępne*, system automatycznie wysyła SMS do wszystkich zapisanych osób:  
    *„Twój obserwowany Volkswagen Golf VII 2016 jest już gotowy na placu w Autohandel Wadera! Kliknij, aby zobaczyć pełną ofertę i umówić się na jazdę próbną: [Link]”*.
  - Samochód może sprzedać się w kilka godzin bez ponoszenia kosztów płatnych ogłoszeń zewnętrznych.
- **Wstępna rezerwacja z prawem pierwokupu:**
  - Możliwość wpłaty symbolicznej kaucji rezerwacyjnej (np. 100–200 zł) z gwarancją pierwszeństwa oględzin w dniu dostawy na plac.

---

## 🤖 9. Moduł VroomAgent: Generator Reklam i Grafik Skupowych (AI Buying Ads & Creative Engine)
*Kontekst biznesowy:* Skupy aut zarabiają na kupnie samochodów poniżej wartości rynkowej od osób prywatnych, którym zależy na czasie i świętym spokoju. Tradycyjne metody (ogłoszenia na słupach, oklejona laweta) są niewystarczające. Płatne kampanie Meta Ads (Facebook & Instagram) oraz posty na lokalnych grupach (np. *„Spotted Włocławek”*, *„Sprzedam auto Kujawsko-Pomorskie”*) mają gigantyczny zwrot z inwestycji (ROI), ale właściciele komisów nie potrafią lub nie mają czasu tworzyć skutecznych kreacji reklamowych.

Rozszerzenie VroomAgenta o dedykowany tryb skupowy rozwiązuje ten problem — tworzy gotowe teksty, nagłówki i **grafiki reklamowe o wysokiej klikalności (High-CTR)**.

### 🎯 5 Gotowych Kątów Psychologicznych (Advertising Angles):
1. **Kąt: „Pilna Gotówka w 15 minut”** (dla osób w nagłej potrzebie finansowej):
   - *Hasło:* „Potrzebujesz gotówki dzisiaj? Płacimy do ręki przy odbiorze auta. Dojazd w 15–30 minut!”.
2. **Kąt: „Koniec męczarni z OLX”** (dla zmęczonych wiszącym ogłoszeniem i maruderami):
   - *Hasło:* „Wystawiłeś auto i masz dość telefonów o 23:00 i marudzenia o ryskę na zderzaku? Dajemy gotówkę od ręki bez negocjacji!”.
3. **Kąt: „Auta problematyczne: bez OC, bez PT, powypadkowe”** (dla aut zawadzających na podwórku):
   - *Hasło:* „Auto stoi i niszczeje? Brak przeglądu, skończone OC, uszkodzony silnik? Zabierzemy je darmową lawetą i zapłacimy gotówką!”.
4. **Kąt: „Sprzedajesz firmie – bez telefonów z pretensjami”** (dla bojących się roszczeń):
   - *Hasło:* „Sprzedaj legalnie firmie, na umowę. Nie musisz się bać, że kupujący zadzwoni za tydzień z pretensjami.” (bez obietnic „100% spokoju” – patrz uwaga prawna w sekcji 3).
5. **Kąt: „Lokalny skup w Twojej okolicy”** (budowanie zaufania lokalnego):
   - *Hasło:* „Skup aut w promieniu 100 km od [Miasto]. Dojeżdżamy, wyceniamy, płacimy na miejscu!”.

### ⚡ Quick Wins
- **Nowy tryb w VroomAgent: `Posty i Reklamy Skupowe`:**
  - Przełącznik w VroomAgent: *Sprzedaż aut (Inventory)* ⇄ *Skup aut od osób prywatnych (Buying)*.
  - Wybór kąta psychologicznego (np. „Pilna gotówka”, „Zmęczeni OLX-em”, „Auta uszkodzone”).
  - Generowanie kompletnego pakietu: chwytliwy nagłówek (Primary Text), treść posta z emoji, CTA oraz lista lokalnych hashtagów.
- **Kopiowanie gotowych postów na lokalne grupy Facebooka:**
  - Formatki zoptymalizowane pod posty w grupach typu Spotted / Ogłoszenia Lokalne (format nieodrzucany przez moderatorów grup).

### 🚀 Średnioterminowe
- **Automatyczny Generator Grafik Reklamowych (Ad Banner Engine):**
  - VroomAgent generuje gotowe grafiki reklamowe w formatach:
    - **1:1 (1080x1080 px)** — posty i karuzela na Facebook / Instagram Feed.
    - **9:16 (1080x1920 px)** — format pionowy pod Stories, Rolki i TikTok.
  - **Gotowe szablony kreacji o sprawdzonej konwersji:**
    - *Szablon Kontrastowy (Emergency/Attention):* Czarno-żółte lub czerwone pasy, czytelny wielki napis: „SKUP AUT ZA GOTÓWKĘ – [MIASTO]”, duży numer telefonu, badge „Dojazd lawetą w 30 min”.
    - *Szablon Social Proof:* Zdjęcie lawety ładującej samochód z podwórka + gotówka w ręku + logo dealera w rogu (autentyczność, nie stock!).
    - *Szablon Porównawczy (Mem/Infografika):* „Sprzedaż samemu na portalu vs Sprzedaż w [Nazwa Komisu]”.
- **Personalizacja pod Brand Dealera:**
  - Narzędzie automatycznie nanosi logo komisu, firmowe kolory (np. czerwień Wadery lub błękit D-Car), numer telefonu i miasto na podstawie profilu z VroomSites.

### 🌟 Game Changery
- **Kreator Kampanii Meta Ads w 1 Klik (Meta Marketing API):**
  - Właściciel komisu nie musi wchodzić w skomplikowanego Menedżera Reklam Facebooka.
  - W VroomAgent klika: *„Uruchom reklamę skupową”* → wybiera budżet (np. 15 zł / dzień) i promień wokół komisu (np. 40 km) → system automatycznie tworzy i włącza kampanię na koncie Meta Ads dealera.
- **Dynamiczny retargeting dla odwiedzających podstronę `/skup-aut`:**
  - Klient wszedł na podstronę skupu, ale nie wysłał formularza? VroomAgent generuje reklamę przypominającą na Facebooku: *„Zastanawiasz się nad sprzedażą auta? Sprawdź naszą bezpłatną wycenę bez zobowiązań!”*.

---

## 🚀 10. Strategiczne Kierunki Rynkowe & Game Changery Ekosystemu (Market Fit & Revenue Drivers)
*Kontekst rynkowy w Polsce:* 
1. **Drogie pakiety Otomoto/OLX:** Pakiety dealerskie kosztują małe komisy od 1500 do nawet 8000 zł miesięcznie i budują markę portalu, a nie komisu. Własna strona i marketing lokalny to dla nich ucieczka od abonamentowego monopolu.
2. **Brak czasu i kompetencji cyfrowych u właścicieli:** Handlarz to człowiek orkiestra — myje auta, jeździ z lawetą, załatwia akcyzę, odbiera telefony. Narzędzia muszą działać w 1 klik z telefonu.
3. **Kryzys zaufania do „handlarzy”:** Polscy kupujący boją się „miny”. Transparentność, certyfikaty i dowody pozwalają komisom sprzedawać auta drożej i bez marudzenia klientów.

Oto 6 przełomowych funkcji, które rozwiązują te realne problemy:

### 📸 A. AI Foto-Studio: Automatyczne profesjonalne tło dla aut
* **Problem:** Zdjęcia robione smartfonem na placu mają w tle błoto, kałuże, siatkę ogrodzeniową, inne rozbite pojazdy lub szopę sąsiada. Auto traci na wartości w oczach klienta.
* **Rozwiązanie:** Wbudowany w panelu / VroomAgent model segmentacji obrazu.
  - Wrzucasz surowe zdjęcie z telefonu.
  - AI automatycznie wycina tło i wstawia samochód na estetyczny, wirtualny plac z brandingiem komisu (elegancka kostka, nowoczesny minimalistyczny showroom, soft-box oświetleniowy, naturalny cień pod kołami).
  - Zdjęcia wyglądają jak z profesjonalnego studia fotograficznego za ułamek kosztów.

### 🛡️ B. Cyfrowa „Karta Transparentności” (Pomiary lakieru + Raport CEPIK)
* **Problem:** Kupujący przyjeżdżają z niepewnością i podejrzliwością, marnując godziny na obmacywanie auta czujnikami lakieru.
* **Rozwiązanie:** W karcie każdego auta interaktywny schemat nadwozia:
  - Wprowadzone w panelu grubości powłoki lakierniczej na elementach (np. Maska: 120 µm, Drzwi LP: 110 µm, Błotnik TP: 190 µm - *drugi lakier bez szpachli*).
  - Zrzut z rządowego raportu *historiapojazdu.gov.pl* potwierdzający przebieg i brak szkody całkowitej.
  - Zdjęcia newralgicznych miejsc (podwozie, progi, komora silnika na zimno).
  - Taki pojazd budzi natychmiastowe zaufanie i sprzedaje się bez prób zbijania ceny o 20%.

### 🔄 C. Moduł Wymiany: „Zostaw swoje auto w rozliczeniu” (Trade-In Evaluator)
* **Problem:** Klient chce kupić auto za 35 000 zł, ale najpierw musi sprzedać swoją starą Corsę za 5 000 zł. Blokuje go brak gotówki i strach przed sprzedażą.
* **Rozwiązanie:** Na karcie każdego auta dedykowany widget:
  - *„Masz auto na zamianę? Oblicz dopłatę w 30 sekund”*.
  - Klient podaje swoje obecne auto → system kalkuluje: *„Szacowana dopłata: tylko 30 000 zł lub 520 zł/miesięcznie”*.
  - **Podwójny zysk dla komisu:** sprzedaje droższe auto ze stoku z marżą i jednocześnie tanio pozyskuje kolejne auto od osoby prywatnej na swój plac!

### 💰 D. Moduł Finansowania / Kredytów z prowizją dla Dealera (Affiliate Finanse)
* **Mechanizm zarobku:** Komisy samochodowe zarabiają drugą pensję na prowizjach bankowych z kredytów i pożyczek na auta (Cofidis, Santander Consumer, BNP Paribas) lub gwarancji technicznych (GetHelp, Defend).
* **Rozwiązanie na stronie:**
  - Przycisk na karcie auta: *„Kup na raty bez BIK – sprawdź ratę”*.
  - Klient wysyła 3 podstawowe dane (dochód, forma zatrudnienia) → lead wpada do współpracującego brokera finansowego.
  - Dealer inkasuje **od 500 do 2 500 zł czystej prowizji** od każdego sfinansowanego pojazdu.

### 🤖 E. AI Asystent WhatsApp / Voice Bot (Recepcja komisu 24/7)
* **Problem:** Klienci przeglądają oferty i piszą o 21:00–23:00 lub w niedzielę. Właściciel komisu nie odbiera. Do rana klient znajduje inne auto na Otomoto.
* **Rozwiązanie:** Agent AI podpięty pod WhatsApp komisu:
  - Zna stan magazynowy z bazy VroomSites.
  - Odpowiada w 10 sekund: *„Tak, Opel Astra 2007 jest nadal dostępny na placu w Topólce. Czy chciałby Pan zarezerwować dogodną godzinę na jazdę próbną jutro o 11:00 czy 15:00?”*.
  - Zapisuje termin w kalendarzu i przekazuje właścicielowi podsumowanie rozmowy.

### 🌐 F. Centralny Marketplace: Ekosystem VroomSites / VroomDealer
* **Problem:** Pojedynczy komis ma ograniczony zasięg lokalny.
* **Rozwiązanie:** 
  - Główna domena platformy (np. `vroomsites.pl` lub `vroomdealer.pl`) agreguje oferty wszystkich podłączonych komisów w ogólnopolski katalog aut używanych z gwarancją.
  - Każde auto linkuje bezpośrednio do dedykowanej strony danego dealera.
  - Tworzy to darmowy, synergiczny ruch dla wszystkich dealerów w sieci, bez płacenia haraczy wielkim portalom ogłoszeniowym.

---

## 🧲 11. Niezależny landing skupowy + przekazywanie leadów do skupów (Lead Routing)
*Kontekst:* klient nastawiony na tani skup (auta do 10 000 zł) mówi „nie ma co kupić”, „giełda stoi” (w slangu: rynek komisów stoi), „ceny kosmos”. Reklama nie stworzy aut, ale może przejąć te, które dziś trafiają do konkurencji, na złom albo stoją pod blokiem.

### Dlaczego własny landing, a nie strona dealera
- Lead zebrany na stronie D-Car jest „lead D-Car” – jeśli Dawidowi nie pasuje (za drogie, za daleko, zły model), lead przepada.
- Na neutralnej stronie, **przy wyraźnej zgodzie użytkownika**, odrzucony lead można przekazać do innego skupu. Żaden lead się nie marnuje.
- Jedna marka = jedna kampania, jedna strona, wiele skupów. Wyniki kampanii są nasze, nie konkretnego dealera.
- Dawid zostaje **pierwszym partnerem z wyłącznością na swój teren** – dostaje leady jako pierwszy.

### Mechanika routingu
1. Użytkownik wypełnia formularz (marka, rocznik, stan, lokalizacja, oczekiwana cena, zdjęcia, telefon).
2. System dobiera skup po **powiecie / promieniu**, przedziale wartości auta i rodzaju aut (sprawne / uszkodzone).
3. Skup ma **15 minut** na przyjęcie leada w panelu (lub SMS-em). Brak reakcji albo odrzucenie → lead idzie do kolejnego skupu.
4. **Nigdy jeden lead do 5 skupów naraz** – sprzedający dostałby 5 telefonów i spaliłby markę.
5. Skup oznacza wynik: *dodzwoniono / wyceniono / kupiono / odrzucono (powód)*. To daje dane do rozliczeń i oceny jakości leadów.

### Model zarobku (kwoty do zweryfikowania w rozmowach ze skupami)
| Model | Plusy | Minusy |
| :--- | :--- | :--- |
| Opłata za lead (np. 20–50 zł) | Proste, płatne od razu | Spory o jakość leadów |
| Prowizja od kupionego auta (np. 200–400 zł) | Płacą tylko za efekt | Trudno sprawdzić, czy auto kupiono |
| Abonament za wyłączność terenu | Przewidywalny przychód | Trudniej sprzedać na starcie |

Rekomendacja: niski abonament lub opłata za lead + premia za kupione auto.

### Wymogi prawne (RODO) – do przejrzenia przez prawnika
- Osobny, nieobowiązkowy checkbox zgody na przekazanie danych do współpracującego skupu w okolicy (z opisem kategorii odbiorców).
- Brak zgody → lead trafia wyłącznie do pierwszego skupu, bez dalszego przekazywania.
- Umowy powierzenia / udostępnienia danych ze skupami partnerskimi, polityka prywatności z listą lub kategoriami partnerów.

### Psychologia i badania do wykorzystania na landingu i w reklamach
- **Efekt posiadania** (Kahneman, Knetsch, Thaler, 1990): właściciel wycenia swoją rzecz ok. 2× wyżej niż kupujący – stąd „ceny kosmos”. Nie dyskutujemy z wartością auta, zmieniamy punkt odniesienia.
- **Kotwiczenie:** zamiast „ile jest warte Twoje auto?” → „ile kosztuje Cię to, że ono stoi?” (OC, utrata wartości, przegląd, akumulator).
- **Awersja do straty:** „tracisz X zł miesięcznie” działa mocniej niż „zyskasz X zł”.
- **Efekt pewności:** „pewna cena dziś” vs „może więcej kiedyś na OLX”.
- **Szybkość odpowiedzi** (HBR, *The Short Life of Online Sales Leads*, 2011): kontakt w ciągu godziny daje ok. 7× większą szansę na rozmowę z decyzyjną osobą. Stąd limit 15 minut w routingu.
- **Mały pierwszy krok:** pierwszy krok formularza to tylko marka i rocznik, telefon na końcu.
- **Twarz zamiast logo:** „Zadzwoni do Ciebie Dawid” + zdjęcie (przy routingu: imię i zdjęcie przypisanego skupującego).
- **Lokalny dowód społeczny:** „W tym miesiącu kupiliśmy 11 aut z powiatu włocławskiego” + zdjęcia z lawety.
- **Uczciwy przedział ceny:** żadnego „wysoka cena online, zbijanie na miejscu” – lokalnie jedna zła opinia kosztuje więcej niż marża z kilku aut.

### Wyzwalacze czasowe dla kampanii
- **Październik–listopad:** przed zimą (akumulatory, diesle nie odpalają) – najlepszy okres na tani skup.
- **Kończące się OC:** pytanie w formularzu „kiedy kończy się OC?” → pretekst do przypomnienia.
- **Niezaliczony przegląd:** kąt reklamowy „Nie przeszło przeglądu?”.

### Dodatkowe źródła aut poza reklamą (offline)
- Mechanicy i wulkanizatorzy (premia za polecenie auta, którego nie opłaca się naprawiać).
- Stacje kontroli pojazdów (auta, które nie przeszły przeglądu).
- Stacje demontażu (auta oddawane na złom, które jeszcze jeżdżą).
- Małe firmy wymieniające flotę (stare auta dostawcze).
- Licytacje komornicze i przetargi urzędowe.

### Plan testu (MVP przed budową pełnej platformy)
1. **Prosty neutralny landing** na istniejącym silniku VroomSites (formularz + checkbox zgody RODO + WhatsApp).
2. **2–4 tygodnie Meta Ads**, budżet ok. 300–500 zł, promień 40–60 km wokół Dawida, 2–3 kąty reklamowe.
3. Routing **ręczny** na start: leady do Dawida, odrzucone ręcznie do 1–2 innych skupów.
4. Mierzymy: koszt leada, % leadów do realnego kupienia, **koszt pozyskania jednego auta**, powody odrzuceń.
5. Jeśli koszt kupionego auta jest wyraźnie niższy od marży (np. 150–300 zł przy marży 1,5–3 tys. zł) → automatyzujemy routing i z wynikami idziemy do kolejnych skupów.

### Co już mamy w kodzie, a czego brakuje
- ✅ Multi-tenant, API leadów (`/api/leads`), powiadomienia Resend, honeypot, dane regionu/powiatu tenanta, panel leadów ze statusami.
- ❌ Tabela przypisań „powiat → skup” i kolejka skupów.
- ❌ Przekazanie leada dalej po czasie lub odrzuceniu (z zachowaniem zgody).
- ❌ Statusy „kupiono / odrzucono + powód” i rozliczenia ze skupami.
- ❌ Osobny checkbox zgody na przekazanie danych w formularzu.

---

## 🗺️ Sugerowany plan wdrożenia (Najbliższe kroki)

| Priorytet | Moduł | Zadanie | Wpływ na biznes |
| :--- | :--- | :--- | :--- |
| **0** | **Lead Routing** | **Test: neutralny landing skupowy + Meta Ads 300–500 zł + ręczny routing (Dawid → inne skupy)** | 🧪 **Dowód, ile kosztuje pozyskanie auta** |
| **1** | Karta Auta | Klikalne CTA do WhatsApp z predefiniowaną treścią ogłoszenia | 🔥 Natychmiastowy wzrost liczby zapytań |
| **2** | Katalog | Filtrowanie wielokryterialne (cena od-do, skrzynia biegów) | 🎯 Dużo lepsze UX dla szukających aut |
| **3** | **W przygotowaniu** | **Status `W przygotowaniu` + zapis „Powiadom mnie o premierze”** | 🚀 **Sprzedaż aut przed wystawieniem na Otomoto/OLX** |
| **4** | **VroomAgent** | **Generator postów i grafik skupowych (5 kątów reklamowych)** | 🧲 **Stały napływ tanich aut od prywatnych właścicieli** |
| **5** | **Karta Auta** | **Widget „Auto w rozliczeniu” (Trade-In Evaluator)** | 🔄 **Podwójna marża (sprzedaż + tani skup)** |
| **6** | Skup Aut | Dodawanie zdjęć do formularza wyceny (do 5 zdjęć z kompresją) | 📈 Wyższa jakość leadów i łatwiejsza wycena |
| **7** | **Zaufanie** | **Cyfrowa Karta Transparentności (Pomiary lakieru + CEPIK)** | ⭐ **Szybsza sprzedaż bez zbijania ceny** |
| **8** | Panel Admina | Szybka zmiana statusu (*Dostępne/W przygotowaniu/Sprzedane*) w tabeli | ⏱️ Oszczędność czasu właściciela |
| **9** | Analityka | Meta CAPI (Server-Side) + Eventy `Contact` / `Lead` | 💰 30-40% dokładniejsze dane w kampaniach reklamowych |



