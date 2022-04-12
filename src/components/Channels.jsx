import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure
} from "@chakra-ui/core";

const ChannelsContext = React.createContext({
    channels: [], fetchChannels: () => {
    }
})


export default function Channels() {
    /**
     * Main function of this view
     * Returns a list of channels from the default edf file
     */
    const [channels, setChannels] = useState([])

    const fetchChannels = async () => {
        const response = await fetch("http://localhost:8000/test/list/channels")
        const channels = await response.json()
        setChannels(channels.channels)
    }
    useEffect(() => {
        fetchChannels()
    }, [])

    return (
        <ChannelsContext.Provider value={{channels, fetchChannels}}>
            {/*{channels}*/}
            <AutoCorrelate/>
            <hr/>
            <h1> List of Channels:</h1>

            <Stack spacing={5}>
                {channels.map((channel) => (
                    <b>{channel}</b>
                ))}
            </Stack>
        </ChannelsContext.Provider>
    )
}

function AutoCorrelate() {
    /**
     * Function returns a form that accepts a string for the autocorrelate function and also returns the results
     * below the form in a list
     */
    const [channelId, setChannelId] = React.useState("")
    const {channels, setChannels} = React.useContext(ChannelsContext)
    const [correlateResult,setCorrelateResult] =  React.useState([])

    const handleInput = event => {
        setChannelId(event.target.value)
    }

    function updateResult(resultJson){
        setCorrelateResult(resultJson.value)
    }

    const handleSubmit = async (event) => {
        // const new = channelId
        event.preventDefault();

        const response = await fetch("http://localhost:8000/test/return_autocorrelation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"name" : channelId})
            // body: newTodo
        })
            // .then(response => updateResult(response.json()) )
        const resultJson = await response.json()
        setCorrelateResult(resultJson.values_autocorrelation)
    }

    return (
        <React.Fragment>
            <span>
                 Select one of the channels in the bottom of the page
            </span>
            <form onSubmit={handleSubmit}>
                <InputGroup size="md">
                    <Input
                        pr="4.5rem"
                        type="text"
                        placeholder="Select Channel to autocorrelate"
                        aria-label="Select Channel to autocorrelate"
                        onChange={handleInput}
                    />
                </InputGroup>
                <input type="submit"/>
            </form>
            <hr/>
            <span>
                <h1> Results</h1>
            </span>

            <Stack spacing={5}>
                {correlateResult.map((result) => (
                    <b>{result}</b>
                ))}
            </Stack>

        </React.Fragment>
    )

}
