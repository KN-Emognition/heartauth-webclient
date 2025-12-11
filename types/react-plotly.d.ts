declare module "react-plotly.js" {
  import * as React from "react";
  import { Layout, Config, Data } from "plotly.js";

  export interface PlotParams {
    data?: Partial<Data>[];
    layout?: Partial<Layout>;
    config?: Partial<Config>;
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
  }

  const Plot: React.FC<PlotParams>;
  export default Plot;
}
