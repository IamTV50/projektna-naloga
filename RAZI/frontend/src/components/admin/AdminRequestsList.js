import React, {useState} from 'react'
import {Card, CardBody, Collapse, Heading, HStack, Icon, IconButton, Text, VStack} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {useCollapse} from "react-collapsed";
import AdminGetRequest from "./AdminGetRequest";


function AdminRequestsList({ requests, onRequestDeleted }) {
    console.log(requests)
    const [isExpanded, setExpanded] = useState(false)
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })

    return (
        <VStack alignItems="flex-start">
            <HStack>
                <Heading size="sl">Zahteve</Heading>
                <IconButton variant="blue"
                            icon={<Icon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} boxSize={6} />}
                            {...getToggleProps({
                                onClick: () => setExpanded((prevExpanded) => !prevExpanded),
                            })}>
                </IconButton>
            </HStack>

            <Collapse in={isExpanded}>
                <div>
                        {requests.map(request => (
                            <AdminGetRequest request={request} key={request._id} onRequestDeleted={onRequestDeleted} />
                            // <li key={request._id}>
                            //     <p>{request.reason}</p>
                            // </li>
                        ))}
                </div>
            </Collapse>
        </VStack>
    )
}

export default AdminRequestsList