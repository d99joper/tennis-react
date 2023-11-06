// DynamicTable.js
import { Button, Table, TableBody, TableCell, TableFoot, TableHead, TableRow, View } from "@aws-amplify/ui-react";
import { helpers, matchFunctions, userFunctions } from "helpers";
import React, { useEffect, useState } from "react";
import { GoTriangleDown, GoTriangleUp, GoCommentDiscussion } from 'react-icons/go';
import { GiCrossedSwords, GiPropellerBeanie, GiTennisRacket } from 'react-icons/gi';
import { Link } from "react-router-dom";
import H2H from "../H2H/H2H";
import { BsArrowBarDown, BsChevronCompactDown, BsChevronDoubleDown } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { Box, Dialog, DialogTitle, Modal, Typography } from "@mui/material";
//import "./Matches.css"

const DynamicTable = ({
    columns,
    sortField: initialSortField,
    direction: initialDirection,
    data,//: initialData,
    deleteFunc,
    footerChildren,
    iconSet,
    nextToken,
    nextText,
    sortHandler,
    ...props
}) => {

    const [sortField, setSortField] = useState(initialSortField)
    const [direction, setDirection] = useState(initialDirection)
    const [isShowComments, setIsShowComments] = useState([])
    const [isShowH2H, setIsShowH2H] = useState([])
    const [h2HData, setH2HData] = useState({})

    console.log("dynamicTable", data, sortField, direction)

    function openH2HModal(match, i) {
        //if (!isH2HDataFetched[i]) {
        const index = match.winner[0].id + match.loser[0].id
        if (!h2HData[index]) {
            userFunctions.getPlayerH2H(match.winner[0], match.loser[0]).then((data) => {
                setH2HData(prev => { return { ...prev, [index]: data } })
                console.log(data)
                setIsShowH2H(prevState => { return { ...prevState, [i]: true } })
            })
        }
        else setIsShowH2H(prevState => { return { ...prevState, [i]: true } })
    }
    function openCommentsModal(match, i) {
        setIsShowComments(prevState => { return { ...prevState, [i]: true } })
    }

    function createIconSets(item, i) {
        let sets = []
        iconSet.forEach(element => {
            switch (element.name) {
                case 'H2H':
                    //console.log(item)
                    let match = item.match ?? item 
                    if (match)
                        sets.push(
                            <React.Fragment key={`Fragment_${i}`}>
                                <GiCrossedSwords
                                    title="H2H"
                                    className="middleIcon"
                                    color="#3e3333"
                                    onClick={() => openH2HModal(item, i)}
                                />
                                <Dialog
                                    onClose={() => setIsShowH2H(prevState => { return { ...prevState, [i]: false } })}
                                    open={isShowH2H[i] ?? false}
                                    aria-labelledby={'Head to Head'}
                                    aria-describedby="Head to Head"
                                    padding={'1rem'}
                                >
                                    <Box padding={'1rem'}>
                                        <H2H key={`H2H_${i}`} data={h2HData[item.winnerID + item.loserID]} />
                                    </Box>
                                </Dialog>
                            </React.Fragment >
                        )
                    break;
                case 'Comments':
                    sets.push(
                        <React.Fragment key={`Fragment_${i}`}>
                                <GoCommentDiscussion
                            key={`icon_${i}`}
                            color="#3e3333"
                            className="cursorHand"
                            onClick={() => openCommentsModal(item, i)}
                        />
                                <Dialog
                                    onClose={() => setIsShowComments(prevState => { return { ...prevState, [i]: false } })}
                                    open={isShowComments[i] ?? false}
                                    aria-labelledby={'Comments'}
                                    aria-describedby="Comments"
                                    padding={'1rem'}
                                >
                                    <Box padding={'1rem'}>
                                        some comments here
                                    </Box>
                                </Dialog>
                            </React.Fragment >
                        
                    )
                    break;
                default:
                    break;
            }
        });

        return sets
    }

    // massage the data and add all content items to the output array (outArr)
    function setContent(item, column, i) {
        let outArr = [], text, urlVals, obj, property
        //console.log("setContent",item,column,i)
        if (column.link) {
            const urlSplit = column.link.split('/')
            urlVals = { page: urlSplit[0], type: urlSplit[1], value: 0 }
        }
        const x = column.accessor.split('.')
        // set the object depending on how many property levels we need to drill down (eq winner.name)
        switch (column.parts) {
            case 3:
                obj = item[x[0]][[x[1]]]
                property = x[2]
                break;
            case 2:
                obj = item[x[0]]

                property = x[1]
                break;
            case 1:
                obj = item
                property = column.accessor
                break;
            case 0:
                return createIconSets(item, i)
            default:
                break;
        }
        
        try {
            // if the text is in an array (as in two players playing doubles), extract each element
            if (Array.isArray(obj)) {
                obj.forEach((x, index) => {
                  outArr.push(parseContent(x, property, urlVals))

                  if (obj.length !== index + 1) 
                    outArr.push(<View as='span'> / </View>)
                })
            }
            // for non-array items
            else if (obj[property]) {
                outArr.push(parseContent(obj, property, urlVals))
            }
        }
        catch (e) {
            outArr.push(<View as='span'>"Data error"</View>)
        }

        return outArr.map((elem) => elem)
    }

    function parseContent(obj, property, urlVals) {
        let outArr=[], text = obj[property]

        // For the score prop, set the tiebreak scores to superscript
        if (property == 'score')
        text = text.split(', ').map((str, index) => {
            const [mainNum, superscriptNum] = str.split('(');
            return (
                <React.Fragment key={index}>
                    {mainNum}
                    {superscriptNum && <sup>({superscriptNum.slice(0, -1)})</sup>}
                    {index !== text.split(', ').length - 1 && ', '}
                </React.Fragment>
            )
        })

        // if there's an url specified, create a link
        if (urlVals) {
            // the url value might be different than the text value (eq winner.name vs winner.id)
            urlVals.value = obj[urlVals.type]
            if (urlVals.page === 'Profile')
                text = userFunctions.SetPlayerName(obj)
            
            outArr.push(
                <Link to={'/' + urlVals.page + '/' + urlVals.value}
                    onClick={() => props.onLinkClick(urlVals.value)}
                >
                    {text}
                </Link>
            )
        }
        // if no URL, just add the text in a span
        else 
            outArr.push(<View as='span'>{text}</View>)

        return outArr
    }

    const handleSorting = (col, sortOrder) => {
        if (sortHandler) {
            sortHandler(col.accessor, sortOrder)
        }
        else {
            console.log(col, sortOrder)
            data.sort((a, b) => {
                let x = a[col.accessor]
                let y = b[col.accessor]
                if (col.parts === 3) {
                    const p = col.accessor.split('.')
                    x = a[p[0]][p[1]][p[2]]
                    y = b[p[0]][p[1]][p[2]]
                }
                if (col.parts === 2) {
                    const p = col.accessor.split('.')
                    x = a[p[0]][p[1]]
                    y = b[p[0]][p[1]]
                }

                if (x === null) return 1;
                if (b === null) return -1;
                if (x === null && y === null) return 0

                return (
                    x.toString().localeCompare(y.toString(), "en", {
                        numeric: true,
                    }) * (sortOrder === "acs" ? 1 : -1)
                )
            })
        }
    }

    function handleSortingChange(e, col) {
        const parts = col.accessor.split('.')
        const sortOrder = (col.accessor === sortField && direction === "asc") ? "desc" : "asc";
        setSortField(col.accessor);
        setDirection(sortOrder);
        handleSorting(col, sortOrder)
    }

    function setBackgroundColor(item) {
        if (props.styleConditionVariable) { 
            if (item[props.styleConditionVariable])
                return { className: props.styleConditionColor[0] }
            return { className: props.styleConditionColor[1] }
        }
        return null
    }

    return (<div key={"dynamicTable" + props.key}>
        {data && data.length > 0 &&
            <>
                <Table highlightOnHover={true} marginTop="1em" marginBottom=".2em" variation="striped" className={props.className} backgroundColor={props.backgroundColor ?? 'white'}>
                    <TableHead backgroundColor={props.headerBackgroundColor ?? 'blue.20'} >
                        <TableRow>
                            {columns.map((col, i) =>
                                <TableCell as="th"
                                    key={col.accessor + '_' + i}
                                    className={col.sortable ? "cursorHand" : null}
                                    onClick={col.sortable ? (e) => handleSortingChange(e, col) : null}
                                >
                                    {col.label + " "}
                                    {  // Set the search arrow (default year desc)
                                        (!sortField && col.accessor == "year"
                                            ? <GoTriangleUp />
                                            // asc -> arrow down
                                            : sortField === col.accessor && direction === "asc")
                                            ? <GoTriangleDown />
                                            // desc -> arrow up
                                            : (sortField === col.accessor && direction === "asc")
                                                ? <GoTriangleUp />
                                                // grey with 100 opacity to act as space filler 
                                                : (col.sortable)
                                                    ? <GoTriangleDown />
                                                    // otherwise nothing
                                                    : null
                                    }
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((m, i) => {
                            const deleteCell = props.allowDelete ?
                                <TableCell key={`delete${i}`}>
                                    <AiOutlineDelete className="cursorHand" onClick={(e) => deleteFunc(m)} />
                                </TableCell>
                                : null
                            return (
                                <TableRow
                                    key={`BodyRow_${i}_${m.id}`}
                                    {...setBackgroundColor(m)}
                                >
                                    {columns.map(c => {
                                        const content = setContent(m, c, i)
                                        return (
                                            <TableCell key={`BodyCell_${i}_${c.accessor}`}>{content}</TableCell>
                                        )
                                    })}
                                    {deleteCell}
                                </TableRow>
                            )
                        }
                        )}
                        {/* {bodyChildren} */}
                    </TableBody>
                    {footerChildren &&
                        <TableFoot>
                            {footerChildren}
                        </TableFoot>
                    }
                </Table>
                {nextToken ?
                    <Button onClick={props.onNextClick} variation="link">
                        {nextText}&nbsp;<BsChevronDoubleDown />    <BsChevronDoubleDown />
                    </Button>
                    : null
                }

            </>
            // : 'no matches'
        }
    </div>)
}

export default DynamicTable