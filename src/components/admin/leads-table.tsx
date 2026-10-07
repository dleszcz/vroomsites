"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/app/[dealerSlug]/admin/actions";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  dealer_id: string;
  customer_name: string | null;
  customer_phone: string;
  customer_email: string | null;
  vehicle_details: Record<string, unknown> | string | null;
  local_seo_city: string | null;
  photos: string[] | number | null;
  status: string;
  notes: string | null;
  created_at: string;
  attribution: Record<string, unknown> | null;
}

const STATUS_OPTIONS = [
  { value: "new", label: "Nowy", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  { value: "contacted", label: "Skontaktowany", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { value: "qualified", label: "W trakcie wyceny", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  { value: "purchased", label: "Odkupiony", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { value: "lost", label: "Odrzucony", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
];

const CONDITION_LABELS: Record<string, string> = {
  sprawny: "Sprawny / Używany",
  sprawny_uzywany: "Sprawny / Używany",
  uszkodzony: "Uszkodzony mechanicznie",
  uszkodzony_mechanicznie: "Uszkodzony mechanicznie",
  powypadkowy: "Powypadkowy",
  bez_oc_przegladu: "Bez OC / Przeglądu",
  zlomowanie: "Do złomowania / Kasacji",
  do_zlomowania: "Do złomowania / Kasacji",
};

interface ParsedVehicle {
  label: string | null;
  rawString: string | null;
  brand?: string;
  model?: string;
  year?: string;
  mileage?: string;
  condition?: string;
  expectedPrice?: string;
}

function parseVehicleDetails(raw: unknown): ParsedVehicle {
  if (!raw) return { label: null, rawString: null };
  if (typeof raw === "string") {
    return { label: raw, rawString: raw };
  }
  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const brand = (obj.brand || obj.make || "") as string;
    const model = (obj.model || "") as string;
    const year = (obj.year || "") as string;
    const mileage = obj.mileage ? String(obj.mileage) : "";
    const condition = (obj.condition || "") as string;
    const expectedPrice = obj.expectedPrice || obj.price ? String(obj.expectedPrice || obj.price) : "";

    const label = `${brand} ${model}${year ? ` (${year})` : ""}`.trim();
    return {
      label: label || null,
      rawString: null,
      brand,
      model,
      year,
      mileage,
      condition,
      expectedPrice,
    };
  }
  return { label: null, rawString: null };
}

function getStatusConfig(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filter === "all" || lead.status === filter;
    const matchesSearch =
      !searchQuery ||
      lead.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customer_phone?.includes(searchQuery) ||
      lead.local_seo_city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Filters Bar */}
      <div style={styles.filtersBar}>
        <div style={styles.filterButtons}>
          <button
            onClick={() => setFilter("all")}
            style={{
              ...styles.filterBtn,
              ...(filter === "all" ? styles.filterBtnActive : {}),
            }}
          >
            Wszystkie ({leads.length})
          </button>
          {STATUS_OPTIONS.map((s) => {
            const count = leads.filter((l) => l.status === s.value).length;
            return (
              <button
                key={s.value}
                onClick={() => setFilter(s.value)}
                style={{
                  ...styles.filterBtn,
                  ...(filter === s.value
                    ? { ...styles.filterBtnActive, color: s.color, borderColor: s.color }
                    : {}),
                }}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>
        <input
          type="text"
          placeholder="🔍 Szukaj po nazwisku, telefonie, mieście..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
          <p style={{ color: "#94a3b8", fontSize: "16px" }}>
            {leads.length === 0
              ? "Brak zgłoszeń. Nowe leady pojawią się tutaj automatycznie."
              : "Brak wyników dla wybranych filtrów."}
          </p>
        </div>
      ) : (
        <div style={styles.leadsList}>
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              isExpanded={expandedId === lead.id}
              onToggle={() =>
                setExpandedId(expandedId === lead.id ? null : lead.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LeadCard({
  lead,
  isExpanded,
  onToggle,
}: {
  lead: Lead;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusConfig = getStatusConfig(lead.status);
  const vehicle = parseVehicleDetails(lead.vehicle_details);
  const photosCount = typeof lead.photos === "number"
    ? lead.photos
    : Array.isArray(lead.photos)
    ? lead.photos.length
    : 0;
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(lead.notes || "");
  const router = useRouter();

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      await updateLeadStatus(lead.id, newStatus);
      router.refresh();
    });
  }

  function handleSaveNotes() {
    startTransition(async () => {
      await updateLeadStatus(lead.id, lead.status, notes);
      router.refresh();
    });
  }

  return (
    <div style={styles.card}>
      {/* Card Header — always visible */}
      <div style={styles.cardHeader} onClick={onToggle}>
        <div style={styles.cardHeaderLeft}>
          <div style={styles.customerInfo}>
            <span style={styles.customerName}>
              {lead.customer_name || "Brak imienia"}
            </span>
            {lead.local_seo_city && (
              <span style={styles.cityBadge}>📍 {lead.local_seo_city}</span>
            )}
          </div>
          <div style={styles.vehicleInfo}>
            {vehicle.label ? (
              <span style={{ fontWeight: 600, color: "#f8fafc" }}>
                🚗 {vehicle.label}
              </span>
            ) : vehicle.rawString ? (
              <span style={{ color: "#cbd5e1", fontSize: "13px" }}>
                🚗 {vehicle.rawString.slice(0, 45)}...
              </span>
            ) : null}
            {vehicle.condition && (
              <span style={styles.conditionTag}>
                {CONDITION_LABELS[vehicle.condition] || vehicle.condition}
              </span>
            )}
          </div>
        </div>

        <div style={styles.cardHeaderRight}>
          <a
            href={`tel:${lead.customer_phone}`}
            onClick={(e) => e.stopPropagation()}
            style={styles.phoneLink}
          >
            📞 {lead.customer_phone}
          </a>
          <div
            style={{
              ...styles.statusBadge,
              color: statusConfig.color,
              background: statusConfig.bg,
            }}
          >
            {statusConfig.label}
          </div>
          <div style={styles.dateText}>{formatDate(lead.created_at)}</div>
          {photosCount > 0 && (
            <span style={styles.photoBadge}>📷 {photosCount}</span>
          )}
          <span style={styles.expandIcon}>{isExpanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div style={styles.cardBody}>
          <div style={styles.detailsGrid}>
            {/* Contact */}
            <div style={styles.detailSection}>
              <h4 style={styles.detailTitle}>Kontakt</h4>
              <p style={styles.detailText}>
                <strong>Telefon:</strong>{" "}
                <a href={`tel:${lead.customer_phone}`} style={{ color: "#3b82f6" }}>
                  {lead.customer_phone}
                </a>
              </p>
              {lead.customer_email && (
                <p style={styles.detailText}>
                  <strong>Email:</strong> {lead.customer_email}
                </p>
              )}
              {lead.local_seo_city && (
                <p style={styles.detailText}>
                  <strong>Miasto:</strong> {lead.local_seo_city}
                </p>
              )}
            </div>

            {/* Vehicle Details */}
            {(vehicle.label || vehicle.rawString) && (
              <div style={styles.detailSection}>
                <h4 style={styles.detailTitle}>Pojazd</h4>
                {vehicle.brand && (
                  <p style={styles.detailText}>
                    <strong>Marka / Model:</strong> {vehicle.brand}{" "}
                    {vehicle.model || ""}
                  </p>
                )}
                {vehicle.year && (
                  <p style={styles.detailText}>
                    <strong>Rocznik:</strong> {vehicle.year}
                  </p>
                )}
                {vehicle.mileage && (
                  <p style={styles.detailText}>
                    <strong>Przebieg:</strong>{" "}
                    {isNaN(Number(vehicle.mileage))
                      ? vehicle.mileage
                      : Number(vehicle.mileage).toLocaleString("pl-PL")}{" "}
                    km
                  </p>
                )}
                {vehicle.condition && (
                  <p style={styles.detailText}>
                    <strong>Stan:</strong>{" "}
                    {CONDITION_LABELS[vehicle.condition] || vehicle.condition}
                  </p>
                )}
                {vehicle.expectedPrice && (
                  <p style={styles.detailText}>
                    <strong>Oczekiwana cena:</strong>{" "}
                    {isNaN(Number(vehicle.expectedPrice))
                      ? vehicle.expectedPrice
                      : Number(vehicle.expectedPrice).toLocaleString("pl-PL")}{" "}
                    zł
                  </p>
                )}
                {vehicle.rawString && !vehicle.brand && (
                  <p style={styles.detailText}>
                    <strong>Opis:</strong> {vehicle.rawString}
                  </p>
                )}
              </div>
            )}

            {/* Attribution */}
            {lead.attribution && (
              <div style={styles.detailSection}>
                <h4 style={styles.detailTitle}>Źródło ruchu</h4>
                <p style={styles.detailText}>
                  <strong>UTM Source:</strong>{" "}
                  {(lead.attribution.utm_source as string) || "Organic / Direct"}
                </p>
                {(lead.attribution.utm_campaign as string) && (
                  <p style={styles.detailText}>
                    <strong>Kampania:</strong>{" "}
                    {String(lead.attribution.utm_campaign)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Photos */}
          {Array.isArray(lead.photos) && lead.photos.length > 0 && (
            <div style={styles.photosSection}>
              <h4 style={styles.detailTitle}>📷 Zdjęcia ({lead.photos.length})</h4>
              <div style={styles.photosGrid}>
                {lead.photos.map((photo: unknown, idx: number) => (
                  <img
                    key={idx}
                    src={photo as string}
                    alt={`Zdjęcie ${idx + 1}`}
                    style={styles.photoThumb}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Status Change & Notes */}
          <div style={styles.actionsRow}>
            <div style={styles.statusSelect}>
              <label style={styles.actionLabel}>Zmień status:</label>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isPending}
                style={styles.select}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.notesSection}>
              <label style={styles.actionLabel}>Notatka handlowa:</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Np. Klient prosi o telefon po 16:00..."
                  style={styles.notesInput}
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={isPending}
                  style={styles.saveBtn}
                >
                  💾
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  filtersBar: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  filterButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  filterBtn: {
    background: "rgba(30, 41, 59, 0.8)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "8px",
    padding: "8px 14px",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  filterBtnActive: {
    color: "#10b981",
    borderColor: "#10b981",
    background: "rgba(16, 185, 129, 0.08)",
  },
  searchInput: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    maxWidth: "400px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
  },
  leadsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  card: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "border-color 0.15s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    cursor: "pointer",
    gap: "16px",
  },
  cardHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },
  customerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "4px",
  },
  customerName: {
    color: "#f1f5f9",
    fontSize: "15px",
    fontWeight: "600",
  },
  cityBadge: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  vehicleInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#64748b",
    fontSize: "13px",
  },
  conditionTag: {
    background: "rgba(148, 163, 184, 0.1)",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "12px",
  },
  cardHeaderRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  phoneLink: {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  dateText: {
    color: "#64748b",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },
  photoBadge: {
    color: "#f59e0b",
    fontSize: "12px",
  },
  expandIcon: {
    color: "#64748b",
    fontSize: "10px",
  },
  cardBody: {
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
    padding: "20px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  detailSection: {},
  detailTitle: {
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "600",
    margin: "0 0 8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailText: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: "0 0 4px",
    lineHeight: "1.5",
  },
  photosSection: {
    marginBottom: "20px",
  },
  photosGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px",
  },
  photoThumb: {
    width: "80px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
  },
  actionsRow: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  statusSelect: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  actionLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "500",
  },
  select: {
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#f1f5f9",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  },
  notesSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: "250px",
  },
  notesInput: {
    flex: 1,
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#f1f5f9",
    fontSize: "13px",
    outline: "none",
  },
  saveBtn: {
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
