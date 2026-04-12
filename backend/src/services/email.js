import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_xxxxxxxxxxxxxxxxxxxx');
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

/**
 * Send Welcome Email to Client
 */
export const sendWelcomeEmail = async ({ clientName, clientEmail, offerName, totalPrice, subscriptionId }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; color: #111;">
      <div style="background-color: #CC0000; padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px;">R+ TELECOM</h1>
      </div>
      <div style="padding: 40px;">
        <h2 style="color: #CC0000;">Bienvenue chez R+ TELECOM, ${clientName} !</h2>
        <p style="font-size: 16px; line-height: 1.6;">Nous avons bien reçu votre demande de souscription. Notre équipe est ravie de vous compter parmi nos futurs clients.</p>
        
        <table style="width: 100%; margin: 30px 0; border-collapse: collapse; background-color: #f9f9f9; border-radius: 8px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px; font-weight: bold;">Offre choisie :</td>
            <td style="padding: 15px;">${offerName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px; font-weight: bold;">Montant mensuel :</td>
            <td style="padding: 15px; color: #CC0000; font-weight: bold;">${totalPrice} DH</td>
          </tr>
          <tr>
            <td style="padding: 15px; font-weight: bold;">Référence :</td>
            <td style="padding: 15px; font-family: monospace;">${subscriptionId.substring(0, 8)}</td>
          </tr>
        </table>

        <p style="font-size: 14px; background-color: #FFF0F0; padding: 15px; border-left: 4px solid #CC0000; color: #CC0000;">
          <strong>Prochaine étape :</strong> Notre équipe traitera votre demande dans les 24h. Vous recevrez un email dès que votre accès sera prêt.
        </p>
        
        <p style="margin-top: 30px;">Besoin d'aide ? Contactez-nous à <a href="mailto:contact@rplusTelecom.ma" style="color: #CC0000; text-decoration: none;">contact@rplusTelecom.ma</a></p>
      </div>
      <div style="background-color: #111; padding: 15px; text-align: center; color: white; font-size: 12px;">
        &copy; 2026 R+ TELECOM — Casablanca, Maroc
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `R+ TELECOM <${FROM_EMAIL}>`,
      to: [clientEmail],
      subject: "Bienvenue chez R+ TELECOM — Votre souscription est enregistrée",
      html,
    });

    if (error) {
      console.error('Resend Error (Welcome):', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Service Error (Email):', err);
    throw err;
  }
};

/**
 * Send Status Update Email
 */
export const sendStatusEmail = async ({ clientName, clientEmail, status, subscriptionId, offerName }) => {
  const isApproved = status === 'approved';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; color: #111;">
      <div style="background-color: ${isApproved ? '#10b981' : '#CC0000'}; padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Statut de votre demande</h1>
      </div>
      <div style="padding: 40px;">
        <h2 style="color: ${isApproved ? '#10b981' : '#CC0000'};">
          ${isApproved ? 'Félicitations !' : 'Mise à jour de votre demande'}
        </h2>
        <p style="font-size: 16px; line-height: 1.6;">
          ${isApproved 
            ? `Votre souscription R+ TELECOM pour <strong>${offerName}</strong> a été approuvée. Votre service sera activé sous 48h.`
            : `Nous sommes au regret de vous informer que votre demande de souscription n'a pas pu être validée pour le moment.`}
        </p>
        
        <p style="margin-top: 30px;">Référence de la demande : <strong>${subscriptionId.substring(0, 8)}</strong></p>
        
        <p style="margin-top: 20px;">
          ${isApproved 
            ? 'Nos techniciens prendront contact avec vous très prochainement.' 
            : 'Pour plus d\'informations, vous pouvez contacter notre support à contact@rplusTelecom.ma'}
        </p>
      </div>
      <div style="background-color: #111; padding: 15px; text-align: center; color: white; font-size: 12px;">
        &copy; 2026 R+ TELECOM — Casablanca, Maroc
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `R+ TELECOM <${FROM_EMAIL}>`,
      to: [clientEmail],
      subject: isApproved 
        ? "Félicitations ! Votre souscription R+ TELECOM est approuvée" 
        : "Mise à jour de votre demande R+ TELECOM",
      html,
    });

    if (error) {
      console.error('Resend Error (Status):', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Service Error (Email Status):', err);
    throw err;
  }
};

/**
 * Send Admin Notification
 */
export const sendAdminNotification = async ({ adminEmail, clientName, offerName, totalPrice, subscriptionId }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #111;">
      <h2 style="color: #CC0000; border-bottom: 2px solid #CC0000; padding-bottom: 10px;">Nouvelle souscription reçue</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 10px; border: 1px solid #eee;"><strong>Client :</strong></td><td style="padding: 10px; border: 1px solid #eee;">${clientName}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #eee;"><strong>Offre :</strong></td><td style="padding: 10px; border: 1px solid #eee;">${offerName}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #eee;"><strong>Montant :</strong></td><td style="padding: 10px; border: 1px solid #eee;">${totalPrice} DH/mois</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #eee;"><strong>ID :</strong></td><td style="padding: 10px; border: 1px solid #eee;">${subscriptionId}</td></tr>
      </table>
      <p style="margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/admin/demandes/${subscriptionId}" style="background-color: #CC0000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Gérer la demande
        </a>
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: `R+ TELECOM System <${FROM_EMAIL}>`,
      to: [adminEmail || 'admin@rplusTelecom.ma'],
      subject: `Nouvelle souscription — ${clientName} — ${offerName}`,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error('Admin Email Error:', err);
    return { success: false, error: err.message };
  }
};
