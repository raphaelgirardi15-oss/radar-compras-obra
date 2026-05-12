import { useState, useEffect, useCallback, useRef } from "react";
import _ from "lodash";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ComposedChart } from "recharts";

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
const CAT_COLORS = {
  "EPI": "#22c55e", "Elétrica": "#a78bfa", "Discos": "#22d3ee", "Mat. Construção": "#3b82f6",
  "Alimentação": "#f97316", "Ferramentas": "#f59e0b", "Limpeza": "#ec4899", "Pintura": "#8b5cf6", "Outros": "#6b7280"
};
const STORAGE_KEY = "obra-compras-v4";

function getWeekLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return `S${Math.ceil(d.getDate() / 7)}-${["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][d.getMonth()]}`;
}
function formatBRL(v) { return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function sortWeeks(weeks) {
  const m = { Jan:1,Fev:2,Mar:3,Abr:4,Mai:5,Jun:6,Jul:7,Ago:8,Set:9,Out:10,Nov:11,Dez:12 };
  return _.sortBy(weeks, w => { const p = w.match(/S(\d+)-(\w+)/); return p ? (m[p[2]] || 0)*10+parseInt(p[1]) : 0; });
}
function autoCategory(prod) {
  const p = prod.toUpperCase();
  if (/BOTA|LUVA|OCULOS|CAPACETE|PROTETOR AUR|RESPIRADOR|ABAFADOR|CARNEIRA|JUGULAR|CAPA CHUVA|TOUCA|CINTO SEG|TALABARTE|COLETE REFLET/.test(p)) return "EPI";
  if (/DISCO/.test(p)) return "Discos";
  if (/CABO|CONECTOR|FITA ISOLANTE|HASTE TERRA|CORDOALHA|GRAMPO|CAIXA ATERR|ESTABILIZADOR|REFLETOR|ELETRODUTO|BARRAMENTO|CAIXA LUZ|PLUGUE|TOMADA|PLACA 4X2|ABRACADEIRA|DISJUNTOR|CHAVE|INTERRUPTOR|ARMACAO SEC/.test(p)) return "Elétrica";
  if (/CAVADEIRA|ESQUADRO|PRUMO|PONTEIRO|TALHADEIRA|DESEMPENADEIRA|TRENA|LAPIS CARP|SERRA CIRC|PONTEIRA/.test(p)) return "Ferramentas";
  if (/REFEIC|GUARAVITA|MARMITA/.test(p)) return "Alimentação";
  if (/CLORO|DESINF|PAPEL HIG|ESPONJA|DETERGENTE|PANO|SABAO|SACO DE LIXO|SABONETE|DISPENSER|LIXEIRA/.test(p)) return "Limpeza";
  if (/ROLO PINTURA|THINNER|TRINCHA|TINTA/.test(p)) return "Pintura";
  if (/MADEIRITE|MADEIRA|FECHO|TUBO IND|MANGUEIRA|MASSA|TELA TAPUME|PROTETOR VERGALHAO|FITA ZEBRADA|ELETRODO|CADEADO|CIMENTO|AREIA|BRITA|COLUNA ACO|CHAPA|ESCORA|TABUA|PINUS|LONA|ESPADADOR|GUIA SUPORTE/.test(p)) return "Mat. Construção";
  return "Outros";
}

// ─── CSV Parsers ───
function parseCSVLine(line) {
  // Proper CSV parsing handling quoted fields with commas
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ""; }
    else if (ch === ';' && !inQuotes) { result.push(current.trim()); current = ""; }
    else { current += ch; }
  }
  result.push(current.trim());
  return result;
}

function parseBRNumber(str) {
  if (!str) return NaN;
  return parseFloat(str.replace(/\./g, "").replace(",", "."));
}

function parseOriginalCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().split("\n");
  const entries = [];
  let currentDate = null, currentForn = null;

  // Detect separator: if first data line uses ; it's semicolon format
  const isSemicolon = lines.some(l => /^\d{2}\/\d{2}\/\d{4};;;;?$/.test(l.trim()));
  const isComma = lines.some(l => /^\d{2}\/\d{2}\/\d{4},,,\s*$/.test(l.trim()));

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || /^(Data da compra|C.digo|Fornecedor|Nome do produto|Total geral)/i.test(line)) continue;

    // Date line
    const dateMatch = line.match(/^(\d{2}\/\d{2}\/\d{4})\s*[;,]*\s*$/);
    if (dateMatch) {
      const p = dateMatch[1].split("/");
      currentDate = `${p[2]}-${p[1]}-${p[0]}`;
      continue;
    }

    // NFe line
    const stripped = isComma ? line.replace(/,+$/, "").trim() : line.replace(/;+$/, "").trim();
    if (/^NFe\s+/i.test(stripped)) continue;

    // Fornecedor line
    if ((isComma && line.endsWith(",,,")) || (isSemicolon && line.endsWith(";;;;"))) {
      currentForn = stripped;
      continue;
    }
    // Also catch fornecedor lines without trailing separators
    if (stripped && !stripped.includes(",") && !stripped.includes(";") && !/^\d{2}\/\d{2}\/\d{4}$/.test(stripped) && !/^NFe/i.test(stripped)) {
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
      if (nextLine && /\d/.test(nextLine) && (nextLine.includes(",") || nextLine.includes(";"))) {
        currentForn = stripped;
        continue;
      }
    }

    // Product line
    const parts = parseCSVLine(line);
    // We need at least 4 fields: name, val_unit, qty, val_bruto
    if (parts.length >= 4) {
      const vu = parseBRNumber(parts[parts.length - 3]);
      const qt = parseBRNumber(parts[parts.length - 2]);
      const vb = parseBRNumber(parts[parts.length - 1]);
      if (!isNaN(vu) && !isNaN(qt) && !isNaN(vb) && vu > 0 && qt > 0) {
        const prodName = parts.slice(0, parts.length - 3).join(" ").trim() || parts[0].trim();
        if (prodName && currentDate) {
          entries.push({
            data: currentDate,
            semana: getWeekLabel(currentDate),
            fornecedor: currentForn || "Não identificado",
            produto: prodName,
            categoria: autoCategory(prodName),
            valUnit: vu,
            qtd: Math.round(qt),
          });
        }
      }
    }
  }
  return entries;
}

// ─── Price increase detector (>10% in <90 days) ───
function detectPriceIncreases(data) {
  const prodData = {};
  data.forEach(d => {
    if (!prodData[d.produto]) prodData[d.produto] = [];
    prodData[d.produto].push({ data: d.data, preco: d.valUnit, fornecedor: d.fornecedor });
  });

  const alerts = [];
  Object.entries(prodData).forEach(([prod, entries]) => {
    const sorted = _.sortBy(entries, "data");
    const uniquePrices = [];
    sorted.forEach(e => {
      if (!uniquePrices.length || uniquePrices[uniquePrices.length - 1].preco !== e.preco)
        uniquePrices.push(e);
    });
    if (uniquePrices.length < 2) return;
    for (let j = 0; j < uniquePrices.length - 1; j++) {
      const a = uniquePrices[j], b = uniquePrices[j + 1];
      if (a.preco === 0) continue;
      const varPct = ((b.preco - a.preco) / a.preco) * 100;
      const days = Math.round((new Date(b.data) - new Date(a.data)) / 86400000);
      if (varPct > 10 && days < 90 && days > 0) {
        alerts.push({ produto: prod, de: a.preco, para: b.preco, varPct: Math.round(varPct * 10) / 10, dias: days, dataInicio: a.data, dataFim: b.data, fornecedor: b.fornecedor });
      }
    }
  });
  return _.orderBy(alerts, "varPct", "desc");
}

// ─── Shared Components ───
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

function KPI({ label, value, detail, color }) {
  return (
    <div style={{ background: "#151920", border: "1px solid #252b35", borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 10, color: "#8c94a3", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{detail}</div>
    </div>
  );
}

function AlertBadge({ type, children }) {
  const s = { critical: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "#ef4444" }, warning: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "#f59e0b" }, info: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "#3b82f6" } }[type] || { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "#3b82f6" };
  return <div style={{ background: s.bg, borderLeft: `3px solid ${s.border}`, borderRadius: 6, padding: "10px 14px", marginBottom: 8, fontSize: 12.5, lineHeight: 1.6, color: s.color }}>{children}</div>;
}

const lbl = { display: "block", fontSize: 10, color: "#8c94a3", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 };
const inp = { width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #252b35", background: "#0c0f14", color: "#e4e8ef", fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: "none" };
const card = { background: "#151920", border: "1px solid #252b35", borderRadius: 12, padding: 20 };

// ════════════════════════════════════════════
//  ANÁLISE DE COMPRAS — Dashboard Executivo
// ════════════════════════════════════════════
function AnaliseCompras({ data }) {
  const total = _.sumBy(data, d => d.valUnit * d.qtd);
  const fornecedores = _.uniq(data.map(d => d.fornecedor));
  const nForn = fornecedores.length;

  // Fornecedor ranking
  const fornRank = _.orderBy(
    Object.entries(_.groupBy(data, "fornecedor")).map(([f, items]) => ({
      nome: f, total: _.sumBy(items, d => d.valUnit * d.qtd), qtd: items.length
    })), "total", "desc"
  );
  const topFornPct = fornRank[0] ? (fornRank[0].total / total * 100).toFixed(1) : "0";

  // Category breakdown
  const catBreak = _.orderBy(
    Object.entries(_.groupBy(data, "categoria")).map(([c, items]) => ({
      cat: c, total: _.sumBy(items, d => d.valUnit * d.qtd), pct: (_.sumBy(items, d => d.valUnit * d.qtd) / total * 100)
    })), "total", "desc"
  );

  // Monthly
  const monthly = _.orderBy(
    Object.entries(_.groupBy(data, d => d.data.slice(0, 7))).map(([m, items]) => ({
      mes: m, label: ["","Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][parseInt(m.slice(5))],
      total: _.sumBy(items, d => d.valUnit * d.qtd)
    })), "mes"
  );
  const maxMonth = _.maxBy(monthly, "total")?.total || 1;

  // Top products
  const topProds = _.orderBy(
    Object.entries(_.groupBy(data, "produto")).map(([p, items]) => ({
      produto: p, total: _.sumBy(items, d => d.valUnit * d.qtd), qtd: _.sumBy(items, "qtd")
    })), "total", "desc"
  ).slice(0, 10);

  // Anomalies
  const priceAnomalies = [];
  Object.entries(_.groupBy(data, "produto")).forEach(([prod, items]) => {
    const prices = _.uniq(items.map(d => d.valUnit));
    if (prices.length > 1) {
      const min = _.min(prices), max = _.max(prices);
      const varPct = ((max - min) / min * 100);
      if (varPct > 8) priceAnomalies.push({ produto: prod, min, max, varPct, items });
    }
  });
  priceAnomalies.sort((a, b) => b.varPct - a.varPct);

  const barColors = ["#3b82f6", "#f97316", "#22c55e", "#a78bfa", "#22d3ee", "#ec4899", "#6b7280"];
  const monthColors = { 1: "#60a5fa", 2: "#ef4444", 3: "#60a5fa", 4: "#f59e0b", 5: "#22c55e", 6: "#3b82f6", 7: "#a78bfa", 8: "#f97316", 9: "#22d3ee", 10: "#ec4899", 11: "#6b7280", 12: "#ef4444" };

  return (
    <div className="print-area" style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
        <KPI label="Total Comprado" value={formatBRL(total)} detail="Valor bruto acumulado" color="#60a5fa" />
        <KPI label="Fornecedores" value={nForn.toString()} detail={`${topFornPct}% concentrado em 1`} color="#e4e8ef" />
        <KPI label="Registros" value={data.length.toString()} detail={`Média ${formatBRL(total / Math.max(data.length, 1))}/item`} color="#e4e8ef" />
        <KPI label="Anomalias" value={priceAnomalies.length.toString()} detail="Variações de preço > 8%" color="#ef4444" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Fornecedores */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🏢 Volume por Fornecedor</div>
          {fornRank.slice(0, 7).map((f, i) => {
            const pct = f.total / total * 100;
            return (
              <div key={f.nome} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 11, width: 150, minWidth: 150, textAlign: "right", color: "#8c94a3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.nome}</span>
                <div style={{ flex: 1, height: 24, background: "#1c2129", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: barColors[i], display: "flex", alignItems: "center", paddingLeft: 8, fontSize: 10, fontFamily: "monospace", color: "#fff", minWidth: "fit-content" }}>{formatBRL(f.total)}</div>
                </div>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", width: 45, textAlign: "right" }}>{pct.toFixed(1)}%</span>
              </div>
            );
          })}
          {/* Concentration bar */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>CONCENTRAÇÃO (top 3 = {(fornRank.slice(0, 3).reduce((s, f) => s + f.total, 0) / total * 100).toFixed(1)}%)</div>
            <div style={{ display: "flex", height: 20, borderRadius: 5, overflow: "hidden" }}>
              {fornRank.slice(0, 5).map((f, i) => (
                <div key={f.nome} style={{ width: `${f.total / total * 100}%`, background: barColors[i] }} title={`${f.nome} ${(f.total / total * 100).toFixed(1)}%`} />
              ))}
              <div style={{ flex: 1, background: "#252b35" }} />
            </div>
          </div>
        </div>

        {/* Categorias */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📦 Distribuição por Categoria</div>
          {catBreak.map(c => (
            <div key={c.cat} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: CAT_COLORS[c.cat] || "#6b7280", flexShrink: 0 }} />
              <span style={{ fontSize: 12, width: 130, color: "#cbd5e1" }}>{c.cat}</span>
              <div style={{ flex: 1, height: 18, background: "#1c2129", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${c.pct}%`, height: "100%", background: CAT_COLORS[c.cat] || "#6b7280", borderRadius: 4, opacity: 0.8 }} />
              </div>
              <span style={{ fontSize: 10, fontFamily: "monospace", color: "#8c94a3", width: 80, textAlign: "right" }}>{formatBRL(c.total)}</span>
              <span style={{ fontSize: 10, fontFamily: "monospace", color: "#6b7280", width: 40, textAlign: "right" }}>{c.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evolução Mensal */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📈 Evolução Mensal de Gastos</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160, paddingTop: 10 }}>
          {monthly.map(m => {
            const h = (m.total / maxMonth) * 130;
            const monthNum = parseInt(m.mes.slice(5));
            return (
              <div key={m.mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: "#8c94a3", marginBottom: 4 }}>{formatBRL(m.total)}</div>
                <div style={{ width: "100%", maxWidth: 56, height: h, borderRadius: "6px 6px 0 0", background: `linear-gradient(180deg, ${monthColors[monthNum] || "#3b82f6"}, ${monthColors[monthNum] || "#3b82f6"}cc)` }} />
                <div style={{ fontSize: 12, color: "#8c94a3", marginTop: 8, fontWeight: 500 }}>{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Top Produtos */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🏆 Top 10 Produtos</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ borderBottom: "1px solid #252b35" }}>
              <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, color: "#8c94a3", fontWeight: 500 }}>PRODUTO</th>
              <th style={{ textAlign: "right", padding: "6px 8px", fontSize: 10, color: "#8c94a3", fontWeight: 500 }}>QTD</th>
              <th style={{ textAlign: "right", padding: "6px 8px", fontSize: 10, color: "#8c94a3", fontWeight: 500 }}>TOTAL</th>
            </tr></thead>
            <tbody>{topProds.map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1c2129" }}>
                <td style={{ padding: "7px 8px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.produto}</td>
                <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: "monospace" }}>{p.qtd}</td>
                <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{formatBRL(p.total)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* Anomalias */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>⚠️ Anomalias Identificadas</div>
          {priceAnomalies.slice(0, 5).map((a, i) => (
            <AlertBadge key={i} type={a.varPct > 30 ? "critical" : "warning"}>
              <strong>{a.produto}</strong> — variação de {a.varPct.toFixed(0)}%<br/>
              <span style={{ fontSize: 11, opacity: 0.8 }}>De {formatBRL(a.min)} para {formatBRL(a.max)}</span>
            </AlertBadge>
          ))}
          {fornRank[0] && parseFloat(topFornPct) > 40 && (
            <AlertBadge type="info">
              <strong>Alta concentração</strong> — {topFornPct}% das compras em {fornRank[0].nome}. Sem cotações alternativas, não há referência de mercado.
            </AlertBadge>
          )}
        </div>
      </div>

      {/* Aumentos >10% em <3 meses */}
      {(() => {
        const increases = detectPriceIncreases(data);
        if (increases.length === 0) return null;
        return (
          <div style={{ ...card, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>🔺 Produtos com Aumento &gt;10% em Menos de 3 Meses</div>
            <div style={{ fontSize: 11, color: "#8c94a3", marginBottom: 14 }}>Monitoramento de reajustes acelerados — produtos cujo valor unitário subiu mais de 10% em menos de 90 dias</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ borderBottom: "1px solid #252b35" }}>
                  {["Produto", "Fornecedor", "Preço Inicial", "Preço Atual", "Variação", "Período", "Dias"].map(h => (
                    <th key={h} style={{ textAlign: h === "Variação" || h === "Dias" ? "center" : h.includes("Preço") ? "right" : "left", padding: "8px 10px", fontSize: 10, color: "#8c94a3", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.3 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{increases.map((a, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1c2129", background: i % 2 === 0 ? "transparent" : "#0e1117" }}>
                    <td style={{ padding: "8px 10px", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.produto}</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: "#8c94a3", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.fornecedor}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace" }}>{formatBRL(a.de)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{formatBRL(a.para)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center" }}>
                      <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: "monospace", background: a.varPct > 30 ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)", color: a.varPct > 30 ? "#ef4444" : "#f59e0b" }}>+{a.varPct}%</span>
                    </td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: "#8c94a3", whiteSpace: "nowrap" }}>{a.dataInicio.slice(5)} → {a.dataFim.slice(5)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontSize: 11 }}>{a.dias}d</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* Recomendações */}
      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>💡 Recomendações de Melhoria na Gestão</div>
        {[
          { t: "Política de cotação mínima tripla", d: `Exigir ao menos 3 cotações para compras acima de R$ 500. ${fornRank[0]?.nome || "O principal fornecedor"} concentra ${topFornPct}% sem concorrência visível. Potencial de economia: 10-15%.` },
          { t: "Contrato fechado para alimentação", d: "Negociar contrato mensal fixo com valor/refeição travado e relatório mensal de quantitativos por dia." },
          { t: "Tabela de preços de referência", d: "Criar planilha com preço-base de cada item recorrente. Qualquer compra acima do preço-base deve ter justificativa." },
          { t: "Compras consolidadas por período", d: "Consolidar pedidos quinzenais reduz frete, ganha desconto por volume e reduz trabalho administrativo." },
          { t: "Controle de EPIs por colaborador", d: "Implantar ficha de entrega individual por funcionário para rastrear consumo e evitar duplicidades." },
          { t: "Classificação por centro de custo", d: "Separar compras por etapa da obra (fundação, estrutura, instalações) para comparar custo real vs orçado." },
        ].map((r, i) => (
          <div key={i} style={{ background: "#1c2129", borderRadius: 8, padding: "12px 16px", marginBottom: 8, display: "flex", gap: 10, fontSize: 12.5, lineHeight: 1.6 }}>
            <span style={{ background: "#3b82f6", color: "#fff", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <div><strong>{r.t}:</strong> {r.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  RADAR SEMANAL — Operacional
// ════════════════════════════════════════════
function RadarSemanal({ data, saveData }) {
  const [radarView, setRadarView] = useState("radar");
  const [showForm, setShowForm] = useState(false);
  const [importMode, setImportMode] = useState(null);
  const [filterCat, setFilterCat] = useState("Todas");
  const [filterForn, setFilterForn] = useState("Todos");
  const [selectedWeek, setSelectedWeek] = useState(null); // null = última semana
  const [formData, setFormData] = useState({ data: new Date().toISOString().slice(0, 10), fornecedor: "", produto: "", categoria: "EPI", valUnit: "", qtd: "" });
  const [bulkText, setBulkText] = useState("");
  const [csvPreview, setCsvPreview] = useState(null);
  const [importMsg, setImportMsg] = useState(null);
  const fileRef = useRef();

  const addEntry = () => {
    if (!formData.data || !formData.fornecedor || !formData.produto || !formData.valUnit || !formData.qtd) return;
    const entry = { ...formData, valUnit: parseFloat(formData.valUnit), qtd: parseInt(formData.qtd), semana: getWeekLabel(formData.data) };
    saveData([...data, entry]);
    setFormData({ data: formData.data, fornecedor: "", produto: "", categoria: "EPI", valUnit: "", qtd: "" });
  };

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
    if (newEntries.length > 0) { saveData([...data, ...newEntries]); setBulkText(""); }
  };

  // Uses the shared parseOriginalCSV (handles both ; and , formats)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setImportMsg(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const entries = parseOriginalCSV(ev.target.result);
        if (entries.length === 0) { setImportMsg({ type: "error", text: "Nenhum registro encontrado. Verifique o formato." }); setCsvPreview(null); }
        else { setCsvPreview({ entries, fileName: file.name }); setImportMsg({ type: "success", text: `${entries.length} registros identificados.` }); }
      } catch (err) { setImportMsg({ type: "error", text: `Erro: ${err.message}` }); }
    };
    reader.readAsText(file, "utf-8");
    e.target.value = "";
  };

  const confirmImport = (mode) => {
    if (!csvPreview) return;
    const ne = csvPreview.entries;
    if (mode === "replace") { saveData(ne); setImportMsg({ type: "success", text: `Base substituída com ${ne.length} registros.` }); }
    else { saveData([...data, ...ne]); setImportMsg({ type: "success", text: `${ne.length} registros adicionados. Total: ${data.length + ne.length}.` }); }
    setCsvPreview(null); setTimeout(() => setImportMsg(null), 4000);
  };

  const filtered = data.filter(d => (filterCat === "Todas" || d.categoria === filterCat) && (filterForn === "Todos" || d.fornecedor === filterForn));
  const allWeeks = sortWeeks(_.uniq(data.map(d => d.semana)));
  const allFornecedores = _.sortBy(_.uniq(data.map(d => d.fornecedor)));

  const weeklyVolume = allWeeks.map(w => {
    const items = filtered.filter(d => d.semana === w);
    return { semana: w, "Valor Total (R$)": Math.round(_.sumBy(items, d => d.valUnit * d.qtd) * 100) / 100, "Qtd Itens": _.sumBy(items, "qtd") };
  });

  // Price variations
  const prodWeekPrices = {};
  data.forEach(d => { if (!prodWeekPrices[d.produto]) prodWeekPrices[d.produto] = {}; if (!prodWeekPrices[d.produto][d.semana]) prodWeekPrices[d.produto][d.semana] = []; prodWeekPrices[d.produto][d.semana].push(d.valUnit); });
  const priceVariations = [];
  Object.entries(prodWeekPrices).forEach(([prod, weeks]) => {
    const wk = Object.keys(weeks); if (wk.length < 2) return;
    const sorted = _.sortBy(wk.map(w => ({ semana: w, preco: _.mean(weeks[w]) })), a => allWeeks.indexOf(a.semana));
    const first = sorted[0].preco, last = sorted[sorted.length - 1].preco;
    const varPct = ((last - first) / first) * 100;
    if (Math.abs(varPct) > 0.5) priceVariations.push({ produto: prod, semanas: sorted, varPct: Math.round(varPct * 10) / 10, first, last });
  });
  priceVariations.sort((a, b) => Math.abs(b.varPct) - Math.abs(a.varPct));

  // Week selection logic
  const activeWeek = selectedWeek || allWeeks[allWeeks.length - 1] || "";
  const activeIdx = allWeeks.indexOf(activeWeek);
  const prevWeekLabel = activeIdx > 0 ? allWeeks[activeIdx - 1] : null;
  const activeVol = weeklyVolume.find(w => w.semana === activeWeek)?.["Valor Total (R$)"] || 0;
  const prevVol = prevWeekLabel ? (weeklyVolume.find(w => w.semana === prevWeekLabel)?.["Valor Total (R$)"] || 0) : 0;
  const volChange = prevVol > 0 ? ((activeVol - prevVol) / prevVol * 100) : 0;

  // Items in the active week
  const weekItems = filtered.filter(d => d.semana === activeWeek);
  const weekByForn = _.orderBy(Object.entries(_.groupBy(weekItems, "fornecedor")).map(([f, items]) => ({ fornecedor: f, total: _.sumBy(items, d => d.valUnit * d.qtd), itens: items.length })), "total", "desc");
  const weekByCat = _.orderBy(Object.entries(_.groupBy(weekItems, "categoria")).map(([c, items]) => ({ cat: c, total: _.sumBy(items, d => d.valUnit * d.qtd) })), "total", "desc");

  const catWeekly = allWeeks.map(w => {
    const row = { semana: w };
    CATEGORIAS.forEach(cat => { row[cat] = Math.round(_.sumBy(data.filter(d => d.semana === w && d.categoria === cat), d => d.valUnit * d.qtd) * 100) / 100; });
    return row;
  });

  return (
    <div style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ k: "radar", l: "📊 Radar" }, { k: "precos", l: "📈 Preços" }, { k: "categorias", l: "📦 Categorias" }, { k: "dados", l: "📋 Dados" }].map(v => (
            <button key={v.k} onClick={() => setRadarView(v.k)}
              style={{ padding: "6px 14px", borderRadius: 8, border: radarView === v.k ? "1px solid #3b82f6" : "1px solid #252b35", background: radarView === v.k ? "rgba(59,130,246,0.15)" : "#1c2129", color: radarView === v.k ? "#60a5fa" : "#8c94a3", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{v.l}</button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Novo Registro</button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ ...card, marginBottom: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 4, background: "#0c0f14", borderRadius: 8, padding: 3 }}>
              {[{ k: "form", l: "✏️ Individual" }, { k: "bulk", l: "📋 Lote" }, { k: "csv", l: "📁 Importar CSV" }].map(t => (
                <button key={t.k} onClick={() => { setImportMode(t.k); setImportMsg(null); setCsvPreview(null); }}
                  style={{ padding: "6px 14px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", background: (importMode || "form") === t.k ? "#252b35" : "transparent", color: (importMode || "form") === t.k ? "#e4e8ef" : "#6b7280" }}>{t.l}</button>
              ))}
            </div>
            <button onClick={() => { if (confirm("Resetar para dados originais?")) saveData(SEED_DATA); }} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, border: "1px solid #252b35", background: "#1c2129", color: "#ef4444", cursor: "pointer" }}>Resetar</button>
          </div>

          {importMsg && <div style={{ padding: "8px 14px", borderRadius: 6, marginBottom: 12, fontSize: 12, fontWeight: 500, background: importMsg.type === "error" ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)", color: importMsg.type === "error" ? "#ef4444" : "#22c55e", borderLeft: `3px solid ${importMsg.type === "error" ? "#ef4444" : "#22c55e"}` }}>{importMsg.text}</div>}

          {(!importMode || importMode === "form") && (
            <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 1fr 120px 100px 80px auto", gap: 10, alignItems: "end" }}>
              <div><label style={lbl}>Data</label><input type="date" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} style={inp} /></div>
              <div><label style={lbl}>Fornecedor</label><input list="forn-list" value={formData.fornecedor} onChange={e => setFormData({ ...formData, fornecedor: e.target.value })} style={inp} placeholder="Fornecedor" /><datalist id="forn-list">{allFornecedores.map(f => <option key={f} value={f} />)}</datalist></div>
              <div><label style={lbl}>Produto</label><input value={formData.produto} onChange={e => setFormData({ ...formData, produto: e.target.value })} style={inp} placeholder="Produto" /></div>
              <div><label style={lbl}>Categoria</label><select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} style={inp}>{CATEGORIAS.map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label style={lbl}>Val. Unit.</label><input type="number" step="0.01" value={formData.valUnit} onChange={e => setFormData({ ...formData, valUnit: e.target.value })} style={inp} placeholder="0,00" /></div>
              <div><label style={lbl}>Qtd</label><input type="number" value={formData.qtd} onChange={e => setFormData({ ...formData, qtd: e.target.value })} style={inp} placeholder="0" /></div>
              <button onClick={addEntry} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", height: 36 }}>Salvar</button>
            </div>
          )}
          {importMode === "bulk" && (
            <div>
              <div style={{ fontSize: 11, color: "#8c94a3", marginBottom: 8 }}>Formato: <span style={{ fontFamily: "monospace", color: "#60a5fa" }}>data;fornecedor;produto;categoria;valor_unit;qtd</span></div>
              <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={5} placeholder="2026-05-12;Unifer;DISCO CORTE;Discos;1.99;30" style={{ width: "100%", background: "#0c0f14", border: "1px solid #252b35", borderRadius: 8, padding: 12, color: "#e4e8ef", fontFamily: "monospace", fontSize: 12, resize: "vertical" }} />
              <button onClick={addBulk} style={{ marginTop: 8, padding: "8px 24px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Importar</button>
            </div>
          )}
          {importMode === "csv" && (
            <div>
              <div style={{ background: "#0c0f14", borderRadius: 8, padding: 14, marginBottom: 14, border: "1px solid #252b35" }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#60a5fa" }}>📁 Importar CSV no formato original do sistema</div>
                <div style={{ fontSize: 11, color: "#8c94a3" }}>Selecione o .csv exportado — o sistema reconhece datas, NFs, fornecedores e produtos automaticamente. Categorias atribuídas por palavras-chave.</div>
              </div>
              <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ display: "none" }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <button onClick={() => fileRef.current?.click()} style={{ padding: "10px 24px", borderRadius: 8, border: "2px dashed #252b35", background: "#1c2129", color: "#60a5fa", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📄 Selecionar arquivo CSV</button>
                {csvPreview && <span style={{ fontSize: 12, color: "#22c55e" }}>✓ {csvPreview.fileName}</span>}
              </div>
              {csvPreview && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Prévia — {csvPreview.entries.length} registros · {formatBRL(_.sumBy(csvPreview.entries, e => e.valUnit * e.qtd))}</div>
                  <div style={{ maxHeight: 250, overflowY: "auto", borderRadius: 8, border: "1px solid #252b35", marginBottom: 12 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <thead><tr style={{ background: "#1c2129", position: "sticky", top: 0 }}>
                        {["Data", "Fornecedor", "Produto", "Cat.", "Val.Un.", "Qtd"].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: "left", fontSize: 10, color: "#8c94a3", fontWeight: 500, borderBottom: "1px solid #252b35" }}>{h}</th>)}
                      </tr></thead>
                      <tbody>{csvPreview.entries.slice(0, 30).map((e, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #1c2129" }}>
                          <td style={{ padding: "5px 8px" }}>{e.data}</td>
                          <td style={{ padding: "5px 8px", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.fornecedor}</td>
                          <td style={{ padding: "5px 8px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.produto}</td>
                          <td style={{ padding: "5px 8px" }}><span style={{ padding: "1px 5px", borderRadius: 3, fontSize: 9, fontWeight: 600, background: (CAT_COLORS[e.categoria] || "#6b7280") + "22", color: CAT_COLORS[e.categoria] || "#6b7280" }}>{e.categoria}</span></td>
                          <td style={{ padding: "5px 8px", fontFamily: "monospace" }}>{formatBRL(e.valUnit)}</td>
                          <td style={{ padding: "5px 8px", fontFamily: "monospace" }}>{e.qtd}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => confirmImport("append")} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>＋ Adicionar à base</button>
                    <button onClick={() => confirmImport("replace")} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #ef4444", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Substituir</button>
                    <button onClick={() => setCsvPreview(null)} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #252b35", background: "#1c2129", color: "#8c94a3", fontSize: 12, cursor: "pointer" }}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#8c94a3" }}>Filtrar:</span>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inp, width: "auto", minWidth: 130 }}><option value="Todas">Todas categorias</option>{CATEGORIAS.map(c => <option key={c}>{c}</option>)}</select>
        <select value={filterForn} onChange={e => setFilterForn(e.target.value)} style={{ ...inp, width: "auto", minWidth: 150 }}><option value="Todos">Todos fornecedores</option>{allFornecedores.map(f => <option key={f}>{f}</option>)}</select>
        {radarView === "radar" && <>
          <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>|</span>
          <span style={{ fontSize: 12, color: "#8c94a3" }}>Semana:</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => { const idx = allWeeks.indexOf(activeWeek); if (idx > 0) setSelectedWeek(allWeeks[idx - 1]); }} disabled={activeIdx <= 0}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #252b35", background: "#1c2129", color: activeIdx > 0 ? "#60a5fa" : "#3a3f4a", fontSize: 14, cursor: activeIdx > 0 ? "pointer" : "default" }}>◀</button>
            <select value={activeWeek} onChange={e => setSelectedWeek(e.target.value)} style={{ ...inp, width: "auto", minWidth: 100, textAlign: "center", fontWeight: 600 }}>
              {allWeeks.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <button onClick={() => { const idx = allWeeks.indexOf(activeWeek); if (idx < allWeeks.length - 1) setSelectedWeek(allWeeks[idx + 1]); }} disabled={activeIdx >= allWeeks.length - 1}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #252b35", background: "#1c2129", color: activeIdx < allWeeks.length - 1 ? "#60a5fa" : "#3a3f4a", fontSize: 14, cursor: activeIdx < allWeeks.length - 1 ? "pointer" : "default" }}>▶</button>
          </div>
        </>}
      </div>

      {/* Radar */}
      {radarView === "radar" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 16 }}>
            <KPI label="Semana Selecionada" value={activeWeek || "—"} detail={formatBRL(activeVol)} color="#3b82f6" />
            <KPI label="Variação vs Anterior" value={`${volChange >= 0 ? "+" : ""}${volChange.toFixed(1)}%`} detail={`vs ${prevWeekLabel || "—"}`} color={volChange > 20 ? "#ef4444" : volChange < -20 ? "#22c55e" : "#f59e0b"} />
            <KPI label="Itens na Semana" value={weekItems.length.toString()} detail={`${weekByForn.length} fornecedor(es)`} color="#a78bfa" />
            <KPI label="Total Acumulado" value={formatBRL(_.sumBy(filtered, d => d.valUnit * d.qtd))} detail={`${filtered.length} linhas`} color="#22c55e" />
          </div>

          {/* Weekly chart */}
          <div style={card}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📊 Volume Semanal de Compras <span style={{ fontSize: 11, fontWeight: 400, color: "#8c94a3" }}>— clique na barra para selecionar</span></div>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={weeklyVolume} onClick={(e) => { if (e?.activeLabel) setSelectedWeek(e.activeLabel); }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252b35" />
                <XAxis dataKey="semana" tick={{ fill: "#8c94a3", fontSize: 10 }} />
                <YAxis tick={{ fill: "#8c94a3", fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Valor Total (R$)" radius={[4, 4, 0, 0]} style={{ cursor: "pointer" }}>{weeklyVolume.map((e, i) => <Cell key={i} fill={e.semana === activeWeek ? "#3b82f6" : "#1e3a5f"} />)}</Bar>
                <Line type="monotone" dataKey="Qtd Itens" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Week detail panel */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📋 Detalhes da Semana {activeWeek}</div>
              {weekItems.length === 0 ? <div style={{ color: "#6b7280", fontSize: 12 }}>Sem compras nesta semana.</div> : (
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                    <thead><tr style={{ borderBottom: "1px solid #252b35" }}>
                      {["Fornecedor", "Produto", "Val.Un.", "Qtd", "Total"].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: h.includes("Val") || h === "Qtd" || h === "Total" ? "right" : "left", fontSize: 10, color: "#8c94a3", fontWeight: 500 }}>{h}</th>)}
                    </tr></thead>
                    <tbody>{weekItems.map((d, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #1c2129" }}>
                        <td style={{ padding: "5px 8px", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#8c94a3" }}>{d.fornecedor}</td>
                        <td style={{ padding: "5px 8px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.produto}</td>
                        <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: "monospace" }}>{formatBRL(d.valUnit)}</td>
                        <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: "monospace" }}>{d.qtd}</td>
                        <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{formatBRL(d.valUnit * d.qtd)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⚠️ Alertas</div>
              {volChange > 30 && <AlertBadge type="critical">Volume de {activeWeek} subiu {volChange.toFixed(0)}% vs semana anterior.</AlertBadge>}
              {volChange < -50 && <AlertBadge type="info">Volume de {activeWeek} caiu {Math.abs(volChange).toFixed(0)}% vs anterior.</AlertBadge>}
              {priceVariations.filter(p => p.varPct > 10).slice(0, 5).map((p, i) => <AlertBadge key={i} type="warning"><strong>{p.produto}</strong> — preço subiu {p.varPct}% ({formatBRL(p.first)} → {formatBRL(p.last)})</AlertBadge>)}
              {priceVariations.filter(p => p.varPct > 10).length === 0 && volChange <= 30 && volChange >= -50 && <AlertBadge type="info">Sem alertas críticos. Variações dentro da faixa normal.</AlertBadge>}
              {weekByForn.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: "#8c94a3", marginBottom: 6 }}>FORNECEDORES NA SEMANA</div>
                  {weekByForn.map(f => (
                    <div key={f.fornecedor} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12, borderBottom: "1px solid #1c2129" }}>
                      <span style={{ color: "#cbd5e1" }}>{f.fornecedor}</span>
                      <span style={{ fontFamily: "monospace", color: "#8c94a3" }}>{formatBRL(f.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preços */}
      {radarView === "precos" && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📈 Variações de Preço (semana a semana)</div>
          {priceVariations.map((pv, i) => (
            <div key={i} style={{ ...card, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{pv.produto}</span>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: "monospace", background: pv.varPct > 10 ? "rgba(239,68,68,0.15)" : pv.varPct < -5 ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", color: pv.varPct > 10 ? "#ef4444" : pv.varPct < -5 ? "#22c55e" : "#f59e0b" }}>{pv.varPct > 0 ? "+" : ""}{pv.varPct}%</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={pv.semanas}><CartesianGrid strokeDasharray="3 3" stroke="#252b35" /><XAxis dataKey="semana" tick={{ fill: "#8c94a3", fontSize: 10 }} /><YAxis tick={{ fill: "#8c94a3", fontSize: 10 }} domain={["auto", "auto"]} /><Tooltip content={<CustomTooltip />} /><Line type="monotone" dataKey="preco" name="Val. Unit. (R$)" stroke={pv.varPct > 10 ? "#ef4444" : pv.varPct < -5 ? "#22c55e" : "#f59e0b"} strokeWidth={2.5} dot={{ r: 4, fill: "#0c0f14", strokeWidth: 2 }} /></LineChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 11, color: "#8c94a3", marginTop: 4 }}>{formatBRL(pv.first)} → {formatBRL(pv.last)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Categorias */}
      {radarView === "categorias" && (
        <div>
          <div style={card}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📦 Composição Semanal por Categoria</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={catWeekly}><CartesianGrid strokeDasharray="3 3" stroke="#252b35" /><XAxis dataKey="semana" tick={{ fill: "#8c94a3", fontSize: 10 }} /><YAxis tick={{ fill: "#8c94a3", fontSize: 10 }} /><Tooltip content={<CustomTooltip />} /><Legend wrapperStyle={{ fontSize: 11 }} />{CATEGORIAS.map(cat => <Bar key={cat} dataKey={cat} stackId="a" fill={CAT_COLORS[cat]} />)}</BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Dados */}
      {radarView === "dados" && (
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>📋 Base de Dados ({filtered.length})</span>
            <button onClick={() => { const csv = "Data;Semana;Fornecedor;Produto;Categoria;ValorUnit;Qtd;Total\n" + data.map(d => `${d.data};${d.semana};${d.fornecedor};${d.produto};${d.categoria};${d.valUnit};${d.qtd};${(d.valUnit * d.qtd).toFixed(2)}`).join("\n"); const b = new Blob([csv], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "compras_obra.csv"; a.click(); }} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #252b35", background: "#1c2129", color: "#60a5fa", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Exportar CSV</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ borderBottom: "1px solid #252b35" }}>
                {["Data", "Semana", "Fornecedor", "Produto", "Cat.", "Val.Un.", "Qtd", "Total", ""].map(h => <th key={h} style={{ textAlign: h.includes("Val") || h === "Qtd" || h === "Total" ? "right" : "left", padding: "7px 8px", fontSize: 10, color: "#8c94a3", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>)}
              </tr></thead>
              <tbody>{filtered.slice().reverse().map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1c2129" }}>
                  <td style={{ padding: "7px 8px" }}>{d.data}</td>
                  <td style={{ padding: "7px 8px" }}><span style={{ padding: "2px 6px", borderRadius: 4, background: "#1c2129", fontSize: 10 }}>{d.semana}</span></td>
                  <td style={{ padding: "7px 8px" }}>{d.fornecedor}</td>
                  <td style={{ padding: "7px 8px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.produto}</td>
                  <td style={{ padding: "7px 8px" }}><span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 600, background: (CAT_COLORS[d.categoria] || "#6b7280") + "22", color: CAT_COLORS[d.categoria] }}>{d.categoria}</span></td>
                  <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: "monospace" }}>{formatBRL(d.valUnit)}</td>
                  <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: "monospace" }}>{d.qtd}</td>
                  <td style={{ padding: "7px 8px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{formatBRL(d.valUnit * d.qtd)}</td>
                  <td style={{ padding: "7px 8px" }}><button onClick={() => { if (confirm("Remover?")) { const idx = data.length - 1 - i; saveData(data.filter((_, j) => j !== idx)); } }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13, opacity: 0.4 }}>✕</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
//  APP PRINCIPAL
// ════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("analise");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) { const parsed = JSON.parse(stored); if (Array.isArray(parsed) && parsed.length > 0) { setData(parsed); setLoading(false); return; } }
    } catch (e) {}
    setData(SEED_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    setLoading(false);
  }, []);

  const saveData = useCallback((newData) => {
    setData(newData);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newData)); } catch (e) { console.error(e); }
  }, []);

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0c0f14", color: "#60a5fa", fontSize: 18 }}>Carregando...</div>;

  return (
    <div style={{ background: "#0c0f14", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#e4e8ef" }}>
      {/* ─── Top Navigation ─── */}
      <div className="no-print" style={{ background: "#151920", borderBottom: "1px solid #252b35", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0", marginRight: 24 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📡</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.3 }}>Gestão de Compras — Obra</div>
              <div style={{ fontSize: 10, color: "#6b7280" }}>{data.length} registros</div>
            </div>
          </div>
          {/* Page tabs */}
          {[
            { k: "analise", l: "📊 Análise de Compras", desc: "Dashboard executivo" },
            { k: "radar", l: "📡 Radar Semanal", desc: "Acompanhamento operacional" },
          ].map(p => (
            <button key={p.k} onClick={() => setPage(p.k)}
              style={{ padding: "16px 20px", border: "none", borderBottom: page === p.k ? "2px solid #3b82f6" : "2px solid transparent", background: "transparent", color: page === p.k ? "#e4e8ef" : "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
              {p.l}
            </button>
          ))}
        </div>
        {/* Export PDF */}
        <button onClick={() => window.print()}
          style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(59,130,246,0.3)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Exportar PDF
        </button>
      </div>

      {/* ─── Page Content ─── */}
      {page === "analise" && <AnaliseCompras data={data} />}
      {page === "radar" && <RadarSemanal data={data} saveData={saveData} />}
    </div>
  );
}
