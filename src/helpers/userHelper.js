import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

const userHelper = {

	getPlayerNames: function(players) {
		return players.map((p, index) => (
			<span key={p.id}>
				{p.name}
				{index < players.length - 1 && <br />}
			</span>
		));
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
						<Box>{i > 0 ? ' / ' : ''}</Box>
						<Link to={`/players/${p.slug}`} >{name}</Link>
					</React.Fragment>
				)
			}
			else 
				return (
					<React.Fragment key={`Fragment_${i}`}>
					<Box>{i > 0 ? ' / ' : ''}</Box>
					{name}
				</React.Fragment>
				)
		})
	},
}

export default userHelper;
