import Realm from "realm";
import { UserInfoSchema } from "../model/userInfo";
import { ConversationSchema } from "../model/Conversation";

export class RealmDB {
  private static instance: Realm;

  private constructor() { }

  public static getInstance(): Realm {
      if (!RealmDB.instance) {
        RealmDB.instance = new Realm({
          path: "airyRealm",
          schema: [UserInfoSchema, ConversationSchema]
        });
      }
      return RealmDB.instance;
  }
}