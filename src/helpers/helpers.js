
const helpers = {
    
    truncate: (text, len) => {
        if(text.length > len) 
            return text.substring(0,len) + '...'
        return text
    },

    intToFloat: (number) => {
        return number.toFixed(1)
    },

    getGUID: () => {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ (((crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4)).toString(16)
        );
    },
    
    formatDate: (date) => {
        date = new Date(date);
        if(Object.prototype.toString.call(date) === '[object Date]')
            return date.toLocaleDateString('en-us',{ year:"numeric", month:"short", day:"numeric"})

        return 'not a date'
    },

    formatAWSDate: (date, hoursToAdd = 0) => {
        Date.prototype.addHours = function(h) {
            this.setTime(this.getTime() + (h*60*60*1000));
            return this;
        }
        date = new Date(date).addHours(hoursToAdd)
        if(Object.prototype.toString.call(date) === '[object Date]')
            return [date.getFullYear(), 
                    String(date.getMonth()+1).padStart(2,'0'), 
                    String(date.getDate()).padStart(2,'0')]
                    .join('-')

        return 'not a date'
    },
    stringToColor: function(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xaa;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
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


export {helpers};