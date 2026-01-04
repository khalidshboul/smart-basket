/**
 * Bill Generator Utility
 * Generates HTML for PDF bill/receipt
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { StoreComparisonResult } from '../types';

/**
 * Generates HTML string for the bill receipt
 */
export function generateBillHtml(store: StoreComparisonResult): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const availableItems = store.itemPrices.filter(item => item.available);
  const itemsHtml = availableItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #eee; color: #333;">${item.referenceItemName}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #eee; text-align: right; color: #333; font-weight: 500;">${item.price.toFixed(2)} ${store.currency}</td>
        </tr>
      `
    )
    .join('');

  const missingHtml =
    store.missingItems.length > 0
      ? `
        <div style="margin-top: 30px;">
          <div style="background-color: #FEE2E2; padding: 10px 16px; border-radius: 8px 8px 0 0;">
            <h3 style="margin: 0; color: #B91C1C; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Missing Items</h3>
          </div>
          <div style="background-color: #FEF2F2; border: 1px solid #FEE2E2; border-top: none; border-radius: 0 0 8px 8px; padding: 8px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              ${store.missingItems.map(item => `
                <tr>
                  <td style="padding: 10px 16px; color: #7F1D1D;">${item}</td>
                  <td style="padding: 10px 16px; text-align: right; color: #EF4444; font-weight: bold;">✕</td>
                </tr>
              `).join('')}
            </table>
          </div>
        </div>
      `
      : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          padding: 40px;
          background-color: #ffffff;
          color: #1a1a1a;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .store-logo {
          font-size: 32px;
          font-weight: 800;
          color: #10B981;
          margin: 0;
          letter-spacing: -1px;
        }
        .date {
          color: #6B7280;
          font-size: 14px;
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .section-header {
          background-color: #ECFDF5;
          padding: 10px 16px;
          border-radius: 8px 8px 0 0;
          margin-top: 20px;
        }
        .section-title {
          margin: 0;
          color: #047857;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #E5E7EB;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }
        
        .total-section {
          margin-top: 40px;
          padding: 24px;
          background-color: #F9FAFB;
          border-radius: 12px;
          text-align: center;
        }
        .total-label {
          color: #6B7280;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .total-amount {
          font-size: 42px;
          font-weight: 800;
          color: #111827;
          letter-spacing: -1px;
          margin: 0;
        }
        
        .footer {
          margin-top: 60px;
          text-align: center;
          border-top: 1px solid #E5E7EB;
          padding-top: 20px;
        }
        .footer-logo {
          font-weight: bold;
          color: #4B5563;
          font-size: 14px;
        }
        .footer-tagline {
          color: #9CA3AF;
          font-size: 12px;
          margin-top: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="store-logo">${store.storeName}</h1>
        <p class="date">${date}</p>
      </div>
      
      <div class="section-header">
        <h3 class="section-title">Available Items</h3>
      </div>
      <table class="items-table">
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      ${missingHtml}

      <div class="total-section">
        <div class="total-label">Total Amount</div>
        <h2 class="total-amount">${store.totalPrice.toFixed(2)} ${store.currency}</h2>
      </div>

      <div class="footer">
        <p class="footer-logo">Smart Basket</p>
        <p class="footer-tagline">Optimize Your Grocery Shopping</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates and shares a PDF bill for the given store
 */
export async function downloadBill(store: StoreComparisonResult): Promise<void> {
  try {
    const html = generateBillHtml(store);

    // Generate PDF file
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Share the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `${store.storeName} - Shopping List`,
        UTI: 'com.adobe.pdf',
      });
    } else {
      console.warn('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error generating bill:', error);
    throw error;
  }
}
