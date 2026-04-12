import QRCode from 'qrcode';

export const generateAgencyQR = async () => {
  const agencyData = {
    name: "R+ TELECOM Agence Principale",
    address: "123 Boulevard Mohammed V, Casablanca",
    phone: "+212 5XX-XXXXXX",
    email: "contact@rplusTelecom.ma",
    website: "https://rplusTelecom.ma",
    maps: "https://maps.google.com/?q=Casablanca+Maroc"
  };

  const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${agencyData.name}
TEL:${agencyData.phone}
EMAIL:${agencyData.email}
ADR:;;${agencyData.address}
URL:${agencyData.website}
END:VCARD`;

  return await QRCode.toDataURL(vCard);
};

export const generateSubscriptionQR = async (subscriptionId) => {
  const url = `https://rplusTelecom.ma/suivi/${subscriptionId}`;
  return await QRCode.toDataURL(url);
};
