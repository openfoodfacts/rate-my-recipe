import { Stack } from "@mui/joy";
import * as React from "react";

export const ImagePlaceholder = ({
  placeholderText,
}: {
  placeholderText?: string;
}) => {
  return (
    <Stack
      sx={(theme) => ({
        width: "100%",
        bgcolor: theme.colorSchemes.light.palette.primary[100],
        height: 150,
      })}
    >
      {placeholderText}
    </Stack>
  );
};
