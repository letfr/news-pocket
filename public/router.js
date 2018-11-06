import { intro, newsItem, cartItem } from "./template.js";

$(document).ready(() => {
  page('/', index);
  //page('/products', products);
  page('/news/:category', news);
  page('/cart', cart);
  page();

  counter();
})

function index() {
  $("#content").html(intro());
};

/*function products() {
  $("#content").html("");
  fetch("https://api.itbook.store/1.0/new")
    .then(response => response.json())
    .then(data => {
      for (let book of data.books) {
        $("#content").append(productsItem(book));
      }
    })
}*/

function news(ctx) {
  $("#content").html("");
  fetch(`https://api.nytimes.com/svc/topstories/v2/${ctx.params.category}.json?api-key=a72142464e264cd1b6f631078d3af64c`)
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
  $(`.btn-cart[data-url="${news.short_url}"]`).css("background-color", "#3CB371").text(`FAVORITED`);
}

function cart() {
  $("#content").html("");
  const items = { ...localStorage };
  for (let i in items) {
    $("#content").append(cartItem(i, items));
  }
  $(".remove-cart").on("click", (e) => removeFromCart(e.target));
}

function removeFromCart(target) {
  target.parentElement.parentElement.remove();
  localStorage.removeItem(target.dataset.name);
  counter();
} 