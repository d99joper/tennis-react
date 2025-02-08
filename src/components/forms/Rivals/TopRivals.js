import React, { useState } from "react";
import { Box, Card, CardContent, CardActions, Typography, Grid2 as Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ProfileImage } from "../ProfileImage";
import MyModal from "components/layout/MyModal";
import H2H from "../H2H/H2H";


const TopRivals = ({ data, rivalsFetched, player }) => {
	const [h2hModal, setH2hModal] = useState({ open: false, rival: null });

	const handleOpenModal = (rival) => setH2hModal({ open: true, rival });
	const handleCloseModal = () => setH2hModal({ open: false, rival: null });

	return (
		rivalsFetched ? (
			<>
				<Typography variant="h5">{player.name}</Typography>
				{data?.rivals?.length > 0
					? (
						<Box mt={2}>
							<Grid container spacing={2}>
								{data.rivals.map((rival, index) => (
									<Grid key={index} size={{ xs: 12, sm: 6 }}>
										<Card variant="outlined">
											<CardContent>
												<Typography as="span" variant="body1">
													<Box display="flex" alignItems="center" gap={1}>
														vs.&nbsp;
														<Link to={`/players/${rival.player.id}`} >
															<Box display="flex" alignItems="center" gap={0.5}>
																<ProfileImage player={rival.player} size={40} />
																<Typography variant="body1" component="span">
																	{rival.player.name}
																</Typography>
															</Box>
														</Link>
													</Box>
												</Typography>
												<Typography>
													<strong>{rival.wins} wins</strong> and{" "}
													<strong>{rival.losses} losses</strong> in {rival.total_matches} matches.
												</Typography>
											</CardContent>
											<CardActions>
												<Button size="small" color="primary" onClick={() => handleOpenModal(rival)}>
													See H2H
												</Button>
											</CardActions>
										</Card>
									</Grid>
								))}
							</Grid>
							<MyModal
								showHide={h2hModal.open}
								onClose={handleCloseModal}
								title={`H2H ${player.name} vs ${h2hModal.rival?.player.name || ""}`}
							>
								{h2hModal.rival && (
									<H2H
										winners={[player]}
										losers={[h2hModal.rival.player]}
									/>
								)}
							</MyModal>
						</Box>
					)
					: (
						<Typography variant="h6" align="center">
							You don't have any rivals yet. <br />
							Register at least two matches against the same opponent and then come back.
						</Typography>
					)}
			</>
		) : (
			<Typography variant="h6" align="center">Loading...</Typography>
		)
	);
};

export default TopRivals;
