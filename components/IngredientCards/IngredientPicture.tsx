import * as React from "react";
import Typography from "@mui/joy/Typography";
import ResponsiveImage from "@/components/shared/atoms/ResponsiveImage";

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

      <ResponsiveImage
        minHeight="50px"
        maxHeight="150px"
        objectFit="contain"
        sx={{ my: 1 }}
        src={imageUrl}
        alt=""
      />
    </>
  );
};
