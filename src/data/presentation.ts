import { BankCard, Contact, Transaction } from '@/types';

const friends = [
  ['briana', 'Briana Filip', 'BF', '#6998ba', 12, false, 'Wed', 2],
  ['darius', 'Darius Gligor', 'DG', '#8053ff', 10, true, 'Wed', 0],
  ['rares', 'Rareș Roman', 'RR', '#ffac00', 1, true, 'Tue', 0],
  ['andrei-durla', 'Andrei Durla', 'AD', '#66918b', 46, true, 'Tue', 0],
  ['angelica', 'ANGELICA ADRIANA BALAJ', 'AB', '#c39c7b', 22.99, false, 'Tue', 1],
  ['raisa', 'Raisa Sabau', 'RS', '#b86f85', 50, false, '7 Sep', 1],
  ['mihaela', 'Mihaela Ioana Laslau', 'MI', '#2baef0', 6, false, '1 Sep', 0],
  ['luca', 'Luca Bucurean', 'LB', '#22bcc7', 20, false, '16 Aug', 0],
  ['diana', 'Diana Codruta Tipi', 'DC', '#6897b9', 820, false, '4 Aug', 0],
] as const;

// Presentation fixtures transcribed from the supplied references. No real account identifiers.
export const presentationContacts: Contact[] = friends.map(([id,name,initials,avatarColor,amount,isSender,dateLabel,unread]) => ({
  id: `c-${id}`, name, initials, avatarColor, phone: '', iban: 'Demo contact account', unread,
  transfers: [{id:`reference-${id}`,amount,currency:'RON',isSender,dateLabel,timeLabel:'21:08',status:'completed'}],
}));

const entries = [
  ['carrefour', 'Carrefour', -8.61, '21:35', 'Groceries'],
  ['briana', 'Briana Filip', 12, '21:08', 'Transfers'],
  ['chantia', 'Chantia', -22, '21:08', 'Shopping'],
  ['kfc', 'Kfc', -19.90, '19:51', 'Restaurants'],
  ['city-market', 'City Market', -6.50, '19:08', 'Groceries'],
  ['primaria', 'Primaria Oradea', -3, '14:47', 'General'],
  ['nufaru', 'Nufaru Nonstop', -10, '10:55', 'Groceries'],
  ['nufaru-small', 'Nufaru Nonstop', -2.30, '10:54', 'Groceries'],
] as const;
export const presentationTransactions: Transaction[] = entries.map(([id,title,amount,timestamp,category],index) => ({
  id:`reference-${id}`,title,amount,timestamp,category,currency:'RON',date:'Yesterday',
  subtitle: amount>0?'Received from Briana':'Card payment',brand: amount>0?'Contact':title,
  isIncoming:amount>0,status:'completed',rawDate:Date.UTC(2026,8,30,21,35)-index*60000,
  ...(amount>0?{contactId:'c-briana',contactName:'Briana Filip'}:{}),
}));

const cardRows = [
  ['shopping-blue', 'Online Shopping', '0791', '12/30', 'neon_purple', 'mastercard'],
  ['disposable', 'Disposable', '9942', '12/30', 'platinum', 'visa'],
  ['blood', 'Online Shopping', '0177', '11/30', 'blood_drip', 'visa'],
  ['surge', 'Surge', '0345', '01/31', 'cyan_glow', 'mastercard'],
  ['orange', 'b', '2470', '01/31', 'mclaren', 'mastercard'],
  ['lavender', 'Maria · Lavender', '0781', '10/30', 'neon_purple', 'mastercard'],
  ['shirt', 'Shirt Sash', '9349', '01/31', 'platinum', 'visa'],
] as const;
export const presentationCards: BankCard[] = cardRows.map(([id,name,last4,expiry,theme,scheme])=>({
  id:`card-${id}`,name,last4,expiry,theme,scheme,type:id==='disposable'?'disposable':'virtual',
  fullNumber:`0000 0000 0000 ${last4}`,cvv:'000',isFrozen:id==='shirt',status:id==='shirt'?'frozen':'active',
}));
