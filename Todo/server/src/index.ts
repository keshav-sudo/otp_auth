
import express from 'express';
import cookieParser from 'cookie-parser'; 
import config from "../src/config/dotenv.ts"
import authRoutes from './routes/auth.routes.ts'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cookieParser());


app.use('/api/v1', authRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the MERN stack API!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});