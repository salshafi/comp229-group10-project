import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
const PORT = process.env.PORT || 5000;
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Missing MONGODB_URI or JWT_SECRET. Configure server/.env using .env.example.');
  process.exit(1);
}
await connectDB();
app.listen(PORT, () => console.log(`FindIt API running at http://localhost:${PORT}`));
