import { Box } from "@mui/joy";
import * as React from "react";

export const ImagePlaceholder = ({
  placeholderText,
  height,
}: {
  placeholderText?: string;
  height?: number;
}) => {
  return (
    <Box
      component={"div"}
      sx={(theme) => ({
        width: "100%",
        bgcolor: theme.colorSchemes.light.palette.primary[100],
        height: height || 150,
      })}
    >
      {placeholderText}
    </Box>
  );
};
