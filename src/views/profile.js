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
  SliderField,
  SwitchField
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
    const [profileChange, setProfileChange] = useState(0)
    const [canEdit, setCanEdit] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    //const player = useRef(null);
    const [player2, setPlayer] = useState()
    const editSwitch = useRef();

    async function getProfile() {
        
        const loggedIn = async () => {
            return await userFunctions.CheckIfSignedIn()
        }
        setIsLoggedIn(loggedIn);
        
        let p = null;

        const sessionPlayer = await userFunctions.getCurrentlyLoggedInPlayer()        
        // Check if userid param was provided
        if(params.userid) {
            console.log('userid provided');
            // Get the user from the userid -> paramPlayer
            p = await userFunctions.getPlayer(params.userid) 
            p = p ?? sessionPlayer
                    
            if(sessionPlayer) {
                if(sessionPlayer.email === p.email) {
                    console.log('This is your page, so you can edit it');
                    setCanEdit(true);
                }
            }
            else {
                setError({status:true, message:'This user does not exist.'});
            }
            setIsLoaded(true);
        }
        else {
            console.log('no userid provided, use sessionPlayer', sessionPlayer);        
            if(sessionPlayer) {
                p = sessionPlayer;
                console.log(p)
                document.title = 'My Tennis Space - ' + p.name;
                //setPlayer(prevState => ({...prevState, p})) 
                console.log('This is your page, so you can edit it');
                setCanEdit(true);                        
            }
            else {
                setError({status:true, message:'This user does not exist.'});
            }
            setIsLoaded(true);
        }    
        
        if(p)
            document.title = 'My Tennis Space - ' + p.name;

        return p;

    }

    // function updatePlayer() {
    //     setIsLoaded(false);
        
    //     new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
    //         setIsLoaded(true);
    //     });
    // }

    async function updateProfilePic(e) {        
        // const profilePic = Array.from(profilePicPicker.current.files)[0]
        const profilePic = Array.from(e.target.files)[0]

        const p = await userFunctions.UpdatePlayer(player2, player2.id, profilePic)
        console.log("updateProfilePic",p)
        setPlayer(prevState => ({...prevState, image: p.image, imageUrl: p.imageUrl})) 
        // Set profile changed to re-render
        //setProfileChange(profileChange + 1)

        setShowImagePicker(false)        
    }

    // function setPlayerNTPR(val) {
    //     let newVal = val
    //     if(typeof val === 'number') {
    //         console.log("add zero and make to string")
    //         newVal = val.toFixed(1).toString()
    //     }
        
    //     setPlayer(prevState => ({...prevState, NTPR: newVal}))  
    // }

    async function updateProfileData(e) {      
        e.preventDefault();

        const form = new FormData(e.target);
        const data = {
            about: form.get("about"),
            NTRP: form.get("NTPR"),
            UTR: form.get("UTR"),
        };
        console.log(player2)
        
        let p = await userFunctions.UpdatePlayer(data, player2.id)
        setPlayer(prevState => ({...prevState, p}))
         
        console.log(p)
        //console.log(player2)
        setIsEdit((isEdit) => !isEdit)
        // console.log(editSwitch.current.checked)
        // //editSwitch.current.check// = false
        // editSwitch.current.checked = false
        // console.log(editSwitch.current.checked)
        // Set profile changed to re-render
        //setProfileChange(profileChange + 1)
    }

    function openUserImagePicker(e) {
        e.preventDefault()
        
        if(canEdit)
            setShowImagePicker(true);
    }
    
    // useEffect(() => {
    //     console.log(player2)
    //     // const p = player2.p
    //     //setPlayer(prevState => ({...prevState, player2})) 
    // },[])

    useEffect(() => {
        console.log("profile page got new userId", params)

        getProfile().then(p => setPlayer(p))
    //}, []);  
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
                                {player2.image ?
                                    <Image
                                        src={player2.imageUrl}
                                        alt={`visual aid for ${player2.name}`}
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
                                        text={player2.name}
                                        className="hiddenImageInput" 
                                        onChange={(e) => {updateProfilePic(e)}}                                  
                                        />  
                                                                                                                 
                                    <Button>
                                        <label htmlFor="imageInput" className='cursorHand'>
                                            Select a profile picture.
                                        </label>
                                    </Button>
                                </Modal>
                            <Text fontSize='x-large'>{player2.name}</Text>
                            <Text fontSize='small'>{isLoggedIn ? <a href={`mailto:${player2.email}`}>{player2.email}</a> : 'Email only visible to other players'}</Text>
                            <Text fontSize='small'>{isLoggedIn ? (player2.phone) : ''}</Text>
                        </Card>
                        <Card className='card' variation="elevated" flex="1" as="form" onSubmit={updateProfileData}>
                            <div style={{float:'right'}}>
                            {canEdit &&
                            <SwitchField
                                key={"editModeSwitch"}
                                isDisabled={false}
                                defaultChecked={false}
                                label="Edit Mode"
                                labelPosition="start"
                                checked={isEdit}
                                ref={editSwitch}
                                onChange={(e) => {setIsEdit(e.target.checked)}}
                                />
                            }
                            </div>
                            <Grid 
                                // rowGap={'0.5rem'}
                                // columnGap={"2rem"}
                                templateColumns="1fr 3fr"
                                templateRows="1fr 1fr 1fr 3fr"
                            >
                                <View><Text>NTRP rating:</Text></View>
                                <Flex direction={'row'} flex='1'>
                                    <Editable 
                                    text={player2.NTRP ?? '-'}
                                    isEditing={isEdit}  
                                    direction="row"
                                    gap="1rem"                                  
                                > 
                                    <SelectField
                                        name="NTPR"
                                        size='small'                                        
                                        defaultValue={player2.NTRP ? player2.NTRP : '2.0'}
                                        options={NTRPItems}
                                        //onChange={(e) => {setPlayerNTPR(e.target.value)}}
                                    ></SelectField>
                                    {/* <SliderField label="Select your NTPR" labelHidden="true" isValueHidden="false"
                                            min={1.5}
                                            max={6.0}
                                            step={0.5}
                                            onChange={(e) => {console.log(e); player.current.NTRP = e;setPlayerNTPR(e) }}
                                            defaultValue={3.0}>
                                        </SliderField><div>{player2.NTRP}</div> */}
                                    
                                    
                                    
                                </Editable> 
                                <span>View the USTA NTPR <a href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf' target='blank'>guidelines</a>.</span>
                                </Flex>
                                <View>UTR rating:</View>
                                <Editable
                                    text={player2.UTR ?? '-'}
                                    isEditing={isEdit}
                                >
                                    <TextField name="UTR" size='small' defaultValue={player2.UTR}></TextField>
                                </Editable>
                                <View>Ladders:</View>
                                <Ladders></Ladders>
                                <View><Text fontSize={'large'}>About:</Text></View>
                                <Editable
                                    text={player2.about}
                                    isEditing={isEdit}>
                                    <TextAreaField name="about" defaultValue={player2.about}></TextAreaField>
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
                            <Matches player={player2}></Matches>
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
