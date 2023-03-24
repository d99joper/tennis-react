// DynamicTable.js
import { Table, TableBody, TableCell, TableFoot, TableHead, TableRow } from "@aws-amplify/ui-react";
import { userFunctions } from "helpers";
import React, { useEffect, useState } from "react";
import { GoTriangleDown, GoTriangleUp, GoCommentDiscussion } from 'react-icons/go';
import { GiCrossedSwords, GiPropellerBeanie } from 'react-icons/gi';
import { Link } from "react-router-dom";
import H2H from "../H2H/H2H";
import Modal from "components/layout/Modal/modal";
import { ConsoleLogger } from "@aws-amplify/core";
//import "./Matches.css"

const DynamicTable = ({
    columns,
    sortField: initialSortField,
    direction: initialDirection,
    data,//: initialData,
    footerChildren,
    iconSet,
    nextToken,
    nextText,
    ...props
}) => {

    //useEffect(()=>{},[data])
    const [sortField, setSortField] = useState(initialSortField)
    const [direction, setDirection] = useState(initialDirection)
    const [isShowH2H, setIsShowH2H] = useState([])
    const [isH2HDataFetched, setIsH2HDataFetched] = useState({})//new Array(data.length).fill(false))
    const [h2HData, setH2HData] = useState()

    function openH2HModal(match, i) {
        if (!isH2HDataFetched[i]) {
            userFunctions.getPlayerH2H(match.winner, match.loser).then((data) => {
                setH2HData(data)
                console.log(data)
            })
        }

        setIsH2HDataFetched(prevState => {
            return { ...prevState, [i]: true }
        })

        setIsShowH2H(prevState => { return { ...prevState, [i]: true } })
    }

    function createIconSets(item, i) {
        let sets = []
        iconSet.forEach(element => {
            switch (element.name) {
                case 'H2H':
                    //console.log(item)
                    sets.push(
                        <React.Fragment key={`Fragment_${i}`}>
                            <GiCrossedSwords
                                title="H2H"
                                className="middleIcon"
                                color="#3e3333"
                                onClick={() => openH2HModal(item.match, i)}
                            />
                            <Modal
                                title={`${item.match.winner.name} vs ${item.match.loser.name}`}
                                onClose={() => setIsShowH2H(prevState => { return { ...prevState, [i]: false } })}
                                show={isShowH2H[i]}
                            >
                                <H2H key={`H2H_${i}`} data={h2HData} />

                            </Modal>
                        </React.Fragment>
                    )
                    break;
                case 'Comments':
                    sets.push(
                        <GoCommentDiscussion key={`icon_${i}`}
                            color="#3e3333"
                        />
                    )
                    break;
                default:
                    break;
            }
        });

        return sets
    }

    function setContent(item, column, i) {
        let text, urlVals
        //console.log("setContent",item,column,i)
        if (column.link) {
            const urlSplit = column.link.split('/')
            urlVals = { page: urlSplit[0], type: urlSplit[1], value: 0 }
        }
        const x = column.accessor.split('.')
        switch (column.parts) {
            case 3:
                // console.log(item)
                // console.log(x)
                // console.log(item[x[0]][[x[1]]])
                // console.log(item[x[0]][[x[1]]][[x[2]]])
                text = item[x[0]][[x[1]]][[x[2]]]
                if (urlVals) {
                    urlVals.value = item[x[0]][[x[1]]][urlVals.type]
                }
                break;
            case 2:
                //const x = column.accessor.split('.')
                text = item[x[0]][[x[1]]]
                if (urlVals) {
                    urlVals.value = item[x[0]][urlVals.type]
                }
                break;
            case 1:
                text = item[column.accessor]
                if (urlVals)
                    urlVals.value = item[urlVals.type]
                break;
            case 0:
                return createIconSets(item, i)
            default:
                break;
        }

        if (urlVals) {
            return (<Link to={'/' + urlVals.page + '/' + urlVals.value} onClick={props.onLinkClick} >{text}</Link>)
        }
        return text
    }

    const handleSorting = (col, sortOrder) => {
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
                }) * (sortOrder === "asc" ? 1 : -1)
            )
        })
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
        {data.length > 0 ?
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
                                            : (sortField === col.accessor && direction === "desc")
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
                        {data.map((m, i) =>
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
                            </TableRow>
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
                    <div onClick={props.onNextClick}>
                        {nextText}
                    </div>
                    : null
                }

            </>
            : 'no matches'
        }
    </div>)
}

export default DynamicTable