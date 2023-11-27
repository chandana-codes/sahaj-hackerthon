const express = require('express');
const app = express();
const store = require("./store")

const PORT = process.env.PORT || 8080;

// Greeting 
app.get('/greeting', (req, res) => {
    return res.send('Hello world!');
});

// Register business
app.post('/business-listing', (req, res) => {
    const businessListingRequest = req.body;
    const businessListing = store.create(businessListingRequest)
    if(!businessListing){
        return res.status(400);
    }
    return res.status(201).send(store.create(businessListingRequest));
});

// Get business listing
app.get('/business-listing/:id', (req, res) => {
    const id = req.params.id;
    const businessListing = store.read(id);
    if(!businessListing){
        const msg = "Business listing with "+id+" was not found";
        return res.status(404).json(({ message : msg }));
    }
    return res.send(businessListing);
});

// Get all business listing
app.get('/business-listings/all', (req, res) => {
    const businessListings = store.readAll()
    return res.send(businessListings);
});


app.post('/business-listings/search', (req, res) => {
    const businessListings = store.search(req.body);
    return res.send(businessListings);
});

app.listen(PORT, () => {
    console.log("Server running at PORT", PORT);
});