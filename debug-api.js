// Quick debug script to test the API
async function testAPI() {
    try {
        console.log('Testing API...');
        const response = await fetch('http://localhost:3000/api/questions');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        console.log('Success:', data.success);
        console.log('Data type:', typeof data.data);
        console.log('Data length:', data.data?.length);
        console.log('First topic:', data.data?.[0]);
    } catch (error) {
        console.error('API Error:', error);
    }
}

testAPI();