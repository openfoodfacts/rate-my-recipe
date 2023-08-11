import * as React from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Nutriscore from "@/components/Nutriscore";
import { Drawer, drawerClasses } from "@mui/material";
import { Stack } from "@mui/joy";
import Table from "@mui/joy/Table";
import IconButton from "@mui/joy/IconButton";
import DecreaseIcon from "@mui/icons-material/SouthEast";
import IncreaseIcon from "@mui/icons-material/NorthEast";
import StableIcon from "@mui/icons-material/East";
import InfoIcon from "@mui/icons-material/Info";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

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

const isSubNutriment = (nutrimentKey: string) =>
  ["sugars_100g", "saturated-fat_100g"].includes(nutrimentKey);

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

const shouldIncrease = {
  fiber_100g: true,
  proteins_100g: true,
} as any;

const EvolutionIcon = ({
  userValue,
  urlValue,
  nutrimentKey,
}: {
  userValue?: number;
  urlValue?: number;
  nutrimentKey: string;
}) => {
  if (urlValue === undefined || userValue === undefined) {
    return null;
  }
  if (urlValue < userValue) {
    return (
      <IncreaseIcon
        color={shouldIncrease[nutrimentKey] ? "success" : "error"}
      />
    );
  }

  if (urlValue < userValue) {
    return (
      <DecreaseIcon
        color={shouldIncrease[nutrimentKey] ? "error" : "success"}
      />
    );
  }

  return <StableIcon color="inherit" />;
};

export default function ShowNutritionalTable() {
  console.log("ShowNutritionalTable");
  const { t } = useTranslation();
  const userNutriscore = useSelector(
    (state: RootState) => state.recipe.recipes["userRecipe"].nutriscore
  );
  const userNutriscore100 = useSelector(
    (state: RootState) => state.recipe.recipes["userRecipe"].nutriscore_100
  );
  const userNutriments = useSelector(
    (state: RootState) => state.recipe.recipes["userRecipe"].nutriments
  );
  const urlNutriments = useSelector(
    (state: RootState) => state.recipe.recipes["urlRecipe"].nutriments
  );
  const urlNutriscore = useSelector(
    (state: RootState) => state.recipe.recipes["urlRecipe"].nutriscore
  );
  const urlNutriscore100 = useSelector(
    (state: RootState) => state.recipe.recipes["urlRecipe"].nutriscore_100
  );

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        {urlNutriscore ? (
          <>
            <Nutriscore grade={urlNutriscore} score={urlNutriscore100} height={50} />
            <ArrowForwardIcon />
          </>
        ) : (
          null
        )}
        
        <Nutriscore grade={userNutriscore} score={userNutriscore100} height={50} />
        <IconButton variant="plain" onClick={() => setOpen(true)}>
          <InfoIcon />
        </IconButton>
      </Stack>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        sx={{
          [`& .${drawerClasses.paper}`]: {
            p: 2,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
      >
        <Stack direction="row" justifyContent="center">
          <IconButton
            variant="plain"
            color="neutral"
            sx={{ ml: "auto" }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Table sx={{ "& span": { whiteSpace: "initial" } }}>
          <thead>
            <tr>
              <th>{t("nutriments.nutriment")}</th>
              <th>
                <span>{t("nutriments.initial_value")}</span>
              </th>
              <th>
                <span>{t("nutriments.modified_value")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(NUTRIMENTS_TITLE).map((key) => {
              const urlValue = urlNutriments?.[key]?.toFixed(
                NUTRIMENTS_PRECISION[key]
              );
              const userValue = userNutriments?.[key]?.toFixed(
                NUTRIMENTS_PRECISION[key]
              );

              return (
                <tr key={key}>
                  <td
                    style={{
                      paddingLeft: isSubNutriment(key) ? 10 : 0,
                    }}
                  >
                    {t(`nutriments.${key}`)}
                  </td>
                  <td>{urlValue ?? t(`nutriments.unknown`)}</td>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{userValue ?? t(`nutriments.unknown`)}</span>
                    <EvolutionIcon
                      urlValue={urlValue}
                      userValue={userValue}
                      nutrimentKey={key}
                    />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td />
              <td>
                <Nutriscore grade={urlNutriscore} score={urlNutriscore100} height={40} />
              </td>
              <td>
                <Nutriscore grade={userNutriscore} score={userNutriscore100} height={40} />
              </td>
            </tr>
          </tbody>
        </Table>
      </Drawer>
    </>
  );
}
