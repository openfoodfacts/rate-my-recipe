"use client";

import * as React from "react";
import Button from "@mui/joy/Button";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Navigator from "./Navigator";
import { useDispatch, useSelector } from "react-redux";
import { selectEditorView } from "@/redux/selectors";
import { closeEditor } from "@/redux/reducers/editor";

export default function IngredientSelector() {
  const view = useSelector(selectEditorView);
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <Drawer
        open={view !== null}
        onClose={() => dispatch(closeEditor({}))}
        anchor="bottom"
        sx={{
          [`& .${drawerClasses.paper}`]: {
            height: "90vh",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            p: 2,
            overflowX: "auto",
            margin: "auto",
          },
        }}
      >
        <Navigator />
      </Drawer>
    </React.Fragment>
  );
}
