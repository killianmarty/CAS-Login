const request = require('request');
const cheerio = require('cheerio');


class CAS{
	#userAgent
	#cookieJar

	constructor(casURL, serviceURL){
		this.casURL = casURL;
		this.serviceURL = serviceURL;
		this.#userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0" 
	}

	#makeRequest(method, options) {
	  return new Promise((resolve, reject) => {
	    if (method === 'GET') {
	      request.get(options, (error, response, body) => {
	        if (!error && response.statusCode === 200) {
	          resolve(body);
	        } else {
	          reject(new Error(error));
	        }
	      });
	    } else if (method === 'POST') {
	      request.post(options, (error, response, body) => {
	        if (!error) {
	        	if(response.statusCode == 401) reject(new Error("Login error or invalid credentials."));
	        	else resolve(body);
	        } else {
	          reject(new Error(error));
	        }
	      });
	    } else {
	      reject(new Error('Unsupported request method.'));
	    }
	  });
	}

	#parseHTML(html){
		return cheerio.load(html);
	}

	#getToken = async ()=>{
		const tokenRequestOptions = {
	  	url: this.casURL + "?service=" + this.serviceURL,
	  	jar: this.#cookieJar,
	  	headers: {
				"User-Agent": this.#userAgent
			}
	  };
	  const tokenRequestResponse = await this.#makeRequest('GET', tokenRequestOptions);

	  return this.#parseHTML(tokenRequestResponse)('[name=execution]').val();
	}

	#sendLoginRequest = async (username, password, token)=>{
		//create body
		const data = {
			username: username,
			password: password,
			execution: token,
			_eventId: 'submit',
	      	geolocation: ''
		}

		const loginRequestOptions = {
			url: this.casURL + "?service=" + this.serviceURL,
			jar: this.#cookieJar,
			form: data,
			followAllRedirects: true,
			headers: {
				"User-Agent": this.#userAgent
			}
		}

		return await this.#makeRequest('POST', loginRequestOptions);
	}

	sendServiceRequest = async (serviceURL=this.serviceURL)=>{
		const serviceRequestOptions = {
	  	url: this.serviceURL,
	  	jar: this.#cookieJar,
	  	headers: {
				"User-Agent": this.#userAgent
			}
	  };
	  return await this.#makeRequest('GET', serviceRequestOptions);
	}



	async login(username, password){
		//init/reset cookieJar
		this.#cookieJar = new request.jar();

		//getToken
		const token = await this.#getToken();
		
		//sendLoginRequest
		const loginResponse = await this.#sendLoginRequest(username, password, token);

		return this.#cookieJar;
	}

	//getters
	getCookieJar(){
		return this.#cookieJar;
	}

	//setters
	setUserAgent(userAgent){
		this.#userAgent = userAgent;
	}

	setCasURL(casURL){
		this.casURL = casURL;
	}

	setServiceURL(serviceURL){
		this.serviceURL = serviceURL;
	}

};

module.exports = CAS;