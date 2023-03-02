import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import {
  MongoClient,
  ObjectId,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";

const client = new MongoClient();
//usuario: Augus, password: NebrijaAugus
await client.connect(
  `mongodb+srv://Augus:NebrijaAugus@cluster0.bffv5pw.mongodb.net/?authMechanism=SCRAM-SHA-1`
);

export const db = client.database("Cluster0");
export const recordsCollection = db.collection<ldrBoard>("LeaderBorad");

const app = new Application();

type Record = {
  name: string;
  score: number;
};
type ldrBoard = {
  _id?: ObjectId;
  first: Record;
  second: Record;
  third: Record;
};

const router = new Router();
router
  .get("/records", async (ctx) => {
    const ldrBoard: ldrBoard[] | undefined[] = await recordsCollection
      .find({})
      .toArray();
    ctx.response.body = ldrBoard[0];
  })
  .put("/reset", async (ctx) => {
    const value = getQuery(ctx, { mergeParams: true });
    if (value?.pswrd != "porfadejamesoyyo") {
      ctx.response.body = "Nice try but wrong password.";
      ctx.response.status = 401;
      return;
    }
    await recordsCollection.deleteMany({});
    const ldrBoard: ldrBoard = {
      first: { name: "", score: 0 },
      second: { name: "", score: 0 },
      third: { name: "", score: 0 },
    };
    await recordsCollection.insertOne(ldrBoard);
    ctx.response.status = 202;
  })
  .post("/put/:top/:name/:score", async (ctx) => {
    const { top, name, score } = ctx.params;

    const ldrBoard: ldrBoard[] | undefined[] = await recordsCollection
      .find({})
      .toArray();
    if (ldrBoard[0]) {
      if (top === "first") {
        ldrBoard[0].third.name = ldrBoard[0].second.name;
        ldrBoard[0].third.score = ldrBoard[0].second.score;
        ldrBoard[0].second.name = ldrBoard[0].first.name;
        ldrBoard[0].second.score = ldrBoard[0].first.score;
        ldrBoard[0].first = { name, score };
      } else if (top === "second") {
        ldrBoard[0].third.name = ldrBoard[0].second.name;
        ldrBoard[0].third.score = ldrBoard[0].second.score;
        ldrBoard[0].second = { name, score };
      } else if (top === "third") {
        ldrBoard[0].third = { name, score };
      }
    }

    await recordsCollection.replaceOne({}, ldrBoard[0]);
    ctx.response.status = 202;
  });

app.use(router.routes());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
