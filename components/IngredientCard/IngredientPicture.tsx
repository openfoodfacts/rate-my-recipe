import Typography from "@mui/joy/Typography";
import AspectRatio from "@mui/joy/AspectRatio";
import * as React from "react";

interface IngredientPictureProps {
  ingredientName: string | undefined;
  imageUrl: string | undefined;
}

export const IngredientPicture = ({
  ingredientName,
  imageUrl,
}: IngredientPictureProps) => {
  return (
    <>
      <Typography level="h2" fontSize="md">
        {ingredientName}
      </Typography>
      {/* <Typography level="body2">({props.quantity_name})</Typography> */}

      <AspectRatio
        minHeight="150px"
        maxHeight="300px"
        objectFit="contain"
        sx={{ my: 1 }}
      >
        <img src={imageUrl} loading="lazy" alt="" />
      </AspectRatio>
    </>
  );
};
