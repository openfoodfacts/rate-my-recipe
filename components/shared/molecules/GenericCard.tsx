import Card from "@mui/joy/Card";
import { CardMedia } from "@mui/material";
import { CardContent, Stack, Typography } from "@mui/joy";
import React from "react";

interface GenericCardProps {
  title: string | undefined;
  onClick(): void;
  imgUrl?: string | undefined | null;
  svg?: React.ReactNode[];
}

export function GenericCard({ title, onClick, imgUrl, svg }: GenericCardProps) {
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
      <CardContent>
        {svg && (
          <Stack direction={"row"} justifyContent={"center"} gap={1}>
            {svg}
          </Stack>
        )}
        <Typography maxWidth={"100%"}>{title}</Typography>
      </CardContent>
    </Card>
  );
}
