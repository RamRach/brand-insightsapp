import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): boolean => {
  input.db
    .prepare("DELETE FROM insights WHERE id = ?")
    .run(input.id);
  return input.db.changes > 0;
};
