// src/components/SeoHelmet.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHelmet = ({
  title = 'My Tennis Space',
  description = 'Join My Tennis Space to track your matches, discover local clubs, and compete in tennis events and ladders.',
  url = 'https://mytennis.space/',
  image = 'https://mytennis.space/images/og-image.png',
  type = 'website',
  robots = 'index,follow'
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content={robots} />
    <link rel="canonical" href={url} />
    {/* Open Graph */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />
    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
  </Helmet>
);

export default SeoHelmet;