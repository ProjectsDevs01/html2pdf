const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' })); 
app.use(cors());

app.post('/generate-pdf', async (req, res) => {
    const { htmlContent } = req.body;
    const outputFile = 'output.pdf';

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ path: outputFile, format: 'A4' });
        await browser.close();

        const fileStream = fs.createReadStream(outputFile);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
