const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const FileCookieStore = require('tough-cookie-filestore');


class CAS{
	#cookieJar

	constructor(casURL, serviceURL){
		this.casURL = casURL;
		this.serviceURL = serviceURL;
		this.userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0";
		this.cookieJarFile = "";
		this.verbose = false;
	}

	#loadCookies(filePath){
		if(!fs.existsSync(filePath)) fs.open(filePath, 'w', ()=>{});
		return request.jar(new FileCookieStore(filePath));
	}

	#initCookies(){
		if(this.cookieJarFile == "") this.#cookieJar = new request.jar();
		else this.#cookieJar = this.#loadCookies(this.cookieJarFile);
	}

	#getToken(){
		const options = {
		  	url: this.casURL + "?service=" + this.serviceURL,
		  	jar: this.#cookieJar,
		  	headers : {
				"User-Agent" : this.userAgent
			},
			followAllRedirects: true
	  	};

	  	return new Promise((resolve, reject) => {
		  	request.get(options, (error, response, body)=>{
		  		if(error) throw new Error(error);

		  		//check the response codes
		  		if(response.request.uri.href != options.url) reject("Already logged in.");
		  		else resolve(cheerio.load(body)('[name=execution]').val());
		  	})
	  	});
	}

	#sendLoginRequest(username, password, token){
		const data = {
			username: username,
			password: password,
			execution: token,
			_eventId: 'submit',
	      	geolocation: ''
		};

		const options = {
			url: this.casURL + "?service=" + this.serviceURL,
			form: data,
			followAllRedirects: true,
			jar: this.#cookieJar,
			headers : {
				"User-Agent" : this.userAgent
			}
		};

		return new Promise((resolve, reject) => {
			request.post(options, (error, response, body)=>{
				if(error) throw new Error(error);

				//check the reponse codes
				if(response.statusCode == 401) throw new Error("Login error or invalid credentials.");
				else resolve(body);
			})
		})
	}

	#info(message){
		if(this.verbose) console.log(message);
	}

	async login(username, password){
		//init cookieJar
		this.#info("Initializing cookies...");
		this.#initCookies();

		//try getting token
		let token;
		this.#info("Getting token...")
		try{
			token = await this.#getToken();
		}catch(error){
			if(error === "Already logged in.") {
				this.#info(error);
				return this.#cookieJar;
			}
			else throw new Error(error);
		}

		//send login request
		this.#info("Sending login request...");
		await this.#sendLoginRequest(username, password, token);

		this.#info("Sucess.");
		return this.#cookieJar;
	}

	//getters
	getCookieJar(){
		return this.#cookieJar;
	}

};

module.exports = CAS;