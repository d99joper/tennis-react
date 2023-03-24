import * as React from "react";
import { Card, Flex, Text, Grid } from "@aws-amplify/ui-react";
import { helpers } from "helpers";
import { decomposeColor } from "@mui/material";

const ItemCard = ({ header, description, footer, footerRight, ...props }) => {
    return (

        <Card
            width={props.width ?? "250px"}
            borderRadius={'15px'}
            border='solid'
            backgroundColor={props.backgroundColor ?? 'white'}>
            <Grid 
                templateRows={'1fr 2fr auto'}
                rowGap=".25rem"
            >
                <Text fontSize={'1.1rem'} fontWeight='bold'>{header}</Text>
                <Text className='tooltip' paddingBottom={'1rem'}>
                    {helpers.truncate(description, 70)}
                    <span className="tooltiptext">{description}</span>
                </Text>
                <Text>
                    {footer}
                    {footerRight && 
                        <span style={{float:'right'}}>{footerRight}</span>
                    }
                </Text>
            </Grid>
        </Card>

        // <Flex
        // key="iyu67iy"
        //   gap=".5rem"
        //   direction="column"
        //   width="280px"
        //   height="100px"
        //   justifyContent="space-between"
        //   alignItems="flex-start"
        //   position="relative"
        //   border="1px SOLID rgba(0,0,0,1)"
        //   boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        //   borderRadius="10px"
        //   padding="1rem"
        //   backgroundColor="rgba(255,255,255,1)"
        // >
        //   <Flex key="jhk6"
        //     gap="0"
        //     direction="row"
        //     justifyContent="space-between"
        //     alignItems="center"
        //     shrink="0"
        //     alignSelf="stretch"
        //     position="relative"
        //     padding="0px 0px 0px 0px"
        //   >
        //     <Flex key="9ku7"
        //       gap="0"
        //       direction="column"
        //       width="287px"
        //       height="49px"
        //       justifyContent="flex-start"
        //       alignItems="flex-start"
        //       shrink="0"
        //       position="relative"
        //       padding="0px 0px 0px 0px"
        //     >
        //       <Text
        //         fontFamily="Inter"
        //         fontSize="16px"
        //         fontWeight="700"
        //         color="rgba(13,26,38,1)"
        //         lineHeight="20px"
        //         textAlign="left"
        //         display="block"
        //         direction="column"
        //         justifyContent="unset"
        //         width="unset"
        //         height="unset"
        //         gap="unset"
        //         alignItems="unset"
        //         shrink="0"
        //         position="relative"
        //         padding="0px 0px 0px 0px"
        //         whiteSpace="pre-wrap"
        //         children="Ladder Name"
        //         key="adsfvasd2"
        //       >{header}</Text>
        //       <Text key="asdsde"
        //         fontFamily="Inter"
        //         fontSize="16px"
        //         fontWeight="400"
        //         color="rgba(48,64,80,1)"
        //         lineHeight="24px"
        //         textAlign="left"
        //         display="block"
        //         direction="column"
        //         justifyContent="unset"
        //         letterSpacing="0.01px"
        //         width="unset"
        //         height="unset"
        //         gap="unset"
        //         alignItems="unset"
        //         shrink="0"
        //         position="relative"
        //         padding="0px 0px 0px 0px"
        //         whiteSpace="pre-wrap"
        //         children="Description"
        //       >{description}</Text>
        //     </Flex>
        //   </Flex>
        //   <Text
        //     fontFamily="Inter"
        //     fontSize="12px"
        //     fontWeight="600"
        //     color="rgba(0,0,0,1)"
        //     lineHeight="12px"
        //     textAlign="left"
        //     display="block"
        //     direction="column"
        //     justifyContent="unset"
        //     width="unset"
        //     height="unset"
        //     gap="unset"
        //     alignItems="unset"
        //     shrink="0"
        //     position="relative"
        //     padding="0px 0px 0px 0px"
        //     whiteSpace="pre-wrap"
        //     children="22 players"
        //     key="234SS"
        //   >
        //     {footer}
        //   </Text>
        // </Flex>
    )
}
export default ItemCard