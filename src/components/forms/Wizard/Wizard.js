import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';



export default function Wizard({
  steps,
  handleSubmit,
  submitText = 'Submit',
  completeStep
}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [error, setError] = React.useState(null);

  const handleNext = async () => {
    const step = steps[activeStep];

    // Check if the current step has a handleNext function
    if (step.handleNext) {
      try {
        // Await the handleNext function, if it's a promise (async)
        const complete = await step.handleNext();
        // If handleNext returns false, show an error and stop
        if (!complete) {
          return;
        }
      } catch (err) {
        // Catch any errors from the asynchronous function and stop progression
        setError('An error occurred: ' + err.message);
        return;
      }
    }

    // If no errors, or handleNext returned true, move to the next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel className='cursorHand'
              onClick={() => {
                if (activeStep > index)
                  setActiveStep(index)
              }}
              optional={
                index === steps.length - 1 ? (
                  <Typography as='span' variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>

              <Typography as='span'>{step.description}</Typography>
              <Typography as='span'>{step.content}</Typography>

              {/* Display error message if any */}
              {error && <Typography as='span' color="error">{error}</Typography>}

              <Box sx={{ mb: 2 }}>
                {typeof (handleNext) === 'function' &&
                  <Button
                    variant="contained"
                    onClick={async () => {
                      // handle step logic asynchonously 
                      if (index === steps.length - 1) {
                        if (handleSubmit)
                          handleSubmit() // call final submission on last step
                      }
                      else
                        await handleNext() // await handleNext (might have a step function)
                    }}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? submitText : 'Continue'}
                  </Button>
                }
                <Button
                  disabled={index === 0 || step.disableBackButton === true}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          {completeStep ??
            <Typography as='span'>'All steps completed - you&apos;re finished'

            </Typography>
          }
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}
