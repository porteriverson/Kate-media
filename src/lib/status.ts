const invoiceStatusRank: Record<string, number> = {
  creating: 0,
  draft: 0,
  open: 1,
  payment_failed: 1,
  uncollectible: 2,
  paid: 3,
  void: 3,
  failed: 0,
};

export function shouldAdvanceInvoiceStatus(current: string, next: string) {
  return (invoiceStatusRank[next] ?? 0) >= (invoiceStatusRank[current] ?? 0);
}
