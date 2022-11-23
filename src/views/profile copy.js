import { API, Storage, Auth, selectInput } from 'aws-amplify';
import React, {useState, useEffect, useRef} from 'react'; 
import { SlPencil, SlUser } from 'react-icons/sl';
import {useParams} from 'react-router-dom';
import {
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
  TextField,
  SelectField,
  View,
  Image,
  ComponentPropsToStylePropsMap,
  TextAreaField,
  Divider,
  useTheme,
  SliderField
} from "@aws-amplify/ui-react";
import {userFunctions} from '../helpers/helpers'
import {Editable, Matches, Ladders} from '../components/forms/index.js'
import Modal from '../components/layout/Modal/modal';
import './profile.css';


function Profile(props) {

    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    const NTRPItems = ["-","1.5","2.0","2.5","3.0","3.5","4.0","4.5","5.0","5.5"];


    const params = useParams();
    const [error, setError] = useState({status: false, message: null});
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const player = useRef(null);
    const [player2, setPlayer] = useState();
    const profilePicPicker = useRef();

    function toggleEdit() {
        setIsEdit(!isEdit);
    }

    function updatePlayer() {
        setIsLoaded(false);
        
        new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
            setIsLoaded(true);
        });
    }

    async function updateProfilePic(e) {        
        // const profilePic = Array.from(profilePicPicker.current.files)[0]
        const profilePic = Array.from(e.target.files)[0]

        player.current = await userFunctions.UpdatePlayer(player.current, player.current.id, profilePic)

        setShowImagePicker(false)
        
    }

    function setPlayerNTPR(val) {
        let newVal = val
        if(typeof val === 'number') {
            console.log("add zero and make to string")
            newVal = val.toFixed(1).toString()
        }
        console.log(newVal, typeof newVal)
        setPlayer(prevState => ({...prevState, NTPR: newVal}))  
        console.log(player2)
    }

    async function updateProfileData(e) {        
        player.current = await userFunctions.UpdatePlayer(player.current, player.current.id)
        setPlayer(player.current)  
    }

    function openUserImagePicker(e) {
        e.preventDefault()
        
        if(canEdit)
            setShowImagePicker(true);
    }
    
    useEffect(() => {
        console.log(player.current)
        setPlayer(player.current)  
    },[player2])

    useEffect(() => {
        console.log("profile page got new userId", params)

        const loggedIn = async () => {
            return await userFunctions.CheckIfSignedIn()
        }
        setIsLoggedIn(loggedIn);
        
        userFunctions.getCurrentlyLoggedInPlayer()        
            .then((sessionPlayer) => {
                
                // Check if userid param was provided
                if(params.userid) {
                    console.log('userid provided');
                    // Get the user from the userid -> paramPlayer
                    userFunctions.getPlayer(params.userid)
                    .then((paramPlayer) => {

                        player.current = paramPlayer ?? sessionPlayer;
                        setPlayer(player.current)  
                        // no user set
                        //if(paramPlayer === 'undefined' & sessionPlayer === 'undefined') {
                        if(player.current) {
                            document.title = 'My Tennis Space - ' + player.current.name;
                            if(sessionPlayer) {
                                if(sessionPlayer.email === player.current.email) {
                                    console.log('This is your page, so you can edit it');
                                    setCanEdit(true);
                                }
                            }
                        } 
                        else {
                            setError({status:true, message:'This user does not exist.'});
                        }
                        setIsLoaded(true);
                    })
                    .catch((e) => {
                        setError({status:true, message: e})
                    });
                }
                else {
                    console.log('no userid provided, use sessionPlayer', sessionPlayer);        
                    if(sessionPlayer) {
                        player.current = sessionPlayer;
                        setPlayer(player.current)  
                        console.log('This is your page, so you can edit it');
                        setCanEdit(true);                        
                    }
                    else {
                        setError({status:true, message:'This user does not exist.'});
                    }
                    setIsLoaded(true);
                }                
            });
    }, [params.userid]);  

    if (error.status) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>

                <Flex direction="column" gap="1rem">
                    <Flex direction="row" gap="1rem">
                        <Card className='card' variation="elevated">
                            <View className={"profileImageContainer"}>
                                {player.current.image ?
                                    <Image
                                        src={player.current.imageUrl}
                                        alt={`visual aid for ${player.current.name}`}
                                        className={`profileImage ${canEdit ? " cursorHand":null}`}
                                        onClick={(e) => {openUserImagePicker(e)}}
                                    />
                                    
                                :   <SlUser size='150' className={`${canEdit ? " cursorHand":null}`} onClick={(e) => {openUserImagePicker(e)}} />}
                            </View>
                                {/* <button onClick={() => {setShowImagePicker(true)}}>Show Modal</button> */}
                                <Modal 
                                    title="Update profile picture" 
                                    onClose={() => setShowImagePicker(false)} show={showImagePicker} 
                                    // onSubmit={(e) => {updateProfilePic(e)}}
                                    >
                                    <View
                                        name="profilePic"
                                        as="input"
                                        type="file"    
                                        id="imageInput"
                                        text={player.current.name}
                                        className="hiddenImageInput" 
                                        ref={profilePicPicker}
                                        onChange={(e) => {updateProfilePic(e)}}                                  
                                        />  
                                                                                                                 
                                    <Button>
                                        <label htmlFor="imageInput" className='cursorHand'>
                                            Select a profile picture.
                                        </label>
                                    </Button>
                                </Modal>
                            <Text fontSize='x-large'>{player.current.name}</Text>
                            <Text fontSize='small'>{isLoggedIn ? <a href="mailto:player.current.email">{player.current.email}</a> : 'Email only visible to other players'}</Text>
                            <Text fontSize='small'>{isLoggedIn ? (player.current.phone) : ''}</Text>
                        </Card>
                        <Card className='card' variation="elevated" flex="1">
                            <Grid 
                                // rowGap={'0.5rem'}
                                // columnGap={"2rem"}
                                templateColumns="1fr 3fr"
                                templateRows="1fr 1fr 1fr 3fr"
                            >
                                <View><Text>NTRP rating:</Text></View>
                                <Flex direction={'row'} flex='1'>
                                    <Editable 
                                    text={player.current.NTPR ?? '-'}
                                    isEditing={true}  
                                    direction="row"
                                    gap="1rem"                                  
                                > 
                                    <SelectField
                                        // backgroundColor={'white'}
                                        size='small'
                                        value={player2.NTPR}
                                        defaultValue={player2.NTPR ?? ''}
                                        options={NTRPItems}
                                        onChange={(e) => {player.current.NTRP = e.target.value;setPlayerNTPR(e.target.value)}}
                                    ></SelectField>
                                    {/* <SliderField label="Select your NTPR" labelHidden="true" isValueHidden="false"
                                            min={1.5}
                                            max={6.0}
                                            step={0.5}
                                            onChange={(e) => {console.log(e); player.current.NTRP = e;setPlayerNTPR(e) }}
                                            defaultValue={3.0}>
                                        </SliderField><div>{player2.NTRP}</div> */}
                                    
                                    <span>USTA NTPR <a href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf' target='blank'>guidelines</a>.</span>
                                    
                                </Editable> 
                                </Flex>
                                <View>UTR rating:</View>
                                <Editable
                                    text={player.current.UTR ?? '-'}
                                    isEditing={true}
                                >
                                    <TextField size='small' defaultValue={player.current.UTR}></TextField>
                                </Editable>
                                <View>Ladders:</View>
                                <Ladders></Ladders>
                                <View><Text fontSize={'large'}>About:</Text></View>
                                <Editable
                                    text={player.current.About}
                                    isEditing={true}>
                                    <TextAreaField></TextAreaField>
                                </Editable>
                            </Grid>
                            
                            
                            
                            {/* <Flex direction="row">
                                <Flex 
                                    direction="column"
                                    gap="5px"
                                >
                                    <View>NTRP rating:</View>
                                    <View>UTR rating:</View>
                                    <View>Ladders:</View>
                                    <View><Text fontSize={'large'}>About:</Text></View>
                                </Flex>
                                <Flex direction="column" gap="5px">                                    
                                    <Editable 
                                        text={player.current.NTPR ?? '-'}
                                        isEditing={true}    
                                    > 
                                        <SelectField
                                            // backgroundColor={'white'}
                                            defaultValue={player.current.NTPR ?? ''}
                                            placeholder="What is your NTPR?"
                                            options={NTRPItems}
                                        ></SelectField>
                                        <span>Set your USTA NTPR or estimate based on these <a href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf' target='blank'>guidelines</a>.</span>
                                    </Editable> 
                                    
                                    <View>{player.current.NTPR ?? '-'}</View>
                                    <View>{player.current.UTR ?? '-'}</View>
                                </Flex>
                            </Flex> */}
                        </Card>
                    </Flex>
                    <Flex direction="row" gap="1rem">
                        <Card className='card' variation="elevated">                            
                            <Matches player={player.current}></Matches>
                        </Card>
                    </Flex>
                </Flex>
                <Divider></Divider>


                {/* <div className='profileWrapper'>
                    <div className='header'>Header</div>
                    <div className='profilePic'>Profile pic</div>
                    <div className='stats'>Stats</div>
                    <div className='about'>about</div>
                    <div className='matches'>matches</div>
                </div> */}
                
            </>
        )
    }

};

export default Profile;
