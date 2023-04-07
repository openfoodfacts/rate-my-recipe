"use client";

import * as React from "react";
import Button from "@mui/joy/Button";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Navigator from "./Navigator";

export default function IngredientSelector() {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        sx={{
          [`& .${drawerClasses.paper}`]: {
            height: "90vh",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            p: 2,
          },
        }}
      >
        <Navigator />
      </Drawer>
    </React.Fragment>
  );
}
