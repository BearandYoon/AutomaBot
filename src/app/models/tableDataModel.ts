export class ConversionTableModel {
  id: string;
  date: string;
  name: string;
  senderId: string;
  platform: string;
  interest: string;
  query_count: string;
  conversion_count: string;
}

export class ClientMessageTableModel {
  id: string;
  date: string;
  name: string;
  phoneNumber: string;
  message: string;
}

export class CMARequestTableModel {
  id: string;
  date: string;
  name: string;
  contact: string;
  location: string;
  address: string;
}

export class ListingUpdateTableModel {
  id: string;
  date: string;
  name: string;
  contact: string;
  price: string;
  beds: string;
  baths: string;
  propertyType: string;
  location: string;
}

export class SoldAlertsTableModel {
  id: string;
  date: string;
  name: string;
  contact: string;
  location: string;
  address: string;
}