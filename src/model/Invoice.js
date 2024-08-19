import { Model } from "@nozbe/watermelondb";
import { field, text, writer } from "@nozbe/watermelondb/decorators";

export default class Invoice extends Model {
  static table = "invoices";
  static associations = {
    clients: { type: "belongs_to", key: "client_id" },
  };

  @field("img")
  img;
  @field("index") index;
  @text("client_id")
  clientId;

  @writer
  async updateImg(newImg, index) {
    if (index === this.index) {
      await this.update((invoice) => {
        invoice.img = newImg;
      });
    }
  }

  @writer
  async delete() {
    await this.markAsDeleted();
  }
}
