const express = require("express")
const cors = require("cors")
const { initializeDatabase } = require("./db/db.connect")
const Agent = require("./models/agent.model.js")

initializeDatabase()

const app = express();
app.use(express.json())
app.use(cors({
    origin: "*",
    credentials: true
}))
app.post("/agents", async(req, res) => {

    try {

        const data = req.body;
        const agent = new Agent(data);

        const savedAgent = await agent.save();
        if (savedAgent) {
            res.status(201).json({ message: "Agent Saved Successfully", agent: savedAgent })
        }

    } catch (error) {
        res.status(500).json({ message: "Agent Cannot be Added." })
    }

})

app.get("/agents", async(req, res) => {
    try {

        const agents = await Agent.find();
        if (agents.length > 0) {
            res.json(agents)
        } else {
            res.status(404).json({ error: "Product Not Found", error })
        }


    } catch (error) {
        res.status(500).json({ message: "Cannot fetch Products." })
    }
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server running on PORT", PORT)
})