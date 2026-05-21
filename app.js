// RSVP
document.getElementById("rsvpForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    attendance: document.getElementById("attendance").value,
    message: document.getElementById("message").value
  };

  try {
    await fetch(CONFIG.rsvpEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    document.getElementById("rsvpStatus").innerText = "Thanks for your RSVP!";
  } catch (err) {
    document.getElementById("rsvpStatus").innerText = "Error sending RSVP.";
  }
});

// Photo wall (local only)
const photoGrid = document.getElementById("photoGrid");
const upload = document.getElementById("photoUpload");

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const img = document.createElement("img");
    img.src = reader.result;
    photoGrid.appendChild(img);

    const existing = JSON.parse(localStorage.getItem("photos") || "[]");
    existing.push(reader.result);
    localStorage.setItem("photos", JSON.stringify(existing));
  };

  reader.readAsDataURL(file);
});

// Load saved photos
window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("photos") || "[]");
  saved.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    photoGrid.appendChild(img);
  });
});

// Simple map (Google embed fallback)
document.getElementById("map").innerHTML = `
  <iframe
    width="100%"
    height="300"
    style="border:0"
    loading="lazy"
    allowfullscreen
    src="https://www.google.com/maps?q=${CONFIG.venue.lat},${CONFIG.venue.lng}&output=embed">
  </iframe>
`;