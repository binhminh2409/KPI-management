# Documentation for KPI Management Application

## File Structure

- `index.js`: The main server file that sets up the Express.js server, handles the routes and the data from the client side.
- `public/`: Directory containing static files such as HTML, CSS, and client-side JavaScript files.
- `utils/`: Directory containing the methods to fetch and handle page data from Facebook Graph API.
- `package.json`: The project configuration file that includes dependencies and scripts.
- `node_modules`: Installed dependencies

## Dependencies

- `express`: Node.js web application framework.
- `axios`: HTTP client for making API requests.
- `path`: Node.js module for working with file paths.
- `moment`: JavaScript library for parsing, manipulating, and formatting dates.

## Usage

### Setting Up the Server

The main server file, `index.js`, is responsible for setting up the Express.js server and handling the routes. 

```javascript
// Example code snippet
const express = require('express');
const app = express();
app.get('/graph.html', (req,res) => {
  res.sendFile(path.join(__dirname, 'public/graph.html'));
})

app.get('/index.html', function (req, res) {
    //...
});

app.get('/data', (req, res) => {
    //...
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### Fetching the Facebook Graph API Data
The `getFBData()` method is responsible for fetching and handling the Facebook Graph API data, with customizable page metrics like page likes, reach, engagements,...

```javascript
// Example code snippet
const express = require('axios');
const moment = require('moment');
function getFBData(ID, accessToken, datePreset){
    const metricList = ["page_impressions","page_post_engagements","page_fan_adds"];
    const metricListName = ["reach","engagements","page_likes"];
    const apiEndpoint = `https://graph.facebook.com/v16.0/${ID}/insights?metric=${metricList.join(',')}`;
    const params = {
        "access_token": accessToken,
        "date_preset": datePreset
    };
    return new Promise((resolve, reject) => {
      axios.get(apiEndpoint, { params })
      .then((response) => {
        //...
      })
    });
}
```
## Troubleshooting
If you encounter any issues or errors, ensure that the API credentials and endpoints are correctly configured in the fbDataUtils.js file.
Check the console logs for any error messages or warnings.

## Contributing
If you would like to contribute to this project, please fork the repository and create a pull request with your proposed changes.