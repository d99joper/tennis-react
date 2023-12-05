
const helpers = {

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