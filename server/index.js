require("dotenv").config();
const { resolve } = require("path");
const express = require("express");

const cookieParser = require("cookie-parser");
const { Shopify, LATEST_API_VERSION } = require("@shopify/shopify-api");

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 4000;

const applyAuthMiddleware = require("./middleware/auth.js");
const verifyRequest = require("./middleware/verify-request.js");
const fs = require("fs");
const serveStatic = require("serve-static");
const compression = require("compression");
const cors = require("cors");
const {
  storeCallBack,
  loadCallBack,
  deleteCallBack,
} = require("./helpers/session-helper.js");
const { applyApiEndpoints } = require("./middleware/applyApiEndpoints.js");

try {
  const USE_ONLINE_TOKENS = true;
  const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

  // console.log(process.env.SHOPIFY_API_KEY);

  Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: process.env.SCOPES.split(","),
    HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
    API_VERSION: LATEST_API_VERSION,
    IS_EMBEDDED_APP: true,
    // This should be replaced with your preferred storage strategy
    SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
      storeCallBack,
      loadCallBack,
      deleteCallBack
    ),
  });

  const ACTIVE_SHOPIFY_SHOPS = {};
  Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/webhooks",
    webhookHandler: async (topic, shop, body) => {
      delete ACTIVE_SHOPIFY_SHOPS[shop];
    },
  });

  const app = express();

  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  app.post("/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      if (!res.headersSent) {
        res.status(500).send(error.message);
      }
    }
  });

  app.use("/api/*", verifyRequest(app));

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: false, limit: "50mb" }));

  applyApiEndpoints(app);

  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  app.use("/*", (req, res, next) => {
    const { shop } = req.query;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
    } else {
      next();
    }
  });

  /*Client Side routing*/

  app.use(express.static(resolve(__dirname, "../build")));
  // app.use(compression());
  app.get("/*", (req, res, next) => {
    // Client-side routing will pick up on the correct route to render, so we always render the index here
    res
      .status(200)
      .set("Content-Type", "text/html")
      .sendFile(fs.readFileSync(`${process.cwd()}/build/index.html`));

    // res.send("<h1>Hello</h1>");
  });

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on localhost:${PORT} - env ${process.env.NODE_ENV}`);
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
