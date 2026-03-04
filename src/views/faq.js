import React, { useState } from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Box, Tabs, Tab, Button } from '@mui/material';
import { MdOutlineExpandMore } from 'react-icons/md';
import { Helmet } from 'react-helmet-async';
import { AiOutlineMessage } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const faqCategories = [
  {
    label: 'General',
    faqs: [
      {
        question: 'How do I schedule matches on My Tennis Space?',
        answer: (
          <Typography variant="body1">
            Go to the player you want to challenge&apos;s page. If you are logged in to your account, you will see a
            &nbsp;<i>
              <AiOutlineMessage color='green' size={25} cursor={'pointer'} />
              &nbsp;Message
            </i>&nbsp;
            button under the player&apos;s name. Clicking that button brings up a chat box where you can send messages. The message will be sent as an in-app message, but also as an email to the player.
          </Typography>
        ),
      },
      {
        question: 'What match formats can I use?',
        answer: (
          <Typography variant="body1">
            My Tennis Space supports various match formats, including singles and doubles.
            You can select the format that suits your preference and time requirements.
            You can do best-of-three sets with a full third set or a third set tie-break.
            If you are short on time, you can play a single pro-set to 10 or 8 games.
            We also offer fast 4 match formats with best out of 3 or 5 sets.
          </Typography>
        ),
      },
      {
        question: 'How do I find clubs or events near me?',
        answer: (
          <Typography variant="body1">
            Visit the <a href="/clubs">Clubs</a> or <a href="/events">Events</a> page to browse
            available clubs and upcoming events in your area. You can search by location and
            join clubs that match your skill level and interests.
          </Typography>
        ),
      },
      {
        question: 'How do I update my profile information?',
        answer: (
          <Typography variant="body1">
            Navigate to your profile page by clicking &quot;My Profile&quot; in the menu.
            From there you can update your profile picture, bio, and other information.
            Click on any editable field to make changes.
          </Typography>
        ),
      },
    ],
  },
  // {
  //   label: 'Subscriptions & Billing',
  //   faqs: [
  //     {
  //       question: 'What subscription plans are available?',
  //       answer: (
  //         <Box>
  //           <Typography variant="body1" sx={{ mb: 1 }}>
  //             We offer three tiers:
  //           </Typography>
  //           <Typography variant="body1" component="div">
  //             <strong>Free</strong> — Create a profile, communicate with players, see trophies and badges,
  //             and join up to 5 events. You can see your 3 most recent matches.
  //           </Typography>
  //           <Typography variant="body1" component="div" sx={{ mt: 1 }}>
  //             <strong>Basic ($2.99/month or $29.99/year)</strong> — Everything in Free, plus unlimited events,
  //             full match history with filters, head-to-head stats, player stats, and rivals section.
  //           </Typography>
  //           <Typography variant="body1" component="div" sx={{ mt: 1 }}>
  //             <strong>Pro ($5.99/month or $59.99/year)</strong> — Everything in Basic, plus create up to 2 clubs,
  //             unlimited leagues and tournaments, automatic club ladders, and the ability to charge participation fees.
  //           </Typography>
  //           <Button component={Link} to="/subscription" variant="outlined" size="small" sx={{ mt: 2 }}>
  //             View Plans & Pricing
  //           </Button>
  //         </Box>
  //       ),
  //     },
  //     {
  //       question: 'What do I get with the Free plan?',
  //       answer: (
  //         <Typography variant="body1">
  //           With the Free plan, you get a profile page, the ability to communicate with other players,
  //           view your trophies and badges, and see events you have completed in. You can join up to 5
  //           events in your lifetime and see your 3 most recent matches on the matches tab.
  //         </Typography>
  //       ),
  //     },
  //     {
  //       question: 'How many events can I join for free?',
  //       answer: (
  //         <Typography variant="body1">
  //           Free accounts can join up to 5 events total. Once you have reached this limit,
  //           you will need to upgrade to a Basic or Pro subscription to join additional events.
  //           Subscribing gives you unlimited event entries along with many other features.
  //         </Typography>
  //       ),
  //     },
  //     {
  //       question: 'What additional features does the Basic plan offer?',
  //       answer: (
  //         <Typography variant="body1">
  //           The Basic plan unlocks unlimited event entries, full match history with filtering,
  //           head-to-head stats between players (both on profile pages and when viewing matches),
  //           a detailed stats section with yearly breakdowns, and a rivals section showing your
  //           most frequent opponents.
  //         </Typography>
  //       ),
  //     },
  //     {
  //       question: 'What can I do with the Pro plan?',
  //       answer: (
  //         <Typography variant="body1">
  //           In addition to everything in Basic, the Pro plan lets you create up to 2 clubs.
  //           Once you have a club, you can create unlimited events (leagues, tournaments, socials).
  //           Your club gets an automatic ladder for members. You can also charge participation fees
  //           for events, with membership fee support coming soon.
  //         </Typography>
  //       ),
  //     },
  //     {
  //       question: 'How do I manage or cancel my subscription?',
  //       answer: (
  //         <Typography variant="body1">
  //           Visit the <a href="/subscription">Subscription</a> page to view your current plan,
  //           manage your billing details, or cancel your subscription. You can also upgrade
  //           or downgrade your plan at any time. Changes take effect at the start of the
  //           next billing cycle.
  //         </Typography>
  //       ),
  //     },
  //     {
  //       question: 'What payment methods do you accept?',
  //       answer: (
  //         <Typography variant="body1">
  //           We accept all major credit and debit cards through Stripe, our secure payment
  //           processor. Your payment information is handled securely by Stripe and never
  //           stored on our servers.
  //         </Typography>
  //       ),
  //     },
  //     {
  //       question: 'Can I switch between monthly and yearly billing?',
  //       answer: (
  //         <Typography variant="body1">
  //           Yes! You can switch between monthly and yearly billing at any time from the
  //           subscription management page. Yearly plans save you about 17% compared to
  //           monthly billing.
  //         </Typography>
  //       ),
  //     },
  //   ],
  // },
  {
    label: 'Clubs & Events',
    faqs: [
      {
        question: 'How do I create a club?',
        answer: (
          <Typography variant="body1">
            You need a Pro subscription to create clubs. With Pro, you can create up to 2 clubs.
            Visit the <a href="/clubs">Clubs</a> page and click &quot;Create Club&quot; to get started.
            As a club admin, you can organize leagues, tournaments, and socials for your members.
          </Typography>
        ),
      },
      {
        question: 'What types of events can I create?',
        answer: (
          <Typography variant="body1">
            Club admins with a Pro subscription can create leagues, tournaments, and social events.
            Each event type has its own format and scoring rules. Your club also gets an automatic
            ladder that members can compete on.
          </Typography>
        ),
      },
      {
        question: 'Can I charge fees for events?',
        answer: (
          <Typography variant="body1">
            Yes! Pro subscribers can set participation fees for events they organize. Payments are
            processed securely through Stripe. Membership fee support is coming soon as well.
          </Typography>
        ),
      },
    ],
  },
];

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Helmet>
        <title>FAQ | MyTennis Space</title>
      </Helmet>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Frequently Asked Questions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Find answers to common questions about My Tennis Space.
        Can&apos;t find what you are looking for? <a href="/about">Contact us</a>.
      </Typography>

      <Tabs
        value={activeCategory}
        onChange={(e, val) => setActiveCategory(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {faqCategories.map((cat, i) => (
          <Tab key={i} label={cat.label} />
        ))}
      </Tabs>

      {faqCategories[activeCategory]?.faqs.map((faq, i) => (
        <Accordion key={`${activeCategory}-${i}`} disableGutters>
          <AccordionSummary expandIcon={<MdOutlineExpandMore />}>
            <Typography variant="subtitle1" fontWeight={500}>
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {faq.answer}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* <Box sx={{ mt: 4, p: 3, textAlign: 'center', backgroundColor: 'background.default', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Ready to get more out of My Tennis Space?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upgrade your plan and unlock unlimited events, full stats, and more.
        </Typography>
        <Button component={Link} to="/subscription" variant="contained" color="primary">
          View Plans & Pricing
        </Button>
      </Box> */}
    </Box>
  );
};

export default FAQPage;