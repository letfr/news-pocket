import { intro, newsItem, newspaperItem } from "./template.js";

$(document).ready(() => {
  page('/', index);
  page('/topnews', topnews);
  page('/news/:category', news);
  page('/newspaper', newspaper);
  page();

  counter();
})

function index() {
  $("#content").html(intro());
};

function topnews() {
  $("#content").html("");
  fetch(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=CRxa3mqVDmbeTKlZxFxA9Axrsjgm8BBo`)
    .then(response => response.json())
    .then(data => {
      for (let news of data.results) {
        $("#content").append(newsItem(news));
        $(`.btn-cart[data-url="${news.short_url}"]`).on("click", () => addToCart(news));
      }
    })
}

function news(ctx) {
  $("#content").html("");
  fetch(`https://api.nytimes.com/svc/topstories/v2/${ctx.params.category}.json?api-key=CRxa3mqVDmbeTKlZxFxA9Axrsjgm8BBo`)
    .then(response => response.json())
    .then(data => {
      for (let news of data.results) {
        $("#content").append(newsItem(news));
        $(`.btn-cart[data-url="${news.short_url}"]`).on("click", () => addToCart(news));
      }
    })
}

function counter() {
  let count = 0;
  for(let item in { ...localStorage }) count++;
  if(count > 0){ $("#cart-counter").html(`<p class="cart-counter">${count}</p>`); }
}

function addToCart(data) {
  localStorage.setItem(data.title, JSON.stringify(data));
  let count = 0;
  for(let item in { ...localStorage }) count++;
  $("#cart-counter").html(`<p class="cart-counter">${count}</p>`);
  $(`.btn-cart[data-url="${data.short_url}"]`).css("border-bottom", "3px solid #24053B").text(`FAVORITED`);
}

function newspaper() {
  $("#content").html("");
  const items = { ...localStorage };
  for (let i in items) {
    console.log(JSON.parse(items[i]))
    $("#content").append(newspaperItem(i, items));
  }
  $(".remove-cart").on("click", (e) => removeFromCart(e.target));
}

function removeFromCart(target) {
  target.parentElement.parentElement.remove();
  localStorage.removeItem(target.dataset.name);
  counter();
} 