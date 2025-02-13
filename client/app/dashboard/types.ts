import { z } from "zod";

export const financialRecordSchema = z.object({
  description: z.string().min(1, "Description is required").max(100, "Description is too long"),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  category: z.enum(["food", "rent", "salary", "utilities", "entertainment", "other"], {
    required_error: "Please select a category",
  }),
  paymentMethod: z.enum(["credit-card", "cash", "bank-transfer"], {
    required_error: "Please select a payment method",
  }),
});

export type FinancialRecord = z.infer<typeof financialRecordSchema>;
export type PaymentMethod = z.infer<typeof financialRecordSchema.shape.paymentMethod>;
export type Category = z.infer<typeof financialRecordSchema.shape.category>;