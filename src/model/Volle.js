import { Model } from "@nozbe/watermelondb";
import { field, writer } from "@nozbe/watermelondb/decorators";

export default class Volle extends Model {
  static table = "volles";

  @field("colored_price") coloredPrice;
  @field("white_price") whitePrice;

  @writer async updateMe(whitePrice, coloredPrice) {
    await this.update((vls) => {
      vls.whitePrice = whitePrice;
      vls.coloredPrice = coloredPrice;
    });
  }
}
