"use client";
import * as React from "react";
import data from "../../data/ingredient_taxonomy.json";
import { Button, Input, Stack } from "@mui/joy";

type Quantity = {
  "Quantity ": string;
  "Quantity id": string;
  default_weight: string;
  default_weight_per_unit: string;
  default_number_of_units: string;
  image_url: string;
};
type Ingredients = {
  Ingredient: string;
  "Ingredient id": string;
  Preparation: string;
  quantities: Quantity[];
};
type Type = {
  "Ingredient type": string;
  "Ingredient type id": string;
  Description: string;
  ingredients: Ingredients[];
};

type DataType = Type[];
type ViewTypes = "type" | "ingredient" | "quantity" | "value";

export default function Navigator() {
  const [view, setView] = React.useState<ViewTypes>("type");
  const [typeId, setTypeId] = React.useState<string | undefined>(undefined);
  const [ingredientId, setIngredientId] = React.useState<string | undefined>(
    undefined
  );
  const [quantityId, setQuantityId] = React.useState<string | undefined>(
    undefined
  );
  const [quantityValue, setQuantityValue] = React.useState<number | undefined>(
    undefined
  );

  const currentType = React.useMemo(() => {
    return (
      (data as DataType).find(
        (type) => type["Ingredient type id"] === typeId
      ) ?? null
    );
  }, [typeId]);

  const currentIngredient = React.useMemo(() => {
    return (
      currentType &&
      currentType.ingredients.find(
        (ingredient) => ingredient["Ingredient id"] === ingredientId
      )
    );
  }, [currentType, ingredientId]);

  const currentQuantity = React.useMemo(() => {
    return (
      currentIngredient &&
      currentIngredient.quantities.find(
        (quantity) => quantity["Quantity id"] === quantityId
      )
    );
  }, [currentIngredient, quantityId]);

  const skipQuantityView =
    currentIngredient && currentIngredient.quantities.length === 1;

  React.useEffect(() => {
    if (view === "value") {
      setQuantityValue(Number(currentQuantity?.default_number_of_units ?? 1));
    }
  }, [view, currentQuantity]);

  if (view === "type") {
    return (
      <HeaderWrapper
        view={view}
        setView={setView}
        disableNext={typeId === undefined}
      >
        {(data as DataType).map((type) => (
          <Button
            key={type["Ingredient type id"]}
            onClick={() => {
              setView("ingredient");
              setTypeId(type["Ingredient type id"]);
            }}
          >
            {type["Ingredient type"]}
          </Button>
        ))}
      </HeaderWrapper>
    );
  }
  if (view === "ingredient") {
    return (
      <HeaderWrapper
        view={view}
        setView={setView}
        disableNext={ingredientId === undefined}
        skipQuantityView={skipQuantityView}
      >
        {currentType?.ingredients.map((ingredient) => (
          <Button
            key={ingredient["Ingredient id"]}
            onClick={() => {
              if (ingredient.quantities.length === 1) {
                // If only one quantity type, we set it directly
                setView("value");
                setIngredientId(ingredient["Ingredient id"]);
                setQuantityId(ingredient.quantities[0]["Quantity id"]);
                return;
              }
              setView("quantity");
              setIngredientId(ingredient["Ingredient id"]);
            }}
          >
            {ingredient["Ingredient"]}
            {ingredient.quantities[0].image_url && (
              <img
                src={ingredient.quantities[0].image_url}
                height={150}
                width={150}
                style={{ objectFit: "contain" }}
              />
            )}
          </Button>
        ))}
      </HeaderWrapper>
    );
  }
  if (view === "quantity") {
    return (
      <HeaderWrapper
        view={view}
        setView={setView}
        disableNext={quantityId === undefined}
      >
        {currentIngredient?.quantities.map((quantity) => (
          <Button
            key={quantity["Quantity id"]}
            onClick={() => {
              setView("value");
              setQuantityId(quantity["Quantity id"]);
            }}
          >
            {quantity["Quantity "]}
            {quantity.image_url && (
              <img
                src={quantity.image_url}
                height={150}
                width={150}
                style={{ objectFit: "contain" }}
              />
            )}
          </Button>
        ))}
      </HeaderWrapper>
    );
  }
  return (
    <HeaderWrapper
      view={view}
      setView={setView}
      skipQuantityView={skipQuantityView}
    >
      <Stack direction="row" justifyContent="space-between">
        <Button
          disabled={quantityValue === 1}
          onClick={() => {
            setQuantityValue((prev) => (prev as number) - 1);
          }}
        >
          -
        </Button>
        <Input
          type="number"
          value={quantityValue}
          onChange={(event) => setQuantityValue(Number(event.target.value))}
        />
        <Button
          onClick={() => {
            setQuantityValue((prev) => (prev as number) + 1);
          }}
        >
          +
        </Button>
      </Stack>
    </HeaderWrapper>
  );
}

const viewsOrder = ["type", "ingredient", "quantity", "value"];

const HeaderWrapper = ({
  view,
  setView,
  skipQuantityView,
  disableNext,
  children,
}: any) => {
  const viewIndex = viewsOrder.findIndex((v) => v === view);
  const prevView =
    skipQuantityView && viewsOrder[viewIndex - 1] === "quantity"
      ? viewsOrder[viewIndex - 2]
      : viewsOrder[viewIndex - 1];
  const nextView =
    skipQuantityView && viewsOrder[viewIndex + 1] === "quantity"
      ? viewsOrder[viewIndex + 2]
      : viewsOrder[viewIndex + 1];

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Button disabled={!prevView} onClick={() => setView(prevView)}>
          Prev
        </Button>
        <Button
          disabled={!nextView || disableNext}
          onClick={() => setView(nextView)}
        >
          Next
        </Button>
      </Stack>
      {children}
    </Stack>
  );
};
