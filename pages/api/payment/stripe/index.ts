import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

type Data = {
  data: any;
};

const config = {
  protocol: `${process.env.NEXT_STRIPE_API_PROTOCOL}`,
  host: `${process.env.NEXT_STRIPE_API_HOST}`,
  apiVersion: `${process.env.NEXT_STRIPE_API_VERSION}`,
};

const stripe = new Stripe(`${process.env.NEXT_STRIPE_SECRET_KEY}`, {
  apiVersion: "2020-08-27",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { card_number, card_exp_date, card_exp_year, card_cvc } = req.body;

  const token = await stripe.tokens.create({
    card: {
      number: card_number,
      exp_month: card_exp_date,
      exp_year: card_exp_year,
      cvc: card_cvc,
    },
  });

  res.status(200).json({
    data: token,
  });
}
