# CAS Login Client

## Introduction

Nowadays, numerous services use CAS (Central Authentification Service) to authentificate their users. This module provides a nodejs implementation for creating a logged session on a CAS-authentificated service.

## Disclaimer

While this module can be used to interact with CAS-authenticated services, it is not intended for web scraping purposes. Web scraping involves extracting data from websites without explicit permission from the website owner, which can be considered a violation of the website's terms of service and may lead to legal consequences.

When using this module, you are solely responsible for ensuring that your usage complies with all applicable laws and regulations.

The author and contributors to this module disclaim any responsibility for any damages or legal repercussions arising from the use of the module for web scraping or illegal activities.

By using this module, you acknowledge and agree to the terms of this disclaimer.

## Installation

```bash
#clone the project
git clone "https://github.com/killianmarty/CAS-Login"

#install dependencies
npm install request
npm install cheerio
```

## Usage

### 1. Import module

```javascript
const cas = require("./CAS-Login");
```

### 2. Instantiate CAS Login Client

```javascript
const casURL = 'https://your-cas-server.com/cas';
const serviceURL = 'https://your-service.com';

const cas = new CAS(casURL, serviceURL);
```

### 3. Set your own User-Agent (optionnal)

You might want to set your own User-Agent header for the HTTP requests used by the module. By default, a Mozilla Firefox on Linux User-Agent is set.

```javascript
cas.setUserAgent("Your Custom User-Agent");
```

### 4. Login (asyncronous)

This method will try to login to the specified service with the given CAS server. In case of success, it returns a Cookie Jar containing your logged session cookies !

```javascript
cas.login("username", "password").then((cookieJar)=>{
	console.log("Successfuly logged in!");
}).catch((error)=>{
	console.log("Error : " + error);
});
```
### 5. Send requests to the service (optionnal)

Now that you are logged in, you can perform HTTP GET requests to your service. You can also perform these requests using the nodejs "request" module, using the Cookie Jar returned by the login method (recommended).

This method is mainly implemented for debug purposes.

If you dont specify a service URL to the sendServiceRequest method, the service URL that you specified when you created the CAS object will be used.

```javascript
cas.sendServiceRequest("https://your-service-url/....").then((html)=>{
    console.log("Sucess ! HTML response : " + html);
}).catch((error)){
    console.log("Error : " + error);
}
```

## License

This project is licensed under the MIT License.

## Credits

This package was created by Killian Marty.