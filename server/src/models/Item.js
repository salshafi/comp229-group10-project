import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1500 },
  category: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Bags', 'Books', 'Accessories', 'Keys', 'Other'] },
  type: { type: String, required: true, enum: ['lost', 'found'] },
  location: { type: String, required: true, trim: true, maxlength: 120 },
  date: { type: Date, required: true },
  status: { type: String, enum: ['open', 'claimed', 'returned'], default: 'open' },
  contactEmail: { type: String, required: true, lowercase: true, trim: true },
  imageUrl: { type: String, trim: true, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

itemSchema.index({ title: 'text', description: 'text', location: 'text' });
export default mongoose.model('Item', itemSchema);
