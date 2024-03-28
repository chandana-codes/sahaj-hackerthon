const fs = require("fs").promises;
const dataPath = "./businessListings.json";

async function readBusinessListings() {
  try {
    const data = await fs.readFile(dataPath);
    return JSON.parse(data);
  } catch(err) {
    console.error('Error occured while reading fs-store', err.message);
  }
};

async function writeBusinessListings(data) {
  try{
    const currentData = await readBusinessListings();
    const newData = {
      ...currentData || {},
      [data.businessListingId]: data
    };
    const writeData = await fs.writeFile(dataPath, JSON.stringify(newData));
  }catch(err) {
    console.error("Error occured while writing fs-store", err.message);
  }
};

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

function create(businessListingRequest) {
  const businessListingsData = readBusinessListings();
  const businessListings = Object.values(businessListingsData);
  const existingListing = businessListings.find(listing => listing.businessName === businessListingRequest.businessName);

  if (existingListing) {
      return null; 
  }

  const businessListingId = generateUniqueId();
  const newBusinessListing = {
      businessListingId,
      businessName: businessListingRequest.businessName,
      ownerName: businessListingRequest.ownerName,
      category: businessListingRequest.category,
      city: businessListingRequest.city,
      establishmentYear: businessListingRequest.establishmentYear
  };

  writeBusinessListings(newBusinessListing);
  return newBusinessListing;
};

function read(id) {
  const businessListingsData = readBusinessListings();
  return businessListingsData[id] || null;
};

function readAll() {
  return readBusinessListings();
};

function search(searchRequest) {
    const { condition, fields } = searchRequest;
    const businessListingsData = readBusinessListings();
    const businessListings = Object.values(businessListingsData);

    if (!condition || !fields || fields.length === 0) {
        return []; 
    }

    const filterFunction = (listing) => {
        return fields.every(criteria => {
            const { fieldName, eq, neq } = criteria;

            if (eq !== undefined) {
                return listing[fieldName] === eq;
            } else if (neq !== undefined) {
                return listing[fieldName] !== neq;
            }

            return false;
        });
    };

    const filteredListings = (condition.toUpperCase() === 'AND')
        ? businessListings.filter(filterFunction)
        : businessListings.filter(listing => fields.some(criteria => filterFunction({ ...listing }, criteria)));

    return filteredListings;
};

function aggregate(aggregateCriteria) {
    const { groupByFields, aggregationRequests } = aggregateCriteria;
    const businessListingsData = readBusinessListings();
    const businessListings = Object.values(businessListingsData);

    if (!groupByFields || !aggregationRequests || groupByFields.length === 0 || aggregationRequests.length === 0) {
        return []; 
    }

    const calculateAggregation = (aggregationFunction, values) => {
        switch (aggregationFunction.toUpperCase()) {
            case 'COUNT':
                return values.length;
            case 'MIN':
                return Math.min(...values);
            case 'MAX':
                return Math.max(...values);
            default:
                return null;
        }
    };

    const groupedListings = businessListings.reduce((groups, listing) => {
        const key = groupByFields.map(field => listing[field]).join('-');
        (groups[key] = groups[key] || []).push(listing);
        return groups;
    }, {});

    const aggregatedResults = Object.entries(groupedListings).map(([groupKey, listings]) => {
        const groupObject = {};
        groupByFields.forEach((field, index) => {
            groupObject[field] = listings[0][field]; 
        });

        aggregationRequests.forEach(request => {
            const { fieldName, function: aggregationFunction, alias } = request;
            const values = listings.map(listing => listing[fieldName]);
            groupObject[alias] = calculateAggregation(aggregationFunction, values);
        });

        return groupObject;
    });

    return aggregatedResults;
};

module.exports = { create, read, search, readAll, aggregate};