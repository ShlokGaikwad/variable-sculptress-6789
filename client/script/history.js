// Function to fetch data from a specified endpoint with a bearer token
async function fetchData(endpoint, token) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Add other headers if needed
        },
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  }
  
  // Function to fetch result details based on resultId
  async function fetchResultDetails(resultId, token) {
    const endpoint = `http://localhost:3000/results/${resultId}`;
    return fetchData(endpoint, token);
  }
  
  // Main function to fetching and processing data
  async function main() {
    try {
      let userId = localStorage.getItem("userId");
      let token = localStorage.getItem("token");
      console.log(userId);
  
      if (!userId || !token) {
        console.error('userId or token is not defined.');
        return;
      }
  
      // Fetch histories with bearer token
      const histories = await fetchHistories(userId, token);
      console.log('Histories:', histories);
  
      // Example: Fetch details for the first result in histories with bearer token
      if (histories && histories.length > 0) {
        const firstResultId = histories[0].resultId;
        const resultDetails = await fetchResultDetails(firstResultId, token);
        console.log('Result Details:', resultDetails);
      } else {
        console.log('No histories available.');
      }
    } catch (error) {
      console.error('Error in main function:', error);
    }
  }
  
  // Call the main function
  main();
  