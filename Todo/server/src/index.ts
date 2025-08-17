
import express from 'express';
import cookieParser from 'cookie-parser'; 
import config from "../src/config/dotenv.ts"
import authRoutes from './routes/auth.routes.ts'; 
import userRoutes  from '../src/routes/user.routes.ts';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use(cors({
  origin: "http://localhost:5173/", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
}));
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the MERN stack API!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});