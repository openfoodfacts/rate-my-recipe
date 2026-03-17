import * as React from "react";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import Autocomplete from "@mui/joy/Autocomplete";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Card from "@mui/joy/Card";
import availableIngredients from "@/data/otherIngredients.json";
import { ValueEditor } from "@/components/shared/molecules/ValueEditor";

interface UnknownIngredientViewProps {
  onIncrement(): void;
  onDecrement(): void;
  quantityValue: number | null | undefined;
  onInputChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onTitleChange(newValue: string): void;
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
          <Autocomplete
            options={availableIngredients}
            slotProps={{
              listbox: { sx: { zIndex: 1800 } },
            }}
            value={title ?? ""}
            onChange={(event, newValue) => onTitleChange(newValue ?? "")}
          />
        </FormControl>

        <ValueEditor
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          disabledDecrement={quantityValue! <= step}
        >
          <Input
            type="number"
            value={`${Math.max(0, quantityValue ?? 0)}`}
            onChange={onInputChange}
            endDecorator={<Typography> {unit}</Typography>}
          />
        </ValueEditor>
      </CardContent>
    </Card>
  );
}
