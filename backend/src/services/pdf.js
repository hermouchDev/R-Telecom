import puppeteer from 'puppeteer';

export const generateContractPDF = async (subscriptionData) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const {
    id,
    offer_name,
    client_name,
    client_email,
    client_phone,
    client_cin,
    client_address,
    is_fondation,
    base_price,
    discount,
    service_fee,
    router_fee,
    total_price,
    created_at
  } = subscriptionData;

  const year = new Date(created_at).getFullYear();
  const date = new Date(created_at).toLocaleDateString('fr-FR');
  const contractNumber = `RPT-${year}-${id.substring(0, 8).toUpperCase()}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica', sans-serif; color: #111; padding: 40px; }
        .header { border-bottom: 4px solid #CC0000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 32px; font-weight: 800; color: #CC0000; }
        .logo span { color: #111; }
        .title { text-align: center; font-size: 24px; font-weight: 800; margin-bottom: 40px; text-transform: uppercase; }
        .info-section { margin-bottom: 30px; }
        .info-title { background: #f4f4f4; padding: 8px 15px; font-weight: bold; border-left: 4px solid #CC0000; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #eee; padding: 12px; text-align: left; }
        th { background: #fafafa; }
        .total-row { font-weight: bold; font-size: 18px; color: #CC0000; }
        .footer { margin-top: 60px; font-size: 12px; color: #666; border-top: 1px solid #eee; pt-20; }
        .signature-box { display: flex; justify-content: space-between; margin-top: 50px; }
        .signature-space { border: 1px dashed #ccc; width: 200px; height: 100px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">R+ <span>TELECOM</span></div>
        <div style="text-align: right">
          <div>Contrat N°: <strong>${contractNumber}</strong></div>
          <div>Date: ${date}</div>
        </div>
      </div>

      <div class="title">Contrat de Souscription</div>

      <div class="info-section">
        <div class="info-title">Informations Client</div>
        <table>
          <tr><th>Nom Complet</th><td>${client_name}</td></tr>
          <tr><th>Email</th><td>${client_email}</td></tr>
          <tr><th>Téléphone</th><td>${client_phone}</td></tr>
          <tr><th>CIN</th><td>${client_cin}</td></tr>
          <tr><th>Adresse Installation</th><td>${client_address || 'Non spécifiée'}</td></tr>
        </table>
      </div>

      <div class="info-section">
        <div class="info-title">Détails de l'Offre</div>
        <table>
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Montant (DH)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Abonnement Mensuel: <strong>${offer_name}</strong></td>
              <td>${base_price} DH</td>
            </tr>
            ${is_fondation ? `<tr><td style="color: green">Remise Fondation (-25%)</td><td style="color: green">-${discount} DH</td></tr>` : ''}
            <tr>
              <td>Frais d'Activation / Service</td>
              <td>${service_fee === 0 ? 'Offerts' : service_fee + ' DH'}</td>
            </tr>
            ${router_fee > 0 ? `<tr><td>Frais Routeur (Unique)</td><td>${router_fee} DH</td></tr>` : ''}
            <tr class="total-row">
              <td>TOTAL À PAYER (MENSUEL)</td>
              <td>${total_price} DH</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="info-section" style="font-size: 11px; line-height: 1.5;">
        <div class="info-title">Conditions Générales (Extrait)</div>
        <p>Le présent contrat engage l'abonné pour une durée indéterminée (sauf mention contraire). Le client s'engage à payer les mensualités à date échue. R+ TELECOM s'engage à fournir un service de qualité avec une disponibilité de 99.9%.</p>
      </div>

      <div class="signature-box">
        <div>
          <strong>Signature Client</strong>
          <div class="signature-space"></div>
          <p style="font-size: 10px">${client_name}</p>
        </div>
        <div style="text-align: right">
          <strong>R+ TELECOM S.A.</strong>
          <div class="signature-space" style="margin-left: auto;"></div>
          <p style="font-size: 10px">Cachet et Signature</p>
        </div>
      </div>

      <div class="footer">
        <p>R+ TELECOM — Siège Social: Casablanca, Maroc | Contact: +212 5XX-XXXXXX | www.rplusTelecom.ma</p>
        <p>Document généré électroniquement. Ref: ${id}</p>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

  await browser.close();
  return pdfBuffer;
};
