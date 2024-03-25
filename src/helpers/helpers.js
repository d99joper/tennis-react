let loadingPromise = null
const helpers = {
	loadGoogleMapsAPI: async () => {
		// Check if Google Maps API is already loaded
		if (window.google && window.google.maps) {
			console.log('Google Maps API already loaded');
			return window.google.maps;
		}

		// If another function is already loading the script, wait for it to complete
		if (loadingPromise) {
			console.log('Waiting for Google Maps API script to load...');
			return loadingPromise;
		}

		// Create a new loading promise and start loading the script
		loadingPromise = new Promise((resolve, reject) => {
			console.log('Google Maps API not loaded, adding...');
			const apiKey = process.env.REACT_APP_PLACES_API_KEY;
			const script = document.createElement('script');
			script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places';
			script.async = true;
			script.defer = true;

			script.onload = () => {
				if (window.google && window.google.maps) {
					resolve(window.google.maps);
				} else {
					reject(new Error('Google Maps API not available'));
				}
			};

			script.onerror = () => {
				reject(new Error('Error loading Google Maps API script'));
			};

			document.body.appendChild(script);
		});

		// Clear the loading promise once the script is loaded or an error occurs
		loadingPromise.finally(() => {
			loadingPromise = null;
		});

		return loadingPromise;
	},
	// async () => {
	// 	return new Promise((resolve, reject) => {
	// 		// Check if Google Maps API is already loaded
	// 		if (window.google && window.google.maps) {
	// 			console.log('already loaded')
	// 			resolve(window.google.maps);
	// 		} else {
	// 			console.log('maps api not loaded, adding...')
	// 			// Dynamically load Google Maps API script
	// 			const script = document.createElement('script');
	// 			const apiKey = process.env.REACT_APP_PLACES_API_KEY
	// 			script.src = 'https://maps.googleapis.com/maps/api/js?key='+apiKey+'&libraries=places';
	// 			script.async = true;
	// 			script.defer = true;
	// 			script.onload = () => {
	// 				// Resolve the Promise with the google.maps object
	// 				if (window.google && window.google.maps) {
	// 					resolve(window.google.maps);
	// 				} else {
	// 					reject(new Error('Google Maps API not available'));
	// 				}
	// 			};

	// 			script.onerror = () => {
	// 				reject(new Error('Error loading Google Maps API script'));
	// 			};

	// 			document.body.appendChild(script);
	// 		}
	// 	});
	// },

	resizeImage: (inputImage, targetWidth) => {
		return new Promise((resolve) => {
			const reader = new FileReader();

			reader.onload = function (e) {
				const img = new Image();

				img.onload = function () {
					const aspectRatio = img.width / img.height;
					const targetHeight = Math.floor(targetWidth / aspectRatio);

					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');

					canvas.width = targetWidth;
					canvas.height = targetHeight;

					ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

					canvas.toBlob((blob) => {
						resolve(new File([blob], inputImage.name, { type: inputImage.type }));
					}, inputImage.type);
				};

				img.src = e.target.result;
			};

			reader.readAsDataURL(inputImage);
		});
	},

	parseFilter: (filter) => {
		return Object.entries(filter)
			.map(([key, value]) => `${key}=${value}`)
			.join('&')
	},

	setDate: (days) => {
		let d = new Date()
		d.setDate(d.getDate() + days)
		return d
	},

	truncate: (text, len) => {
		if (text.length > len)
			return text.substring(0, len) + '...'
		return text
	},

	intToFloat: (number) => {
		return number.toFixed(1)
	},

	getGUID: () => {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(c ^ (((crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4)).toString(16)
		);
	},

	formatDate: (date) => {
		date = new Date(date)
		if (Object.prototype.toString.call(date) === '[object Date]')
			return date.toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })

		return 'not a date'
	},

	formatAWSDate: (date, hoursToAdd = 0) => {
		Date.prototype.addHours = function (h) {
			this.setTime(this.getTime() + (h * 60 * 60 * 1000));
			return this;
		}
		date = new Date(date).addHours(hoursToAdd)
		if (Object.prototype.toString.call(date) === '[object Date]')
			return [date.getFullYear(),
			String(date.getMonth() + 1).padStart(2, '0'),
			String(date.getDate()).padStart(2, '0')]
				.join('-')

		return 'not a date'
	},

	modalStyle: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 'auto',
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
		position: 'absolute',
		// top:'10%',
		// left:'10%',
		overflow: 'scroll',
		//height: '100%',
		display: 'block'
	},

	stringToColor: function (string) {
		let hash = 0;
		let i;

		/* eslint-disable no-bitwise */
		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';
		let val

		for (i = 0; i < 3; i += 1) {
			const value = Math.floor((hash >> (i * 8)) * 56) + 200 //& 0xaa//Math.floor(Math.random()*75)+175 //(hash >> (i * 8)) & 0xff;
			val = value
			color += `00${value.toString(16)}`.slice(-2);
		}
		//console.log(color)
		/* eslint-enable no-bitwise */
		// return "hsl(" + 360 * Math.random() + ',' +
		// (25 + 70 * Math.random()) + '%,' + 
		// (85 + 10 * Math.random()) + '%)'
		return `hsla(${val}, 70%,  72%, 0.8)`
		return color;
	}

	//     formatAWSDateTime: (date, hoursToAdd = 0) => {
	//         Date.prototype.addHours = function(h) {
	//             this.setTime(this.getTime() + (h*60*60*1000));
	//             return this.toLocaleString();
	//         }
	//         date = new Date(date).addHours(hoursToAdd)
	//         if(Object.prototype.toString.call(date) === '[object Date]')
	//             return [date.getFullYear(), 
	//                     String(date.getMonth()+1).padStart(2,'0'), 
	//                     String(date.getDate()).padStart(2,'0')]
	//                     .join('-')
	//                     .toLocaleString()

	//         return 'not a date'
	//     }
};


export { helpers };