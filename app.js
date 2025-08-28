async function searchBugs() {
  const query = document.getElementById("searchInput").value;
  if (!query) return alert("Digite uma tecnologia!");

  const url = `https://api.github.com/search/issues?q=${query}+is:issue+is:open`;

  const res = await fetch(url);
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  if (data.items && data.items.length > 0) {
    data.items.slice(0, 9).forEach(issue => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3><a href="${issue.html_url}" target="_blank">${issue.title}</a></h3>
        <small><i class="fa-regular fa-calendar"></i> ${new Date(issue.created_at).toLocaleDateString('pt-BR')}</small>
        <small><i class="fa-solid fa-link"></i> ${issue.repository_url.split("/").slice(-2).join("/")}</small>`;
      results.appendChild(card);
    });
  } else {
    results.innerHTML = "<p>Nenhum bug encontrado.</p>";
  }
}

function setSearch(term) {
  document.getElementById("searchInput").value = term;
  searchBugs();
}
