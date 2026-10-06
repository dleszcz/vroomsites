import React from "react";
import { DealerTenant } from "@/types/landing";

interface LegalPageProps {
  tenant: DealerTenant;
  type: "privacy" | "terms";
}

export function LegalPage({ tenant, type }: LegalPageProps) {
  const name = tenant.businessName;
  const address = tenant.location?.address || "";
  const city = tenant.location?.city || "";
  const phone = tenant.contact.phone || "";
  const email = tenant.contact.email || "";
  const fullAddress = [address, city].filter(Boolean).join(", ");

  if (type === "privacy") {
    return (
      <article className="vd-legal-page">
        <div className="vd-container" style={{ maxWidth: "800px", padding: "3rem 1.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
            Polityka prywatności
          </h1>
          <p style={{ color: "var(--color-text-soft)", marginBottom: "2rem" }}>
            Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              1. Administrator danych osobowych
            </h2>
            <p>
              Administratorem Twoich danych osobowych jest <strong>{name}</strong>
              {fullAddress && <>, z siedzibą pod adresem: {fullAddress}</>}.
              {phone && <> Kontakt telefoniczny: <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>.</>}
              {email && <> E-mail: <a href={`mailto:${email}`}>{email}</a>.</>}
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              2. Jakie dane zbieramy
            </h2>
            <p>W ramach korzystania z naszej strony internetowej możemy zbierać następujące dane:</p>
            <ul style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
              <li>Imię i nazwisko (podane w formularzu kontaktowym)</li>
              <li>Numer telefonu (wymagany do kontaktu w sprawie wyceny)</li>
              <li>Adres e-mail (opcjonalnie, podany w formularzu)</li>
              <li>Informacje o pojeździe (marka, model, rok produkcji, stan techniczny, zdjęcia)</li>
              <li>Miejscowość</li>
              <li>Dane techniczne urządzenia i przeglądarki (cookies, adres IP)</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              3. Cel przetwarzania danych
            </h2>
            <p>Twoje dane osobowe przetwarzamy w następujących celach:</p>
            <ul style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
              <li>Kontakt w sprawie wyceny i skupu samochodu (art. 6 ust. 1 lit. b RODO)</li>
              <li>Realizacja usług skupu, sprzedaży i pomocy drogowej (art. 6 ust. 1 lit. b RODO)</li>
              <li>Marketing bezpośredni (art. 6 ust. 1 lit. a RODO — na podstawie zgody)</li>
              <li>Analiza statystyczna ruchu na stronie (art. 6 ust. 1 lit. f RODO — uzasadniony interes)</li>
              <li>Obsługa zapytań i reklamacji (art. 6 ust. 1 lit. f RODO)</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              4. Pliki cookies i narzędzia analityczne
            </h2>
            <p>
              Nasza strona korzysta z plików cookies oraz następujących narzędzi zewnętrznych:
            </p>
            <ul style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
              <li><strong>Meta Pixel (Facebook)</strong> — do celów remarketingowych i analizy kampanii reklamowych. Uruchamiany wyłącznie po wyrażeniu zgody.</li>
              <li><strong>Vercel Analytics</strong> — do analizy wydajności strony.</li>
            </ul>
            <p>
              Możesz zarządzać zgodą na pliki cookies za pośrednictwem banera wyświetlanego przy
              pierwszej wizycie lub w ustawieniach przeglądarki.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              5. Okres przechowywania danych
            </h2>
            <p>
              Dane osobowe przechowywane są przez okres niezbędny do realizacji celu, w jakim
              zostały zebrane, nie dłużej niż:
            </p>
            <ul style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
              <li>Dane z formularza wyceny — do 12 miesięcy od daty złożenia</li>
              <li>Dane transakcyjne — zgodnie z obowiązującymi przepisami podatkowymi (5 lat)</li>
              <li>Dane cookies — do czasu wycofania zgody lub wygaśnięcia pliku cookie</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              6. Twoje prawa
            </h2>
            <p>Na podstawie RODO przysługują Ci następujące prawa:</p>
            <ul style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
              <li>Prawo dostępu do swoich danych</li>
              <li>Prawo do sprostowania danych</li>
              <li>Prawo do usunięcia danych („prawo do bycia zapomnianym&quot;)</li>
              <li>Prawo do ograniczenia przetwarzania</li>
              <li>Prawo do przenoszenia danych</li>
              <li>Prawo do wniesienia sprzeciwu wobec przetwarzania</li>
              <li>Prawo do cofnięcia zgody w dowolnym momencie</li>
              <li>Prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO)</li>
            </ul>
            <p>
              W celu realizacji powyższych praw skontaktuj się z nami telefonicznie
              {phone && <> pod numerem <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a></>}
              {email && <> lub mailowo na adres <a href={`mailto:${email}`}>{email}</a></>}.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              7. Udostępnianie danych
            </h2>
            <p>
              Twoje dane osobowe mogą być udostępniane podmiotom trzecim wyłącznie w zakresie
              niezbędnym do świadczenia usług, w szczególności:
            </p>
            <ul style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
              <li>Dostawcom usług IT i hostingowych (Vercel, Supabase)</li>
              <li>Dostawcom usług e-mail (Resend)</li>
              <li>Platformom reklamowym (Meta/Facebook) — wyłącznie po wyrażeniu zgody</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              8. Kontakt
            </h2>
            <p>
              W sprawach związanych z ochroną danych osobowych skontaktuj się z Administratorem:
            </p>
            <p>
              <strong>{name}</strong>
              {fullAddress && <><br />{fullAddress}</>}
              {phone && <><br />Tel.: <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a></>}
              {email && <><br />E-mail: <a href={`mailto:${email}`}>{email}</a></>}
            </p>
          </section>
        </div>
      </article>
    );
  }

  // type === "terms"
  return (
    <article className="vd-legal-page">
      <div className="vd-container" style={{ maxWidth: "800px", padding: "3rem 1.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
          Regulamin serwisu
        </h1>
        <p style={{ color: "var(--color-text-soft)", marginBottom: "2rem" }}>
          Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            § 1. Postanowienia ogólne
          </h2>
          <ol style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
            <li>Niniejszy regulamin określa zasady korzystania z serwisu internetowego prowadzonego przez <strong>{name}</strong>{fullAddress && <>, z siedzibą: {fullAddress}</>}.</li>
            <li>Serwis umożliwia użytkownikom zapoznanie się z ofertą skupu i sprzedaży samochodów oraz złożenie zgłoszenia wyceny pojazdu.</li>
            <li>Korzystanie z serwisu jest dobrowolne i bezpłatne.</li>
          </ol>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            § 2. Usługi
          </h2>
          <ol style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
            <li>Za pośrednictwem serwisu użytkownik może:
              <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0" }}>
                <li>Złożyć formularz wyceny samochodu</li>
                <li>Zapoznać się z ofertą samochodów na sprzedaż</li>
                <li>Skontaktować się z {name} telefonicznie lub za pośrednictwem WhatsApp</li>
              </ul>
            </li>
            <li>Złożenie formularza wyceny nie stanowi oferty w rozumieniu Kodeksu cywilnego i nie zobowiązuje żadnej ze stron do zawarcia umowy.</li>
            <li>Wycena pojazdu jest bezpłatna i niezobowiązująca.</li>
          </ol>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            § 3. Formularz wyceny
          </h2>
          <ol style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
            <li>Formularz wyceny wymaga podania numeru telefonu kontaktowego jako pola obowiązkowego.</li>
            <li>Użytkownik zobowiązany jest do podawania prawdziwych i aktualnych danych.</li>
            <li>Przesłanie formularza jest równoznaczne z wyrażeniem zgody na kontakt telefoniczny w celu przedstawienia wyceny pojazdu.</li>
            <li>Dane przesłane w formularzu są przetwarzane zgodnie z Polityką prywatności.</li>
          </ol>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            § 4. Odpowiedzialność
          </h2>
          <ol style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
            <li>{name} dokłada wszelkich starań, aby informacje zamieszczone w serwisie były aktualne i prawidłowe.</li>
            <li>Zdjęcia i opisy samochodów mają charakter informacyjny. Szczegóły oferty mogą ulec zmianie.</li>
            <li>{name} nie ponosi odpowiedzialności za przerwy w działaniu serwisu wynikające z przyczyn technicznych.</li>
          </ol>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            § 5. Własność intelektualna
          </h2>
          <ol style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
            <li>Treści zamieszczone w serwisie (teksty, grafiki, logotypy) są chronione prawem autorskim.</li>
            <li>Kopiowanie, rozpowszechnianie lub modyfikacja treści bez pisemnej zgody jest zabronione.</li>
          </ol>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            § 6. Ochrona danych osobowych
          </h2>
          <ol style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
            <li>Szczegółowe informacje dotyczące przetwarzania danych osobowych znajdują się w <a href={`/${tenant.slug}/polityka-prywatnosci`}>Polityce prywatności</a>.</li>
          </ol>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            § 7. Postanowienia końcowe
          </h2>
          <ol style={{ paddingLeft: "1.5rem", margin: "0.75rem 0" }}>
            <li>Regulamin obowiązuje od dnia opublikowania w serwisie.</li>
            <li>{name} zastrzega sobie prawo do zmiany regulaminu. Zmiany wchodzą w życie z chwilą opublikowania.</li>
            <li>W sprawach nieuregulowanych regulaminem zastosowanie mają przepisy prawa polskiego.</li>
          </ol>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            § 8. Kontakt
          </h2>
          <p>
            <strong>{name}</strong>
            {fullAddress && <><br />{fullAddress}</>}
            {phone && <><br />Tel.: <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a></>}
            {email && <><br />E-mail: <a href={`mailto:${email}`}>{email}</a></>}
          </p>
        </section>
      </div>
    </article>
  );
}
