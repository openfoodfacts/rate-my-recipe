import { Avatar, Stack, Typography } from "@mui/joy";
import * as React from "react";
import { IngredientType } from "@/data";

interface IngredientCardProps {
  ingredientId: any;
  ingredient: IngredientType;
  onClick(): void;
  imageUrl?: string | null;
}

export function IngredientCard({
  ingredientId,
  ingredient,
  onClick,
  imageUrl,
}: IngredientCardProps) {
  const imagePlaceholderUrl =
    "https://thumbs.dreamstime.com/b/doodles-%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D0%B2-%D0%BF%D0%B8%D1%82%D0%B0%D0%BD%D0%B8%D1%8F-%D1%81%D0%BE-%D0%B7%D0%BD%D0%B0%D1%87%D0%BA%D0%BE%D0%BC-%D0%B8-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80-%D1%81%D1%85%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%BD%D1%8B%D0%BC%D0%B8-%D0%B2%D1%8B%D1%87%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8-170694576.jpg";

  return (
    <Stack
      key={ingredientId}
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
