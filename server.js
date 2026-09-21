const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database Connected Successfully!'))
    .catch(err => console.error('Database Connection Error:', err));

const challanSchema = new mongoose.Schema({
    challanNo: String,
    containerNo: String,
    vesselName: String,
    officeLocation: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const Challan = mongoose.model('Challan', challanSchema);

app.post('/api/challans', async (req, res) => {
    try {
        const savedChallan = await new Challan(req.body).save();
        res.status(201).json({ success: true, data: savedChallan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.get('/api/challans', async (req, res) => {
    try {
        const challans = await Challan.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: challans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
