const chatBox = document.getElementById("chat-box");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(message) {
  appendMessage("user", message);
  input.value = "";

  const res = await fetch("http://127.0.0.1:5000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });
  const data = await res.json();

  appendMessage("bot", data.response);
  speak(data.response);
}

sendBtn.onclick = () => {
  const msg = input.value.trim();
  if (msg) sendMessage(msg);
};

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendBtn.click();
});

const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (recognition) {
  const recog = new recognition();
  recog.lang = "en-US";

  voiceBtn.onclick = () => {
    recog.start();
  };

  recog.onresult = e => {
    const msg = e.results[0][0].transcript;
    sendMessage(msg);
  };
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  synth.speak(utter);
}

// Greeting
window.onload = () => {
  const greet = "Hello, I’m Krypten — your AI assistant. Ready to chat or listen to you.";
  appendMessage("bot", greet);
  speak(greet);
};
