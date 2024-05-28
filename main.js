let cart = [];

const searchPlayers = () => {
  const searchText = document.getElementById("search-field").value;
  loadPlayers(searchText);
  document.getElementById("search-field").value = "";
};

const loadPlayers = (searchText) => {
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchText}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayplayers(data.player));
};

const displayplayers = (players) => {
  const playersContainer = document.getElementById("playersContainer");
  playersContainer.innerText = "";
  if (players == null) {
    playersContainer.innerHTML = `
    <p class="w-50 text-center mx-auto fs-3 fw-bold"> There is no data to show </p>
    `;
  } else {
    players.forEach((player) => {
      const playerDiv = document.createElement("div");
      playerDiv.classList.add("col");
      playerDiv.innerHTML = `
          <div class="card h-100">
              <img src="${
                player.strThumb || "images/default.png"
              }" class="card-img-top" alt="...">
              <div class="card-body">
                  <h5 class="card-title"><b>Name:</b> ${player.strPlayer}</h5>
                  <h5 class="card-title"><b>Nationality:</b> ${
                    player.strNationality
                  }</h5>
                  <h5 class="card-title"><b>Team:</b> ${player.strTeam}</h5>
                  <h5 class="card-title"><b>Sports:</b> ${player.strSport}</h5>
                  <h5 class="card-title"><b>Gender:</b> ${player.strGender}</h5>
                  <h5 class="card-title"><b>Salary:</b> ${
                    player.strWage || "Not Mentioned"
                  }</h5>
                  <p class="card-text"><b>Description:</b> ${
                    (player.strDescriptionEN?.slice(0, 100) ||
                      "Description is not available") + "..."
                  }</p>
                  <div class="social">
                    <a target="_blank" href=${
                      player.strTwitter || "www.instagram.com/ingstagram10"
                    }><i class="fa-brands fa-twitter fs-3 me-2"></i></a>
                    <a target="_blank" href=${
                      player.strInstagram || "www.instagram.com/ingstagram10"
                    }><i class="fa-brands fa-instagram fs-3 me-2"></i></a>
                  </div>
              </div>
              <div class="card-footer">
                <button onclick="loadPlayerDetail(${
                  player.idPlayer
                })" type="button" class="btn" data-bs-toggle="modal" data-bs-target="#playerDetails">
                    Details
                </button>
                <button id="addToCartBtn${
                  player.idPlayer
                }" onclick="addToCart(${player.idPlayer}, '${
        player.strPlayer
      }')" class="btn">Add to Cart</button>
              </div>
          </div>
          `;
      playersContainer.appendChild(playerDiv);
    });
  }
};

const loadPlayerDetail = async (playerId) => {
  const url = `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayPlayerDetails(data.players[0]);
  } catch (error) {
    console.log(error);
  }
};

const displayPlayerDetails = (player) => {
  document.getElementById("exampleModalLabel").innerText =
    player.strPlayer + "'s Details";
  const playerDetails = document.getElementById("playerDetailsBody");
  playerDetails.innerHTML = `
      <img src="${
        player.strThumb || "images/default.png"
      }" class="img-fluid" alt="...">
      <h5 class="card-title"><b>Nationality:</b> ${player.strNationality}</h5>
      <h5 class="card-title"><b>Team:</b> ${player.strTeam}</h5>
      <h5 class="card-title"><b>Sports:</b> ${player.strSport}</h5>
      <h5 class="card-title"><b>Gender:</b> ${player.strGender}</h5>
      <h5 class="card-title"><b>Birth Date:</b> ${player.dateBorn}</h5>
      <h5 class="card-title"><b>Signing Data:</b> ${player.dateSigned}</h5>
      <h5 class="card-title"><b>Status:</b> ${player.strStatus}</h5>
      <h5 class="card-title"><b>Position:</b> ${player.strPosition}</h5>
      <h5 class="card-title"><b>Salary:</b> ${player.strWage || "null"}</h5>
      <p class="card-text"><b>Description:</b> ${
        (player.strDescriptionEN?.slice(0, 400) ||
          "Description is not available") + "..."
      }</p>
  `;
};

const addToCart = (playerId, playerName) => {
  if (cart.find((player) => player.id === playerId)) {
    alert("Player is already in the cart");
    return;
  }
  if (cart.length >= 11) {
    alert("You cannot add more than 11 players");
    return;
  }
  cart.push({ id: playerId, name: playerName });
  updateCart();
  const addToCartBtn = document.getElementById(`addToCartBtn${playerId}`);
  addToCartBtn.innerText = "Added To Cart";
  addToCartBtn.disabled = true;
};

const updateCart = () => {
  const cartContainer = document.getElementById("cart");
  cartContainer.innerHTML = `
    <h3 class="fs-2 fw-bold text-center mt-4">Cart</h3>
    <hr>
    <p class="fs-4 text-center">Total Player Added: ${cart.length}</p>
  `;
  cart.forEach((player, index) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center my-2">
        <span class="fw-bold">${index + 1}. ${player.name}</span>
        <button class="btn-close" onclick="removeFromCart(${
          player.id
        })"></button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });
};

const removeFromCart = (playerId) => {
  cart = cart.filter((player) => player.id !== playerId);
  updateCart();
  const addToCartBtn = document.getElementById(`addToCartBtn${playerId}`);
  if (addToCartBtn) {
    addToCartBtn.innerText = "Add to Cart";
    addToCartBtn.disabled = false;
  }
};

loadPlayers("danny");
