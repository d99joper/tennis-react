// DynamicTable.js
import { Button, Table, TableBody, TableCell, TableFoot, TableHead, TableRow, View } from "@aws-amplify/ui-react";
import { helpers, matchHelper, userHelper } from "helpers";
import React, { useEffect, useState } from "react";
import { GoTriangleDown, GoTriangleUp, GoCommentDiscussion } from 'react-icons/go';
import { GiCrossedSwords, GiPropellerBeanie, GiTennisRacket } from 'react-icons/gi';
import { Link } from "react-router-dom";
import H2H from "../H2H/H2H";
import { BsArrowBarDown, BsChevronCompactDown, BsChevronDoubleDown } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { Box, Dialog, DialogTitle, Modal, Typography } from "@mui/material";
import { playerAPI } from "api/services";
import MyModal from "components/layout/MyModal";
import { Match } from "models";
import { Comments } from "../Comments/Comments";
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
	const [showCommentsModal, setShowCommentsModal] = useState(Array(data.length).fill(false))
	const [showH2HModal, setShowH2HModal] = useState(Array(data.length).fill(false))
	const [h2HData, setH2HData] = useState({})

	console.log("dynamicTable", data, sortField, direction)

	// function openH2HModal(match, i) {
	// 	setIsShowH2H(prevState => { return { ...prevState, [i]: true } })
	// }

	// function openCommentsModal(match, i) {
	// 	setShowComments(prevState => { return { ...prevState, [i]: true } })
	// }
	function modalSwitch(index, type, open) {
		switch (type) {
			case 'h2h':
				setShowH2HModal(prevState => {
					const newState = [...prevState]
					newState[index] = open
					return newState
				})
				break;
			case 'comments':
				setShowCommentsModal(prevState => {
					const newState = [...prevState]
					newState[index] = open
					return newState
				})
				break;
			default:
				break;
		}
	}

	function createIconSets(item, i) {
		let sets = []
		let m = item.match ?? item
		//console.log(m)
		iconSet.forEach(element => {
			switch (element.name) {
				case 'H2H' && m.winners.length === 1: // only show h2h for singles
					//console.log(item)
					if (m)
						sets.push(
							<React.Fragment key={`FragmentH2H_${i}`}>
								<GiCrossedSwords
									size={30}
									color="#058d0c"
									className={'cursorHand'}
									onClick={() => { modalSwitch(i, 'h2h', true) }}
								/>
								<MyModal
									showHide={showH2HModal[i]}
									onClose={() => { modalSwitch(i, 'h2h', false) }}
									title='H2H'
									height="500px"
									overflow="auto"
								>
									<H2H winners={m.winners} losers={m.losers} />
								</MyModal>
							</React.Fragment >
						)
					break;
				case 'Comments':
					if (m)
						sets.push(
							<React.Fragment key={`FragmentComment_${i}`}>
								<GoCommentDiscussion
									size={30}
									color="#058d0c"
									className={'cursorHand'}
									onClick={() => { modalSwitch(i, 'comments', true) }}
								/>
								<MyModal
									showHide={showCommentsModal[i]}
									onClose={() => { modalSwitch(i, 'comments', false) }}
									title={'Match comments'}
									height="500px"
									overflow="auto"
								>
									{/* <Match match={m} showComments={true} /> */}
									<Comments
										showComments={true}
										entityId={m.id}
										entityType="match"
										data={m.comments}
										allowAdd={props.isLoggedIn}
									/>
								</MyModal>
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
		//console.log(item,column)
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
				//console.log(obj, property)
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
			//console.log(Array.isArray(obj), obj)
			if (Array.isArray(obj)) {
				obj.forEach((x, index) => {
					//console.log(x)
					outArr.push(parseContent(obj, property, urlVals, i))
					//console.log(outArr, x, property)
					if (obj.length !== index + 1)
						outArr.push(<View as='span' key={i + '_' + property}> / </View>)
				})
			}
			// for non-array items
			else if (obj[property]) {
				outArr.push(parseContent(obj, property, urlVals))
			}
		}
		catch (e) {
			outArr.push(<View as='span' key={i + '_' + property}>Data error</View>)
		}

		return outArr.map((elem) => elem)
	}

	function parseContent(obj, property, urlVals, i) {
		let outArr = [], text = obj[property]

		// For the score prop, set the tiebreak scores to superscript
		if (property == 'score')
			text = text.split(', ').map((str, index) => {
				const [mainNum, superscriptNum] = str.split('(');
				return (
					<React.Fragment key={'score' + index}>
						{mainNum}
						{superscriptNum && <sup>({superscriptNum.slice(0, -1)})</sup>}
						{index !== text.split(', ').length - 1 && ', '}
					</React.Fragment>
				)
			})

		// if there's an url specified, create a link
		if (urlVals) {
			//console.log(urlVals)
			// the url value might be different than the text value (eq winner.name vs winner.id)
			urlVals.value = obj[urlVals.type]
			if (urlVals.page === 'Profile')
				text = userHelper.SetPlayerName(obj, false)

			outArr.push(
				<Link key={`${property}_${i}_content`} to={'/' + urlVals.page + '/' + urlVals.value}
					onClick={() => props.onLinkClick(urlVals.value)}
				>
					{text}
				</Link>
			)
		}
		// if no URL, just add the text in a span
		else
			outArr.push(<View as='span' key={`${property}_${i}_content`} >{text}</View>)

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
		// Check if there is a styling condition
		if (props.styleConditionVariable) {
			// if exists, check if the styling condition is set
			// special exception for winner id held in condition variable 2
			if (item[props.styleConditionVariable] || item.winners[0]?.id === props.styleConditionVariable2)
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
									key={'th' + col.accessor + '_' + i}
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