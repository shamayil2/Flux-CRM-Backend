const express = require("express")
const cors = require("cors")
const { initializeDatabase } = require("./db/db.connect")
const Agent = require("./models/agent.model.js")
const Lead = require("./models/lead.model.js")

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
        } else {
            res.status()
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

app.post("/leads", async(req, res) => {
    try {
        const data = req.body;
        const requiredKeys = ["name", "source", "salesAgent", "status", "tags", "timeToClose", "priority"];
        const agents = await Agent.find();
        for (const key of requiredKeys) {
            if (key in data && (data[key] != "" || data[key] != 0 || data[key].length > 0) && key != "salesAgent") {
                continue;
            } else if (key == "salesAgent") {
                let matched = false;
                for (ele of agents) {
                    if (ele._id == data[key]) {
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    res.status(404).json({ error: `Sales agent with ID '${data[key]}' not found.` })
                }

            } else {
                res.status(400).json({ error: `Invalid input: '${key}' is required.` })
            }
        }

        const leadObj = new Lead(data);
        const savedObj = await leadObj.save();

        if (savedObj) {
            res.status(201).json({ message: "Lead Created", lead: savedObj })
        }

    } catch (error) {
        res.status(500).json({ message: "Could Not Add the Lead.", error })
    }
})

app.get("/leads", async(req, res) => {
    try {
        const agentAssigned = req.query.salesAgent;
        const leadStatus = req.query.status;
        const leadTags = req.query.tags;
        const source = req.query.source;
        const filter = {};
        const agents = await Agent.find();
        const statusArr = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'];
        if (agentAssigned) filter.salesAgent = agentAssigned;
        if (leadStatus && statusArr.includes(leadStatus)) {
            filter.status = leadStatus;
        } else {
            res.status(400).json({ error: "Invalid input: 'status' must be one of ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed']." })
        }
        if (leadTags) filter.tags = leadTags;
        if (source) filter.source = source;


        const leadsList = await Lead.find(filter).populate("salesAgent");
        if (leadsList) {
            res.json(leadsList)
        } else {
            res.status(404).json({ message: "Leads Not Found" })
        }

    } catch (error) {
        res.status(500).json({ message: "Cannot fetch The Leads", error })
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running on PORT", PORT)
})