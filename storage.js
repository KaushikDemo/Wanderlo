/**
 * @class TripDataStorage
 * @classdesc A Singleton class to consolidate and manage all user and trip data
 * from sessionStorage and localStorage.
 */
class TripDataStorage {
    // Private field to hold the single instance of the class.
    static #instance;

    /**
     * The constructor is made private to enforce the Singleton pattern.
     * It initializes the data properties.
     */
    constructor() {
        if (TripDataStorage.#instance) {
            throw new Error("Singleton class. Use TripDataStorage.getInstance() to get the object.");
        }
        this.userData = {};
        this.tripDetails = {};
        this.destinationDetails = {};
        this.guideDetails = {};
        this.calculatedCosts = {};
    }

    /**
     * Provides access to the single instance of the TripDataStorage class.
     * @returns {TripDataStorage} The single instance of the class.
     */
    static getInstance() {
        if (!TripDataStorage.#instance) {
            TripDataStorage.#instance = new TripDataStorage();
        }
        return TripDataStorage.#instance;
    }

    /**
     * A private helper method to calculate age from a date of birth string.
     * @param {string} dobString - The date of birth in 'YYYY-MM-DD' format.
     * @returns {number|null} The calculated age or null if the input is invalid.
     */
    #calculateAge(dobString) {
        if (!dobString) return null;
        const dob = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    /**
     * Loads all data from sessionStorage and localStorage, populating the class properties.
     * This is the main method to gather all information from the user's journey.
     */
    loadAllData() {
        // 1. Extract User Data (from index.html via sessionStorage)
        const userFirstName = sessionStorage.getItem('userFirstName');
        const userLastName = sessionStorage.getItem('userLName');
        const userDOB = sessionStorage.getItem('userDOB');
        this.userData = {
            firstName: userFirstName,
            lastName: userLastName,
            fullName: `${userFirstName} ${userLastName}`,
            email: sessionStorage.getItem('userEmail'),
            mobile: sessionStorage.getItem('userMobile'),
            gender: sessionStorage.getItem('userGender'),
            dob: userDOB,
            age: this.#calculateAge(userDOB)
        };

        // 2. Extract Trip Planning Details (from page 2.html via sessionStorage)
        this.tripDetails = {
            travelerCount: parseInt(sessionStorage.getItem('numTravelers'), 10),
            durationInDays: parseInt(sessionStorage.getItem('tripDuration'), 10),
            // Note: Start and End dates are not saved to storage in the provided files,
            // but duration and traveler count are.
        };

        // 3. Extract Destination Package Details (from page 3.html via localStorage)
        const destinationData = JSON.parse(localStorage.getItem('selectedDestination'));
        this.destinationDetails = {
            name: destinationData?.name || 'N/A',
            costPerDay: destinationData?.price || 0,
            image: destinationData?.image || ''
        };

        // 4. Extract Guide Data (from page 4.html via localStorage)
        const guideData = JSON.parse(localStorage.getItem('selectedGuide'));
        this.guideDetails = {
            name: guideData?.name || 'N/A',
            age: guideData?.age || 'N/A',
            gender: guideData?.gender || 'N/A',
            specialty: guideData?.specialty || 'N/A',
            rating: guideData?.rating || 'N/A',
            languages: guideData?.languages || []
        };
        
        // 5. Calculate and store the final expense breakdown (logic from final image.html)
        this.#calculateAndStoreCosts();
    }
    
    /**
     * Private method to perform the final cost calculation based on loaded data.
     */
    #calculateAndStoreCosts() {
        if (!this.destinationDetails.costPerDay || !this.tripDetails.travelerCount || !this.tripDetails.durationInDays) {
            this.calculatedCosts = { error: "Missing data for cost calculation." };
            return;
        }

        const totalCost = this.destinationDetails.costPerDay * this.tripDetails.travelerCount * this.tripDetails.durationInDays;

        const percentages = {
            accommodation: 0.33,
            food: 0.22,
            transportation: 0.15,
            activities: 0.15,
            guide: 0.08,
        };

        const accommodationCost = totalCost * percentages.accommodation;
        const foodCost = totalCost * percentages.food;
        const transportationCost = totalCost * percentages.transportation;
        const activitiesCost = totalCost * percentages.activities;
        const guideCost = totalCost * percentages.guide;
        const miscCost = totalCost - (accommodationCost + foodCost + transportationCost + activitiesCost + guideCost);

        const formatCurrency = (amount) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

        this.calculatedCosts = {
            accommodation: formatCurrency(accommodationCost),
            foodAndDining: formatCurrency(foodCost),
            transportation: formatCurrency(transportationCost),
            activities: formatCurrency(activitiesCost),
            guideServices: formatCurrency(guideCost),
            miscellaneous: formatCurrency(miscCost),
            total: formatCurrency(totalCost)
        };
    }


    /**
     * Returns a consolidated object of all stored data for easy viewing.
     * @returns {object} An object containing all user, trip, destination, and guide data.
     */
    getAllData() {
        return {
            user: this.userData,
            trip: this.tripDetails,
            destination: this.destinationDetails,
            guide: this.guideDetails,
            costs: this.calculatedCosts
        };
    }
}