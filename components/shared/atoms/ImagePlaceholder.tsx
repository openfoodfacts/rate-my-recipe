import { Stack } from "@mui/joy";
import * as React from "react";

export const ImagePlaceholder = ({
  placeholderText,
}: {
  placeholderText?: string;
}) => {
  return (
    <Stack sx={{ width: "100%", bgcolor: "#BDECB6", height: 150 }}>
      {placeholderText}
    </Stack>
  );
};
