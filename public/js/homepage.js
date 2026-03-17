// ======================
// INIT
// ======================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    zIndex: "9999",
    background: "#1f2937",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    opacity: "0",
    transform: "translateY(8px)",
    transition: "all 0.2s ease",
    fontSize: "14px",
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 220);
  }, 2200);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  const form = document.querySelector("#search-form");

  form.addEventListener("submit", handleSearch);

  // ONE global click listener (event delegation)
  document.addEventListener("click", handleGlobalClick);

  document.getElementById("close-map").addEventListener("click", closeModal);
  document.getElementById("map-modal").addEventListener("click", (e) => {
    if (e.target.id === "map-modal") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}

function handleSearch(e) {
  e.preventDefault();

  const cityInput = document.querySelector("#city");
  const city = cityInput.value.trim();

  if (!city) {
    alert("Please enter a city");
    return;
  }

  window.location.href = `/citySearch/${encodeURIComponent(city)}`;
}

function handleGlobalClick(e) {
  const saveBtn = e.target.closest(".btn-save-brewery");
  const mapBtn = e.target.closest(".btn-map-brewery");

  if (saveBtn) {
    handleSave(saveBtn);
  }

  if (mapBtn) {
    handleMap(mapBtn);
  }
}

function handleSave(btn) {
  const originalLabel = btn.textContent;
  btn.disabled = true; // prevent multiple clicks
  btn.textContent = "Saving...";

  const brewery = {
    refid: btn.dataset.id,
    brewname: btn.dataset.name,
    address: btn.dataset.address || "",
    city: btn.dataset.city,
    state: btn.dataset.state,
    zipcode: btn.dataset.zip || "",
    phone: btn.dataset.phone || "",
    website: btn.dataset.website || "",
    latitude: btn.dataset.lat || "",
    longitude: btn.dataset.lng || "",
    remark: btn.dataset.type,
    comment: "",
    currentDate: new Date().toDateString(),
  };

  fetch("/api/breweries/addbrewery", {
    method: "POST",
    body: JSON.stringify(brewery),
    headers: { "Content-Type": "application/json" },
  })
    .then(async (res) => {
      if (res.ok) {
        btn.textContent = "Saved ✅";
        btn.classList.add("saved");
        btn.disabled = true;
        showToast("Brewery saved 🍺");
        return;
      }

      if (res.status === 401) {
        showToast("Please log in first");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
        return;
      }

      btn.disabled = false;
      btn.textContent = originalLabel;

      let message = "Already saved or error";
      try {
        const data = await res.json();
        if (data?.message) {
          message = data.message;
        }
      } catch (e) {
        // ignore invalid json
      }
      showToast(message);
    })
    .catch((err) => {
      console.error(err);
      btn.disabled = false;
      btn.textContent = originalLabel;
      showToast("Unable to save brewery right now");
    });
}

let modalMap;
let marker;

function handleMap(btn) {
  const name = btn.dataset.name;
  const lat = parseFloat(btn.dataset.lat);
  const lng = parseFloat(btn.dataset.lng);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    btn.disabled = true;
    showToast("Location not available");
    return;
  }

  const modal = document.getElementById("map-modal");
  modal.classList.remove("hidden");
  requestAnimationFrame(() => {
    modal.classList.add("active");
  });
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    if (!modalMap) {
      modalMap = L.map("modal-map").setView([lat, lng], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(modalMap);
    } else {
      modalMap.invalidateSize();
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) {
        modalMap.setView([lat, lng], 13);
      } else {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        modalMap.flyTo([lat, lng], 13, {
          animate: true,
          duration: isMobile ? 0.75 : 1.2,
        });
      }
    }

    if (marker) {
      modalMap.removeLayer(marker);
    }

    marker = L.marker([lat, lng]).addTo(modalMap).bindPopup(name).openPopup();
  }, 180);
}

function closeModal() {
  const modal = document.getElementById("map-modal");

  if (modal.classList.contains("hidden")) {
    return;
  }

  modal.classList.remove("active");

  const onTransitionEnd = () => {
    modal.classList.add("hidden");
    modal.removeEventListener("transitionend", onTransitionEnd);
  };

  modal.addEventListener("transitionend", onTransitionEnd);

  document.body.style.overflow = "";
}
