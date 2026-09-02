/**
 * The purchase button.
 *
 * Everything the shop needs is in one place at the top. While the token is
 * empty the buttons stay hidden and the page says the app is not on sale yet,
 * so a half-configured site never shows a button that cannot work.
 */
const PADDLE_TOKEN = "live_caa95e53994f8145b0400f7618d";  // public: it ships in this page
const PADDLE_PRICE = "pri_01m19n2b76m7e23z3gbr00xz2s";    // TouchRotator, ¥1,980, one-time
const THANKS_URL = "https://touchrotator.tsubomi.jp/thanks.html";

const configured = PADDLE_TOKEN !== "" && typeof Paddle !== "undefined";

// The page knows which language its reader is on; the checkout and the
// thank-you page follow it. Hard-coded, a buyer who came from the English
// page paid on a Japanese form.
const PAGE = document.documentElement.lang;
const CHECKOUT_LOCALE = PAGE === "ja" ? "ja" : PAGE === "zh-Hans" ? "zh-Hans" : "en";
const THANKS_LANG = PAGE === "ja" ? "ja" : PAGE === "zh-Hans" ? "zh" : "en";

if (configured) {
  Paddle.Initialize({
    token: PADDLE_TOKEN,
    // Paddle does not put the transaction number on the success URL, and the
    // thank-you page has nothing to look a key up by without it. The number
    // arrives here instead, when the payment goes through, so the redirect is
    // ours to make.
    eventCallback(event) {
      if (event.name !== "checkout.completed") return;
      const transaction = event.data && event.data.transaction_id;
      if (!transaction) return;
      location.href = `${THANKS_URL}?_ptxn=${encodeURIComponent(transaction)}&lang=${THANKS_LANG}`;
    },
  });
}

document.querySelectorAll("[data-buy]").forEach((button) => {
  button.hidden = !configured;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    // No successUrl: Paddle would redirect on its own before the callback
    // above could add the transaction number.
    Paddle.Checkout.open({
      items: [{ priceId: PADDLE_PRICE, quantity: 1 }],
      settings: { locale: CHECKOUT_LOCALE },
    });
  });
});

document.querySelectorAll("[data-not-yet]").forEach((note) => {
  note.hidden = configured;
});
