const { Session } = require("@shopify/shopify-api/dist/auth/session/index");

const MerchantSession = require("../model/sessions.js");
const { Op } = require("sequelize");
const { Shopify } = require("@shopify/shopify-api");

async function storeCallBack(session) {
  try {
    // console.log("InStoreCallback",session)
    let data = session;

    // console.log("Type of expires ",typeof(data.expires))

    const merchant = await MerchantSession.findOne({
      where: { session_id: data.id },
    });

    // console.log(data,domain_id)
    // console.log(merchant,data)
    if (merchant) {
      merchant.set({
        payload: data,
      });
      await merchant.save();
    } else {
      const newMerchant = MerchantSession.build({
        session_id: data.id,
        payload: data,
      });

      await newMerchant.save();
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function loadCallBack(id) {
  try {
    const merchantSession = await MerchantSession.findOne({
      where: {
        [Op.or]: [{ session_id: id }],
      },
    });

    console.log(merchantSession);

    if (!merchantSession) {
      return undefined;
    }

    let session = new Session(merchantSession.session_id);

    console.log("InLoadCallback", session);
    console.log(typeof merchantSession.expires);
    console.log(merchantSession.payload);

    const {
      accessToken,
      state,
      scope,
      expires,
      shop,
      isOnline,
      onlineAccessInfo,
    } = merchantSession?.payload;

    session.shop = shop;
    session.state = state;
    session.scope = scope;
    session.expires = expires ? new Date(expires) : undefined;
    session.isOnline = isOnline;
    session.accessToken = accessToken;
    session.onlineAccessInfo = onlineAccessInfo;

    if (session?.isActive()) {
      console.log("Active");
    } else {
      console.log("Session Inactive");
    }

    return session;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function deleteCallBack(id) {
  try {
    console.log(id);
    await MerchantSession.destroy({
      where: {
        session_id: id,
      },
    });
    return true;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { storeCallBack, loadCallBack, deleteCallBack };
