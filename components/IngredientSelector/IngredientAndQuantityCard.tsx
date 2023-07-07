import { Avatar, Stack, Typography } from "@mui/joy";
import * as React from "react";

interface IngredientAndQuantityCardProps {
  name: string | undefined;
  onClick(): void;
  imageUrl?: string | null;
}

export function IngredientAndQuantityCard({
  name,
  onClick,
  imageUrl,
}: IngredientAndQuantityCardProps) {
  const imagePlaceholderUrl =
    "https://play.google.com/store/apps/dev?id=4712693179220384697&hl=ru&gl=US";
  return (
    <Stack
      sx={{
        display: "flex",
        alignItems: "center",
        "&:hover": { cursor: "pointer", scale: "101%" },
      }}
      onClick={onClick}
      width={"40%"}
      justifyContent={"center"}
      maxWidth={150}
      minWidth={150}
    >
      <Avatar
        alt={name ?? "ingredient_image"}
        src={imageUrl || imagePlaceholderUrl}
        sx={{
          width: 150,
          height: 150,
          borderRadius: "4px",
          objectFit: "contain",
        }}
      />
      <Typography component={"h5"}>{name}</Typography>
    </Stack>
  );
}
