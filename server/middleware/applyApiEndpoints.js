const { Shopify } = require("@shopify/shopify-api");
const Feed = require("../model/feed");

async function applyApiEndpoints(app) {
  app.get("/api/pages", async (req, res) => {
    console.log("In Pages");

    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    console.log(session);
    const { Page } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const data = await Page.all({ session });
    res.status(200).send(data);
  });

  app.get("/api/feeds", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { shop } = session;

      const feeds = await Feed.findAll({
        where: {
          shop: shop,
        },
      });

      res.status(200).send({ result: feeds });
    } catch (err) {
      console.log(err);
      return res.sendStatus(404);
    }
  });

  app.get("/api/feeds/:id", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { shop } = session;

      const feed = await Feed.findOne({
        where: {
          shop: shop,
          id: req.params.id,
        },
      });

      res.status(200).send({ result: feed });
    } catch (err) {
      console.log(err);
      return res.sendStatus(404);
    }
  });

  app.post("/api/feeds", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { shop } = session;

      const { title, image, color, redirectPage, redirectHandle } = req.body;

      if (!title || !image || !color || !redirectPage || !redirectHandle) {
        return res.sendStatus(400);
      }

      const feed = await Feed.build({
        title,
        image,
        theme: { base: color },
        redirects: { redirectPage, redirectHandle },
        shop,
      });

      await feed.save();
      console.log(feed);
      res.status(200).send({ result: feed });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  });

  app.put("/api/feeds/:id", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { shop } = session;

      const { title, image, color, redirectPage, redirectHandle } = req.body;

      if (
        !title ||
        !image ||
        !color ||
        !redirectPage ||
        !redirectHandle ||
        !req.params.id
      ) {
        return res.sendStatus(400);
      }

      const feed = await Feed.findOne({
        where: {
          shop: shop,
          id: req.params.id,
        },
      });

      if (!feed) {
        return res.sendStatus(404);
      }

      feed.set(req.body);

      await feed.save();
      console.log(feed);
      res.status(200).send({ result: feed });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  });

  app.delete("/api/feeds/:id", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { shop } = session;

      const { title, image, color, redirectPage, redirectHandle } = req.body;

      if (!req.params.id) {
        return res.sendStatus(400);
      }

      await Feed.destroy({
        where: {
          shop: shop,
          id: req.params.id,
        },
      });

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  });
}

module.exports.applyApiEndpoints = applyApiEndpoints;
