import { useState, useEffect, useCallback, useRef } from "react";
import _ from "lodash";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, Area, AreaChart, ComposedChart } from "recharts";

// ─── Initial seed data from the CSV ───
const SEED_DATA = [
  { data: "2026-01-15", semana: "S3-Jan", fornecedor: "Unifer", produto: "BOTA COURO ELASTICO N40 VULCAFLEX", categoria: "EPI", valUnit: 53.75, qtd: 1 },
  { data: "2026-01-15", semana: "S3-Jan", fornecedor: "Unifer", produto: "BOTA COURO ELASTICO N42 VULCAFLEX", categoria: "EPI", valUnit: 53.75, qtd: 1 },
  { data: "2026-01-21", semana: "S4-Jan", fornecedor: "Unifer", produto: "BOTA PVC PRETA N40 VULCAFLEX", categoria: "EPI", valUnit: 41.50, qtd: 1 },
  { data: "2026-01-21", semana: "S4-Jan", fornecedor: "Unifer", produto: "BOTA PVC PRETA N44 VULCAFLEX", categoria: "EPI", valUnit: 41.50, qtd: 2 },
  { data: "2026-01-21", semana: "S4-Jan", fornecedor: "Unifer", produto: "CAPA CHUVA PVC GG BRASCAMP", categoria: "EPI", valUnit: 22.60, qtd: 10 },
  { data: "2026-01-21", semana: "S4-Jan", fornecedor: "Unifer", produto: "CAVADEIRA ARTICULADA G COLINS", categoria: "Ferramentas", valUnit: 154.80, qtd: 2 },
  { data: "2026-01-21", semana: "S4-Jan", fornecedor: "Unifer", produto: "ESQUADRO 12 LONGO MTX", categoria: "Ferramentas", valUnit: 53.50, qtd: 2 },
  { data: "2026-01-21", semana: "S4-Jan", fornecedor: "Unifer", produto: "PRUMO DE CENTRO 300g CORTAG", categoria: "Ferramentas", valUnit: 35.20, qtd: 3 },
  { data: "2026-01-26", semana: "S4-Jan", fornecedor: "Unifer", produto: "BOTA PVC PRETA N46 VULCAFLEX", categoria: "EPI", valUnit: 41.50, qtd: 1 },
  { data: "2026-02-05", semana: "S1-Fev", fornecedor: "Unifer", produto: "BOTA COURO ELASTICO N40 VULCAFLEX", categoria: "EPI", valUnit: 53.99, qtd: 1 },
  { data: "2026-02-05", semana: "S1-Fev", fornecedor: "Unifer", produto: "BOTA COURO ELASTICO N42 VULCAFLEX", categoria: "EPI", valUnit: 53.99, qtd: 1 },
  { data: "2026-02-05", semana: "S1-Fev", fornecedor: "Unifer", produto: "OCULOS FENIX CINZA DANNY", categoria: "EPI", valUnit: 3.99, qtd: 10 },
  { data: "2026-02-05", semana: "S1-Fev", fornecedor: "Unifer", produto: "FITA ZEBRADA 200MT PLASTCOR", categoria: "Mat. Construção", valUnit: 9.99, qtd: 2 },
  { data: "2026-02-06", semana: "S1-Fev", fornecedor: "Unifer", produto: "LUVA GLADIADOR XG DANNY", categoria: "EPI", valUnit: 8.99, qtd: 20 },
  { data: "2026-02-06", semana: "S1-Fev", fornecedor: "Friluz", produto: "CABO FLEXIVEL 6MM PRETO", categoria: "Elétrica", valUnit: 9.58, qtd: 88 },
  { data: "2026-02-06", semana: "S1-Fev", fornecedor: "Friluz", produto: "HASTE TERRA 15.8MM x 2M", categoria: "Elétrica", valUnit: 90.00, qtd: 2 },
  { data: "2026-02-06", semana: "S1-Fev", fornecedor: "Friluz", produto: "HASTE TERRA 15.8MM x 2M", categoria: "Elétrica", valUnit: 59.99, qtd: 3 },
  { data: "2026-02-06", semana: "S1-Fev", fornecedor: "Friluz", produto: "CORDOALHA 10MM", categoria: "Elétrica", valUnit: 13.50, qtd: 9 },
  { data: "2026-02-09", semana: "S2-Fev", fornecedor: "Unifer", produto: "DISCO DIAMANTADO 110MM TURBO CORTAG", categoria: "Discos", valUnit: 24.95, qtd: 10 },
  { data: "2026-02-10", semana: "S2-Fev", fornecedor: "Paloma Lacerda", produto: "REFEICOES", categoria: "Alimentação", valUnit: 16.00, qtd: 28 },
  { data: "2026-02-10", semana: "S2-Fev", fornecedor: "Paloma Lacerda", produto: "GUARAVITA", categoria: "Alimentação", valUnit: 2.00, qtd: 28 },
  { data: "2026-02-10", semana: "S2-Fev", fornecedor: "Reserva Madeiras", produto: "MADEIRITE COMUM", categoria: "Mat. Construção", valUnit: 76.15, qtd: 30 },
  { data: "2026-02-10", semana: "S2-Fev", fornecedor: "Unifer", produto: "DISCO DIAMANTADO 110MM ECO CORTAG", categoria: "Discos", valUnit: 24.95, qtd: 10 },
  { data: "2026-02-13", semana: "S2-Fev", fornecedor: "SM Pontes", produto: "PAPEL HIG FD MIMMO 30M", categoria: "Limpeza", valUnit: 89.88, qtd: 1 },
  { data: "2026-02-20", semana: "S3-Fev", fornecedor: "SM Pontes", produto: "CTP DESC TOTALPLAST 200ML", categoria: "Limpeza", valUnit: 4.59, qtd: 25 },
  { data: "2026-02-26", semana: "S4-Fev", fornecedor: "Paloma Lacerda", produto: "REFEICOES", categoria: "Alimentação", valUnit: 16.00, qtd: 26 },
  { data: "2026-02-26", semana: "S4-Fev", fornecedor: "Paloma Lacerda", produto: "GUARAVITA", categoria: "Alimentação", valUnit: 2.00, qtd: 26 },
  { data: "2026-02-26", semana: "S4-Fev", fornecedor: "Friopen", produto: "REFLETOR LED 100W TASCHIBRA", categoria: "Elétrica", valUnit: 80.57, qtd: 9 },
  { data: "2026-02-26", semana: "S4-Fev", fornecedor: "Unifer", produto: "DISCO CORTE 115MM FINO NORTON", categoria: "Discos", valUnit: 1.80, qtd: 20 },
  { data: "2026-03-04", semana: "S1-Mar", fornecedor: "Unifer", produto: "DISCO CORTE 12 NORTON", categoria: "Discos", valUnit: 29.80, qtd: 22 },
  { data: "2026-03-04", semana: "S1-Mar", fornecedor: "Unifer", produto: "PROTETOR AURICULAR KALIPSO", categoria: "EPI", valUnit: 2.15, qtd: 30 },
  { data: "2026-03-04", semana: "S1-Mar", fornecedor: "Unifer", produto: "JUGULAR P/ CAPACETE DELTA PLUS", categoria: "EPI", valUnit: 3.50, qtd: 15 },
  { data: "2026-03-05", semana: "S1-Mar", fornecedor: "Unifer", produto: "DISCO CORTE 12 NORTON", categoria: "Discos", valUnit: 29.80, qtd: 8 },
  { data: "2026-03-16", semana: "S3-Mar", fornecedor: "Paloma Lacerda", produto: "REFEICOES", categoria: "Alimentação", valUnit: 16.00, qtd: 47 },
  { data: "2026-03-16", semana: "S3-Mar", fornecedor: "Paloma Lacerda", produto: "GUARAVITA", categoria: "Alimentação", valUnit: 2.00, qtd: 47 },
  { data: "2026-03-16", semana: "S3-Mar", fornecedor: "Unifer", produto: "CADEADO LATAO 20MM PAPAIZ", categoria: "Mat. Construção", valUnit: 15.70, qtd: 16 },
  { data: "2026-03-24", semana: "S4-Mar", fornecedor: "Ferraco", produto: "ELETRODO 2.50MM", categoria: "Mat. Construção", valUnit: 27.70, qtd: 5 },
  { data: "2026-03-25", semana: "S4-Mar", fornecedor: "SM Pontes", produto: "DETERGENTE NEUTRO 5LTS", categoria: "Limpeza", valUnit: 17.90, qtd: 1 },
  { data: "2026-03-26", semana: "S4-Mar", fornecedor: "Unifer", produto: "DISCO CORTE 115MM FINO NORTON", categoria: "Discos", valUnit: 1.99, qtd: 40 },
  { data: "2026-03-26", semana: "S4-Mar", fornecedor: "Unifer", produto: "THINNER ACABAMENTO 5LT ITAQUA", categoria: "Pintura", valUnit: 69.80, qtd: 1 },
  { data: "2026-03-30", semana: "S5-Mar", fornecedor: "Paloma Lacerda", produto: "REFEICOES", categoria: "Alimentação", valUnit: 16.00, qtd: 28 },
  { data: "2026-03-30", semana: "S5-Mar", fornecedor: "Paloma Lacerda", produto: "GUARAVITA", categoria: "Alimentação", valUnit: 2.00, qtd: 28 },
  { data: "2026-04-09", semana: "S2-Abr", fornecedor: "Prime Eletronicos", produto: "ESTABILIZADOR 500VA COLETEK", categoria: "Elétrica", valUnit: 148.00, qtd: 1 },
  { data: "2026-04-10", semana: "S2-Abr", fornecedor: "Unifer", produto: "DISCO CORTE 115MM FINO NORTON", categoria: "Discos", valUnit: 1.99, qtd: 60 },
  { data: "2026-04-10", semana: "S2-Abr", fornecedor: "Unifer", produto: "DISCO DIAMANTADO 110MM SEG NORTON", categoria: "Discos", valUnit: 13.99, qtd: 46 },
  { data: "2026-04-10", semana: "S2-Abr", fornecedor: "Unifer", produto: "LAPIS CARPINTEIRO IRWIN", categoria: "Ferramentas", valUnit: 1.80, qtd: 72 },
  { data: "2026-04-13", semana: "S2-Abr", fornecedor: "Paloma Lacerda", produto: "REFEICOES", categoria: "Alimentação", valUnit: 16.00, qtd: 20 },
  { data: "2026-04-14", semana: "S3-Abr", fornecedor: "Unifer", produto: "DESEMPENADEIRA ACO DENTADA CORTAG", categoria: "Ferramentas", valUnit: 17.80, qtd: 1 },
  { data: "2026-04-14", semana: "S3-Abr", fornecedor: "Daflon", produto: "FECHO PORTUGUES 3", categoria: "Mat. Construção", valUnit: 14.12, qtd: 3 },
  { data: "2026-04-15", semana: "S3-Abr", fornecedor: "Unifer", produto: "FITA ZEBRADA 200MT PLASTCOR", categoria: "Mat. Construção", valUnit: 11.20, qtd: 3 },
  { data: "2026-04-15", semana: "S3-Abr", fornecedor: "SM Pontes", produto: "DISPENSER HIG ROLAO NOBRE", categoria: "Limpeza", valUnit: 32.90, qtd: 1 },
  { data: "2026-04-17", semana: "S3-Abr", fornecedor: "Unifer", produto: "LIXEIRA C/ PEDAL 50LT JSN", categoria: "Limpeza", valUnit: 146.25, qtd: 2 },
  { data: "2026-04-27", semana: "S4-Abr", fornecedor: "Unifer", produto: "PROTETOR VERGALHAO EP360", categoria: "Mat. Construção", valUnit: 42.95, qtd: 40 },
  { data: "2026-04-27", semana: "S4-Abr", fornecedor: "Unifer", produto: "LUVA GLADIADOR XG DANNY", categoria: "EPI", valUnit: 9.30, qtd: 50 },
  { data: "2026-04-27", semana: "S4-Abr", fornecedor: "Unifer", produto: "RESPIRADOR DESC P2 IDAMM", categoria: "EPI", valUnit: 1.50, qtd: 100 },
  { data: "2026-04-29", semana: "S5-Abr", fornecedor: "Paloma Lacerda", produto: "REFEICOES", categoria: "Alimentação", valUnit: 16.00, qtd: 10 },
  { data: "2026-04-29", semana: "S5-Abr", fornecedor: "Unifer", produto: "TELA TAPUME LARANJA 1.20x50M", categoria: "Mat. Construção", valUnit: 139.98, qtd: 2 },
  { data: "2026-04-29", semana: "S5-Abr", fornecedor: "Unifer", produto: "TRENA CX FECHADA 50M MTX", categoria: "Ferramentas", valUnit: 114.70, qtd: 2 },
  { data: "2026-05-04", semana: "S1-Mai", fornecedor: "Ferraco", produto: "TUBO IND RETANG 40x20x18", categoria: "Mat. Construção", valUnit: 69.10, qtd: 4 },
  { data: "2026-05-05", semana: "S1-Mai", fornecedor: "Unifer", produto: "MANGUEIRA CRISTAL 3/4 HIMAFLEX", categoria: "Mat. Construção", valUnit: 8.60, qtd: 50 },
];

const CATEGORIAS = ["EPI", "Elétrica", "Discos", "Mat. Construção", "Alimentação", "Ferramentas", "Limpeza", "Pintura", "Outros"];
const FORNECEDORES_INICIAIS = ["Unifer", "Friluz", "Paloma Lacerda", "Reserva Madeiras", "Friopen", "SM Pontes", "Ferraco", "Prime Eletronicos", "Daflon"];

const CAT_COLORS = {
  "EPI": "#22c55e", "Elétrica": "#a78bfa", "Discos": "#22d3ee", "Mat. Construção": "#3b82f6",
  "Alimentação": "#f97316", "Ferramentas": "#f59e0b", "Limpeza": "#ec4899", "Pintura": "#8b5cf6", "Outros": "#6b7280"
};

const STORAGE_KEY = "obra-compras-v2";

function getWeekLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const dayOfMonth = d.getDate();
  const weekNum = Math.ceil(dayOfMonth / 7);
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `S${weekNum}-${months[d.getMonth()]}`;
}

function formatBRL(v) {
  return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Custom Tooltip ───
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1c2129", border: "1px solid #252b35", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#e4e8ef" }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: "#94a3b8" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
          <span style={{ color: "#cbd5e1" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, fontFamily: "monospace" }}>
            {typeof p.value === "number" ? (p.name.includes("R$") || p.name.includes("Valor") ? formatBRL(p.value) : p.value.toLocaleString("pt-BR")) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Alert Badge ───
function AlertBadge({ type, children }) {
  const styles = {
    critical: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "#ef4444" },
    warning: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "#f59e0b" },
    info: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "#3b82f6" },
  };
  const s = styles[type] || styles.info;
  return (
    <div style={{ background: s.bg, borderLeft: `3px solid ${s.border}`, borderRadius: 6, padding: "10px 14px", marginBottom: 8, fontSize: 12.5, lineHeight: 1.6, color: s.color }}>
      {children}
    </div>
  );
}

export default function RadarSemanal() {
  const [data, setData] = useState([]);
  const [view, setView] = useState("radar");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [filterCat, setFilterCat] = useState("Todas");
  const [filterForn, setFilterForn] = useState("Todos");
  const [formData, setFormData] = useState({ data: new Date().toISOString().slice(0, 10), fornecedor: "", produto: "", categoria: "EPI", valUnit: "", qtd: "" });
  const [bulkText, setBulkText] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [importMode, setImportMode] = useState(null); // null | "form" | "bulk" | "csv"
  const [csvPreview, setCsvPreview] = useState(null); // { entries: [], raw: "", fileName: "" }
  const [importMsg, setImportMsg] = useState(null);
  const fileRef = useRef();

  // ─── Load from storage ───
  useEffect(() => {
    (async () => {
      try {
        const result = { value: localStorage.getItem(STORAGE_KEY) };
        if (result?.value) {
          const parsed = JSON.parse(result.value);
          if (Array.isArray(parsed) && parsed.length > 0) { setData(parsed); setLoading(false); return; }
        }
      } catch (e) { /* no stored data */ }
      setData(SEED_DATA);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA)); } catch {}
      setLoading(false);
    })();
  }, []);

  // ─── Save ───
  const saveData = useCallback(async (newData) => {
    setData(newData);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newData)); } catch (e) { console.error(e); }
  }, []);

  // ─── Add single entry ───
  const addEntry = () => {
    if (!formData.data || !formData.fornecedor || !formData.produto || !formData.valUnit || !formData.qtd) return;
    const entry = { ...formData, valUnit: parseFloat(formData.valUnit), qtd: parseInt(formData.qtd), semana: getWeekLabel(formData.data) };
    const newData = [...data, entry];
    saveData(newData);
    setFormData({ data: formData.data, fornecedor: "", produto: "", categoria: "EPI", valUnit: "", qtd: "" });
  };

  // ─── Bulk paste ───
  const addBulk = () => {
    const lines = bulkText.trim().split("\n").filter(l => l.trim());
    const newEntries = [];
    for (const line of lines) {
      const parts = line.split(/[;\t]/).map(s => s.trim());
      if (parts.length >= 5) {
        const [dt, forn, prod, cat, vu, q] = parts;
        const dateStr = dt.includes("/") ? dt.split("/").reverse().join("-") : dt;
        newEntries.push({ data: dateStr, semana: getWeekLabel(dateStr), fornecedor: forn, produto: prod, categoria: CATEGORIAS.includes(cat) ? cat : "Outros", valUnit: parseFloat(vu.replace(",", ".")), qtd: parseInt(q) });
      }
    }
    if (newEntries.length > 0) { saveData([...data, ...newEntries]); setBulkText(""); setShowBulk(false); }
  };

  // ─── Reset ───
  const resetData = async () => { if (confirm("Resetar para os dados originais do CSV?")) { saveData(SEED_DATA); } };

  // ─── Auto-categorize product by keywords ───
  const autoCategory = (prod) => {
    const p = prod.toUpperCase();
    if (/BOTA|LUVA|OCULOS|CAPACETE|PROTETOR AUR|RESPIRADOR|ABAFADOR|CARNEIRA|JUGULAR|CAPA CHUVA|TOUCA/.test(p)) return "EPI";
    if (/DISCO/.test(p)) return "Discos";
    if (/CABO|CONECTOR|FITA ISOLANTE|HASTE TERRA|CORDOALHA|GRAMPO TERRA|CAIXA ATERR|ESTABILIZADOR|REFLETOR/.test(p)) return "Elétrica";
    if (/CAVADEIRA|ESQUADRO|PRUMO|PONTEIRO|TALHADEIRA|DESEMPENADEIRA|TRENA|LAPIS CARP/.test(p)) return "Ferramentas";
    if (/REFEIC|GUARAVITA|MARMITA/.test(p)) return "Alimentação";
    if (/CLORO|DESINF|PAPEL HIG|PASTA CRISTAL|ESPONJA|DETERGENTE|PANO DE CHAO|SABAO|SACO DE LIXO|SABONETE|DISPENSER|LIXEIRA|RESERVATORIO/.test(p)) return "Limpeza";
    if (/ROLO PINTURA|THINNER|TRINCHA|TINTA/.test(p)) return "Pintura";
    if (/MADEIRITE|FECHO|TUBO IND|MANGUEIRA|MASSA|TELA TAPUME|PROTETOR VERGALHAO|FITA ZEBRADA|ELETRODO|CADEADO|AREIA|CIMENTO|BRITA/.test(p)) return "Mat. Construção";
    return "Outros";
  };

  // ─── Parse CSV in the original pivot format ───
  const parseOriginalCSV = (text) => {
    const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().split("\n");
    const entries = [];
    let currentDate = null;
    let currentNFe = null;
    let currentFornecedor = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Skip known header lines
      if (/^(Data da compra|C.digo de refer|Fornecedor|Nome do produto|Total geral)/i.test(line)) continue;

      // Date line: dd/mm/yyyy;;;;
      const dateMatch = line.match(/^(\d{2}\/\d{2}\/\d{4})\s*;*\s*$/);
      if (dateMatch) {
        const parts = dateMatch[1].split("/");
        currentDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        continue;
      }

      // NFe line
      if (/^NFe\s+/i.test(line.replace(/;+$/, ""))) {
        currentNFe = line.replace(/;+$/, "").trim();
        continue;
      }

      // Fornecedor line: text followed by only semicolons
      const stripped = line.replace(/;+$/, "");
      if (stripped && !stripped.includes(";") && !/^\d{2}\/\d{2}\/\d{4}$/.test(stripped) && !/^NFe\s+/i.test(stripped) && !/^Total geral/i.test(stripped)) {
        // Could be a fornecedor line — check next line has semicolons with numbers
        const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
        if (nextLine.includes(";") && /\d/.test(nextLine) && !/^NFe/.test(nextLine)) {
          currentFornecedor = stripped;
          continue;
        }
        // Or it ends with ;;;;
        if (line.endsWith(";;;;")) {
          currentFornecedor = stripped;
          continue;
        }
      }

      // Product line — has semicolons with numeric values
      // The format can be tricky: product name may contain ; (e.g. "1;50MT")
      // Strategy: split by ; and try to parse the LAST 3 fields as numbers
      const allParts = line.replace(/;+$/, "").split(";");
      if (allParts.length >= 4) {
        // Try taking last 3 as val_unit, qtd, val_bruto
        let parsed = false;
        for (let tryLen = 3; tryLen <= Math.min(allParts.length - 1, 4); tryLen++) {
          const numParts = allParts.slice(-tryLen);
          const textParts = allParts.slice(0, -tryLen);

          // For 3 numeric fields: valUnit, qtd, valBruto
          if (tryLen === 3) {
            const vu = parseFloat(numParts[0].replace(/\./g, "").replace(",", "."));
            const qt = parseFloat(numParts[1].replace(/\./g, "").replace(",", "."));
            const vb = parseFloat(numParts[2].replace(/\./g, "").replace(",", "."));
            if (!isNaN(vu) && !isNaN(qt) && !isNaN(vb) && qt > 0 && vu > 0) {
              const prodName = textParts.join(";").trim();
              if (prodName && currentDate) {
                entries.push({
                  data: currentDate,
                  semana: getWeekLabel(currentDate),
                  fornecedor: currentFornecedor || "Não identificado",
                  produto: prodName,
                  categoria: autoCategory(prodName),
                  valUnit: vu,
                  qtd: Math.round(qt),
                  nfe: currentNFe || "",
                });
                parsed = true;
                break;
              }
            }
          }
        }

        // Fallback: maybe the line has ; inside the product name, making last 3 not work
        // Try with just the last 2 as qtd and val_bruto (compute val_unit)
        if (!parsed && allParts.length >= 3) {
          const vb = parseFloat(allParts[allParts.length - 1].replace(/\./g, "").replace(",", "."));
          const qt = parseFloat(allParts[allParts.length - 2].replace(/\./g, "").replace(",", "."));
          const vu = parseFloat(allParts[allParts.length - 3].replace(/\./g, "").replace(",", "."));
          if (!isNaN(vu) && !isNaN(qt) && !isNaN(vb) && qt > 0) {
            const prodName = allParts.slice(0, -3).join(";").trim();
            if (prodName && currentDate) {
              entries.push({
                data: currentDate,
                semana: getWeekLabel(currentDate),
                fornecedor: currentFornecedor || "Não identificado",
                produto: prodName,
                categoria: autoCategory(prodName),
                valUnit: vu,
                qtd: Math.round(qt),
                nfe: currentNFe || "",
              });
            }
          }
        }
      }
    }
    return entries;
  };

  // ─── Handle CSV file upload ───
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportMsg(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      try {
        const entries = parseOriginalCSV(text);
        if (entries.length === 0) {
          setImportMsg({ type: "error", text: "Nenhum registro encontrado. Verifique se o formato é o mesmo do CSV original." });
          setCsvPreview(null);
        } else {
          setCsvPreview({ entries, fileName: file.name });
          setImportMsg({ type: "success", text: `${entries.length} registros identificados de ${_.uniq(entries.map(e => e.fornecedor)).length} fornecedor(es).` });
        }
      } catch (err) {
        setImportMsg({ type: "error", text: `Erro ao processar: ${err.message}` });
        setCsvPreview(null);
      }
    };
    reader.readAsText(file, "utf-8");
    // Reset file input so same file can be re-selected
    e.target.value = "";
  };

  // ─── Confirm import ───
  const confirmImport = (mode) => {
    if (!csvPreview) return;
    const newEntries = csvPreview.entries.map(({ nfe, ...rest }) => rest);
    if (mode === "replace") {
      saveData(newEntries);
      setImportMsg({ type: "success", text: `Base substituída com ${newEntries.length} registros.` });
    } else {
      saveData([...data, ...newEntries]);
      setImportMsg({ type: "success", text: `${newEntries.length} registros adicionados à base existente. Total: ${data.length + newEntries.length}.` });
    }
    setCsvPreview(null);
    setTimeout(() => setImportMsg(null), 4000);
  };

  // ─── Derived data ───
  const filtered = data.filter(d => (filterCat === "Todas" || d.categoria === filterCat) && (filterForn === "Todos" || d.fornecedor === filterForn));
  const allWeeks = _.sortBy(_.uniq(data.map(d => d.semana)), w => {
    const monthMap = { Jan: 1, Fev: 2, Mar: 3, Abr: 4, Mai: 5, Jun: 6, Jul: 7, Ago: 8, Set: 9, Out: 10, Nov: 11, Dez: 12 };
    const m = w.match(/S(\d+)-(\w+)/);
    return m ? monthMap[m[2]] * 10 + parseInt(m[1]) : 0;
  });
  const allFornecedores = _.sortBy(_.uniq(data.map(d => d.fornecedor)));

  // ─── Weekly volume ───
  const weeklyVolume = allWeeks.map(w => {
    const items = filtered.filter(d => d.semana === w);
    const total = _.sumBy(items, d => d.valUnit * d.qtd);
    const qtdTotal = _.sumBy(items, "qtd");
    const nItens = items.length;
    return { semana: w, "Valor Total (R$)": Math.round(total * 100) / 100, "Qtd Itens": qtdTotal, nLinhas: nItens };
  });

  // ─── Price variations (products bought in multiple weeks) ───
  const prodWeekPrices = {};
  data.forEach(d => {
    const key = d.produto;
    if (!prodWeekPrices[key]) prodWeekPrices[key] = {};
    if (!prodWeekPrices[key][d.semana]) prodWeekPrices[key][d.semana] = [];
    prodWeekPrices[key][d.semana].push(d.valUnit);
  });

  const priceVariations = [];
  Object.entries(prodWeekPrices).forEach(([prod, weeks]) => {
    const weekKeys = Object.keys(weeks);
    if (weekKeys.length < 2) return;
    const avgByWeek = weekKeys.map(w => ({ semana: w, preco: _.mean(weeks[w]) }));
    const sorted = _.sortBy(avgByWeek, a => allWeeks.indexOf(a.semana));
    const first = sorted[0].preco;
    const last = sorted[sorted.length - 1].preco;
    const varPct = ((last - first) / first) * 100;
    if (Math.abs(varPct) > 0.5) {
      priceVariations.push({ produto: prod, semanas: sorted, varPct: Math.round(varPct * 10) / 10, first, last });
    }
  });
  priceVariations.sort((a, b) => Math.abs(b.varPct) - Math.abs(a.varPct));

  // ─── Weekly alerts ───
  const lastWeek = allWeeks[allWeeks.length - 1];
  const prevWeek = allWeeks.length >= 2 ? allWeeks[allWeeks.length - 2] : null;
  const lastVol = weeklyVolume.find(w => w.semana === lastWeek)?.["Valor Total (R$)"] || 0;
  const prevVol = prevWeek ? (weeklyVolume.find(w => w.semana === prevWeek)?.["Valor Total (R$)"] || 0) : 0;
  const volChange = prevVol > 0 ? ((lastVol - prevVol) / prevVol * 100) : 0;

  // ─── Category weekly breakdown ───
  const catWeekly = allWeeks.map(w => {
    const row = { semana: w };
    CATEGORIAS.forEach(cat => {
      const items = data.filter(d => d.semana === w && d.categoria === cat);
      row[cat] = Math.round(_.sumBy(items, d => d.valUnit * d.qtd) * 100) / 100;
    });
    return row;
  });

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0c0f14", color: "#60a5fa", fontSize: 18, fontFamily: "'DM Sans'" }}>Carregando dados...</div>;

  return (
    <div style={{ background: "#0c0f14", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#e4e8ef" }}>
      {/* ─── Top Bar ─── */}
      <div style={{ background: "#151920", borderBottom: "1px solid #252b35", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📡</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Radar Semanal — Compras da Obra</div>
            <div style={{ fontSize: 11, color: "#8c94a3" }}>{data.length} registros · {allWeeks.length} semanas · {allFornecedores.length} fornecedores</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["radar", "precos", "categorias", "dados"].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: "6px 14px", borderRadius: 8, border: view === v ? "1px solid #3b82f6" : "1px solid #252b35", background: view === v ? "rgba(59,130,246,0.15)" : "#1c2129", color: view === v ? "#60a5fa" : "#8c94a3", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
              {v === "radar" ? "📊 Radar" : v === "precos" ? "📈 Preços" : v === "categorias" ? "📦 Categorias" : "📋 Dados"}
            </button>
          ))}
          <button onClick={() => setShowForm(!showForm)} style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            + Novo Registro
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>

        {/* ─── Entry Form ─── */}
        {showForm && (
          <div style={{ background: "#151920", border: "1px solid #252b35", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            {/* Tab header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 4, background: "#0c0f14", borderRadius: 8, padding: 3 }}>
                {[
                  { key: "form", label: "✏️ Individual", icon: "" },
                  { key: "bulk", label: "📋 Colar em Lote", icon: "" },
                  { key: "csv", label: "📁 Importar CSV", icon: "" },
                ].map(tab => (
                  <button key={tab.key} onClick={() => { setImportMode(tab.key); setImportMsg(null); setCsvPreview(null); }}
                    style={{ padding: "7px 16px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: (importMode || "form") === tab.key ? "#252b35" : "transparent",
                      color: (importMode || "form") === tab.key ? "#e4e8ef" : "#6b7280",
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <button onClick={resetData} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, border: "1px solid #252b35", background: "#1c2129", color: "#ef4444", cursor: "pointer" }}>
                Resetar Dados
              </button>
            </div>

            {/* Import message */}
            {importMsg && (
              <div style={{ padding: "8px 14px", borderRadius: 6, marginBottom: 12, fontSize: 12, fontWeight: 500,
                background: importMsg.type === "error" ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
                color: importMsg.type === "error" ? "#ef4444" : "#22c55e",
                borderLeft: `3px solid ${importMsg.type === "error" ? "#ef4444" : "#22c55e"}`,
              }}>
                {importMsg.text}
              </div>
            )}

            {/* ── Tab: Individual Form ── */}
            {(!importMode || importMode === "form") && (
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr 130px 110px 90px auto", gap: 10, alignItems: "end" }}>
                <div>
                  <label style={lbl}>Data</label>
                  <input type="date" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Fornecedor</label>
                  <input list="fornecedores-list" value={formData.fornecedor} onChange={e => setFormData({ ...formData, fornecedor: e.target.value })} style={inp} placeholder="Nome do fornecedor" />
                  <datalist id="fornecedores-list">{allFornecedores.map(f => <option key={f} value={f} />)}</datalist>
                </div>
                <div>
                  <label style={lbl}>Produto</label>
                  <input value={formData.produto} onChange={e => setFormData({ ...formData, produto: e.target.value })} style={inp} placeholder="Nome do produto" />
                </div>
                <div>
                  <label style={lbl}>Categoria</label>
                  <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} style={inp}>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Valor Unit.</label>
                  <input type="number" step="0.01" value={formData.valUnit} onChange={e => setFormData({ ...formData, valUnit: e.target.value })} style={inp} placeholder="0,00" />
                </div>
                <div>
                  <label style={lbl}>Qtd</label>
                  <input type="number" value={formData.qtd} onChange={e => setFormData({ ...formData, qtd: e.target.value })} style={inp} placeholder="0" />
                </div>
                <button onClick={addEntry} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", height: 36 }}>
                  Salvar
                </button>
              </div>
            )}

            {/* ── Tab: Bulk Paste ── */}
            {importMode === "bulk" && (
              <div>
                <div style={{ fontSize: 11, color: "#8c94a3", marginBottom: 8 }}>Cole linhas no formato: <span style={{ fontFamily: "monospace", color: "#60a5fa" }}>data;fornecedor;produto;categoria;valor_unit;qtd</span> (separado por ; ou TAB)</div>
                <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={6}
                  placeholder={"2026-05-12;Unifer;DISCO CORTE 115MM;Discos;1.99;30\n2026-05-12;Friluz;CABO 6MM;Elétrica;9.80;50"}
                  style={{ width: "100%", background: "#0c0f14", border: "1px solid #252b35", borderRadius: 8, padding: 12, color: "#e4e8ef", fontFamily: "monospace", fontSize: 12, resize: "vertical" }} />
                <button onClick={addBulk} style={{ marginTop: 10, padding: "8px 24px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  Importar Linhas
                </button>
              </div>
            )}

            {/* ── Tab: CSV Import (original format) ── */}
            {importMode === "csv" && (
              <div>
                {/* Instructions */}
                <div style={{ background: "#0c0f14", borderRadius: 8, padding: 16, marginBottom: 16, border: "1px solid #252b35" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#60a5fa" }}>📁 Importar CSV no formato original do sistema</div>
                  <div style={{ fontSize: 12, color: "#8c94a3", lineHeight: 1.7 }}>
                    Selecione o arquivo <span style={{ fontFamily: "monospace", color: "#f59e0b", background: "#1c2129", padding: "1px 6px", borderRadius: 3 }}>.csv</span> exportado no mesmo formato do pivot original. O sistema reconhece automaticamente:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                    {[
                      ["📅 Datas de compra", "dd/mm/aaaa"],
                      ["🧾 Notas fiscais", "NFe XXXXX-X"],
                      ["🏢 Fornecedores", "Nome completo"],
                      ["📦 Produtos", "Nome;Valor;Qtd;Total"],
                    ].map(([label, example], i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                        <span style={{ color: "#cbd5e1" }}>{label}</span>
                        <span style={{ fontFamily: "monospace", color: "#6b7280", fontSize: 10 }}>{example}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#f59e0b", marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    💡 A categoria é atribuída automaticamente com base no nome do produto (EPI, Elétrica, Discos, etc.)
                  </div>
                </div>

                {/* File input */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                  <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFileUpload}
                    style={{ display: "none" }} />
                  <button onClick={() => fileRef.current?.click()}
                    style={{ padding: "10px 24px", borderRadius: 8, border: "2px dashed #252b35", background: "#1c2129", color: "#60a5fa", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Selecionar arquivo CSV
                  </button>
                  {csvPreview && (
                    <span style={{ fontSize: 12, color: "#22c55e" }}>✓ {csvPreview.fileName}</span>
                  )}
                </div>

                {/* Preview table */}
                {csvPreview && csvPreview.entries.length > 0 && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Prévia — {csvPreview.entries.length} registros encontrados</span>
                      <span style={{ fontSize: 11, color: "#8c94a3" }}>
                        {_.uniq(csvPreview.entries.map(e => e.fornecedor)).length} fornecedor(es) · {formatBRL(_.sumBy(csvPreview.entries, e => e.valUnit * e.qtd))} total
                      </span>
                    </div>
                    <div style={{ maxHeight: 300, overflowY: "auto", borderRadius: 8, border: "1px solid #252b35" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                        <thead>
                          <tr style={{ background: "#1c2129", position: "sticky", top: 0 }}>
                            {["Data", "Fornecedor", "Produto", "Categoria", "Val.Unit", "Qtd", "Total"].map(h => (
                              <th key={h} style={{ padding: "8px 10px", textAlign: h === "Val.Unit" || h === "Qtd" || h === "Total" ? "right" : "left", fontSize: 10, color: "#8c94a3", textTransform: "uppercase", letterSpacing: 0.3, fontWeight: 500, borderBottom: "1px solid #252b35" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.entries.slice(0, 50).map((e, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #1c2129", background: i % 2 === 0 ? "transparent" : "#0e1117" }}>
                              <td style={{ padding: "6px 10px", whiteSpace: "nowrap" }}>{e.data}</td>
                              <td style={{ padding: "6px 10px", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.fornecedor}</td>
                              <td style={{ padding: "6px 10px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.produto}</td>
                              <td style={{ padding: "6px 10px" }}>
                                <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 600, background: (CAT_COLORS[e.categoria] || "#6b7280") + "22", color: CAT_COLORS[e.categoria] || "#6b7280" }}>{e.categoria}</span>
                              </td>
                              <td style={{ padding: "6px 10px", textAlign: "right", fontFamily: "monospace" }}>{formatBRL(e.valUnit)}</td>
                              <td style={{ padding: "6px 10px", textAlign: "right", fontFamily: "monospace" }}>{e.qtd}</td>
                              <td style={{ padding: "6px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{formatBRL(e.valUnit * e.qtd)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {csvPreview.entries.length > 50 && (
                        <div style={{ padding: 10, textAlign: "center", fontSize: 11, color: "#8c94a3" }}>
                          ... e mais {csvPreview.entries.length - 50} registros
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                      <button onClick={() => confirmImport("append")}
                        style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", flex: 1 }}>
                        ＋ Adicionar à base existente ({data.length} + {csvPreview.entries.length})
                      </button>
                      <button onClick={() => confirmImport("replace")}
                        style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #ef4444", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                        Substituir tudo
                      </button>
                      <button onClick={() => { setCsvPreview(null); setImportMsg(null); }}
                        style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #252b35", background: "#1c2129", color: "#8c94a3", fontSize: 13, cursor: "pointer" }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Empty state when no file loaded */}
                {!csvPreview && !importMsg && (
                  <div style={{ textAlign: "center", padding: "30px 20px", color: "#4a5568" }}>
                    <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>📄</div>
                    <div style={{ fontSize: 12 }}>Selecione o arquivo CSV para visualizar a prévia antes de importar</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── Filters ─── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "#8c94a3" }}>Filtrar:</div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inp, width: "auto", minWidth: 140 }}>
            <option value="Todas">Todas categorias</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterForn} onChange={e => setFilterForn(e.target.value)} style={{ ...inp, width: "auto", minWidth: 160 }}>
            <option value="Todos">Todos fornecedores</option>
            {allFornecedores.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* ═══════ RADAR VIEW ═══════ */}
        {view === "radar" && (
          <div>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
              <KPI label="Última Semana" value={lastWeek} detail={formatBRL(lastVol)} color="#3b82f6" />
              <KPI label="Variação Semanal" value={`${volChange >= 0 ? "+" : ""}${volChange.toFixed(1)}%`} detail={`vs ${prevWeek || "—"}`} color={volChange > 20 ? "#ef4444" : volChange < -20 ? "#22c55e" : "#f59e0b"} />
              <KPI label="Total Acumulado" value={formatBRL(_.sumBy(filtered, d => d.valUnit * d.qtd))} detail={`${filtered.length} linhas`} color="#a78bfa" />
              <KPI label="Alertas de Preço" value={priceVariations.filter(p => Math.abs(p.varPct) > 10).length.toString()} detail="variações > 10%" color="#ef4444" />
            </div>

            {/* Weekly Volume Chart */}
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📊 Volume Semanal de Compras</div>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={weeklyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252b35" />
                  <XAxis dataKey="semana" tick={{ fill: "#8c94a3", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#8c94a3", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Valor Total (R$)" radius={[4, 4, 0, 0]}>
                    {weeklyVolume.map((entry, i) => (
                      <Cell key={i} fill={entry.semana === lastWeek ? "#3b82f6" : "#1e3a5f"} />
                    ))}
                  </Bar>
                  <Line type="monotone" dataKey="Qtd Itens" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} yAxisId={0} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Alerts */}
            <div style={{ ...card, marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>⚠️ Alertas da Semana</div>
              {volChange > 30 && <AlertBadge type="critical">Volume da semana {lastWeek} subiu {volChange.toFixed(0)}% vs semana anterior — verificar pedidos de emergência ou compras não planejadas.</AlertBadge>}
              {volChange < -50 && <AlertBadge type="info">Volume da semana {lastWeek} caiu {Math.abs(volChange).toFixed(0)}% — verificar se houve atraso em entregas ou se é redução natural.</AlertBadge>}
              {priceVariations.filter(p => p.varPct > 10).map((p, i) => (
                <AlertBadge key={i} type="warning">
                  <strong>{p.produto}</strong> — preço subiu {p.varPct}% (de {formatBRL(p.first)} para {formatBRL(p.last)})
                </AlertBadge>
              ))}
              {priceVariations.filter(p => p.varPct > 10).length === 0 && volChange <= 30 && volChange >= -50 && (
                <AlertBadge type="info">Nenhum alerta crítico nesta semana. Variações dentro da faixa normal.</AlertBadge>
              )}
            </div>
          </div>
        )}

        {/* ═══════ PRICE VIEW ═══════ */}
        {view === "precos" && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📈 Variações de Preço por Produto (semana a semana)</div>
            {priceVariations.length === 0 ? (
              <div style={card}><div style={{ color: "#8c94a3", textAlign: "center", padding: 20 }}>Nenhuma variação encontrada com os filtros atuais.</div></div>
            ) : (
              priceVariations.map((pv, idx) => (
                <div key={idx} style={{ ...card, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{pv.produto}</div>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                      background: pv.varPct > 10 ? "rgba(239,68,68,0.15)" : pv.varPct < -5 ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                      color: pv.varPct > 10 ? "#ef4444" : pv.varPct < -5 ? "#22c55e" : "#f59e0b"
                    }}>
                      {pv.varPct > 0 ? "+" : ""}{pv.varPct}%
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={pv.semanas}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#252b35" />
                      <XAxis dataKey="semana" tick={{ fill: "#8c94a3", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#8c94a3", fontSize: 10 }} domain={["auto", "auto"]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="preco" name="Valor Unit. (R$)" stroke={pv.varPct > 10 ? "#ef4444" : pv.varPct < -5 ? "#22c55e" : "#f59e0b"} strokeWidth={2.5} dot={{ r: 4, fill: "#0c0f14", strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize: 11, color: "#8c94a3", marginTop: 4 }}>
                    {formatBRL(pv.first)} → {formatBRL(pv.last)} · {pv.semanas.length} registros semanais
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ═══════ CATEGORIES VIEW ═══════ */}
        {view === "categorias" && (
          <div>
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📦 Composição Semanal por Categoria</div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={catWeekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252b35" />
                  <XAxis dataKey="semana" tick={{ fill: "#8c94a3", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#8c94a3", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#8c94a3" }} />
                  {CATEGORIAS.map(cat => (
                    <Bar key={cat} dataKey={cat} stackId="a" fill={CAT_COLORS[cat]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category totals */}
            <div style={{ ...card, marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Totais por Categoria</div>
              {CATEGORIAS.map(cat => {
                const total = _.sumBy(data.filter(d => d.categoria === cat), d => d.valUnit * d.qtd);
                const grandTotal = _.sumBy(data, d => d.valUnit * d.qtd);
                const pct = grandTotal > 0 ? (total / grandTotal * 100) : 0;
                if (total === 0) return null;
                return (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: CAT_COLORS[cat], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, width: 130, color: "#cbd5e1" }}>{cat}</span>
                    <div style={{ flex: 1, height: 20, background: "#1c2129", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: CAT_COLORS[cat], borderRadius: 4, opacity: 0.8 }} />
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#8c94a3", width: 90, textAlign: "right" }}>{formatBRL(total)}</span>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", width: 45, textAlign: "right" }}>{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════ DATA TABLE VIEW ═══════ */}
        {view === "dados" && (
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>📋 Base de Dados ({filtered.length} registros)</div>
              <button onClick={() => {
                const csv = "Data;Semana;Fornecedor;Produto;Categoria;Valor Unit;Qtd;Valor Total\n" +
                  data.map(d => `${d.data};${d.semana};${d.fornecedor};${d.produto};${d.categoria};${d.valUnit};${d.qtd};${(d.valUnit*d.qtd).toFixed(2)}`).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "compras_obra.csv"; a.click();
              }} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #252b35", background: "#1c2129", color: "#60a5fa", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                Exportar CSV
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #252b35" }}>
                    {["Data", "Semana", "Fornecedor", "Produto", "Categoria", "Val. Unit.", "Qtd", "Total", ""].map(h => (
                      <th key={h} style={{ textAlign: h === "Val. Unit." || h === "Qtd" || h === "Total" ? "right" : "left", padding: "8px 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, color: "#8c94a3", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice().reverse().map((d, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1c2129" }}>
                      <td style={td}>{d.data}</td>
                      <td style={td}><span style={{ padding: "2px 8px", borderRadius: 4, background: "#1c2129", fontSize: 10 }}>{d.semana}</span></td>
                      <td style={td}>{d.fornecedor}</td>
                      <td style={{ ...td, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.produto}</td>
                      <td style={td}><span style={{ padding: "2px 8px", borderRadius: 4, background: CAT_COLORS[d.categoria] + "22", color: CAT_COLORS[d.categoria], fontSize: 10, fontWeight: 600 }}>{d.categoria}</span></td>
                      <td style={{ ...td, textAlign: "right", fontFamily: "monospace" }}>{formatBRL(d.valUnit)}</td>
                      <td style={{ ...td, textAlign: "right", fontFamily: "monospace" }}>{d.qtd}</td>
                      <td style={{ ...td, textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{formatBRL(d.valUnit * d.qtd)}</td>
                      <td style={td}>
                        <button onClick={() => { if (confirm("Remover este registro?")) saveData(data.filter((_, j) => j !== data.length - 1 - i)); }}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13, opacity: 0.5 }} title="Remover">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Styled helpers ───
const lbl = { display: "block", fontSize: 10, color: "#8c94a3", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 };
const inp = { width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #252b35", background: "#0c0f14", color: "#e4e8ef", fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: "none" };
const card = { background: "#151920", border: "1px solid #252b35", borderRadius: 12, padding: 20 };
const td = { padding: "8px 10px", verticalAlign: "middle" };

function KPI({ label, value, detail, color }) {
  return (
    <div style={{ background: "#151920", border: "1px solid #252b35", borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 10, color: "#8c94a3", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{detail}</div>
    </div>
  );
}
