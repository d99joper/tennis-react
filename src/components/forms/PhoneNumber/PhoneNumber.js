import React from 'react';
import './PhoneNumber.css'

function PhoneNumber(props) {
    //const {onNewNumber} = props
    const [number, setNumber] = React.useState(props.number);
    let latestNumber = props.number
    const [error, setError] = React.useState(null);

    const handleChange = event => {
        let newNumber = event.target.value;

        // Remove all non-digit characters from the new number
        newNumber = newNumber.replace(/[^\d]/g, '');

        // Add the formatting to the new number
        newNumber = newNumber.replace(
            /^(\d{3})(\d{3})(\d{4})$/,
            '($1) $2-$3'
        );

        // Set the new number and clear any error
        setNumber(newNumber);
        setError(null);
    };

    const handleBlur = () => {
        // Use a different regular expression to validate the phone number
        const digitCount = (number ?? '').replace(/[^0-9]/g, '').length
        
        if(digitCount !== 10 && digitCount !== 0) {
            setError("Not a valid number");
            setNumber(latestNumber)
        } 
        else {
            props.onNewNumber(number)
            latestNumber = number
        }
    };

    const formattedNumber = (number ?? '').replace(/[^0-9]/g, '').replace(
        /^(\d{3})(\d{3})(\d{4})$/,
        '($1) $2-$3'
    );

    if (props.editable) {
        return (
            <>
                <input
                    placeholder='(123) 456-7890'
                    type="text"
                    value={formattedNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {error && <p className="error">{error}</p>}
            </>
        );
    } else {
        return <span>{formattedNumber}</span>;
    }
}

export default PhoneNumber;