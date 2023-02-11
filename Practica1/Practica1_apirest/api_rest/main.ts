//@ts-ignore
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application();

type Record = {
    "name": string,
    "score": number
}
let objRecords = {
  first: {
    name: "",
    score: 0
  },
  second: {
    name: "",
    score: 0
  },
  third: {
    name: "",
    score: 0
  },
}

const router = new Router();
router
  .get("/records", (ctx) =>{
    ctx.response.body = JSON.stringify(objRecords);
  })
  .post("/put/:top/:name/:score", async(ctx) =>{
    const {top, name, score} = ctx.params;
    
    if(top === "first"){
      objRecords.third.name = objRecords.second.name;
      objRecords.third.score = objRecords.second.score;
      objRecords.second.name = objRecords.first.name;
      objRecords.second.score = objRecords.first.score;
      objRecords.first = {name, score}

      ctx.response.status = 202
    } else if(top === "second"){
      objRecords.third.name = objRecords.second.name;
      objRecords.third.score = objRecords.second.score;
      objRecords.second = {name, score}

      ctx.response.status = 202
    } else if(top === "third"){
      objRecords.third = {name, score}

      ctx.response.status = 202
    }
  })

app.use(router.routes())

console.log("Server running on http://localhost:8000")
await app.listen({ port: 8000 });


