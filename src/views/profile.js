import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Button, Card, Flex, Grid, Text, TextField, SelectField, View,
    TextAreaField, Divider, SwitchField, Loader, TabItem, Tabs
} from "@aws-amplify/ui-react";
import { enums, helpers, userFunctions } from 'helpers'
import { Editable, Matches, PhoneNumber, UserStats, TopRivals, Match, UnlinkedMatches } from '../components/forms/index.js'
import './profile.css';
import { Avatar, Modal, Box, Typography, Dialog, DialogTitle, Checkbox, Toolbar } from '@mui/material';
import { AiOutlineEdit, AiOutlineMail, AiOutlinePhone, AiOutlineUndo } from 'react-icons/ai';
import { MdOutlineCancel, MdOutlineCheck, MdOutlineInfo } from 'react-icons/md';
import { BiLogOutCircle } from 'react-icons/bi';

function Profile(props) {

    const MatchEditor = lazy(() => import("../components/forms/index") //MatchEditor/MatchEditor")
        .then(module => { return { default: module.MatchEditor } }))
    //const UserStats = lazy(() => import("../components/forms/index")
    //    .then(module => { return { default: module.UserStats } }))

    const NTRPItems = ["-", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"];
    const [isLinkVisible, setIsLinkVisible] = useState(false);

    const handleIconClick = () => {
      setIsLinkVisible(!isLinkVisible);
    };
    const params = useParams();
    const [error, setError] = useState({ status: false, message: null });
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);
    const [isEdit, setIsEdit] = useState(false);
    //const [profileChange, setProfileChange] = useState(0)
    const [canEdit, setCanEdit] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [showMatchEditor, setShowMatchEditor] = useState(false);
    const [player, setPlayer] = useState()
    const [stats, setStats] = useState({})
    const [statsFetched, setStatsFetched] = useState(false);
    const [rivals, setRivals] = useState({})
    const [rivalsFetched, setRivalsFetched] = useState(false);
    const [tabIndex, setTabIndex] = useState(0)
    const [unLinkedMatches, setUnLinkedMatches] = useState()
    const [loggedInPlayer, setLoggedInPlayer] = useState()
    const [unLinkedMatchesAdded, setUnLinkedMatchesAdded] = useState(0)

    const handleUpdatedPhoneNumber = newNumber => {
        setPlayer({ ...player, phone: newNumber })
    }

    const handleStatsClick = () => {
        if (!statsFetched) {
            userFunctions.getPlayerStatsByYear(player.id, 'SINGLES')
                .then((data) => {
                    setStats(data)
                    setStatsFetched(true)
                    console.log("statsFetched", data)
                })
        }
    }
    const handleRivalsClick = () => {
        if (!rivalsFetched) {
            userFunctions.getGreatestRivals(player.id)
                .then((data) => {
                    setRivals(data)
                    setRivalsFetched(true)
                })
        }
    }

    async function updateProfilePic(e) {

        const profilePic = Array.from(e.target.files)[0]
        setIsLoaded(false)
        const p = await userFunctions.UpdatePlayer(player, player.id, profilePic)
        console.log("updateProfilePic", p)
        setPlayer(prevState => ({ ...prevState, image: p.image, imageUrl: p.imageUrl }))
        setIsLoaded(true)
        setShowImagePicker(false)
    }

    async function updateProfileData(e) {
        e.preventDefault();

        setIsLoaded(false)
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
        setIsLoaded(true)
        setIsEdit((isEdit) => !isEdit)
    }

    function openUserImagePicker(e) {
        e.preventDefault()
        if (canEdit) setShowImagePicker(true);
    }

    function handleUnlinkedMatchAdded() {
        setUnLinkedMatchesAdded(prevVal => { return prevVal + 1 })
    }

    useEffect(() => {
        console.log("profile page got new userId", params.userid)

        setRivals({})
        setRivalsFetched(false)
        setStatsFetched(false)
        setStats({})
        setTabIndex(0)
        setUnLinkedMatches()

        async function getProfile() {

            let p = null;
            setCanEdit(false)
            const sessionPlayer = await userFunctions.getCurrentlyLoggedInPlayer()
            setLoggedInPlayer(sessionPlayer)
            // Check if userid param was provided

            if (params.userid) {
                console.log('userid provided')
                // Get the user from the userid -> paramPlayer
                p = await userFunctions.getPlayer(params.userid)
                p = p ?? sessionPlayer
                //setUnLinkedMatches(p.unLinkedMatches)

            }
            else {
                console.log('no userid provided, use sessionPlayer', sessionPlayer)
                // if (sessionPlayer) {
                p = sessionPlayer
                //     document.title = 'My Tennis Space - ' + p.name;
                //     //setPlayer(prevState => ({...prevState, p})) 
                //     console.log('This is your page, so you can edit it');
                //     setCanEdit(true);
                // }
                // else {
                //     setError({ status: true, message: 'This user does not exist.' });
                // }
                // setIsLoaded(true);
            }
            if (sessionPlayer) {
                if (sessionPlayer.email === p.email) {
                    console.log('This is your page, so you can edit it')
                    setUnLinkedMatches(sessionPlayer.unLinkedMatches)
                    setCanEdit(true)
                }
            }
            else if (!p) {
                setError({ status: true, message: 'This user does not exist.' });
            }
            setIsLoaded(true)

            if (p)
                document.title = 'My Tennis Space - ' + p.name

            return p

        }

        getProfile().then(p => {
            console.log("getProfile", p)
            setPlayer(p)
        })
        //}, []);  
    }, [params.userid, unLinkedMatchesAdded]);


    if (error.status) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <h2><Loader />Loading...</h2>;
    } else {
        return (
            <Flex className='profile-main' id="profile">

                <Flex as="form"
                    className='profile-form'
                    onSubmit={updateProfileData}
                >
                    {/******** MODAL TO UPDATE PICTURE   *********/}
                    <Modal
                        aria-labelledby="Update profile picture"
                        onClose={() => setShowImagePicker(false)}
                        open={showImagePicker}
                    >
                        <Box sx={helpers.modalStyle}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={'1rem'}>
                                {`Update profile picture`}
                            </Typography>
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
                        </Box>
                    </Modal>


                    <Card className='card profile-info' id="profileContact" variation="elevated">

                        {/************ PROFILE PICTURE   *************/}
                        <Avatar
                            {...userFunctions.stringAvatar(player, 150)}
                            className={`image ${canEdit ? " cursorHand" : null}`}
                            onClick={(e) => { openUserImagePicker(e) }}
                        />

                        <div>
                            {/************ EDIT TOOGLE   *************/}
                            <div className="desktop-only"
                                style={{ textAlign: 'right', float: 'right', paddingRight: '1rem' }}
                            >
                                {canEdit && isEdit &&
                                    <>
                                        <MdOutlineCheck
                                            onClick={(e) => { setIsEdit(!isEdit) }}
                                            className='cursorHand'
                                        />
                                        <MdOutlineCancel
                                            onClick={() => setIsEdit(!isEdit)}
                                            className='cursorHand'
                                        />
                                    </>
                                }
                                {canEdit && !isEdit &&
                                    <AiOutlineEdit
                                        onClick={() => setIsEdit(!isEdit)}
                                        className='cursorHand'
                                    />

                                }
                            </div>
                            {/************ NAME   *************/}
                            <Text fontSize='x-large' className='name'>
                                {player.name}
                            </Text>

                            <span className='profile-contact'>
                                {/************ EMAIL   *************/}
                                <Text fontSize='small'>
                                    <AiOutlineMail />
                                    {isLoggedIn
                                        ? <>&nbsp;<a href={`mailto:${player.email}`}>{player.email}</a></>
                                        : <>&nbsp;Hidden</>
                                    }
                                </Text>
                                {/************ PHONE   *************/}
                                <Text fontSize='small'>
                                    <AiOutlinePhone />
                                    {isLoggedIn
                                        ?
                                        <>&nbsp;
                                            <PhoneNumber name="name" onNewNumber={handleUpdatedPhoneNumber} number={player.phone} editable={isEdit && canEdit} />
                                        </>
                                        : <>&nbsp;Hidden</>
                                    }
                                </Text>
                                {/************ NTRP   *************/}
                                <Text >
                                    <Flex direction={'row'}>
                                        NTRP:
                                        <Editable
                                            text={player.NTRP ?? '-'}
                                            isEditing={isEdit}
                                            direction="row"
                                            gap="0.5rem"
                                        >
                                            <SelectField
                                                name="NTPR"
                                                size='small'
                                                defaultValue={player.NTRP ? player.NTRP : '2.0'}
                                                options={NTRPItems}
                                            ></SelectField>

                                        </Editable>
                                        <Text as="span" >
                                            <MdOutlineInfo onClick={handleIconClick} className='cursorHand' />
                                            <a
                                                href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
                                                target='_blank'
                                                style={{
                                                    display: isLinkVisible ? 'block' : 'none',
                                                    position: 'absolute',
                                                    //top: '30px', // Adjust the top position as needed
                                                    //left: 0,
                                                    background: 'white',
                                                    padding: '10px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '5px',
                                                    transform: 'scale(1.1)',
                                                    transition: 'transform 0.3s',
                                                }}
                                            >
                                                View the USTA NTPR guidelines
                                            </a>
                                        </Text>
                                    </Flex>
                                </Text>
                                {/************ UTR   *************/}
                                <Flex direction={'row'}>UTR rating:
                                    <Editable
                                        text={player.UTR ?? '-'}
                                        isEditing={isEdit}
                                    >
                                        <TextField name="UTR" size='small' defaultValue={player.UTR}></TextField>
                                    </Editable>
                                    <MdOutlineInfo ></MdOutlineInfo>
                                </Flex>
                            </span>
                        </div>

                        {/************ EDIT TOOGLE   *************/}
                        <div className="mobile-only" style={{ textAlign: 'right', paddingRight: '1rem', flexGrow: 1 }}>

                            {canEdit && isEdit &&
                                <>
                                    <MdOutlineCheck
                                        onClick={(e) => { setIsEdit(!isEdit); updateProfileData(e) }}
                                        className='cursorHand'
                                    />
                                    <MdOutlineCancel
                                        onClick={() => setIsEdit(!isEdit)}
                                        className='cursorHand'
                                    />
                                </>
                            }
                            {canEdit && !isEdit &&
                                <AiOutlineEdit
                                    onClick={() => setIsEdit(!isEdit)}
                                    className='cursorHand'
                                />

                            }
                        </div>
                    </Card>

                    {/************ RIGHT CONTENT   *************/}
                    <Card className='card rightProfileContent' variation="elevated" flex="1">
                        <Tabs
                            currentIndex={tabIndex}
                            onChange={(i) => setTabIndex(i)}
                            justifyContent="flex-start">
                            <TabItem title="General">

                                <Grid
                                    templateColumns="1fr 3fr"
                                    templateRows="auto"
                                    paddingTop={"10px"}
                                >


                                    {/************ LADDERS   *************/}
                                    <View>Ladders:</View>
                                    {/* <Ladders ladderList={player.ladders} player={player} /> */}
                                    <Grid templateRows={"auto"}>
                                        {player.ladders.items.map((item, i) => {
                                            console.log(item)
                                            return (
                                                <Link to={`/ladders/${item.ladder.id}`} key={item.ladder.id}>{item.ladder.name}</Link>
                                            )
                                        })}
                                    </Grid>

                                    {/************ ABOUT   *************/}
                                    <View><Text>About:</Text></View>
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
                            </TabItem>
                            <TabItem title="Stats" onClick={handleStatsClick} >
                                {/************ STATS   *************/}
                                <UserStats stats={stats} statsFetched={statsFetched} paddingTop={10} />
                            </TabItem>
                            <TabItem title="Greatest Rivals" onClick={handleRivalsClick} >
                                {/************ RIVALS   *************/}
                                <TopRivals data={rivals} rivalsFetched={rivalsFetched} player={player} paddingTop={10} />
                            </TabItem>
                        </Tabs>
                    </Card>
                </Flex>

                {/************ MATCHES   *************/}
                <Flex direction="row" gap="1rem">
                    <Card className='card' variation="elevated" style={{ width: "100%" }}>
                        <UnlinkedMatches matches={unLinkedMatches} player={player} handleMatchAdded={handleUnlinkedMatchAdded} />
                        <Matches player={player} limit="5" allowDelete={loggedInPlayer.isAdmin}></Matches>
                        {canEdit &&
                            <Button label="Add new match"
                                onClick={() => setShowMatchEditor(true)}
                            // onClick={(e) => { toggleMatchEditor(e) }}
                            >
                                {showMatchEditor ? 'Cancel' : 'Add'}
                            </Button>
                        }
                        <Dialog
                            onClose={() => setShowMatchEditor(false)}
                            open={showMatchEditor}
                            aria-labelledby={`Add a match`}
                            aria-describedby="Add a new match"
                            padding={'1rem'}
                        >
                            <DialogTitle>Add a new match</DialogTitle>
                            <Box padding={'1rem'}>
                                <Suspense fallback={<h2><Loader />Loading...</h2>}>
                                    <MatchEditor player={player} onSubmit={updateProfileData} />
                                </Suspense>
                            </Box>
                        </Dialog>
                    </Card>
                </Flex>
            </Flex>
        )
    }

};

export default Profile;
