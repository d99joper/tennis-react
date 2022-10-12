import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator, Menu, MenuItem, View, Link, Flex, Heading } from '@aws-amplify/ui-react';

const Profile = (user) => {

    return <h1>Hello {user.attributes.name} ({user.attributes.email})</h1>
};

export default withAuthenticator(Profile(user),{});