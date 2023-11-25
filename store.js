const businessListings = {
  businessListingId: string
  businessName: string,
  ownerName: string,
  category: string,
  city: string,
  establishmentYear: int
};

function create(businessListingRequest) {
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

    businessListings.push(newBusinessListing);
    return newBusinessListing;

  function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }

};

function read(id) {
    const foundListing = businessListings.find(listing => listing.businessListingId === id);

    if (foundListing) {
        return foundListing;
    }
    return null;
};

function readAll(){
  return businessListings;
}

function search(searchCriteria){
    const { condition, fields } = searchRequest;
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

function aggregate(aggregateCriteria){
  return [];
}

module.exports = {create, read, readAll, search, aggregate}