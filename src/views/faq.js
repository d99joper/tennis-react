import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import { MdOutlineExpandMore } from 'react-icons/md';
import { Helmet } from 'react-helmet-async';
import { AiOutlineMessage } from 'react-icons/ai';

const FAQPage = () => {
  return (
    <div className="faq-container">
      <Helmet>
        <title>FAQ | MyTennis Space</title>
      </Helmet>
      <Typography variant="h4" gutterBottom>
        Frequently Asked Questions (FAQ)
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />} aria-controls="q1-content" id="q1-header">
          <Typography variant="h6">Q: How do I schedule matches on My Tennis Space?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Go to the player you want to challenge's page. If you are logged in to your account, you will see a 
            &nbsp;<i>
                <AiOutlineMessage
                color='green'
                size={25}
                cursor={'pointer'}
              />
              &nbsp;Message
              </i>&nbsp;
            button under the player's name. Clicking that button brings up a chat box where you can send messages. The message will be sent as an in-app message, but also as an email to the player.
            {/* Once you have your account and have joined a ladder, you can challenge any player on the ladder.
            Simply click the challenge icon next to a players name and you will get the option to email, text,
            or call your opponent. Be clear in communicate with your opponent to finalize the details of when and where. */}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />} aria-controls="q2-content" id="q2-header">
          <Typography variant="h6">Q: What match formats can I use?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            My Tennis Space supports various match formats, including singles and doubles.
            You can select the format that suits your preference and time requirements.
            You can do best-of-three sets with a full third set or a third set tie-break.
            If you are short on time, you can play a single pro-set to 10 or 8 games.
            We also offer fast 4 matchformats with best out of 3 or 5 sets
          </Typography>
        </AccordionDetails>
      </Accordion>
      {/* Add more accordions for other questions */}
    </div>
  );
};

export default FAQPage;
