import * as React from "react";
import { CardContent, TextField, Typography } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import { ChangeEvent } from "react";
import Card from "@mui/joy/Card";
import { ValueEditor } from "@/components/shared/molecules/ValueEditor";

interface UnknownIngredientViewProps {
  onIncrement(): void;
  onDecrement(): void;
  quantityValue: number | null | undefined;
  onInputChange(event: ChangeEvent<HTMLInputElement>): void;
  onTitleChange(event: ChangeEvent<HTMLInputElement>): void;
  unit?: string | undefined;
  title: string | undefined;
  step?: number;
}

export function UnknownIngredientView({
  onIncrement,
  onDecrement,
  quantityValue,
  onInputChange,
  unit = "g",
  title,
  onTitleChange,
  step = 1,
}: UnknownIngredientViewProps) {
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
        <FormControl id="ingredient-name" required size="md">
          <FormLabel>{"Nom de l'ingredient"}</FormLabel>
          <Input fullWidth value={title ?? ""} onChange={onTitleChange} />
        </FormControl>
      </CardContent>

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
            endDecorator={<Typography> {unit}</Typography>}
          />
        </ValueEditor>
      </CardContent>
    </Card>
  );
}
