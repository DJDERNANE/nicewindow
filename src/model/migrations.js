import {
  createTable,
  schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: "aluminiums",
          columns: [
            { name: "name", type: "string" },
            { name: "colored_price", type: "number" },
            { name: "white_price", type: "number" },
          ],
        }),
        createTable({
          name: "glasss",
          columns: [
            { name: "name", type: "string" },
            { name: "price", type: "number" },
          ],
        }),
        createTable({
          name: "volles",
          columns: [
            { name: "colored_price", type: "number" },
            { name: "white_price", type: "number" },
          ],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        createTable({
          name: "invoices",
          columns: [
            { name: "img", type: "string" },
            { name: "client_id", type: "string" },
          ],
        }),
      ],
    },
  ],
});
