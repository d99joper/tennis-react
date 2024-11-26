/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Flex, Text } from "@aws-amplify/ui-react";
export default function ItemCard(props) {
  const {
    heading = "Heading",
    description = "Some description",
    players,
    overrides,
    ...rest
  } = props;
  return (
    <Flex
      gap="16px"
      direction="column"
      width="320px"
      height="121px"
      justifyContent="space-between"
      alignItems="flex-start"
      position="relative"
      border="1px SOLID rgba(0,0,0,1)"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
      borderRadius="10px"
      padding="15px 15px 15px 15px"
      backgroundColor="rgba(255,255,255,1)"
      {...rest}
      {...getOverrideProps(overrides, "ItemCard")}
    >
      <Flex
        gap="0"
        direction="row"
        width="unset"
        height="unset"
        justifyContent="space-between"
        alignItems="center"
        shrink="0"
        alignSelf="stretch"
        position="relative"
        padding="0px 0px 0px 0px"
        {...getOverrideProps(overrides, "Frame 417")}
      >
        <Flex
          gap="0"
          direction="column"
          width="287px"
          height="49px"
          justifyContent="flex-start"
          alignItems="flex-start"
          shrink="0"
          position="relative"
          padding="0px 0px 0px 0px"
          {...getOverrideProps(overrides, "Product Title")}
        >
          <Text
            fontFamily="Inter"
            fontSize="16px"
            fontWeight="700"
            color="rgba(13,26,38,1)"
            lineHeight="20px"
            textAlign="left"
            display="block"
            direction="column"
            justifyContent="unset"
            width="unset"
            height="unset"
            gap="unset"
            alignItems="unset"
            shrink="0"
            position="relative"
            padding="0px 0px 0px 0px"
            whiteSpace="pre-wrap"
            children={heading}
            {...getOverrideProps(overrides, "Ladder Name")}
          ></Text>
          <Text
            fontFamily="Inter"
            fontSize="16px"
            fontWeight="400"
            color="rgba(48,64,80,1)"
            lineHeight="24px"
            textAlign="left"
            display="block"
            direction="column"
            justifyContent="unset"
            letterSpacing="0.01px"
            width="unset"
            height="unset"
            gap="unset"
            alignItems="unset"
            shrink="0"
            position="relative"
            padding="0px 0px 0px 0px"
            whiteSpace="pre-wrap"
            children={description}
            {...getOverrideProps(overrides, "Description")}
          ></Text>
        </Flex>
      </Flex>
      <Text
        fontFamily="Inter"
        fontSize="12px"
        fontWeight="600"
        color="rgba(0,0,0,1)"
        lineHeight="12px"
        textAlign="left"
        display="block"
        direction="column"
        justifyContent="unset"
        width="unset"
        height="unset"
        gap="unset"
        alignItems="unset"
        shrink="0"
        position="relative"
        padding="0px 0px 0px 0px"
        whiteSpace="pre-wrap"
        children="22 players"
        {...getOverrideProps(overrides, "22 players")}
      ></Text>
    </Flex>
  );
}
