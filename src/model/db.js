import { Database } from "@nozbe/watermelondb";
import SQLIteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";
import migrations from "./migrations";
import Client from "./Client";
import Shape from "./Shape";
import Aluminium from "./Aluminium";
import Glass from "./Glass";
import Volle from "./Volle";
import Invoice from "./Invoice";

const adapter = new SQLIteAdapter({
  schema,
  migrations,
  onSetUpError: (err) => console.error(err),
});

const database = new Database({
  adapter,
  modelClasses: [Client, Shape, Aluminium, Glass, Volle, Invoice],
});

export default database;
