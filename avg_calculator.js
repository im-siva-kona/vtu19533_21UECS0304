const express = require('express');
const http = require('http');

// Use dynamic import for node-fetch
import('node-fetch').then(fetch => {
    const app = express();
    const port = 9678;
    const windowSize = 10;
    let windowNumbers = [];

    // Helper function to fetch numbers from the test server
    async function fetchNumbers(numberId) {
        const url = `http://testserverapi.com/numbers/${numberId}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                return data.numbers;
            } else {
                throw new Error('Failed to fetch numbers from the test server');
            }
        } catch (error) {
            throw new Error('Failed to fetch numbers from the test server');
        }
    }

    // Endpoint to handle requests
    app.get('/numbers/:numberId', async (req, res) => {
        const numberId = req.params.numberId;

        try {
            // Fetch numbers from the test server
            const numbers = await fetchNumbers(numberId);

            // Update window state and remove outdated numbers
            windowNumbers = windowNumbers.concat(numbers).slice(-windowSize);

            // Calculate average
            const windowSum = windowNumbers.reduce((acc, num) => acc + num, 0);
            const windowLength = Math.min(windowSize, windowNumbers.length);
            const average = windowSum / windowLength;

            // Format response
            let response;
            if (numberId === 'c') {
                response = {
                    "numbers": numbers,
                    "windowPrevState": [],
                    "windowCurrState": windowNumbers,
                    "avg": average.toFixed(2)
                };
            } else {
                response = {
                    "numbers": numbers,
                    "windowPrevState": windowNumbers.slice(0, -numbers.length),
                    "windowCurrState": windowNumbers,
                    "avg": average.toFixed(2)
                };
            }

            res.json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Create HTTP server
    const server = http.createServer(app);

    // Start server
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
