# CAS Login Client

## Introduction

Nowadays, numerous services use CAS (Central Authentication Service) to authenticate their users. This module provides a nodejs implementation for creating a logged session on a CAS-authenticated service.

## Disclaimer

This module was made for educational purposes, it is not intended for web scraping purposes. Web scraping involves extracting data from websites without explicit permission from the website owner, which can be considered a violation of the website's terms of service and may lead to legal consequences.

When using this module, you are solely responsible for ensuring that your usage complies with all applicable laws and regulations.

The author and contributors to this module disclaims any responsibility for any damages or legal repercussions arising from the use of this module for web scraping or illegal activity.

By using this module, you acknowledge and agree to the terms of this disclaimer.

## Installation

```bash
#clone the project
git clone "https://github.com/killianmarty/CAS-Login"

#install dependencies
npm install
```

## Usage

### 1. Import module

```javascript
const cas = require("./CAS-Login");
```

### 2. Instantiate CAS Login Client

```javascript
const casURL = "https://your-cas-server.com/cas";
const serviceURL = "https://your-service.com";

const cas = new CAS(casURL, serviceURL);
```

### 3. Set your own settings (optional)

#### 3.1. Set User-Agent

You might want to set your own User-Agent header for the HTTP requests used by the module. By default, a Mozilla Firefox on Linux User-Agent is set.

```javascript
cas.userAgent = "Your Custom User-Agent";
```

#### 3.2. Store cookies

You can load and store your cookies in a file by specifying the path of the file (if the file does not exist it will be created). By default, the cookies are not stored.

```javascript
cas.cookieJarFile = "cookies.json";
```

#### 3.3. Verbose mode

For debug purposes, you can use the module in verbose mode.

```javascript
cas.verbose = true;
```

### 4. Login (asynchronous)

This method will try to login to the specified service with the given CAS server. In case of success, it returns a Cookie Jar containing your logged session cookies !

```javascript
cas.login("username", "password").then((cookieJar)=>{
	console.log("Successfuly logged in!");
}).catch((error)=>{
	console.log("Error : " + error);
});
```

### 5. Get the Cookie Jar

The login method returns the Cookie Jar, but you can also get the Cookie Jar using :

```javascript
let jar = cas.getCookieJar();
```

### 6. Send requests to the service

Now that you are logged in, you can perform HTTP requests to your service. You can perform these requests using the NodeJS "request" module, using the Cookie Jar returned by the login method.

## Example

```javascript
const CAS = require("./CAS-Login");
const request = require("request");

let cas = new CAS("https://cas.myschoolfr/cas/login", "https://ent.myschool.fr/Login");

cas.userAgent = "Custom User-Agent";
cas.cookieJarFile = "cookies.json";
cas.verbose = true;

cas.login("johndoe", "password").then((jar)=>{
	const options = {
		followAllRedirects: true,
		jar: jar,
		url: "https://ent.myschool.fr/schedule.php",
		headers: {
			"User-Agent": cas.userAgent
		}
	};

	request.get(options, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			console.log(body);
		}else{
			console.error("Error !");
		}
	})
});
```

## License

This project is licensed under the MIT License.

## Credits

This package was created by Killian Marty.