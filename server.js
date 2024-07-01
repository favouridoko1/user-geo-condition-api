const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const apiKey = process.env.apiKey

app.get('/', (req, res)=> {
    res.status(200).json({ success: true, data: "Welcome new user" })
});

app.get('/api/hello', async(req, res)=> {
        const geoResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const geoData = await geoResponse.json();

        const tempResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geoData.latitude}&lon=${geoData.longitude}&appid=${apiKey}`);
        const tempData = await tempResponse.json();
        const tempInCelcius = Math.round(tempData.main.temp-273.15) 
    
    try {
        if(req.query.visitor_name) {
           const name = req.query.visitor_name
           return res.status(200).json({ success: true, client_ip: geoData.ip, location: geoData.city, greetings: `Hello ${name}!, the temperature is ${tempInCelcius} degrees Celcius in ${geoData.city}` });
        }
        res.status(200).json({ success: true, message:`Welcome to user geographical condition app` });

    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
})

app.listen(port, ()=> console.log(`Server listening on port ${port}`))