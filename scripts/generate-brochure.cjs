/**
 * Reliable Industries — Product Brochure Generator
 * Reads verified catalog & industry data + embeds optimized local photos
 * and local Inter fonts, then renders an A4 PDF via Puppeteer.
 * Run: node scripts/generate-brochure.cjs
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'public', 'brochures', 'product_brochure.pdf');

const catalog = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src', 'data', 'productsCatalog.json'), 'utf8'),
);
const industries = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src', 'data', 'industries.json'), 'utf8'),
);

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadFontFaceCss() {
  const fontDir = path.join(ROOT, 'node_modules', '@fontsource', 'inter', 'files');
  const weights = [400, 600, 700, 800, 900];
  return weights
    .map((weight) => {
      const regularPath = path.join(fontDir, `inter-latin-${weight}-normal.woff2`);
      const italicPath = path.join(fontDir, `inter-latin-${weight}-italic.woff2`);
      const parts = [];
      if (fs.existsSync(regularPath)) {
        const b64 = fs.readFileSync(regularPath).toString('base64');
        parts.push(`
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: ${weight};
  src: url('data:font/woff2;base64,${b64}') format('woff2');
}`);
      }
      if (fs.existsSync(italicPath)) {
        const b64 = fs.readFileSync(italicPath).toString('base64');
        parts.push(`
@font-face {
  font-family: 'Inter';
  font-style: italic;
  font-weight: ${weight};
  src: url('data:font/woff2;base64,${b64}') format('woff2');
}`);
      }
      return parts.join('\n');
    })
    .join('\n');
}

async function optimizeImageDataUri(absPath, { width, height, fit = 'contain', format = 'png' }) {
  const pipeline = sharp(absPath).resize(width, height, {
    fit,
    background: { r: 244, g: 246, b: 248, alpha: 1 },
  });
  const buf =
    format === 'jpeg'
      ? await pipeline.jpeg({ quality: 82 }).toBuffer()
      : await pipeline.png({ compressionLevel: 9 }).toBuffer();
  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

async function buildHtml() {
  const featuredIds = [2, 5, 17, 29];
  const featuredProducts = [];

  for (const id of featuredIds) {
    const prod = catalog.find((p) => p.id === id);
    if (!prod) continue;
    const primaryFile = prod.galleryFiles?.[0]?.file;
    let photoUri = '';
    if (primaryFile) {
      const imgPath = path.join(ROOT, 'src', 'assets', 'images', 'sealproduct', primaryFile);
      if (fs.existsSync(imgPath)) {
        photoUri = await optimizeImageDataUri(imgPath, {
          width: 480,
          height: 240,
          fit: 'contain',
          format: primaryFile.endsWith('.png') ? 'png' : 'jpeg',
        });
      }
    }
    featuredProducts.push({ ...prod, photoUri });
  }

  const factoryImgPath = path.join(ROOT, 'src', 'assets', 'images', 'hero_industrial_new.jpg');
  const factoryImgUri = fs.existsSync(factoryImgPath)
    ? await optimizeImageDataUri(factoryImgPath, {
        width: 900,
        height: 260,
        fit: 'cover',
        format: 'jpeg',
      })
    : '';

  const equipmentList = [
    { machine: 'Lathe Machine', qty: '15 No.' },
    { machine: 'Lapping Machine', qty: '2 No.' },
    { machine: 'Roll & Grinder', qty: '1 No.' },
    { machine: 'Grinder', qty: '2 No.' },
    { machine: 'Drill Machine', qty: '2 No.' },
    { machine: 'Band Saw / Hacksaw Machine', qty: '1 No.' },
    { machine: 'Hydraulic Press', qty: '1 No.' },
    { machine: 'Punching M/c', qty: '1 No.' },
    { machine: 'Flatness Testing M/c', qty: '1 No.' },
    { machine: 'CNC Lathe M/c', qty: '2 No.' },
    { machine: 'VMC / Milling', qty: '1 No.' },
  ];

  const featuredCardsHtml = featuredProducts
    .map((prod) => {
      const specEntries = Object.entries(prod.specs || {}).slice(0, 6);
      const specHtml = specEntries
        .map(
          ([key, val]) =>
            `<li><span class="sk">${escapeHtml(key)}</span><span class="sv">${escapeHtml(val)}</span></li>`,
        )
        .join('');
      const descText =
        prod.description &&
        prod.description !==
          'A reliable sealing solution engineered for maximum efficiency and durability in industrial applications.'
          ? prod.description
          : (prod.features && prod.features[0]) || prod.description;

      return `
      <div class="prod-card">
        <div class="prod-card-header">
          <div class="series">${escapeHtml(prod.category)}</div>
          <h4>${escapeHtml(prod.name)}</h4>
        </div>
        ${
          prod.photoUri
            ? `<div class="prod-img-wrap"><img src="${prod.photoUri}" alt="${escapeHtml(prod.name)}" /></div>`
            : ''
        }
        <div class="prod-card-body">
          <p>${escapeHtml(descText)}</p>
          <ul class="spec-list">${specHtml}</ul>
        </div>
      </div>`;
    })
    .join('');

  const industriesHtml = industries
    .map(
      (ind) => `
      <div class="ind-item">
        <div class="ind-name">${escapeHtml(ind.title)}</div>
        <div class="ind-sub">${escapeHtml(ind.headline)}</div>
      </div>`,
    )
    .join('');

  const fontCss = loadFontFaceCss();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Reliable Industries — Product Catalogue</title>
<style>
  ${fontCss}

  @page { size: A4; margin: 0; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:  #003B6D;
    --cyan:  #009FE3;
    --yellow:#FFE600;
    --light: #F4F6F8;
    --slate: #334155;
    --muted: #64748b;
    --white: #ffffff;
    --dark:  #002038;
  }

  body {
    font-family: 'Inter', Arial, sans-serif;
    color: var(--slate);
    font-size: 9.5pt;
    line-height: 1.5;
    background: #fff;
  }

  .page {
    page-break-after: always;
    width: 210mm;
    height: 297mm;
    position: relative;
    overflow: hidden;
  }
  .page:last-child { page-break-after: auto; }

  .cyan { color: var(--cyan); }
  .kicker { font-size: 7.5pt; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
  .section-title { font-size: 17pt; font-weight: 800; line-height: 1.15; color: var(--navy); }
  .divider { width: 36px; height: 3px; background: var(--cyan); margin: 8px 0 14px; }

  .ph { background: var(--light); padding: 14px 36px; border-bottom: 3px solid var(--cyan); display: flex; align-items: center; justify-content: space-between; }
  .ph-brand { font-family: "Times New Roman", Times, "Liberation Serif", Georgia, serif; font-size: 11pt; font-weight: 700; font-style: italic; color: var(--navy); }
  .ph-label { font-size: 7.5pt; font-weight: 700; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
  .ph-page { font-size: 7.5pt; font-weight: 700; color: var(--navy); }

  /* ── PAGE 1: COVER ── */
  #cover {
    background: var(--navy);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  #cover .cover-top {
    background: var(--dark);
    padding: 24px 36px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  #cover .logo-block .brand-line1,
  #cover .logo-block .brand-line2 {
    font-family: "Times New Roman", Times, "Liberation Serif", Georgia, serif;
    font-size: 24pt; font-weight: 700; font-style: italic; color: #fff; line-height: 1.02;
  }
  #cover .logo-block .tagline {
    font-size: 7pt; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: var(--cyan); margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.22); padding-top: 5px;
  }
  #cover .cover-year { font-size: 8.5pt; font-weight: 600; color: rgba(255,255,255,0.55); }

  #cover .cover-hero {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 36px 48px 24px;
    text-align: center;
  }
  #cover .cover-badge {
    display: inline-block;
    background: var(--cyan);
    color: #fff;
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 18px;
    margin-bottom: 22px;
  }
  #cover h1 {
    font-size: 31pt; font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 16px; max-width: 490px;
  }
  #cover h1 span { color: var(--cyan); }
  #cover .cover-sub {
    font-size: 10.5pt; color: rgba(255,255,255,0.78); max-width: 430px; line-height: 1.6; margin-bottom: 28px;
  }
  #cover .cover-photo {
    width: 100%; max-width: 480px; height: 155px; overflow: hidden; border: 2px solid rgba(0,159,227,0.55);
  }
  #cover .cover-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }

  #cover .cover-stats {
    display: flex; gap: 32px; justify-content: center;
    padding: 18px 36px;
    border-top: 1px solid rgba(255,255,255,0.14);
    border-bottom: 1px solid rgba(255,255,255,0.14);
  }
  #cover .stat-item { text-align: center; }
  #cover .stat-num { font-size: 19pt; font-weight: 800; color: var(--cyan); line-height: 1; }
  #cover .stat-label { font-size: 7pt; font-weight: 600; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 4px; }

  #cover .cover-bottom {
    background: var(--cyan); padding: 14px 36px; display: flex; align-items: center; justify-content: space-between;
  }
  #cover .cover-bottom span { font-size: 8.5pt; font-weight: 600; color: #fff; }

  /* ── PAGE 2: ABOUT & CAPABILITIES ── */
  #about .content { padding: 22px 36px; }
  .about-grid { display: grid; grid-template-columns: 1.02fr 0.98fr; gap: 22px; margin-bottom: 16px; }
  .about-intro p { font-size: 9pt; line-height: 1.6; color: var(--slate); margin-bottom: 8px; }
  .workforce-box { border: 1px solid #e2e8f0; background: var(--light); padding: 10px 12px; margin-top: 10px; }
  .workforce-box h4 { font-size: 8pt; font-weight: 700; color: var(--navy); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.8px; }
  .wf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; font-size: 8pt; }
  .wf-item { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; }
  .wf-item strong { color: var(--navy); }

  .stat-row { display: flex; border: 1px solid #e2e8f0; }
  .stat-cell { flex: 1; padding: 10px 10px; text-align: center; border-right: 1px solid #e2e8f0; }
  .stat-cell:last-child { border-right: none; }
  .stat-cell .num { font-size: 16pt; font-weight: 800; color: var(--cyan); line-height: 1; }
  .stat-cell .lbl { font-size: 7pt; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px; }

  .equip-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 8pt; }
  .equip-table thead tr { background: var(--navy); color: #fff; }
  .equip-table thead th { padding: 6px 10px; text-align: left; font-weight: 700; font-size: 7.5pt; }
  .equip-table tbody tr:nth-child(even) { background: var(--light); }
  .equip-table tbody td { padding: 4.5px 10px; border-bottom: 1px solid #e2e8f0; color: var(--slate); }
  .equip-table tbody td:last-child { font-weight: 700; color: var(--navy); text-align: center; }

  .pillar-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 8px; }
  .pillar-card { border: 1px solid #e2e8f0; border-top: 3px solid var(--cyan); padding: 10px 12px; }
  .pillar-card.navy-top { border-top-color: var(--navy); }
  .pillar-card h4 { font-size: 8.5pt; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .pillar-card p { font-size: 7.6pt; line-height: 1.48; color: var(--slate); }

  /* ── PAGE 3: PRODUCT CATEGORIES ── */
  #products .content { padding: 24px 36px; }
  .cat-block { margin-bottom: 16px; border: 1px solid #e2e8f0; }
  .cat-header { background: var(--navy); color: #fff; padding: 9px 14px; display: flex; align-items: center; gap: 10px; }
  .cat-header .cat-num { background: var(--cyan); color: #fff; font-size: 7.5pt; font-weight: 800; padding: 3px 8px; min-width: 24px; text-align: center; }
  .cat-header h3 { font-size: 10pt; font-weight: 700; }
  .cat-header .cat-sub { font-size: 7pt; color: rgba(255,255,255,0.7); margin-left: auto; }
  .cat-body { padding: 11px 14px; display: grid; grid-template-columns: 1fr 1.85fr; gap: 14px; align-items: start; }
  .cat-desc { font-size: 8.2pt; line-height: 1.55; color: var(--slate); }
  .cat-items { display: flex; flex-wrap: wrap; gap: 5px; }
  .cat-tag { background: var(--light); border: 1px solid #e2e8f0; font-size: 7.4pt; font-weight: 600; color: var(--navy); padding: 3px 8px; border-radius: 2px; }

  /* ── PAGE 4: FEATURED PRODUCTS ── */
  #featured .content { padding: 22px 36px; }
  .prod-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .prod-card { border: 1px solid #e2e8f0; border-radius: 2px; overflow: hidden; display: flex; flex-direction: column; }
  .prod-card-header { background: var(--light); padding: 9px 12px; border-bottom: 2px solid var(--cyan); }
  .prod-card-header .series { font-size: 6.8pt; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--cyan); margin-bottom: 2px; }
  .prod-card-header h4 { font-size: 8.8pt; font-weight: 700; color: var(--navy); line-height: 1.25; }
  .prod-img-wrap { background: var(--light); height: 105px; padding: 8px 12px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #e2e8f0; }
  .prod-img-wrap img { max-height: 100%; max-width: 100%; object-fit: contain; display: block; }
  .prod-card-body { padding: 10px 12px; flex: 1; }
  .prod-card-body p { font-size: 7.5pt; line-height: 1.48; color: var(--slate); margin-bottom: 8px; }
  .spec-list { list-style: none; }
  .spec-list li { font-size: 7.2pt; padding: 2.5px 0; border-bottom: 1px solid #f1f5f9; display: flex; gap: 8px; }
  .spec-list li:last-child { border-bottom: none; }
  .spec-list .sk { font-weight: 700; color: var(--navy); min-width: 82px; flex-shrink: 0; }
  .spec-list .sv { color: var(--slate); }

  /* ── PAGE 5: SERVICES ── */
  #services .content { padding: 24px 36px; }
  .svc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .svc-card { border: 1px solid #e2e8f0; padding: 13px 14px; border-left: 4px solid var(--cyan); }
  .svc-card.navy-l { border-left-color: var(--navy); }
  .svc-num { font-size: 7pt; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--cyan); margin-bottom: 3px; }
  .svc-card.navy-l .svc-num { color: var(--navy); }
  .svc-card h4 { font-size: 9pt; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .svc-card p { font-size: 8pt; line-height: 1.5; color: var(--slate); }

  /* ── PAGE 6: INDUSTRIES & CERTIFICATIONS ── */
  #industries-certs .content { padding: 24px 36px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .ind-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .ind-item { background: var(--light); border: 1px solid #e2e8f0; padding: 9px 10px; border-radius: 2px; }
  .ind-item .ind-name { font-size: 8.2pt; font-weight: 700; color: var(--navy); }
  .ind-item .ind-sub { font-size: 7.2pt; color: var(--muted); margin-top: 2px; line-height: 1.35; }
  .cert-list { list-style: none; }
  .cert-item { padding: 9px 0; border-bottom: 1px solid #e2e8f0; }
  .cert-item:last-child { border-bottom: none; }
  .cert-item .cert-name { font-size: 8.5pt; font-weight: 700; color: var(--navy); }
  .cert-item .cert-scope { font-size: 7.5pt; color: var(--muted); margin-top: 2px; line-height: 1.4; }
  .cert-badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 6.5pt; font-weight: 700; padding: 2px 7px; margin-left: 6px; vertical-align: middle; border-radius: 2px; }

  /* ── PAGE 7: CONTACT & BACK COVER ── */
  #contact-page { background: var(--navy); display: flex; flex-direction: column; justify-content: space-between; }
  #contact-page .cont-top { background: var(--dark); padding: 22px 36px 18px; display: flex; align-items: center; justify-content: space-between; }
  #contact-page .cont-brand { font-family: "Times New Roman", Times, "Liberation Serif", Georgia, serif; font-size: 11pt; font-weight: 700; font-style: italic; color: #fff; }
  #contact-page .cont-label { font-size: 7.5pt; font-weight: 700; color: rgba(255,255,255,0.55); letter-spacing: 1px; text-transform: uppercase; }
  #contact-page .cont-body { flex: 1; padding: 36px 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  #contact-page h2 { font-size: 22pt; font-weight: 800; color: #fff; margin-bottom: 10px; }
  #contact-page .cont-sub { font-size: 10pt; color: rgba(255,255,255,0.7); max-width: 400px; margin-bottom: 28px; line-height: 1.55; }
  .contact-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width: 100%; max-width: 540px; }
  .contact-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); padding: 15px 12px; text-align: center; border-radius: 4px; }
  .contact-card .cc-label { font-size: 7pt; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--cyan); margin-bottom: 6px; }
  .contact-card .cc-val { font-size: 8.2pt; font-weight: 600; color: #fff; line-height: 1.45; }

  .dept-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%; max-width: 540px; margin-top: 18px; }
  .dept-item { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 10px 14px; text-align: left; border-radius: 2px; }
  .dept-item .di-title { font-size: 8pt; font-weight: 700; color: #fff; margin-bottom: 2px; }
  .dept-item .di-email { font-size: 7.5pt; color: var(--cyan); }
  .hours-note { margin-top: 18px; font-size: 8pt; color: rgba(255,255,255,0.68); }

  #contact-page .cont-footer { background: var(--cyan); padding: 14px 36px; display: flex; align-items: center; justify-content: space-between; }
  #contact-page .cont-footer span { font-size: 8.5pt; font-weight: 600; color: #fff; }
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page" id="cover">
  <div class="cover-top">
    <div class="logo-block">
      <div class="brand-line1">Reliable</div>
      <div class="brand-line2">Industries</div>
      <div class="tagline">Pioneer in Sealing</div>
    </div>
    <span class="cover-year">2026 – 2027 Catalogue</span>
  </div>

  <div class="cover-hero">
    <div class="cover-badge">Technical Product Catalogue</div>
    <h1>Precision Engineered<br/><span>Sealing Solutions</span></h1>
    <p class="cover-sub">
      Mechanical seals, rotary joints, and seal support systems engineered for extreme pressure, thermal, and chemical services across heavy process industries.
    </p>
    ${
      factoryImgUri
        ? `<div class="cover-photo"><img src="${factoryImgUri}" alt="Reliable Industries Manufacturing Facility" /></div>`
        : ''
    }
  </div>

  <div class="cover-stats">
    <div class="stat-item"><div class="stat-num">${catalog.length}</div><div class="stat-label">Catalog Models</div></div>
    <div class="stat-item"><div class="stat-num">1987</div><div class="stat-label">Legacy Roots</div></div>
    <div class="stat-item"><div class="stat-num">30</div><div class="stat-label">Workforce</div></div>
    <div class="stat-item"><div class="stat-num">6,400</div><div class="stat-label">Sq. Ft. Plant</div></div>
    <div class="stat-item"><div class="stat-num">ISO</div><div class="stat-label">9001:2015</div></div>
  </div>

  <div class="cover-bottom">
    <span>reliableseal.com</span>
    <span>info@reliableseal.com</span>
    <span>+91- 78880 65557</span>
  </div>
</div>

<!-- PAGE 2: ABOUT & CAPABILITIES -->
<div class="page" id="about">
  <div class="ph">
    <span class="ph-brand">Reliable Industries</span>
    <span class="ph-label">About Us &amp; Factory Capabilities</span>
    <span class="ph-page">02</span>
  </div>
  <div class="content">
    <div class="kicker cyan" style="margin-bottom:4px">Who We Are</div>
    <div class="section-title">Precision Engineered For Extreme Industrial Demands</div>
    <div class="divider"></div>

    <div class="about-grid">
      <div>
        <div class="about-intro">
          <p>Tracing its legacy to <strong>1987</strong> as Reliable Engineering Works before transitioning to <strong>Reliable Industries</strong> in <strong>2005</strong>, our Mumbai headquarters engineers mechanical seals, cartridge units, rotary joints, and seal support systems.</p>
          <p>Operating across <strong>6,400 sq. ft.</strong> (2,900 + 3,500 sq. ft.), our machining plant houses CNC turning centers, precision lapping rigs, flatness testing benches, and grinding centers for complete in-house dimensional control.</p>
          <p>From plant process audits and custom seal manufacture to refurbishment and on-site training, we support 10 heavy process industries.</p>
        </div>
        <div class="workforce-box">
          <h4>Workforce Overview (30 Personnel)</h4>
          <div class="wf-grid">
            <div class="wf-item"><span>Skilled Engineers &amp; Machinists</span><strong>10</strong></div>
            <div class="wf-item"><span>Semi-Skilled Technicians</span><strong>5</strong></div>
            <div class="wf-item"><span>Service Staff</span><strong>4</strong></div>
            <div class="wf-item"><span>Production &amp; Marketing</span><strong>4</strong></div>
            <div class="wf-item"><span>Quality Control (Q.C.)</span><strong>3</strong></div>
            <div class="wf-item"><span>Dispatch &amp; Logistics</span><strong>4</strong></div>
          </div>
        </div>
      </div>

      <div>
        <div class="stat-row">
          <div class="stat-cell"><div class="num">2005</div><div class="lbl">Reliable Ind.</div></div>
          <div class="stat-cell"><div class="num">30</div><div class="lbl">Personnel</div></div>
          <div class="stat-cell"><div class="num">6,400</div><div class="lbl">Sq. Ft. Area</div></div>
        </div>
        <table class="equip-table">
          <thead><tr><th>In-House Factory Equipment</th><th style="text-align:center">Qty.</th></tr></thead>
          <tbody>
            ${equipmentList
              .map((row) => `<tr><td>${escapeHtml(row.machine)}</td><td>${escapeHtml(row.qty)}</td></tr>`)
              .join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="kicker cyan" style="margin-bottom:6px">Our Core Strengths</div>
    <div class="pillar-grid">
      <div class="pillar-card">
        <h4>Specialist Know-How</h4>
        <p>Focused engineering expertise across centrifugal pumps, chemical reactors, agitators, and thermic oil systems.</p>
      </div>
      <div class="pillar-card navy-top">
        <h4>In-House Manufacturing</h4>
        <p>Complete machining, precision lapping, flatness inspection, and hydro-testing performed under one roof.</p>
      </div>
      <div class="pillar-card">
        <h4>Fast Turnaround</h4>
        <p>Dedicated service and dispatch teams prioritizing breakdown replacement seals and emergency spares.</p>
      </div>
      <div class="pillar-card navy-top">
        <h4>Process Consultation</h4>
        <p>Thorough plant pump &amp; liquid parameter analysis to eliminate recurring mechanical seal failure factors.</p>
      </div>
      <div class="pillar-card">
        <h4>Repair &amp; Refurbishment</h4>
        <p>Precision face re-lapping and elastomer upgrades matched to fluid chemistry to reduce ownership cost.</p>
      </div>
      <div class="pillar-card navy-top">
        <h4>Hands-On Training</h4>
        <p>Practical installation, troubleshooting, and preventive maintenance training at our facility or customer site.</p>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 3: PRODUCT CATEGORIES -->
<div class="page" id="products">
  <div class="ph">
    <span class="ph-brand">Reliable Industries</span>
    <span class="ph-label">Product Range Overview (15 Categories)</span>
    <span class="ph-page">03</span>
  </div>
  <div class="content">
    <div class="kicker cyan" style="margin-bottom:4px">Our Products</div>
    <div class="section-title">Complete Sealing Product Range</div>
    <div class="divider"></div>

    <div class="cat-block">
      <div class="cat-header">
        <span class="cat-num">01</span>
        <h3>Mechanical Seals</h3>
        <span class="cat-sub">Pumps · Reactors · Agitators · High-Temp Services</span>
      </div>
      <div class="cat-body">
        <p class="cat-desc">Precision mechanical seals engineered for clean water, solvents, corrosive acids, slurries, hydrocarbons, and viscous media across single, multi-spring, bellows, and cartridge designs.</p>
        <div class="cat-items">
          <span class="cat-tag">Reactor Seal</span>
          <span class="cat-tag">Agitator Seal</span>
          <span class="cat-tag">Cartridge Seal</span>
          <span class="cat-tag">Single Spring Series Seal</span>
          <span class="cat-tag">Multi Spring Series Seal</span>
          <span class="cat-tag">High Temp Seal</span>
          <span class="cat-tag">Water Seal</span>
        </div>
      </div>
    </div>

    <div class="cat-block">
      <div class="cat-header">
        <span class="cat-num">02</span>
        <h3>Rotary Joints &amp; Rotating Unions</h3>
        <span class="cat-sub">Water · Steam · Hot Oil · Hydraulic · High-Temp</span>
      </div>
      <div class="cat-body">
        <p class="cat-desc">Balanced monoflow (RMF) and dualflow (RDF) rotary pressure joints engineered for rotating cylinders, drying drums, calenders, and machine tool spindles.</p>
        <div class="cat-items">
          <span class="cat-tag">Rotary Joints</span>
          <span class="cat-tag">Water Rotary Joints</span>
          <span class="cat-tag">Hot Oil Rotary Joints</span>
          <span class="cat-tag">Steam Rotary Joints</span>
          <span class="cat-tag">Hydraulic Rotary Joints</span>
          <span class="cat-tag">High Temperature Rotary Joint</span>
        </div>
      </div>
    </div>

    <div class="cat-block">
      <div class="cat-header">
        <span class="cat-num">03</span>
        <h3>Auxiliary Seal Support Systems</h3>
        <span class="cat-sub">Barrier Fluid Vessels · Heat Exchangers</span>
      </div>
      <div class="cat-body">
        <p class="cat-desc">Auxiliary piping and cooling systems engineered to maintain stable barrier fluid circulation and thermal dissipation for dual mechanical seals and hot-service pumps.</p>
        <div class="cat-items">
          <span class="cat-tag">Thermosyphon System</span>
          <span class="cat-tag">Heat Exchanger System</span>
          <span class="cat-tag">Cooling &amp; Barrier Circulation</span>
        </div>
      </div>
    </div>

    <div class="cat-block">
      <div class="cat-header">
        <span class="cat-num">04</span>
        <h3>Replacement Seal Faces, Secondary Elements &amp; Spares</h3>
        <span class="cat-sub">SiC · Tungsten Carbide · Carbon · Ceramic · PTFE · Grafoil</span>
      </div>
      <div class="cat-body">
        <p class="cat-desc">Replacement lapped seal faces, springs, sleeves, and chemically resistant elastomers matched to process media and operating temperatures.</p>
        <div class="cat-items">
          <span class="cat-tag">Silicon Carbide (SiC)</span>
          <span class="cat-tag">Tungsten Carbide (TC)</span>
          <span class="cat-tag">Carbon Graphite</span>
          <span class="cat-tag">99.5% Alumina Ceramic</span>
          <span class="cat-tag">Virgin / Glass PTFE</span>
          <span class="cat-tag">Flexible Grafoil</span>
          <span class="cat-tag">FKM / EPDM Elastomers</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 4: FEATURED PRODUCTS -->
<div class="page" id="featured">
  <div class="ph">
    <span class="ph-brand">Reliable Industries</span>
    <span class="ph-label">Featured Product Specifications</span>
    <span class="ph-page">04</span>
  </div>
  <div class="content">
    <div class="kicker cyan" style="margin-bottom:4px">Highlighted Catalog Models</div>
    <div class="section-title">Featured Mechanical Seals &amp; Rotating Unions</div>
    <div class="divider"></div>
    <div class="prod-grid">${featuredCardsHtml}</div>
  </div>
</div>

<!-- PAGE 5: SERVICES -->
<div class="page" id="services">
  <div class="ph">
    <span class="ph-brand">Reliable Industries</span>
    <span class="ph-label">Technical &amp; Plant Services</span>
    <span class="ph-page">05</span>
  </div>
  <div class="content">
    <div class="kicker cyan" style="margin-bottom:4px">What We Offer</div>
    <div class="section-title">Complete Mechanical Seal Service Solutions</div>
    <div class="divider"></div>

    <div class="svc-grid">
      <div class="svc-card">
        <div class="svc-num">Service 01</div>
        <h4>Consultation &amp; Process Analysis</h4>
        <p>Thorough analysis of plant process, pump make, model, type, and system configuration to identify failure factors and specify the correct seal and secondary system.</p>
      </div>
      <div class="svc-card navy-l">
        <div class="svc-num">Service 02</div>
        <h4>Technical Support</h4>
        <p>Eliminate drawbacks of pump and booster systems with correct application guidance for mechanical seals and pumps to raise process reliability.</p>
      </div>
      <div class="svc-card navy-l">
        <div class="svc-num">Service 03</div>
        <h4>Maintenance</h4>
        <p>Full maintenance techniques for pump and seal systems — improving pump performance, addressing face/secondary system drawbacks, and aligning motor couplings.</p>
      </div>
      <div class="svc-card">
        <div class="svc-num">Service 04</div>
        <h4>Repair &amp; Refurbishment</h4>
        <p>Repair existing mechanical seals with new precision-lapped faces and elastomers chosen per your liquid parameters — significantly reducing seal ownership cost.</p>
      </div>
      <div class="svc-card">
        <div class="svc-num">Service 05</div>
        <h4>Training Programmes</h4>
        <p>Practical training at our plant or customer site covering complete seal &amp; pump processes, hands-on installation, testing, and troubleshooting.</p>
      </div>
      <div class="svc-card navy-l">
        <div class="svc-num">Service 06</div>
        <h4>Inventory Control</h4>
        <p>Cross-plant analysis of pump models and processes to standardize unified seal types across multiple pumps — lowering required spare inventory stock.</p>
      </div>
    </div>

    <div class="svc-card" style="margin-top:12px">
      <div class="svc-num">Service 07</div>
      <h4>Preventive Maintenance Programme</h4>
      <p>Evaluate existing mechanical seal service life in pumps, provide advance scheduling warnings for preventive maintenance intervals, maintain essential backup seal and pump spare inventories, and train staff on proper cleaning and reassembly of serviceable components.</p>
    </div>
  </div>
</div>

<!-- PAGE 6: INDUSTRIES & CERTIFICATIONS -->
<div class="page" id="industries-certs">
  <div class="ph">
    <span class="ph-brand">Reliable Industries</span>
    <span class="ph-label">Industries &amp; Quality Certifications</span>
    <span class="ph-page">06</span>
  </div>
  <div class="content">
    <div class="two-col">
      <div>
        <div class="kicker cyan" style="margin-bottom:4px">Industries Served</div>
        <div class="section-title" style="font-size:15pt">10 Heavy Process Sectors</div>
        <div class="divider"></div>
        <div class="ind-grid">${industriesHtml}</div>
      </div>

      <div>
        <div class="kicker cyan" style="margin-bottom:4px">Quality &amp; Compliance</div>
        <div class="section-title" style="font-size:15pt">Certifications &amp; Standards</div>
        <div class="divider"></div>
        <ul class="cert-list">
          <li class="cert-item">
            <div class="cert-name">API Spec Q1 / ISO 29001 <span class="cert-badge">Active &amp; Audited</span></div>
            <div class="cert-scope">Quality management system specifications for petroleum &amp; gas manufacturing (API 682 4th Ed. compliant).</div>
          </li>
          <li class="cert-item">
            <div class="cert-name">ASME "U" Stamp (115366 BPV) <span class="cert-badge">Certified</span></div>
            <div class="cert-scope">Unfired pressure vessels, barrier fluid reservoirs, and heat exchanger systems.</div>
          </li>
          <li class="cert-item">
            <div class="cert-name">ISO 9001:2015 <span class="cert-badge">Certified QA</span></div>
            <div class="cert-scope">Precision engineering design, raw material traceability, CNC production, and final hydro-testing.</div>
          </li>
          <li class="cert-item">
            <div class="cert-name">ATEX Directive 2014/34/EU <span class="cert-badge">CE / Ex</span></div>
            <div class="cert-scope">Certified operation in explosive gas, vapor, and dust zones (Zone 1 &amp; 2).</div>
          </li>
          <li class="cert-item">
            <div class="cert-name">ISO 14001 &amp; ISO 45001 <span class="cert-badge">Compliant</span></div>
            <div class="cert-scope">Environmental management and occupational health &amp; safety systems.</div>
          </li>
          <li class="cert-item">
            <div class="cert-name">FDA &amp; EU 1935/2004 Sanitary <span class="cert-badge">Approved</span></div>
            <div class="cert-scope">Food, beverage, and active pharmaceutical elastomer &amp; face material compliance (USP Class VI).</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 7: CONTACT & BACK COVER -->
<div class="page" id="contact-page">
  <div class="cont-top">
    <span class="cont-brand">Reliable Industries</span>
    <span class="cont-label">Contact &amp; Inquiries</span>
  </div>

  <div class="cont-body">
    <h2>Ready to Solve Your Sealing Challenge?</h2>
    <p class="cont-sub">Speak with our Mumbai engineering team for product selection, custom drawings, refurbishment quotes, or on-site plant support.</p>

    <div class="contact-cards">
      <div class="contact-card">
        <div class="cc-label">Phone</div>
        <div class="cc-val">+91- 78880 65557<br/>+91- 78880 65558<br/>+91- 78880 65559</div>
      </div>
      <div class="contact-card">
        <div class="cc-label">General Email</div>
        <div class="cc-val">info@reliableseal.com</div>
      </div>
      <div class="contact-card">
        <div class="cc-label">Headquarters</div>
        <div class="cc-val">AF-02, 03, 04 Saraf Kaskar Ind. Prem Co-op. Soc. Ltd., S.V.Road, Oshiwara, Jogeshwari (W), Mumbai - 400102</div>
      </div>
    </div>

    <div class="dept-grid">
      <div class="dept-item">
        <div class="di-title">Technical &amp; Engineering</div>
        <div class="di-email">tech@reliableseal.com</div>
      </div>
      <div class="dept-item">
        <div class="di-title">Sales &amp; Quotations</div>
        <div class="di-email">sales@reliableseal.com</div>
      </div>
      <div class="dept-item">
        <div class="di-title">Dispatch &amp; Logistics</div>
        <div class="di-email">dispatch@reliableseal.com</div>
      </div>
      <div class="dept-item">
        <div class="di-title">Quality &amp; QA Inspection</div>
        <div class="di-email">quality@reliableseal.com</div>
      </div>
    </div>

    <p class="hours-note">Business Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST</p>
  </div>

  <div class="cont-footer">
    <span>© 2026 Reliable Industries. All Rights Reserved.</span>
    <span>reliableseal.com</span>
  </div>
</div>

</body>
</html>`;
}

(async () => {
  const html = await buildHtml();
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const baseHref = pathToFileURL(ROOT + path.sep).href;
  await page.setContent(html.replace('<head>', `<head><base href="${baseHref}">`), {
    waitUntil: 'load',
  });
  await page.evaluate(() => document.fonts.ready);

  await page.pdf({
    path: OUTPUT,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  const size = fs.statSync(OUTPUT).size;
  console.log('✅ Brochure generated:', OUTPUT);
  console.log('   File size:', Math.round(size / 1024), 'KB');
})();
