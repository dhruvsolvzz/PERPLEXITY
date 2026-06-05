import app from './src/app.js';
import connectDB from './src/config/database.js';import { testAI } from './src/services/ai.services.js';

testAI();


const PORT = process.env.PORT || 3000;
// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});