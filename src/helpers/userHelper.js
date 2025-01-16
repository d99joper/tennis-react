import { API, Auth, DataStore, Storage } from 'aws-amplify';
import { helpers, enums } from '../helpers/index';
import { SlUser } from 'react-icons/sl';
import { playerAPI } from 'api/services';
import React from 'react';
import { View } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';

const userHelper = {

	getPlayerNames: function(players) {
		return players.map((p) => p.name).join(', ')
	},

	SetPlayerName_old: function (player, lastnameOnly, boldText) {
		let name = player.name
		if (lastnameOnly)
			name = name.split(' ').filter(Boolean).slice(-1)[0]


		if (boldText) {

			if (boldText) {
				let regex = new RegExp(boldText, 'ig')
				const replaceText = name.match(regex)
				console.log(replaceText)
				name = name.split(regex).map((part, index) => {
					console.log(part, index)
					return index % 2 === 0 ? (
						// Non-matching part
						<React.Fragment key={index}>{part}<b>{replaceText[index]}</b></React.Fragment>
					) : (
						// Matching part
						<React.Fragment key={index}>{part}</React.Fragment>
					)
				}
				)
			}
		}
		return <>{name}</> //+ (player.verified ? "" : "*")
	},

	SetPlayerName: (players, setLink = true, boldText) => {
		// only display lastnames if doubles, and add a / between names (i > 0)
		const isDoubles = players.length > 1

		function getName(player) {
			let name = player.name
			if (isDoubles)
				name = name.split(' ').filter(Boolean).slice(-1)[0]

			if (boldText) {
				let regex = new RegExp(boldText, 'ig')
				const replaceText = name.match(regex)
				console.log(replaceText)
				name = name.split(regex).map((part, index) => {
					console.log(part, index)
					return index % 2 === 0 ? (
						// Non-matching part
						<React.Fragment key={index}>{part}<b>{replaceText[index]}</b></React.Fragment>
					) : (
						// Matching part
						<React.Fragment key={index}>{part}</React.Fragment>
					)
				})
			}
			return <>{name}</>
		}
		return players.map((p, i) => {
			const name = getName(p, isDoubles)
			if (setLink) {
				return (
					<React.Fragment key={`Fragment_${i}`}>
						<View as='span'>{i > 0 ? ' / ' : ''}</View>
						<Link to={`/profile/${p.id}`} >{name}</Link>
					</React.Fragment>
				)
			}
			else 
				return (
					<React.Fragment key={`Fragment_${i}`}>
					<View as='span'>{i > 0 ? ' / ' : ''}</View>
					{name}
				</React.Fragment>
				)
		})
	},
}

export default userHelper;
