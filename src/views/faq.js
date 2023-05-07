import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { MdOutlineExpandMore } from 'react-icons/md';

const FAQPage = () => {
  return (
    <div className="faq-container">
      <Typography variant="h4" gutterBottom>
        Frequently Asked Questions (FAQ)
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />} aria-controls="q1-content" id="q1-header">
          <Typography variant="h6">Q: How do I schedule matches on My Tennis Space?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Scheduling matches is a breeze! Simply head to your profile and navigate to the "Schedule Match" section. There, you can choose a convenient date, time, and location for your match. Don't forget to communicate with your opponent to finalize the details.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />} aria-controls="q2-content" id="q2-header">
          <Typography variant="h6">Q: What match formats can I use?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            My Tennis Space supports various match formats, including singles and doubles. You can select the format that suits your preference and playing style. Whether you're looking for a quick singles match or an intense doubles showdown, we've got you covered!
          </Typography>
        </AccordionDetails>
      </Accordion>
      {/* Add more accordions for other questions */}
    </div>
  );
};

export default FAQPage;
