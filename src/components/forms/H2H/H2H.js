import { Badge, Card, Divider, Grid, Image, Loader, Table, TableBody, TableCell, TableHead, TableRow, Text, View } from "@aws-amplify/ui-react";
import React from "react";
import { SlUser } from "react-icons/sl";
import './H2H.css'

const H2H = ({ data, ...props }) => {
    console.log("H2H", data)
    return (
        data ?
            <Grid gap="0.1rem"
                templateColumns="1fr 1fr 1fr"
            >
                {/*** Player 1 ****/}
                <Card columnStart={1} columnEnd={2} className="center">
                    <View className={"profileImageContainer_100"}>
                        {data.player1.image ?
                            <Image
                                src={data.player1.imageUrl}
                                alt={`visual aid for ${data.player1.name}`}
                                className={`profileImage`}
                            />
                            : <SlUser size='100' />}
                    </View>
                    <Text marginLeft={'.25rem'}>{data.player1.name}</Text>
                </Card>

                {/*** vs ****/}
                <Card columnStart={2} columnEnd={3}>
                    <Grid gap="0" templateColumns={"1fr 0fr 1fr"}>
                        <span style={{ textAlign: 'center' }}>
                            <View className="circle_60 player1">
                                <Text fontSize={'2.3rem'}>{data.stats.matches.wins}</Text>
                            </View>
                            <Text variation="success">{data.stats.matches.percentage} % wins</Text>
                        </span>
                        <Divider orientation="vertical" marginLeft="1rem" marginRight={'1rem'} />
                        <span style={{ textAlign: 'center' }}>
                            <View className="circle_60 player2">
                                <Text fontSize={'2.3rem'}>{data.stats.matches.losses}</Text>
                            </View>
                            <Text>{100 - data.stats.matches.percentage} % wins</Text>
                        </span>
                    </Grid>
                </Card>
                
                {/*** Player 2 ****/}
                <Card columnStart={3} columnEnd={-1} className="center">
                    <View className={"profileImageContainer_100"}>
                        {data.player2.image ?
                            <Image
                                src={data.player2.imageUrl}
                                alt={`visual aid for ${data.player2.name}`}
                                className={`profileImage`}
                            />
                            : <SlUser size='100' />}
                    </View>
                    <Text marginLeft={'.25rem'}>{data.player2.name}</Text>
                </Card>
                
                {/*** Stats section ****/}
                {[{ name: 'sets' }, { name: 'tiebreaks' }, { name: 'games' }].map((x,i) =>
                    <React.Fragment key={i}>
                        <Card columnStart={1} columnEnd={2} className="statsCard">
                            {`${data.stats[x.name].wins}/${data.stats[x.name].total} (${data.stats[x.name].percentage}%)`}
                        </Card>
                        <Card columnStart={2} columnEnd={3} className="statsCard statsName">
                            {x.name.charAt(0).toUpperCase()+x.name.slice(1)} Won
                        </Card>
                        <Card columnStart={3} columnEnd={-1} className="statsCard">
                            {`${data.stats[x.name].losses}/${data.stats[x.name].total} (${100 - data.stats[x.name].percentage}%)`}
                        </Card>
                    </React.Fragment>
                )}

                {/*** All matches ****/}
                <Table columnStart={1} columnEnd={-1}>
                    <TableHead>
                        <TableRow backgroundColor={'#555'} borderRadius="5px">
                            <TableCell as="th" color="white">Played On</TableCell>
                            <TableCell as="th" color="white">Ladder</TableCell>
                            <TableCell as="th" color="white">Winner</TableCell>
                            <TableCell as="th" color="white">Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data ? data.matches.map(m =>
                            <TableRow key={m.id} className={m.winner.id === data.player1.id ? "player1" : "player2"}>
                                <TableCell as="td">{m.playedOn}</TableCell>
                                <TableCell as="td">{m.ladder.name}</TableCell>
                                <TableCell as="td">{m.winner.name}</TableCell>
                                <TableCell as="td">{m.score}</TableCell>
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </Grid>
            : <h2><Loader /> Loading</h2>

    )
}

export default H2H
