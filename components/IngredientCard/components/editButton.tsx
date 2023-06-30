import Button from "@mui/joy/Button";
import * as React from "react";

interface EditButtonProps {
  title: string;

  onClick(): void;

  type: "edit" | "delete";
}

export const EditButton = ({ title, onClick, type }: EditButtonProps) => {
  return (
    <Button
      variant="solid"
      size="md"
      fullWidth
      color={type === "edit" ? "primary" : "danger"}
      sx={{ fontWeight: 600 }}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};
