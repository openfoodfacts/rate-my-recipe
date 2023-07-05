import * as React from "react";
import Grid from "@mui/material/Grid";
import { Ingredient } from "@/redux/reducers/recipes";
import data from "../../data";
import { IngredientCard } from "@/components/IngredientCards/IngredientCard";

const IngredientCards = (props: { ingredients: Ingredient[] }) => {
  const { ingredients } = props;

  const cardsToDisplay = ingredients.flatMap(({ quantities }) =>
    quantities.map(({ id: quantityId, value }) => ({
      ...data.quantities[quantityId],
      value,
    }))
  );

  return (
    <Grid container rowGap={2}>
      {cardsToDisplay.map((quantityData) => (
        <Grid
          key={quantityData.quantity_id}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
        >
          <IngredientCard {...quantityData} />
        </Grid>
      ))}
    </Grid>
  );
};
export default IngredientCards;
