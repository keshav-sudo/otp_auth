// tests/registertest.node.ts
import axios from "axios";

async function run() {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/v1/register",
      {
        name: "Test User",
        email: "test@example.com",
        password: "123456",
        role: "USER"
      },
      { withCredentials: true }
    );
    console.log("✅ Register success:", res.data);
  } catch (err) {
    console.error("❌ Register failed:", err);
  }
}

run();
