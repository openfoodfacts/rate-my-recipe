import * as React from "react";
import { Stack } from "@mui/joy";
import { EditButtons } from "@/components/IngredientCards/EditButtons";
import Button from "@mui/joy/Button";

interface CountingPanelProps {
  onIncrement(): void;

  onDecrement(): void;
  onEdit(): void;
  onDelete(): void;

  disabledDecrement?: boolean;
  children: React.ReactNode;
}

export const ValueEditor = ({
  onIncrement,
  onDecrement,
  disabledDecrement,
  children,
  onEdit,
  onDelete,
}: CountingPanelProps) => {
  return (
    <>
      <Stack sx={{ py: 1 }} direction={"row"} justifyContent="space-between">
        <Button
          variant="solid"
          color="neutral"
          size="sm"
          disabled={disabledDecrement}
          onClick={onDecrement}
        >
          -
        </Button>

        {children}
        <Button variant="solid" color="neutral" size="sm" onClick={onIncrement}>
          +
        </Button>
      </Stack>
      <EditButtons onEdit={onEdit} onDelete={onDelete} />
    </>
  );
};
