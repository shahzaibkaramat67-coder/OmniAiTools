import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHistory extends Document {
  userId:      mongoose.Types.ObjectId;
  toolSlug:    string;
  toolName:    string;
  category:    string;
  input:       string;
  output:      string;
  creditsUsed: number;
  createdAt:   Date;
  updatedAt:   Date;
}

const HistorySchema = new Schema<IHistory>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: "User", required: true },
    toolSlug:    { type: String, required: true },
    toolName:    { type: String, required: true },
    category:    { type: String, required: true },
    input:       { type: String, required: true, maxlength: 1000 },
    output:      { type: String, required: true, maxlength: 5000 },
    creditsUsed: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// Compound index for fast per-user queries sorted by date
HistorySchema.index({ userId: 1, createdAt: -1 });
HistorySchema.index({ userId: 1, category: 1 });
HistorySchema.index({ userId: 1, toolSlug: 1 });

const History: Model<IHistory> =
  mongoose.models.History || mongoose.model<IHistory>("History", HistorySchema);

export default History;
