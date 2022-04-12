import React from "react";
import { Heading, Flex, Divider } from "@chakra-ui/core";

const Header = () => {
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="0.5rem"
            bg="#59C7F3"
        >
            <Flex align="center" mr={5}>
                <Heading as="h1" size="sm">MES-CoBraD Analytics and Visualisation</Heading>
                <Divider />
            </Flex>
        </Flex>
    );
};

export default Header;
