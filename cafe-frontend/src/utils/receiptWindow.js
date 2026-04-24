export function formatCurrency(value) {
  return `INR ${Number(value || 0).toLocaleString("en-IN")}`;
}

export function formatPlacedAt(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function describeCustomization(customization) {
  if (!customization) {
    return "";
  }

  const details = [];

  if (customization.size && customization.size !== "Regular") {
    details.push(customization.size);
  }
  if (customization.temperature) {
    details.push(customization.temperature);
  }
  if (customization.milk && customization.milk !== "Whole Milk") {
    details.push(customization.milk);
  }
  if (customization.sugar && customization.sugar !== "1 tsp") {
    details.push(customization.sugar);
  }
  if (customization.shots && customization.shots > 1) {
    details.push(`${customization.shots} shots`);
  }
  if (Array.isArray(customization.extras) && customization.extras.length > 0) {
    details.push(...customization.extras);
  }

  return details.join(" | ");
}

export function buildReceiptMarkup(order, rawReceiptText) {
  const itemsMarkup = (order?.items || [])
    .map((item) => {
      const customization = describeCustomization(item.customization);

      return `
        <div class="receipt-line">
          <div>
            <div class="receipt-item">${escapeHtml(item.name)}</div>
            <div class="receipt-meta">${escapeHtml(customization || "Classic preparation")}</div>
          </div>
          <div class="receipt-right">
            <div>${escapeHtml(`x${item.qty}`)}</div>
            <div>${escapeHtml(formatCurrency(item.price * item.qty))}</div>
          </div>
        </div>
      `;
    })
    .join("");

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>The Third Sip Receipt</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          background:
            radial-gradient(circle at top, rgba(212,168,83,0.18), transparent 38%),
            linear-gradient(180deg, #f6efe5 0%, #efe4d6 100%);
          color: #24120c;
          min-height: 100vh;
          padding: 32px 18px;
        }
        .receipt-shell {
          max-width: 720px;
          margin: 0 auto;
        }
        .receipt-card {
          background: rgba(255,255,255,0.94);
          border: 1px solid rgba(62,32,3,0.12);
          border-radius: 24px;
          box-shadow: 0 28px 60px rgba(62,32,3,0.15);
          overflow: hidden;
        }
        .receipt-top {
          padding: 30px 34px 24px;
          background: linear-gradient(135deg, #2b160e, #5c3222);
          color: #fff7ef;
        }
        .receipt-brand {
          font-size: 14px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #d9b07a;
          margin-bottom: 10px;
        }
        .receipt-title {
          font-size: 42px;
          margin: 0 0 8px;
          font-style: italic;
        }
        .receipt-sub {
          margin: 0;
          color: rgba(255,247,239,0.78);
          font-size: 15px;
        }
        .receipt-body {
          padding: 28px 34px 34px;
        }
        .receipt-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 26px;
        }
        .receipt-panel {
          padding: 16px 18px;
          border-radius: 16px;
          background: #fbf6ef;
          border: 1px solid rgba(62,32,3,0.08);
        }
        .receipt-panel__label {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9a7557;
          margin-bottom: 8px;
        }
        .receipt-panel__value {
          font-size: 18px;
          line-height: 1.45;
        }
        .receipt-section-title {
          margin: 8px 0 14px;
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9a7557;
        }
        .receipt-items {
          display: grid;
          gap: 12px;
        }
        .receipt-line {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px dashed rgba(62,32,3,0.14);
        }
        .receipt-item {
          font-size: 19px;
          margin-bottom: 4px;
        }
        .receipt-meta {
          font-size: 13px;
          color: #7a5c4a;
        }
        .receipt-right {
          text-align: right;
          min-width: 120px;
          display: grid;
          gap: 6px;
          font-size: 15px;
        }
        .receipt-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid rgba(62,32,3,0.12);
        }
        .receipt-total__label {
          font-size: 14px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9a7557;
        }
        .receipt-total__value {
          font-size: 30px;
          color: #5c3222;
        }
        .receipt-footer {
          margin-top: 22px;
          padding: 18px 20px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(198,156,109,0.16), rgba(212,168,83,0.08));
          color: #5a3928;
          font-size: 15px;
          line-height: 1.7;
        }
        .receipt-raw {
          margin-top: 18px;
          font-family: Consolas, monospace;
          font-size: 12px;
          color: #7a5c4a;
          white-space: pre-wrap;
        }
        @media (max-width: 640px) {
          .receipt-top,
          .receipt-body {
            padding-left: 20px;
            padding-right: 20px;
          }
          .receipt-grid {
            grid-template-columns: 1fr;
          }
          .receipt-title {
            font-size: 34px;
          }
          .receipt-line {
            flex-direction: column;
          }
          .receipt-right {
            text-align: left;
            min-width: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-shell">
        <div class="receipt-card">
          <div class="receipt-top">
            <div class="receipt-brand">The Third Sip</div>
            <h1 class="receipt-title">Order Receipt</h1>
            <p class="receipt-sub">Freshly prepared and recorded for your visit.</p>
          </div>
          <div class="receipt-body">
            <div class="receipt-grid">
              <div class="receipt-panel">
                <div class="receipt-panel__label">Order ID</div>
                <div class="receipt-panel__value">${escapeHtml(order.id)}</div>
              </div>
              <div class="receipt-panel">
                <div class="receipt-panel__label">Status</div>
                <div class="receipt-panel__value">${escapeHtml(order.status)}</div>
              </div>
              <div class="receipt-panel">
                <div class="receipt-panel__label">Guest</div>
                <div class="receipt-panel__value">${escapeHtml(order.customer)}</div>
              </div>
              <div class="receipt-panel">
                <div class="receipt-panel__label">Placed At</div>
                <div class="receipt-panel__value">${escapeHtml(formatPlacedAt(order.createdAt))}</div>
              </div>
            </div>

            <div class="receipt-section-title">Items</div>
            <div class="receipt-items">${itemsMarkup}</div>

            <div class="receipt-total">
              <div class="receipt-total__label">Total</div>
              <div class="receipt-total__value">${escapeHtml(formatCurrency(order.total))}</div>
            </div>

            <div class="receipt-footer">
              Thanks for visiting The Third Sip. Your order has been recorded successfully, and our team will prepare it with care.
            </div>

            <details>
              <summary class="receipt-section-title" style="cursor:pointer; margin-top: 18px;">Raw receipt text</summary>
              <div class="receipt-raw">${escapeHtml(rawReceiptText)}</div>
            </details>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}
