require("dotenv").config();
console.log("SERPAPI_KEY loaded?", !!process.env.SERPAPI_KEY);
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/search", require("./routes/search"));

app.get("/", (req, res) => {
  res.json({ message: "PriceRaid backend running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});