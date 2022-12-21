import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { SlUser } from 'react-icons/sl';
import { useParams } from 'react-router-dom';
import {
    Button,
    Card,
    Flex,
    Grid,
    Text,
    TextField,
    SelectField,
    View,
    Image,
    TextAreaField,
    Divider,
    SwitchField
} from "@aws-amplify/ui-react";
import { userFunctions } from 'helpers'
import { Editable, Matches, Ladders, PhoneNumber } from '../components/forms/index.js'
import Modal from '../components/layout/Modal/modal';
import './profile.css';


function Profile() {
    
    const MatchEditor = lazy(() => import("../components/forms/MatchEditor/MatchEditor").then(module => { return { default: module.MatchEditor } }))
    
    const NTRPItems = ["-", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"];

    const params = useParams();
    const [error, setError] = useState({ status: false, message: null });
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    //const [profileChange, setProfileChange] = useState(0)
    const [canEdit, setCanEdit] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false); 
    const [showMatchEditor, setShowMatchEditor] = useState(false); 
    const [player, setPlayer] = useState()

    const handleUpdatedPhoneNumber = newNumber => {
        setPlayer({ ...player, phone: newNumber })
    }

    async function getProfile() {

        const loggedIn = async () => {
            return await userFunctions.CheckIfSignedIn()
        }
        setIsLoggedIn(loggedIn);

        let p = null;

        const sessionPlayer = await userFunctions.getCurrentlyLoggedInPlayer()
        // Check if userid param was provided
        
        if (params.userid) {
            console.log('userid provided');
            // Get the user from the userid -> paramPlayer
            p = await userFunctions.getPlayer(params.userid)
            p = p ?? sessionPlayer

            if (sessionPlayer) {
                if (sessionPlayer.email === p.email) {
                    console.log('This is your page, so you can edit it');
                    setCanEdit(true);
                }
            }
            else {
                setError({ status: true, message: 'This user does not exist.' });
            }
            setIsLoaded(true);
        }
        else {
            console.log('no userid provided, use sessionPlayer', sessionPlayer);
            if (sessionPlayer) {
                p = sessionPlayer;
                console.log(p)
                document.title = 'My Tennis Space - ' + p.name;
                //setPlayer(prevState => ({...prevState, p})) 
                console.log('This is your page, so you can edit it');
                setCanEdit(true);
            }
            else {
                setError({ status: true, message: 'This user does not exist.' });
            }
            setIsLoaded(true);
        }

        if (p)
            document.title = 'My Tennis Space - ' + p.name;

        return p;

    }

    async function updateProfilePic(e) {

        const profilePic = Array.from(e.target.files)[0]

        const p = await userFunctions.UpdatePlayer(player, player.id, profilePic)
        console.log("updateProfilePic", p)
        setPlayer(prevState => ({ ...prevState, image: p.image, imageUrl: p.imageUrl }))

        setShowImagePicker(false)
    }

    async function updateProfileData(e) {
        e.preventDefault();

        const form = new FormData(e.target);
        
        const data = {
            about: form.get("about"),
            NTRP: form.get("NTPR"),
            UTR: form.get("UTR"),
            phone: player.phone || '',
        };
        
        let p = await userFunctions.UpdatePlayer(data, player.id)
        
        // setPlayer(prevState => ({...prevState, p}))
        setPlayer(p)

        setIsEdit((isEdit) => !isEdit)
    }

    function openUserImagePicker(e) {
        e.preventDefault()
        if (canEdit) setShowImagePicker(true);
    }
    function toggleMatchEditor(e) {
        e.preventDefault()
        if (canEdit) setShowMatchEditor(!showMatchEditor);
    }

    useEffect(() => {
        console.log("profile page got new userId", params)

        getProfile().then(p => setPlayer(p))
        //}, []);  
    }, [params.userid]);

    if (error.status) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <h2>Loading...</h2>;
    } else {
        return (
            <>
                <Flex direction="column" gap="1rem">
                    <Flex direction="row" gap="1rem" as="form" onSubmit={updateProfileData} className="mediaFlex">
                        <Card className='card' variation="elevated">
                            <View className={"profileImageContainer"}>
                                {player.image ?
                                    <Image
                                        src={player.imageUrl}
                                        alt={`visual aid for ${player.name}`}
                                        className={`profileImage ${canEdit ? " cursorHand" : null}`}
                                        onClick={(e) => { openUserImagePicker(e) }}
                                    />

                                    : <SlUser size='150' className={`${canEdit ? " cursorHand" : null}`} onClick={(e) => { openUserImagePicker(e) }} />}
                            </View>
                            <Modal
                                title="Update profile picture"
                                onClose={() => setShowImagePicker(false)} show={showImagePicker}
                            >
                                <View
                                    name="profilePic"
                                    as="input"
                                    type="file"
                                    id="imageInput"
                                    text={player.name}
                                    className="hiddenImageInput"
                                    onChange={(e) => { updateProfilePic(e) }}
                                />

                                <Button>
                                    <label htmlFor="imageInput" className='cursorHand'>
                                        Select a profile picture.
                                    </label>
                                </Button>
                            </Modal>
                            <Text fontSize='x-large'>{player.name}</Text>
                            <Text fontSize='small'>{isLoggedIn ? <a href={`mailto:${player.email}`}>{player.email}</a> : 'Email only visible to other players'}</Text>
                            <PhoneNumber name="name" onNewNumber={handleUpdatedPhoneNumber} number={player.phone} editable={isEdit} />
                        </Card>
                        <Card className='card' variation="elevated" flex="1">
                            <div style={{ float: 'right' }}>
                                {canEdit &&
                                    <SwitchField
                                        key={"editModeSwitch"}
                                        isDisabled={false}
                                        defaultChecked={false}
                                        label="Edit Mode"
                                        labelPosition="start"
                                        isChecked={isEdit}
                                        onChange={(e) => { setIsEdit(e.target.checked) }}
                                    />
                                }
                            </div>
                            <Grid
                                templateColumns="1fr 3fr"
                                templateRows="1fr 1fr 1fr 3fr"
                            >
                                <View><Text>NTRP rating:</Text></View>
                                <Flex direction={'row'} flex='1'>
                                    <Editable
                                        text={player.NTRP ?? '-'}
                                        isEditing={isEdit}
                                        direction="row"
                                        gap="1rem"
                                    >
                                        <SelectField
                                            name="NTPR"
                                            size='small'
                                            defaultValue={player.NTRP ? player.NTRP : '2.0'}
                                            options={NTRPItems}
                                        ></SelectField>

                                    </Editable>
                                    <span>View the USTA NTPR <a href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf' target='blank'>guidelines</a>.</span>
                                </Flex>
                                <View>UTR rating:</View>
                                <Editable
                                    text={player.UTR ?? '-'}
                                    isEditing={isEdit}
                                >
                                    <TextField name="UTR" size='small' defaultValue={player.UTR}></TextField>
                                </Editable>
                                <View>Ladders:</View>
                                <Ladders></Ladders>
                                <View><Text fontSize={'large'}>About:</Text></View>
                                <Editable
                                    text={player.about}
                                    isEditing={isEdit}>
                                    <TextAreaField name="about" defaultValue={player.about}></TextAreaField>
                                </Editable>
                                {isEdit &&
                                    <Button type="submit" variation="primary">
                                        Update
                                    </Button>
                                }
                            </Grid>
                        </Card>
                    </Flex>
                    <Flex direction="row" gap="1rem">
                        <Card className='card' variation="elevated">
                            Latest matches
                            <Matches player={player}></Matches>
                            <Button label="Add new match" 
                                    onClick={(e) => { toggleMatchEditor(e) }}
                            >{showMatchEditor ? 'Cancel' : 'Add'}</Button>
                            {/* 
                            <Modal
                                title="Add a match"
                                onClose={() => setShowMatchEditor(false)} show={showMatchEditor}
                            > */}
                            <Suspense fallback={<h2>loading...</h2>}>
                                {showMatchEditor ?
                                <MatchEditor player={player} onSubmit={updateProfileData} />
                                : null}
                            </Suspense>
                            {/* </Modal> */}
                        </Card>
                    </Flex>
                </Flex>
                <Divider></Divider>
            </>
        )
    }

};

export default Profile;
