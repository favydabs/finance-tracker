import mongoose from "mongoose";

interface financialRecord {
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
}

const financialRecordSchema = new mongoose.Schema<financialRecord>({
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, required: true },
});

const FinancialRecordModel = mongoose.model<financialRecord>('FinancialRecord', financialRecordSchema);

export default FinancialRecordModel;
