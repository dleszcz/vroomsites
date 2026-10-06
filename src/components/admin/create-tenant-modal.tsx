"use client";

import { useState, useTransition } from "react";
import { createTenantAction } from "@/app/admin/actions";

export function CreateTenantModal({ host }: { host: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [slug, setSlug] = useState("");

  function handleNameChange(val: string) {
    setBusinessName(val);
    if (!slug || slug === autoSlug(businessName)) {
      setSlug(autoSlug(val));
    }
  }

  function autoSlug(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createTenantAction(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Błąd tworzenia komisu.");
      }
    });
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        style={styles.openBtn}
      >
        ➕ Dodaj Nowy Komis (Tenant)
      </button>

      {isOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>🏢 Nowy Komis Samochodowy (Tenant)</h3>
              <button
                onClick={() => setIsOpen(false)}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <form action={handleSubmit} style={styles.form}>
              {error && <div style={styles.errorBox}>❌ {error}</div>}

              <div style={styles.field}>
                <label style={styles.label}>Nazwa Komisu / Firmy *</label>
                <input
                  name="business_name"
                  type="text"
                  value={businessName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="np. Auto Komis Janusz"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Identyfikator w adresie URL (Slug) *</label>
                <div style={styles.inputPrefixGroup}>
                  <span style={styles.inputPrefix}>{host}/</span>
                  <input
                    name="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-komis-janusz"
                    required
                    style={{ ...styles.input, borderRadius: "0 8px 8px 0" }}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Własna Domena (opcjonalnie)</label>
                <input
                  name="custom_domain"
                  type="text"
                  placeholder="np. autokomis-janusz.pl"
                  style={styles.input}
                />
              </div>

              <div style={styles.grid2}>
                <div style={styles.field}>
                  <label style={styles.label}>Telefon kontaktowy</label>
                  <input
                    name="contact_phone"
                    type="text"
                    placeholder="+48 500 600 700"
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>E-mail do powiadomień</label>
                  <input
                    name="notification_email"
                    type="email"
                    placeholder="kontakt@autokomis-janusz.pl"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Miasto / Lokalizacja</label>
                <input
                  name="city"
                  type="text"
                  placeholder="np. Warszawa"
                  style={styles.input}
                />
              </div>

              <div style={styles.actions}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={styles.cancelBtn}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={styles.submitBtn}
                >
                  {isPending ? "⟳ Tworzenie..." : "🚀 Utwórz Komis"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  openBtn: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: "20px",
  },
  modal: {
    background: "#1e293b",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "520px",
    padding: "28px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  modalTitle: {
    color: "#f1f5f9",
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "20px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  errorBox: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#fca5a5",
    fontSize: "13px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  label: {
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "600",
  },
  input: {
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  },
  inputPrefixGroup: {
    display: "flex",
    alignItems: "center",
  },
  inputPrefix: {
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRight: "none",
    borderRadius: "8px 0 0 8px",
    padding: "10px 12px",
    color: "#64748b",
    fontSize: "13px",
    fontFamily: "monospace",
    whiteSpace: "nowrap",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "12px",
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "8px",
    padding: "10px 16px",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
};
