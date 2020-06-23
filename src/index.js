const express = require("express");
const chargebee = require("chargebee");
const cors = require("cors");

chargebee.configure({
  site: "dnsfilter-test",
  api_key: "test_xyMraWJLkO1TmT2lSXklmNCVI1c70PCx",
});

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate_portal_session", async (req, res) => {
  const client = await chargebee.customer
    .list({
      "email[is]": req.body.email,
    })
    .request(function (error, result) {
      return result;
    });

  let customerId = null;
  for (let i = 0; i < client.list.length; i++) {
    const entry = client.list[i];

    customerId = entry.customer.id;
    // const { card } = entry;
  }

  const resposta = await chargebee.portal_session
    .create({
      customer: {
        id: customerId,
      },
    })
    .request(function (error, result) {
      if (error) {
        // handle error
        console.log(error);

        return error;
      }
      // console.log(result);
      return result.portal_session;
    });

  console.log(resposta.portal_session);

  return res.json(resposta.portal_session);
});

app.post("/generate_checkout_new_url", async (req, res) => {
  const resposta = await chargebee.hosted_page
    .checkout_new({
      subscription: {
        plan_id: "per-user-basic-monthly",
      },
    })
    .request(function (error, result) {
      if (error) {
        // handle error
        // console.log(error);
        return error;
      }
      return result;
    });

  return res.json(resposta.hosted_page);
});

app.post("/generate_checkout_existing_url", async (req, res) => {
  const resposta = await chargebee.hosted_page
    .checkout_existing({
      subscription: {
        id: "AzqgseS2lj9gO1Qky",
      },
    })
    .request(function (error, result) {
      if (error) {
        // handle error
        return error;
      }
      console.log(result);
      return result;
    });

  return res.json(resposta.hosted_page);
});

app.post("/generate_update_payment_method_url", async (req, res) => {
  const client = await chargebee.customer
    .list({
      "email[is]": req.body.email,
    })
    .request(function (error, result) {
      return result;
    });

  console.log({ client });

  let customerId = null;
  for (let i = 0; i < client.list.length; i++) {
    const entry = client.list[i];

    customerId = entry.customer.id;
    // const { card } = entry;
  }

  console.log({ customerId });

  const resposta = await chargebee.hosted_page
    .manage_payment_sources({
      customer: {
        id: customerId,
      },
    })
    .request(function (error, result) {
      if (error) {
        // handle error
        return error;
      }
      // console.log(result);
      return result;
    });

  return res.json(resposta.hosted_page);
});

app.listen(process.env.PORT || 3333, () => {
  console.log("Server started!");
});
