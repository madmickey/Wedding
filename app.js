
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
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2027.0031660466886!2d151.27662948089258!3d-33.89088762855951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ad9e9cdaac29%3A0x554f9a56986a76be!2sBondi%20Surf%20Bathers&#39;%20Life%20Saving%20Club!5e0!3m2!1sen!2sau!4v1779335351013!5m2!1sen!2sau" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  </iframe>
`;