export const API_URL = process.env.API_URL ?? "https://localhost:7184";
export const BANK_ACCOUNT = process.env.BANK_ACCOUNT ?? "10987654321";
export const BANK_ID = process.env.BANK_ID ?? "970415";
export const BANK_NAME = process.env.BANK_NAME ?? "Vietinbank";
export const ORDER_STATUS = {
  PENDING: 0,
  CLOSED: 1,
  SUCCESS: 2,
  CONFIRM: 3,
};
