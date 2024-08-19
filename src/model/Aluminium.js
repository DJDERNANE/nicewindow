import { Model } from "@nozbe/watermelondb";
import { text, field, writer } from "@nozbe/watermelondb/decorators";

export default class Aluminium extends Model {
  static table = "aluminiums";

  @text("name") name;
  @field("colored_price") coloredPrice;
  @field("white_price") whitePrice;

  @writer async updateMe(name, whitePrice, coloredPrice) {
    await this.update((alm) => {
      alm.name = name;
      alm.whitePrice = whitePrice;
      alm.coloredPrice = coloredPrice;
    });
  }
}
