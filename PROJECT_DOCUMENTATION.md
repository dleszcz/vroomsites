# 📘 VroomDealer — Dokumentacja Projektu & Przewodnik Operacyjny

Kompletna dokumentacja architektury, zewnętrznych integracji, środowisk oraz procedury wdrażania nowych komisów (tenantów).

---

## 🏗️ 1. Architektura i Stack Technologiczny

- **Frontend & Backend:** Next.js 16 (App Router, Turbopack, Server Actions, Server Components)
- **Baza danych & Auth:** Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Hosting & Edge:** Vercel
- **DNS & Bezpieczeństwo:** Cloudflare (DNS Only dla rekordów domenowych, Email Routing)
- **Poczta transakcyjna:** Resend API (zweryfikowana domena `vroomdealer.pl` z podpisami SPF/DKIM)
- **Integracja Live Leady:** Google Sheets + Google Apps Script Webhook
- **Analityka & Tracking:** Meta Pixel (`fbq`), Google Analytics 4 (`gtag`), Vercel Analytics

---

## 🌿 2. Środowiska i Git Workflow

| Gałąź Git | Środowisko Vercel | Baza Supabase | Zastosowanie |
| :--- | :--- | :--- | :--- |
| **`develop`** | Preview / Staging | `vroomdealer-dev` | Bieżące zmiany, testy nowych funkcji |
| **`main`** | **Production** | **`vroomdealer` (PROD)** | Wdrożenie publiczne (`vroomdealer.pl`, `d-car.com.pl`) |

### Standardowa procedura wdrażania zmian:
```bash
# 1. Praca na develop
git checkout develop
# ...kodowanie, commity...
git push origin develop

# 2. Wypchnięcie na produkcję
git checkout main
git pull origin main
git merge develop
git push origin main
git checkout develop
```

---

## 🔑 3. Zmienne Środowiskowe (Environment Variables)

Ustawiane w **Vercel Dashboard → Project Settings → Environment Variables**:

| Zmienna | Środowisko | Wartość / Opis |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | All | URL projektu Supabase (`https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Klucz publiczny `anon` z Supabase |
| `NEXT_PUBLIC_BASE_URL` | Production | `https://vroomdealer.pl` |
| `RESEND_API_KEY` | All | Klucz API z Resend (`re_...`) |
| `RESEND_FROM_EMAIL` | All | `VroomDealer <biuro@vroomdealer.pl>` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Opcjonalnie | Identyfikator GA4 (`G-XXXXXXXXXX`) |
| `CC_NOTIFICATION_EMAIL` | Opcjonalnie | Adres ukrytej kopii leadów (domyślnie wyłączony) |

---

## 🌐 4. Usługi Zewnętrzne

### A. Cloudflare (Zarządzanie DNS)
Każda podpięta domena (`vroomdealer.pl`, `d-car.com.pl`) ma ustawione w Cloudflare:
- **`A` record (`@`):** `76.76.21.21` | ⚪ **DNS only** *(Proxy wyłączone)*
- **`CNAME` record (`www`):** `cname.vercel-dns.com` | ⚪ **DNS only**
- **Email Routing (Aliasy):**
  - `biuro@vroomdealer.pl` → `danielxleszczynski@gmail.com`
  - `biuro@d-car.com.pl` → e-mail Dawida (`...wp.pl`)

### B. Resend (Wysyłka e-mail)
- **Zweryfikowana domena:** `vroomdealer.pl` (z rekordami `resend._domainkey` i `send.vroomdealer.pl` w Cloudflare).
- **Adres nadawcy:** `biuro@vroomdealer.pl`
- Wszystkie powiadomienia wychodzą z tej uwierzytelnionej domeny, trafiając bezpośrednio na adres tenanta (`notification_email`).

### C. Vercel (Hosting Aplikacji)
W sekcji **Settings → Domains** dodane są domeny customowe:
- `vroomdealer.pl` + `www.vroomdealer.pl` (redirect)
- `d-car.com.pl` + `www.d-car.com.pl` (redirect)

---

## 📊 5. Skrypt Google Sheets Webhook

Aby przekazywać leady w locie do arkusza Google:

1. W nowym arkuszu Google: **Rozszerzenia → Apps Script**.
2. Wklej poniższy skrypt:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var formattedDate = Utilities.formatDate(
      new Date(),
      "Europe/Warsaw",
      "yyyy-MM-dd HH:mm:ss"
    );

    sheet.appendRow([
      formattedDate,
      data.dealerSlug || data.dealerId || "",
      data.customerName || "Klient",
      data.customerPhone || "",
      data.city || "",
      data.brand || "",
      data.model || "",
      data.year || "",
      data.mileage ? data.mileage + " km" : "",
      data.condition || "",
      data.expectedPrice ? data.expectedPrice + " PLN" : "",
      data.photosCount ? data.photosCount + " zdjęć" : "Brak"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Wdróż → Nowe wdrożenie → Aplikacja internetowa**:
   - Wykonaj jako: **Ja**
   - Kto ma dostęp: **Każdy (Anyone)**
4. Skopiuj wygenerowany URL (`https://script.google.com/macros/s/.../exec`) i wklej w bazie Supabase w kolumnie `profiles.google_sheets_webhook_url`.

---

## 🎛️ 6. Panel Administratora

Dostęp: `https://vroomdealer.pl/admin` lub `https://d-car.com.pl/admin`

- **/admin/leads** — Przegląd leadów, zmiana statusów (*Nowy*, *Skontaktowany*, *W wycenie*, *Odkupiony*, *Odrzucony*), notatki, podgląd danych auta i zdjęć.
- **/admin/settings** — Edycja danych komisu (kolory, logo, nagłówki hero, telefon, WhatsApp, godziny otwarcia, SEO, Meta Pixel ID, Webhook Google Sheets).
- **/admin/platform** — Zarządzanie wszystkimi komisami (widok Superadmina).

---

## 🚀 7. Checklist: Jak dodać NOWY KOMIS (Nowego Klienta)

Gdy pozyskasz nowego klienta (np. *Auto-Komis Janusz*):

### Krok 1: Stworzenie profilu komisu
1. Zaloguj się na konto Superadmina w `/admin/platform`.
2. Kliknij **+ Dodaj nowy komis**:
   - **Nazwa:** np. `Auto Komis Janusz`
   - **Slug:** np. `komis-janusz`
   - **Miasto:** np. `Gdańsk`
   - **Telefon / E-mail powiadomień:** np. `biuro@komisjanusz.pl`
   - **Custom Domain:** np. `komisjanusz.pl` (jeśli klient ma własną domenę).

### Krok 2: Domena i DNS (jeśli ma własną domenę)
1. Dodaj domenę klienta do **Cloudflare** (Connect domain).
2. Ustaw w Cloudflare DNS:
   - `A` record `@` → `76.76.21.21` (⚪ DNS only)
   - `CNAME` `www` → `cname.vercel-dns.com` (⚪ DNS only)
3. W **Vercel** → Settings → Domains:
   - Dodaj `komisjanusz.pl` oraz `www.komisjanusz.pl`.

### Krok 3: Poczta i Aliasy
1. W Cloudflare dla domeny klienta → **Email Routing**:
   - Dodaj regułę: `biuro@komisjanusz.pl` → prywatny e-mail klienta (np. `janusz...@gmail.com`).
   - Klient klika link potwierdzający w mailu.

### Krok 4: Arkusz Google Sheets dla klienta
1. Utwórz nowy arkusz Google, wklej kod z punktu 5 niniejszej dokumentacji i wdróż jako Web App.
2. Wklej URL Webhooka w `/admin/settings?tenant=komis-janusz` w polu *Google Sheets Webhook URL*.
3. Udostępnij arkusz Google klientowi (ma live podgląd zgłoszeń na telefonie).

### Krok 5: Meta Ads & Start
1. Wklej Pixel ID klienta w `/admin/settings?tenant=komis-janusz`.
2. Odpal kampanię Meta Ads kierującą na `https://komisjanusz.pl/?utm_source=facebook&utm_medium=cpc`.

---
*Dokumentacja wygenerowana dla platformy VroomDealer.pl.*
