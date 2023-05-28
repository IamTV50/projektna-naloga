import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import {
    Badge,
    Box,
    Heading,
    Spinner,
    VStack,
    Text,
    Step,
    Stepper,
    StepNumber,
    StepIcon,
    StepIndicator, useSteps, StepTitle, StepDescription, StepStatus, StepSeparator
} from "@chakra-ui/react";
import {steps} from "framer-motion";


function AdminUnlockHistory({ packager, unlockHistory }) {
    const [packagerUnlocks, setPackagerUnlocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { activeStep } = useSteps({
        index: steps.length - 1,
        count: steps.length,
    })

    console.log("Unlock history:");
    console.log(unlockHistory);

    return (
        <Box alignItems={"start"} display="flex" flexDirection={"column"} flex={1} height={"100%"}>
            {packager != null ? <Heading mb={10} size={"md"}>Packager {packager.number} history:</Heading> : ""}
            {unlockHistory.length === 0 ? <Text>No unlocks</Text>
                : <Stepper index={activeStep} orientation='vertical' overflow={"auto"} width={"100%"} height={"100%"} gap='0' >
                    {unlockHistory.map((unlock, index) => (
                        <Step key={index}>
                            <StepIndicator>
                                <StepStatus
                                    complete={<StepIcon />}
                                    incomplete={<StepNumber />}
                                    active={<StepNumber />}
                                />
                            </StepIndicator>
                            <Box flexShrink='0' pb={10}>
                                <StepTitle><Heading size={"sm"}>{new Date(unlock.openedOn).toLocaleString("de-DE")}</Heading></StepTitle>
                                <StepDescription>Packager:  <Badge colorScheme={"blue"} fontSize='1.0em'>{unlock.packager ? unlock.packager.number : "[deleted]"}</Badge> {unlock.success ? <Badge fontSize='1.0em' colorScheme={"green"}>Opened</Badge> : <Badge fontSize='1.0em' colorScheme={"red"}>Failed</Badge>}</StepDescription>
                                <StepDescription>Reason: {unlock.status} </StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>
            }


        </Box>

    );
}

export default AdminUnlockHistory