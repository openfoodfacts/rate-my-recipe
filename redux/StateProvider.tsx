"use client";

import * as React from "react";
import { Provider } from "react-redux";
import store from "../redux/store";

const StateProvider = ({ children }: React.PropsWithChildren) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StateProvider;
