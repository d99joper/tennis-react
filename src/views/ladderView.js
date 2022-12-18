import React from "react";
import { ladderFunctions as lf } from "helpers";

const LadderView = (props) => {

    //lf.CreateLadder({name: "Davis 4.0", location: "Davis, CA"})
    lf.AddPlayerToLadder({id:1}, {id:'bb62b979-4f2b-4e86-a357-c921c8d1bfe8'} )
    
    return (
    <>
        Ladders
    </>
    )
}

export default LadderView