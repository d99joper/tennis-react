import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AboutPage = (props) => {

    return (
        <Box>
            <Helmet>
                <title>MyTennis Space</title>
            </Helmet>

            <Typography variant="h4" gutterBottom>
                Welcome to My Tennis Space!
            </Typography>
            <Typography variant="body1" paragraph>
                Looking to swing your racket, meet fellow tennis enthusiasts, and forge new friendships?
                You've come to the right place! My Tennis Space is your hub for connecting with other players
                ready to engage in some friendly competition and intense rallies. Our mission is to provide a platform where players of all skill levels,
                from beginners to lifelong enthusiasts, can connect with other players, ignite the flames
                of friendly rivalry, and create an unforgettable tennis community.
            </Typography>

            <Typography variant="body1" paragraph>
                Currently, the ladder play feature is where the magic happens.
                Whether you're a novice looking to improve your game or a seasoned player seeking competitive
                challenges, there's a ladder that's perfect for you. And if you can't find a ladder in
                your area or for your skill level, no worries! You have the freedom to create your own ladder
                and invite others to join.
            </Typography>

            <Typography variant="body1" paragraph>
                Our goal is to make your tennis journey an enjoyable one, both on and off the court.
                We are working on features that will help you arrange tournaments and tennis socials
                in your community, where you get to meet new challenges and make new friends.
            </Typography>

            <Typography variant="body1" paragraph>
                Join us today and become part of a community that embraces the camaraderie of tennis.
                Whether you're picking up a racket for the first time or have been playing for years,
                My Tennis Space is here to help you make new friends, improve your skills,
                and create unforgettable tennis memories. Let's hit the court together!
            </Typography>

            <Typography variant="body1" paragraph>
                See you on the courts, champ!
            </Typography>
            {!props?.isLoggedIn &&
                <Button component={Link} to="/registration" variant="contained" className="about-button">
                    Join Now
                </Button>
            }
        </Box>
    );
};
export default AboutPage;
