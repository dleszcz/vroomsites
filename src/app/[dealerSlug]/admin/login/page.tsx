"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Wpisz e-mail oraz hasło.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Błąd logowania.");
        setLoading(false);
        return;
      }

      // Cookies are now set by the API route's Set-Cookie headers.
      // Full page reload ensures middleware reads the fresh cookies.
      const params = new URLSearchParams(window.location.search);
      const defaultRedirect = window.location.pathname.replace("/login", "/settings");
      const redirectTo = params.get("redirect") || defaultRedirect;
      window.location.href = redirectTo;
    } catch (err: unknown) {
      console.error("[Login Exception]:", err);
      setError("Wystąpił nieoczekiwany błąd logowania.");
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Logo / Branding */}
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>🚗</div>
          <h1 style={styles.title}>VroomDealer</h1>
          <p style={styles.subtitle}>Panel Administracyjny</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Adres e-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jan@komis.pl"
              required
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "⟳ Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <p style={styles.footer}>
          Nie masz konta?{" "}
          <a href="mailto:kontakt@vroomdealer.pl" style={styles.link}>
            Skontaktuj się z nami
          </a>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    padding: "24px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(30, 41, 59, 0.8)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "20px",
    padding: "40px 32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  logoSection: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logoIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  title: {
    color: "#10b981",
    fontSize: "28px",
    fontWeight: "800",
    margin: "0 0 4px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: "0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "500",
  },
  input: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#f1f5f9",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  error: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#fca5a5",
    fontSize: "13px",
    textAlign: "center",
  },
  button: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
    marginTop: "4px",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "13px",
    color: "#64748b",
  },
  link: {
    color: "#10b981",
    textDecoration: "none",
  },
};
