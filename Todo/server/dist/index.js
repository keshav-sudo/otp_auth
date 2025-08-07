// server/src/index.ts
import express from "express";
import config from "./config/dotenv"; // Aapki config file ko sahi tarah se import karein
const app = express();
const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map