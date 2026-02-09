import Card from "@mui/joy/Card";
import { CardContent, Stack, Typography } from "@mui/joy";
import React from "react";
import { ImagePlaceholder } from "@/components/shared/atoms/ImagePlaceholder";
import ResponsiveImage from "@/components/shared/atoms/ResponsiveImage";

interface GenericCardProps {
  title: string | undefined;
  onClick(): void;
  imgUrl?: string | undefined | null;
  icons?: JSX.Element;
}

export function GenericCard({
  title,
  onClick,
  imgUrl,
  icons,
}: GenericCardProps) {
  return (
    <Card
      sx={{
        "&:hover": { cursor: "pointer" },
        width: "40%",
        maxWidth: 200,
        display: "flex",
        justifyContent: "center",
        border: "1px solid lightGrey",
        ...(!imgUrl && !icons ? { py: 8 } : {}),
      }}
      onClick={onClick}
    >
      {imgUrl && (
        <ResponsiveImage
          minHeight="100px"
          maxHeight="150px"
          objectFit="contain"
          sx={{ my: 1 }}
          src={imgUrl}
          alt={title}
        />
      )}
      <CardContent>
        {icons && (
          <Stack direction={"row"} justifyContent={"center"} gap={1}>
            {icons}
          </Stack>
        )}
        <Typography maxWidth={"100%"} textAlign={"center"}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
