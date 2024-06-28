import { Alert, AlertTitle } from "@chakra-ui/react";
import React from "react";

const AlertMsg = ({ status, msg, icon }) => {
    return (
        <Alert status={`${status ? status : "info"}`}>
            {icon}
            <AlertTitle ml={5}>{msg}</AlertTitle>
        </Alert>
    );
};

export default AlertMsg;