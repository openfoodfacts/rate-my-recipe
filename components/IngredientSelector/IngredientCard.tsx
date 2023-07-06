import { Avatar, Stack, Typography } from "@mui/joy";
import * as React from "react";
import { IngredientType } from "@/data";

interface IngredientCardProps {
  ingredient: IngredientType;
  onClick(): void;
  imageUrl?: string | null;
}

export function IngredientCard({
  ingredient,
  onClick,
  imageUrl,
}: IngredientCardProps) {
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
        alt={ingredient.ingredient_name ?? "ingredient_image"}
        src={imageUrl || imagePlaceholderUrl}
        sx={{
          width: 150,
          height: 150,
          borderRadius: "4px",
          objectFit: "contain",
        }}
      />
      <Typography component={"h5"}>{ingredient.ingredient_name}</Typography>
    </Stack>
  );
}
