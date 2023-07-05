import { IconButton, Stack, Tooltip } from "@mui/joy";
import ShareIcon from "@mui/icons-material/Share";
import SaveIcon from "@mui/icons-material/Save";
import * as React from "react";

interface TooltipButtonsProps {
  onShareButtonClick(): void;
  onSaveRecipe(): void;
}

export const TooltipButtons = ({
  onShareButtonClick,
  onSaveRecipe,
}: TooltipButtonsProps) => {
  return (
    <Stack spacing={1} direction={"row"}>
      <Tooltip title="Partager un lien">
        <IconButton onClick={onShareButtonClick}>
          <ShareIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Enregistrer la recette">
        <IconButton onClick={onSaveRecipe}>
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
