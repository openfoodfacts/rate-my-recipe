import { Stack } from "@mui/joy";
import * as React from "react";

interface CategoriesAndCardsContainerProps {
  children: React.ReactNode;
}

export const CategoriesAndCardsContainer = ({
  children,
}: CategoriesAndCardsContainerProps) => {
  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      gap={2}
      justifyContent={"center"}
      sx={{
        overflowY: "scroll",
        "::-webkit-scrollbar": { display: "none" },
      }}
    >
      {children}
    </Stack>
  );
};
