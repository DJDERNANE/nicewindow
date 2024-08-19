import { Model, Q } from "@nozbe/watermelondb";
import { children, field, text, writer } from "@nozbe/watermelondb/decorators";
import database from "./db";

export default class Client extends Model {
  static table = "clients";
  static associations = {
    shapes: { type: "has_many", foreignKey: "client_id" },
    invoices: { type: "has_many", foreignKey: "client_id" },
  };

  @text("name")
  name;
  @text("phone")
  phone;
  @text("notes")
  notes;
  @field("dbid") dbid;

  @children("shapes")
  shapes;
  @children("invoices") invoices;

  @writer
  async addShape(frame) {
    const newShape = await database.get("shapes").create((sh) => {
      sh.clientId = this.id;
      sh.frame = frame;
    });
    return newShape;
  }

  @writer
  async addInvoice(img, index) {
    const newInvoice = await database.get("invoices").create((invoice) => {
      invoice.clientId = this.id;
      invoice.img = img;
      invoice.index = index;
    });
    return newInvoice;
  }

  @writer
  async getAllShapes() {
    return await this.shapes;
  }

  @writer
  async getAllInvoices() {
    return await this.invoices;
  }

  @writer async deleteInvoiceImg(index) {
    const invoices = await this.invoices;
    const invoiceIndex = invoices?.findIndex((i) => i.index === index);
    console.log("invoice index => ", invoices.length, index);
    if (invoiceIndex > -1) {
      await invoices[invoiceIndex].destroyPermanently();
    }

    return;
  }
}
