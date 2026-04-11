export interface TransactionRequestV1 {
    type?: string;
    amount?: number;
    payment_method?: string;
}

export interface ReviewTransactionRequestV1 {
    status: 'approved' | 'rejected';
}
