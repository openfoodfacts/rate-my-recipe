import * as React from "react";
import { AspectRatio, AspectRatioProps } from "@mui/joy";

interface ResponsiveImageProps
  extends Pick<
      AspectRatioProps,
      "minHeight" | "maxHeight" | "objectFit" | "sx"
    >,
    React.ImgHTMLAttributes<Element> {
  width?: string | number;
}

export default function ResponsiveImage(props: ResponsiveImageProps) {
  const {
    minHeight,
    maxHeight,
    width = "100%",
    objectFit = "contain",
    sx,
    ...other
  } = props;

  return (
    <AspectRatio
      minHeight={minHeight}
      maxHeight={maxHeight}
      objectFit={objectFit}
      sx={{ width, ...sx }}
    >
      <img alt="" {...other} />
    </AspectRatio>
  );
}
