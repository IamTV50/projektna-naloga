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


function UnlockHistory({ packager, unlockHistory }) {
	const [packagerUnlocks, setPackagerUnlocks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const { activeStep } = useSteps({
		index: steps.length - 1,
		count: steps.length,
	})

	// useEffect(() => {
	// 	console.log("Fetching unlocks");
	// 	console.log(packager);
	// 	const fetchUnlocks = async () => {
	// 		try {
	// 			const res = await fetch(`${process.env.REACT_APP_API_URL}/unlocks/packagerUnlocks/${packager._id}`, {
	// 				credentials: "include"
	// 			})
	// 			const data = await res.json();
	// 			console.log("Unlock history:");
	// 			console.log(data);
	//
	// 			if (!data.message) {
	// 				setPackagerUnlocks(data);
	// 			}
	//
	// 			setIsLoading(false);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	};
	//
	// 	fetchUnlocks();
	// }, []);

	console.log("Unlock history:");
	console.log(unlockHistory);


	return (
		<Box alignItems={"start"} display="flex" flexDirection={"column"} flex={1} height={"100%"}>
			<Heading mb={10} size={"md"}>Packager {packager.number} history:</Heading>
			{unlockHistory.length === 0 ? <Heading size={"md"}>No unlocks</Heading>
			: <Stepper index={activeStep} orientation='vertical' overflow={"auto"} width={"100%"} height={"100%"} gap='0'>
				{unlockHistory.map((unlock, index) => (
					<Step key={index}>
						<StepIndicator>
							<StepStatus
								complete={<StepIcon />}
								incomplete={<StepNumber />}
								active={<StepNumber />}
							/>
						</StepIndicator>
						<Box flexShrink='0'>
							<StepTitle>{new Date(unlock.openedOn).toLocaleString("de-DE")}</StepTitle>
							<StepDescription>By: {unlock.user.username}</StepDescription>
							<StepDescription>Success: {unlock.success ? <Badge colorScheme={"green"}>Opened</Badge> : <Badge colorScheme={"red"}>Failed</Badge>}</StepDescription>
							<StepDescription>Reason: {unlock.status}</StepDescription>
						</Box>
						<StepSeparator />
					</Step>
				))}
			</Stepper>
			}


		</Box>

	);
}

export default UnlockHistory