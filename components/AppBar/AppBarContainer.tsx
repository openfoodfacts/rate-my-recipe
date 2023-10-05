import * as React from "react";
import { Sheet } from "@mui/joy";

interface AppBarContainerProps {
  children: React.ReactNode;
}

export const AppBarContainer = ({ children }: AppBarContainerProps) => {
  return (
    <Sheet
      variant="solid"
      color="primary"
      invertedColors
      sx={(theme) => ({
        width: "100%",
        height: "54px",
        ...theme.typography.h4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
      })}
    >
      {children}
    </Sheet>
  );
};
