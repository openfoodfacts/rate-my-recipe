import * as React from "react";
import { Stack } from "@mui/joy";
import Button from "@mui/joy/Button";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <Stack direction={"row"} gap={5}>
      <Button color={"danger"} sx={commonProps} onClick={onDelete} fullWidth>
        {t("actions.delete")}
      </Button>
      <Button color={"primary"} sx={commonProps} onClick={onEdit} fullWidth>
        {t("actions.edit")}
      </Button>
    </Stack>
  );
};
