import { QueryTable } from "./query";

export const SCHEMA = {
  BONFIRES: new QueryTable("bonfires", "id", {
    id: "STRING(5)",
    max: "INT8",
    min: "INT8",
    tags: "STRING(5)[]",
  }),

  CONFIGURATION: new QueryTable("config", "k", {
    k: "STRING(12)",
    v: "STRING(12)",
  }),
};
