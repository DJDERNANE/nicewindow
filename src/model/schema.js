import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: "clients",
      columns: [
        { name: "name", type: "string" },
        { name: "phone", type: "string" },
        { name: "notes", type: "string", isOptional: true },
        { name: "dbid", type: "number" },
      ],
    }),
    tableSchema({
      name: "shapes",
      columns: [
        { name: "frame", type: "string" },
        { name: "client_id", type: "string" },
      ],
    }),
    tableSchema({
      name: "invoices",
      columns: [
        { name: "img", type: "string" },
        { name: "index", type: "number" },
        { name: "client_id", type: "string" },
      ],
    }),
    tableSchema({
      name: "aluminiums",
      columns: [
        { name: "name", type: "string" },
        { name: "colored_price", type: "number" },
        { name: "white_price", type: "number" },
      ],
    }),
    tableSchema({
      name: "glasss",
      columns: [
        { name: "name", type: "string" },
        { name: "price", type: "number" },
      ],
    }),
    tableSchema({
      name: "volles",
      columns: [
        { name: "colored_price", type: "number" },
        { name: "white_price", type: "number" },
      ],
    }),
  ],
});
