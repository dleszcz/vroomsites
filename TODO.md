# 📌 VroomDealer — TODO & Roadmap

Lista zadań rozwojowych i usprawnień dla platformy VroomDealer.pl.

---

## 🚨 WYSOKI PRIORYTET (High Priority)

### 1. Zarządzanie Ofertą Samochodów w Panelu Admina (CRUD Cars)
- [ ] **Moduł `/admin/vehicles` (lub `/admin/cars`):**
  - [ ] Lista aut przypisanych do tenanta (pobierana dynamicznie z tabeli `cars` w Supabase).
  - [ ] Formularz dodawania nowego samochodu:
    - Marka, model, rocznik, cena (PLN), przebieg (km), rodzaj paliwa, skrzynia biegów, pojemność/moc, kolor, opis.
    - Oznaczenie jako *Wyróżniony (is_featured)*.
  - [ ] Edycja parametrów i cen istniejących pojazdów.
  - [ ] Oznaczanie jako **Sprzedany (`is_sold = true`)** lub całkowite usuwanie pojazdu.
  - [ ] Upload i zarządzanie zdjęciami auta (integracja z Supabase Storage / CDN).
- [ ] **Automatyczna synchronizacja:** Wyświetlanie na landing page'u wyłącznie aut z bazy danych danego komisu.

### 2. Natychmiastowe Powiadomienia na Telefon Handlarza (Instant Mobile Alerts)
- [ ] **Powiadomienia SMS (np. SMSAPI / JustSend):**
  - Automatyczny SMS w 3 sekundy po wysłaniu formularza na telefon właściciela komisu.
  - Treść z kluczowymi danymi: Marka/Model, Rocznik, Oczekiwana cena, Imię i klikalny numer telefonu klienta.
  - Opcja włączenia/wyłączenia SMS per komis w `/admin/settings`.
- [ ] **PWA & Web Push (Powiadomienia w aplikacji panelu admina):**
  - Przekształcenie panelu admina w instalowalną aplikację PWA (*„Dodaj do ekranu głównego”*).
  - Natywne powiadomienia Push na telefonie (z dźwiękiem i wibracją) po nadejściu nowego zgłoszenia.

---

## ⚡ ŚREDNI PRIORYTET (Medium Priority)

- [ ] **Automatyczne powiadomienia SMS (opcjonalnie):** Integracja z SMSAPI / Twilio dla natychmiastowych SMS-ów do właściciela komisu o nowym leadzie.
- [ ] **Eksport leadów do CSV / Excel:** Przycisk pobierania bazy leadów bezpośrednio z panelu `/admin/leads`.
- [ ] **Własne subdomeny `.vroomdealer.pl`:** Automatyczny routing dla komisów bez własnej domeny (np. `d-car.vroomdealer.pl`).

---

## 💡 NISKI PRIORYTET / POMYSŁY (Backlog)

- [ ] Integracja z kalkulatorem rat kredytowych / leasingowych dla sprzedawanych aut.
- [ ] AI Generator opisów samochodów na podstawie parametrów i zdjęć.
