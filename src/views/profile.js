import { API, Storage, Auth } from 'aws-amplify';
import {Link} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  Image,
  ComponentPropsToStylePropsMap,
  TextAreaField
} from "@aws-amplify/ui-react";
import { listPlayers, getPlayer } from "../graphql/queries";
import {
  createPlayer as createPlayerMutation,
  updatePlayer as updatePlayerMutation,
  deletePlayer as deletePlayerMutation,
} from "../graphql/mutations";
import helpers from '../helpers/helpers'


function Profile(props) {

    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    const params = useParams();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [players, setPlayers] = useState([]);
    const [thisPlayer, setThisPlayer] = useState([]);

    useEffect(() => {
        //fetchPlayers();
        let userId;
        if(params.userId)
            userId = params.userId;

        Auth.currentAuthenticatedUser().then((p_auth) => {
            if(!userId)
                userId = p_auth.username;
            getProfilePlayer(userId)//'e2f93832-7ff3-47bc-9c31-ab5559034310')
                .then(
                    (p_db) => {
                        if(p_auth.username === params.userId) {
                            setIsLoggedIn(true);
                        }

                        p_db.name = p_auth.attributes.name;
                        p_db.email = p_auth.attributes.email;
                        setIsLoaded(true);
                        setThisPlayer(p_db);
                },
                    (error) => {
                        setIsLoaded(true);
                        setError(true);

                });
        });
      }, []);

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    //let thisPlayer = getProfilePlayer('e2f93832-7ff3-47bc-9c31-ab5559034310');


    async function getProfilePlayer(id) {
        const apiData = await API.graphql({
            query: getPlayer,
            variables: { id: id },
        });

        const playerFromAPI = apiData.data.getPlayer;

        if(playerFromAPI.image)
            playerFromAPI.image = await Storage.get(playerFromAPI.name)

        return playerFromAPI;
        //console.log(playerFromAPI);
        //setThisPlayer(playerFromAPI);
    }

    async function fetchPlayers() {
        const apiData = await API.graphql({ query: listPlayers });

        const playersFromAPI = apiData.data.listPlayers.items;

        await Promise.all(
            playersFromAPI.map(async (player) => {
              if (player.image) {
                const url = await Storage.get(player.name);
                player.image = url;
              }
              return player;
            })
          );
        setPlayers(playersFromAPI);
    }

    async function createPlayer(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const image = form.get("image");

        const data = {
          name: form.get("name"),
          about: form.get("about"),
          userGUID: uuidv4(),
          image: image.name,
        };
        if (!!data.image) await Storage.put(data.name, image);
        console.log(data);
        await API.graphql({
          query: createPlayerMutation,
          variables: { input: data },
        });
        fetchPlayers();
        event.target.reset();
    }

    async function deletePlayer({ id }) {
        const newPlayers = players.filter((note) => note.id !== id);
        setPlayers(newPlayers);
        await API.graphql({
          query: deletePlayerMutation,
          variables: { input: { id } },
        });
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                <View margin="3rem 2rem" >
                    <Flex direction="row">
                        <Flex direction="column">
                            {thisPlayer.image && (//
                            <Image  src={thisPlayer.image}
                                    alt={`visual aid for ${thisPlayer.name}`}
                                    style={{ width: 150, borderRadius: 25, border: '2px solid #000' }}
                                />
                            )}
                        </Flex>
                        <Flex direction="column">
                            <Flex direction="row">
                                <Text fontSize='large'>{thisPlayer.name}</Text>
                            </Flex>
                            <Flex direction="row">
                                <Text fontSize='large' inputMode='email' >{thisPlayer.email}</Text>
                            </Flex>
                            <Flex direction="row">
                                <Text fontSize='large'>{thisPlayer.phone}d</Text>
                            </Flex>
                        </Flex>
                        <Flex direction="column">
                            <Flex direction="row">
                                <Text fontSize='large'>{thisPlayer.NTPR}</Text>
                            </Flex>
                            <Flex direction="row">
                                <Text fontSize='large'>{thisPlayer.UTR}</Text>
                            </Flex>
                            <Flex direction="row">
                                <Text fontSize='large'>Joined {new Date(thisPlayer.createdAt).toLocaleDateString("en-US", options)}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex direction="row">
                        <Text fontSize="large">{thisPlayer.about}</Text>{isLoggedIn}
                        {isLoggedIn ? <Button>edit</Button> : null} 
                        { isLoggedIn ? 'test' : null }
                    </Flex>
                </View>
            </>
        )
    }

};

export default Profile;

//return (
//         <>
//             <View margin="3rem 0" >
//                 <Flex direction="row">
//                     {/* <Flex direction="column">
//                         {thisPlayer.image && (
//                             <Image
//                                 src={thisPlayer.image}
//                                 alt={`visual aid for ${thisPlayer.name}`}
//                                 style={{ width: 150 }}
//                             />
//                         )}
//                     </Flex> */}
//                     <Flex direction="column"></Flex>
//                 </Flex>
//             </View>

//             <Heading level={2}>Profile</Heading>

//             <View as="form" margin="3rem 0" onSubmit={createPlayer}>
//                 <Flex direction="row" justifyContent="center">
//                 <TextField
//                     name="name"
//                     placeholder="Note Name"
//                     label="Note Name"
//                     labelHidden
//                     variation="quiet"
//                     required
//                 />
//                 <TextField
//                     name="about"
//                     placeholder="Note Description"
//                     label="Note Description"
//                     labelHidden
//                     variation="quiet"
//                     required
//                 />
//                 <View
//                     name="image"
//                     as="input"
//                     type="file"
//                     style={{ alignSelf: "end" }}
//                     />
//                 <Button type="submit" variation="primary">
//                     Create Player
//                 </Button>
//                 </Flex>
//             </View>
//             <Heading level={2}>Current Players</Heading>
//             <View margin="3rem 0">

//                 {players.map((player) => (
//                 <Flex
//                     key={player.id}
//                     direction="row"
//                     justifyContent="center"
//                     alignItems="center"
//                 >
//                     <Text as="strong" fontWeight={700}>
//                     {player.name}
//                     </Text>
//                     <Text as="span">{player.about}</Text>
//                     {player.image && (
//                         <Image
//                             src={player.image}
//                             alt={`visual aid for ${players.name}`}
//                             style={{ width: 150 }}
//                         />
//                     )}
//                                         <Button variation="link" onClick={() => deletePlayer(player)}>
//                     Delete Player
//                     </Button>
//                 </Flex>
//                 ))}
//             </View>
// <hr></hr>
//             <Link to='/'>Home</Link>
//         </>