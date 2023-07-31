import Card from "@mui/joy/Card";
import { CardMedia } from "@mui/material";
import { CardContent, Stack, Typography } from "@mui/joy";
import React from "react";
import { ImagePlaceholder } from "@/components/shared/atoms/ImagePlaceholder";

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
      }}
      onClick={onClick}
    >
      {imgUrl && (
        <CardMedia
          component="img"
          height={90}
          image={imgUrl || ""}
          alt={title}
        />
      )}
      {!imgUrl && !icons && <ImagePlaceholder height={70} />}
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
