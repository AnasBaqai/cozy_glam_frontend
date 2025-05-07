// Interface for flash message
export interface FlashMessage {
  type: "success" | "error";
  message: string;
  timestamp: number;
}

// Interface for sales data
export interface SalesData {
  today: number;
  last7Days: number;
  last31Days: number;
  last90Days: number;
}

// Interface for listings data
export interface ListingsData {
  active: number;
  drafts: number;
  auctionsEnding: number;
  unsold: number;
}

// Interface for orders data
export interface OrdersData {
  awaiting: number;
  returns: number;
  canceled: number;
  awaitingPayment: number;
  awaitingFeedback: number;
}

// Interface for traffic data
export interface TrafficData {
  impressions: number;
  clickRate: number;
  pageViews: number;
  conversionRate: number;
}
