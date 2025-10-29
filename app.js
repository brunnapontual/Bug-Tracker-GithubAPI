async function searchBugs(repoOrQuery) {
  const queryInput = document.getElementById("searchInput");
  const query = repoOrQuery || queryInput.value.trim();

  if (!query) return alert("Digite uma tecnologia ou repositório!");

  let url;
  if (query.includes("/")) {
    url = `https://api.github.com/repos/${query}/issues?state=open`;
  } else {
    url = `https://api.github.com/search/issues?q=${query}+is:issue+is:open`;
  }

  const res = await fetch(url);
  const data = await res.json();
  const results = document.getElementById("results");
  results.innerHTML = "";

  const issues = data.items || data; 
  if (issues && issues.length > 0) {
    issues.slice(0, 9).forEach(issue => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3><a href="${issue.html_url}" target="_blank">${issue.title}</a></h3>
        <small><i class="fa-regular fa-calendar"></i> ${new Date(issue.created_at).toLocaleDateString('pt-BR')}</small>
        <small><i class="fa-solid fa-link"></i> ${issue.repository_url?.split("/").slice(-2).join("/") || query}</small>`;
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

let qrScanner;
document.getElementById("cameraBtn").addEventListener("click", async () => {
  const qrReader = document.getElementById("qrReader");
  qrReader.style.display = "block";

  const { default: QrScanner } = await import("./qr-scanner.min.js");
  const videoElem = document.getElementById("qrVideo");

  qrScanner = new QrScanner(
    videoElem,
    result => {
      qrScanner.stop();
      qrReader.style.display = "none";

      const repoUrl = result.data.trim();
      const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
      if (match) {
        const repo = match[1];
        document.getElementById("searchInput").value = repo;
        searchBugs(repo);
      } else {
        alert("QR inválido! Certifique-se de que é um link de repositório GitHub.");
      }
    },
    { returnDetailedScanResult: true }
  );

  qrScanner.start();
});
document.getElementById("closeCameraBtn").addEventListener("click", () => {
  if (qrScanner) {
    qrScanner.stop();
  }
  document.getElementById("qrReader").style.display = "none";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("Service Worker registrado com sucesso."))
      .catch(err => console.error("Erro ao registrar o Service Worker:", err));
  });
}
