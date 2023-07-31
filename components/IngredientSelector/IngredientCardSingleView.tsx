import * as React from "react";
import { CardContent, Input, Typography } from "@mui/joy";
import { ValueEditor } from "../shared/molecules/ValueEditor";
import { ChangeEvent } from "react";
import { ImagePlaceholder } from "@/components/shared/atoms/ImagePlaceholder";
import Card from "@mui/joy/Card";
import { CardMedia } from "@mui/material";

interface QuantityCardProps {
  onIncrement(): void;
  onDecrement(): void;
  quantityValue: number | null | undefined;
  onInputChange(event: ChangeEvent<HTMLInputElement>): void;
  unit: string | undefined;
  imgSrc: string | undefined;
  title: string | undefined;
  step?: number;
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
}: QuantityCardProps) {
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
        <CardMedia
          component="img"
          height={"30%"}
          image={imgSrc || ""}
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
            value={quantityValue!}
            onChange={onInputChange}
            endDecorator={<Typography>{unit}</Typography>}
          />
        </ValueEditor>
      </CardContent>
    </Card>
  );
}
