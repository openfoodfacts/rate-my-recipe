import { Stack } from "@mui/joy";
import * as React from "react";

interface CardsContainerProps {
  children: React.ReactNode;
}

export const CardsContainer = ({ children }: CardsContainerProps) => {
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
