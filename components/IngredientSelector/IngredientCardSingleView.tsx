import * as React from "react";
import { CardContent, Input, Typography } from "@mui/joy";
import { ChangeEvent } from "react";
import { ImagePlaceholder } from "@/components/shared/atoms/ImagePlaceholder";
import Card from "@mui/joy/Card";
import { ValueEditor } from "@/components/shared/molecules/ValueEditor";
import ResponsiveImage from "@/components/shared/atoms/ResponsiveImage";

interface QuantityCardProps {
  onIncrement(): void;
  onDecrement(): void;
  quantityValue: number | null | undefined;
  onInputChange(event: ChangeEvent<HTMLInputElement>): void;
  unit: string | undefined;
  imgSrc: string | undefined;
  title: string | undefined;
  step?: number;
  weightPerUnit?: number;
}

export function IngredientCardSingleView({
  onIncrement,
  onDecrement,
  quantityValue,
  onInputChange,
  unit,
  imgSrc,
  title,
  step = 2,
  weightPerUnit,
}: QuantityCardProps) {
  // If the weight is not per g, we will display an equivalence
  var weight = "";
  if (weightPerUnit !== undefined) {
    weight = " (" + quantityValue! * weightPerUnit + " g)";
  }

  return (
    <Card
      sx={{
        overflowY: "scroll",
        "::-webkit-scrollbar": { display: "none" },
        alignItems: "center",
        width: "fit-content",
        alignSelf: "center",
        overflow: "scroll",
        border: "1px solid lightGrey",
      }}
    >
      <CardContent>
        <Typography component={"h1"} fontSize={"x-large"}>
          {title}
        </Typography>
      </CardContent>
      {imgSrc ? (
        <ResponsiveImage
          minHeight={100}
          maxHeight={150}
          src={imgSrc || ""}
          alt={title}
        />
      ) : (
        <ImagePlaceholder placeholderText={"no image sorry"} />
      )}

      <CardContent>
        <ValueEditor
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          disabledDecrement={quantityValue! <= step}
        >
          <Input
            type="number"
            value={`${Math.max(0, quantityValue ?? 0)}`}
            onChange={onInputChange}
            endDecorator={
              <Typography>
                {" "}
                {unit}
                {weight}
              </Typography>
            }
          />
        </ValueEditor>
      </CardContent>
    </Card>
  );
}
