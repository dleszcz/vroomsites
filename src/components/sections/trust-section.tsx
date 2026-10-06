"use client";

import React, { useState, useEffect } from "react";
import { DealerTenant, SectionConfig, hasCarBuying } from "@/types/landing";

interface Props { tenant: DealerTenant; config?: SectionConfig; }

const defaultTestimonials = [
  {
    quote: "Szybka wycena, uczciwa oferta i wszystko gotowe od ręki. Polecam każdemu, kto chce sprzedać auto bez zbędnych formalności.",
    author: "Pan Marek (Poznań / Topólka)",
  },
  {
    quote: "Przyjechali pod dom w Radziejowie, wycenili auto na miejscu i od razu wypłacili gotówkę. Bardzo profesjonalne podejście!",
    author: "Tomasz W. (Radziejów)",
  },
  {
    quote: "Transakcja w 20 minut, umowa gotowa od ręki, auto zabrane lawetą. Zero stwarzania problemów z rocznikiem i przebiegiem.",
    author: "Krzysztof K. (Włocławek)",
  },
  {
    quote: "Sprzedałem kilkuletnie auto w rozliczeniu. Wszystko uczciwie i zgodnie z ustaleniami telefonicznymi. Szczerze polecam D-CAR!",
    author: "Piotr R. (Lubraniec)",
  },
];

const salesTestimonials = [
  { quote: "Kupiłem auto dokładnie takie, jak w ogłoszeniu. Pełna historia serwisowa i uczciwa cena.", author: "Pani Anna" },
  { quote: "Jazda próbna od ręki, wszystkie formalności załatwione na miejscu. Polecam!", author: "Michał S." },
  { quote: "Pomogli mi z finansowaniem, a auto odebrałem w 3 dni. Super obsługa.", author: "Karolina P." },
];

export function TrustSection({ tenant, config }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = hasCarBuying(tenant) ? defaultTestimonials : salesTestimonials;

  const data = (config?.data || {}) as {
    heading?: string;
    stats?: { value: string; label: string }[];
  };

  const stats = data.stats || [
    { value: "100%", label: "uczciwych transakcji" },
    { value: "0 zł", label: "ukrytych opłat" },
    { value: "7 dni", label: "w tygodniu do dyspozycji" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const currentReview = testimonials[activeIndex % testimonials.length];

  return (
    <section className="vd-section vd-section--bordered" id="trust">
      <div className="vd-container trust__layout">
        <div>
          <span className="vd-eyebrow">Dlaczego warto nam zaufać?</span>
          <h2 className="vd-heading">{data.heading || "Doświadczenie. Uczciwość. Zadowoleni klienci."}</h2>
          <div className="trust__stats">
            {stats.slice(0, 3).map((stat, i) => (
              <div key={`${stat.value}-${i}`}>
                <span className="trust__stat-value">{stat.value}</span>
                <span className="trust__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonial">
          <span className="testimonial__quote">“</span>
          <p className="testimonial__text" style={{ minHeight: "96px", transition: "opacity 0.3s ease" }}>
            {currentReview.quote}
          </p>
          <div className="testimonial__author">{currentReview.author}</div>
          <div className="testimonial__dots" style={{ cursor: "pointer" }}>
            {testimonials.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setActiveIndex(idx)}
                style={{
                  cursor: "pointer",
                  width: activeIndex === idx ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: activeIndex === idx ? "var(--color-primary, #1686E0)" : "#CBD5E1",
                  display: "inline-block",
                  transition: "all 0.3s ease",
                  margin: "0 4px",
                }}
                aria-label={`Przejdź do opinii ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

