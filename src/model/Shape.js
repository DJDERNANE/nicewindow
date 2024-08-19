import { Model } from "@nozbe/watermelondb";
import { text, writer } from "@nozbe/watermelondb/decorators";

export default class Shape extends Model {
  static table = "shapes";
  static associations = {
    clients: { type: "belongs_to", key: "client_id" },
  };

  @text("frame")
  frame;
  @text("client_id")
  clientId;

  @writer
  async updateFrame(newFrame) {
    await this.update((shape) => {
      shape.frame = newFrame;
    });
  }

  @writer
  async delete() {
    await this.markAsDeleted();
  }
}
