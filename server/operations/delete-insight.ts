import type { HasDBClient } from "../shared.ts";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): boolean => {
  input.db.exec(insightsTable.deleteStatement(input.id));
  return input.db.changes > 0;
};
