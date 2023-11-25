const businessListings = [];

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


  return null;

};

function read(id) {
  return null;
}

function readAll(){
  return [];
}

function search(searchCriteria){
  return [];
}

function aggregate(aggregateCriteria){
  return [];
}

module.exports = {create, read, readAll, search, aggregate}