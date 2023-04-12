import axios from 'axios';

let client = axios.create();
client.defaults.baseURL = process.env.REACT_APP_HOST;

class MockAxios {
    post (url, params) {
        let mockingClient = axios.create();
        mockingClient.defaults.baseURL = process.env.REACT_APP_HOST;
        console.log('Mocking Axios', url);
        return mockingClient.get(url + '.json', params);
    }
}

if (process.env.NODE_ENV === "development") {
    client = new MockAxios();
}

export default client;