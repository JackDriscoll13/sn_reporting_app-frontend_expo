// Use this file to store the backend URL
// The backend URL will be changed based on the environment (local dev, docker dev local, docker test server, production)

// For local development, using uvicorn to run the backend server on localhost: 
const backendUrl: string = 'http://127.0.0.1:8000'; // Default uvicorn local dev

// For the docker deployment, the backend server is running on the same docker network as the frontend
// The backend url is the same as the container name
// const backendUrl: string = '/api';



// Mapbox access token, always stays the same
const mapboxAccessToken: string = 'your_mapbox_access_token_here';

export { backendUrl, mapboxAccessToken };