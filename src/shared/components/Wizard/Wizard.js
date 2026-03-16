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


// Wizard component for multi-step forms
// steps: array of { label, description, content, handleNext (return true/false) }
// handleSubmit: function to call on final submission
// submitText: text for the final submit button
// showCompleteStep: optional content to show when all steps are completed
// showLastStepMeta: whether to show metadata on the last step
// sx: additional styles for the root Box

export default function Wizard({
  steps,
  handleSubmit,
  submitText = 'Submit',
  hideSubmit = false,
  showCompleteStep = false,
  showLastStepMeta = false,
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
                index === steps.length - 1 && showLastStepMeta ? (
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
                  !(index === steps.length - 1 && hideSubmit) && (
                    <Button variant="contained"
                      onClick={async () => await handleNext(index)}
                      disabled={loading}>
                      {index === steps.length - 1 ? submitText : "Continue"}
                    </Button>
                  )
                )
                }
                {activeStep !== 0 && (
                  <Button
                    disabled={index === 0 || step.disableBackButton === true}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && showLastStepMeta && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          {showCompleteStep ??
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
