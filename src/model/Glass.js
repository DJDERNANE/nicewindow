import { Model } from "@nozbe/watermelondb";
import { field, text, writer } from "@nozbe/watermelondb/decorators";

export default class Glass extends Model {
  static table = "glasss";

  @text("name") name;
  @field("price") price;

  @writer async updateMe(name, price) {
    await this.update((gls) => {
      gls.name = name;
      gls.price = price;
    });
  }
}
