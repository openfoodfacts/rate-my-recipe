import Button from "@mui/joy/Button";
import * as React from "react";

interface CountingButtonProps {
    onClick(): void;
    disabled?: boolean;
    action: "increment" | "decrement";
}

export const CountingButton = ({onClick, disabled, action}: CountingButtonProps) => {

    const title = action === "increment" ? '+' : '-'

    return <Button
        variant="solid"
        color="neutral"
        size="sm"
        disabled={disabled}
        onClick={onClick}
    >
        {title}
    </Button>
}