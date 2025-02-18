import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import React, { useState } from 'react';

export default function Wizard({
  steps,
  handleSubmit,
  submitText = 'Submit',
  completeStep,
  sx = null,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async (index) => {
    setError(null);
    setLoading(true);

    const step = steps[activeStep];
    console.log('handleNext', index, index === steps.length - 1)
    try {
      if (index === steps.length - 1) {
        if (handleSubmit) {
          console.log('handleSubmit')
          await handleSubmit();  // Handle the final submission
        }
      }
      else {
        const complete = await step.handleNext();
        if (!complete) {
          setLoading(false);
          return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }


    } catch (err) {
      setError("An error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={sx} >
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
                  loading ? (
                  <CircularProgress size={30} /> // Show spinner while loading
                ) : (
                  <Button variant="contained"
                    onClick={async () => await handleNext(index)}

                    disabled={loading}>
                    {index === steps.length - 1 ? submitText : "Continue"}
                  </Button>
                )
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
