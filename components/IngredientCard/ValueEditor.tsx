import { CountingButton } from "@/components/shared/buttons/CountingButton";
import * as React from "react";
import { Stack } from "@mui/joy";
import { EditButtons } from "@/components/IngredientCard/EditButtons";

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
        <CountingButton
          action={"decrement"}
          onClick={onDecrement}
          disabled={disabledDecrement}
        />
        {children}
        <CountingButton action={"increment"} onClick={onIncrement} />
      </Stack>
      <EditButtons onEdit={onEdit} onDelete={onDelete} />
    </>
  );
};
