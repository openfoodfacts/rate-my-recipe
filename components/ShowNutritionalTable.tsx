import * as React from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Nutriscore from "@/components/Nutriscore";
import { Button, Drawer, Stack, drawerClasses } from "@mui/material";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";

export default function ShowNutritionalTable() {
  const nutriscore = useSelector(
    (state: RootState) => state.recipeV2.recipes["empty_recipe"].nutriscore
  );
  const nutriments = useSelector(
    (state: RootState) => state.recipeV2.recipes["empty_recipe"].nutriments
  );

  const [open, setOpen] = React.useState(false);

  if (!nutriments || !nutriscore) {
    return null;
  }

  const NUTRIMENTS_TITLE: { [key: string]: string } = {
    "energy-kcal_100g": "Energie (kCal)",
    "energy-kj_100g": "Energie (kJ)",
    carbohydrates_100g: "Calories",
    sugars_100g: "dont Sucre",
    fat_100g: "Graisse",
    "saturated-fat_100g": "dont saturée",
    fiber_100g: "Fibres",
    proteins_100g: "Proteines",
    salt_100g: "Sel",
  };

  const NUTRIMENTS_PRECISION = {
    "energy-kcal_100g": 1,
    "energy-kj_100g": 0,
    carbohydrates_100g: 1,
    sugars_100g: 1,
    fat_100g: 1,
    "saturated-fat_100g": 1,
    fiber_100g: 1,
    proteins_100g: 1,
    salt_100g: 1,
  } as any;

  return (
    <>
      <Stack>
        <Nutriscore grade={nutriscore} />
        <Button onClick={() => setOpen(true)}>More info</Button>
      </Stack>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="left"
        sx={{
          [`& .${drawerClasses.paper}`]: {
            // height: "90vh",
            // borderTopRightRadius: 10,
            // borderTopLeftRadius: 10,
            p: 2,
          },
        }}
      >
        <Table aria-label="basic table">
          <thead>
            <tr>
              <th>Nutriment</th>
              <th>pour 100 g</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(NUTRIMENTS_TITLE).map((key) => (
              <tr key={key}>
                <td
                  style={{
                    paddingLeft: NUTRIMENTS_TITLE[key].includes("dont")
                      ? 10
                      : 0,
                  }}
                >
                  {NUTRIMENTS_TITLE[key]}
                </td>
                <td>{nutriments?.[key]?.toFixed(NUTRIMENTS_PRECISION[key])}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Sheet
          sx={{
            p: 2,
            position: "fixed",
            bottom: 0,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Sheet>
      </Drawer>
    </>
  );
}
