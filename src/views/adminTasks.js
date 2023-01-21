import { Button } from "@aws-amplify/ui-react";
import { matchFunctions } from "helpers";
import React from "react";
import XLSX, { read, utils, writeFile } from 'xlsx';

const adminTasks = (() => {      
      
      async function importMatches(e) {
          console.log("import matches")
          const file = e.target.files[0];
        /* get raw data */
        const data = await file.arrayBuffer();
        /* data is an ArrayBuffer */
        const wb = XLSX.read(data);
        //console.log(data, wb)
        /* do something with the workbook here */
        const matchArray = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {raw: false})
        matchFunctions.createMatchesFromArray(matchArray)
    }

    return (
        <>
            <input onChange={importMatches} type="file"></input>Import Matches
        </>
    )
})

export default adminTasks