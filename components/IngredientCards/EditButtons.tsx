import * as React from "react";
import { Stack } from "@mui/joy";
import Button from "@mui/joy/Button";

interface EditButtonsProps {
  onEdit(): void;
  onDelete(): void;
}

const commonProps = {
  variant: "solid",
  size: "md",
  fontWeight: 600,
};

export const EditButtons = ({ onEdit, onDelete }: EditButtonsProps) => {
  return (
    <Stack direction={"row"} gap={5}>
      <Button color={"danger"} sx={commonProps} onClick={onDelete} fullWidth>
        Delete
      </Button>
      <Button color={"primary"} sx={commonProps} onClick={onEdit} fullWidth>
        Edit
      </Button>
    </Stack>
  );
};
