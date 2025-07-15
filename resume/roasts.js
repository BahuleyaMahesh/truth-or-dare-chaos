const roastLines = [
  "📄 ‘Hardworking and punctual’ — wow, you're just like every other applicant.",
  "🧠 'Team player' — did you write this or copy it from a LinkedIn influencer?",
  "🎯 ‘Proficient in Microsoft Word’ — welcome to 2005.",
  "🚩 GPA conveniently missing? Bold strategy.",
  "💀 Listing 'C' as a language? Just say you like pain.",
  "📉 Your resume summary is longer than your actual experience.",
  "🧃 'Self-starter' — but you needed ChatGPT to make this resume?",
  "🥴 Bullet points? More like *blank bullets*.",
  "⏳ Your work history has more gaps than a cheap WiFi signal.",
  "🔥 You wrote 'detail-oriented' and misspelled 'experience'.",
  "🤡 ‘Good communication skills’ — your font choice says otherwise.",
  "🤖 If this resume had a personality, it would be a paperclip.",
];

document.getElementById("pdfUpload").addEventListener("change", handlePDFUpload);

function handlePDFUpload(event) {
  const file = event.target.files[0];
  if (!file || file.type !== "application/pdf") {
    alert("Please upload a valid PDF file.");
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = function () {
    const typedarray = new Uint8Array(this.result);

    pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
      let totalText = "";

      const totalPages = pdf.numPages;
      let processedPages = 0;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        pdf.getPage(pageNum).then(function (page) {
          page.getTextContent().then(function (textContent) {
            const pageText = textContent.items.map(item => item.str).join(" ");
            totalText += pageText + "\n";
            processedPages++;

            if (processedPages === totalPages) {
              document.getElementById("resumeInput").value = totalText;
              roastResume(); // optional: auto-roast when PDF is loaded
            }
          });
        });
      }
    });
  };

  fileReader.readAsArrayBuffer(file);
}

function roastResume() {
  const input = document.getElementById("resumeInput").value.toLowerCase();
  const output = document.getElementById("roastOutput");

  if (input.trim() === "") {
    output.textContent = "Bro... paste *something* or upload a PDF first.";
    return;
  }

  const smartRoasts = [];

  // Keyword-based intelligent roasts
  if (input.includes("microsoft word") || input.includes("ms word")) {
    smartRoasts.push("🎯 'Proficient in Microsoft Word' — what is this, a time capsule?");
  }

  if (input.includes("team player")) {
    smartRoasts.push("🧠 'Team player' — that phrase belongs in HR bingo.");
  }

  if (input.includes("self-starter")) {
    smartRoasts.push("🧃 'Self-starter'? Then why'd you use ChatGPT to make this?");
  }

  if (input.includes("communication skills")) {
    smartRoasts.push("🗣️ 'Great communication skills' — yet this resume is screaming in Comic Sans.");
  }

  if (input.includes("c language") || input.includes("c programming")) {
    smartRoasts.push("💀 C language? Just admit you enjoy pain.");
  }

  if (input.includes("gpa") && input.includes("not") && input.includes("disclose")) {
    smartRoasts.push("🚩 GPA hidden? That's a plot twist right there.");
  }

  if (input.includes("motivated") || input.includes("detail-oriented")) {
    smartRoasts.push("📄 ‘Motivated and detail-oriented’ — the oldest lie in the book.");
  }

  // If no smart roasts triggered
  if (smartRoasts.length === 0) {
    smartRoasts.push("🤔 I looked... and still found nothing worth praising. Bold.");
    smartRoasts.push("📄 Your resume is so generic, even AI can’t find something to roast.");
  }

  // Fill up to 3 total roasts (if less than 3 so far)
  while (smartRoasts.length < 3) {
    const randRoast = roastLines[Math.floor(Math.random() * roastLines.length)];
    if (!smartRoasts.includes(randRoast)) {
      smartRoasts.push(randRoast);
    }
  }

  output.innerHTML = smartRoasts.join("\n\n");
}
