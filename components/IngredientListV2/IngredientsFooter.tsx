import { Button, Stack } from "@mui/joy";
import Nutriscore from "../Nutriscore";

export const IngredientsFooter = ({
  recipeId,
  copy,
}: {
  recipeId: string;
  copy: () => void;
}) => {
  return (
    <Stack
      sx={{ padding: 2, justifyContent: "space-between", alignItems: "center" }}
      direction="row"
    >
      <Nutriscore />
      <Button sx={{ my: "auto" }} onClick={copy}>
        Make a copy
      </Button>
    </Stack>
  );
};
