import { Badge, Card, Divider, Grid, Image, Loader, Table, TableBody, TableCell, TableHead, TableRow, Text, View } from "@aws-amplify/ui-react";
import React from "react";
import { SlUser } from "react-icons/sl";
import './H2H.css'

const H2H = ({ data, ...props }) => {
    console.log(data)
    return (
        data ?
            <Grid gap="0.1rem"
                templateColumns="1fr 1fr 1fr"
            >

                {/* inspiration
                https://www.atptour.com/en/players/atp-head-2-head/mikael-ymer-vs-jannik-sinner/y268/s0ag
                title: 
                    pic p1    vs        pic p2
                    name p1   XX-XX    name p2
                
                table:  
                    stat p1   stat name     stat p2
                
                score list (ordered by playedOn)
                date(year) ladder winner score */}
                <Card columnStart={1} columnEnd={2} style={{ textAlign: 'center' }}>
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
                <Card columnStart={2} columnEnd={3}>
                    <Grid gap="0" templateColumns={"1fr 0fr 1fr"}>
                        <span style={{ textAlign: 'center' }}>
                            <View className="circle_60 player1">
                                <Text fontSize={'2.3rem'}>{data.stats.matches.wins}</Text>
                            </View>
                            <Text variation="success">{data.stats.matches.percentage} % wins</Text>
                        </span>
                        <Divider orientation="vertical" textAlign={'center'} marginLeft="1rem" marginRight={'1rem'} />
                        <span style={{ textAlign: 'center' }}>
                        <View className="circle_60 player2">
                            <Text fontSize={'2.3rem'}>{data.stats.matches.losses}</Text>
                        </View>
                            <Text>{100 - data.stats.matches.percentage} % wins</Text>
                        </span>
                    </Grid>
                </Card>
                <Card columnStart={3} columnEnd={-1} style={{ textAlign: 'center' }}>
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
