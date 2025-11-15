// Section switching
function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = "none");
    document.getElementById(id).style.display = "block";
}

// Chatbot functions
function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (text === "") return;

    addMessage(text, "user");

    setTimeout(() => {
        addMessage("Thanks! AI coming soon...", "bot");
    }, 500);

    input.value = "";
}

function addMessage(text, sender) {
    const chatbox = document.getElementById("chatbox");
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = text;

    chatbox.appendChild(msg);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// FAQ toggle
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        answer.style.display = (answer.style.display === 'block') ? 'none' : 'block';
    });
});

// Load news feed from API (replace YOUR_API_KEY with real key)
async function loadNews() {
    const newsFeed = document.getElementById('news-feed');
    newsFeed.innerHTML = "Loading news...";

    try {
        const response = await fetch('https://newsapi.org/v2/everything?q=cybersecurity&apiKey=YOUR_API_KEY');
        const data = await response.json();

        newsFeed.innerHTML = '';
        data.articles.forEach(article => {
            const li = document.createElement('li');
            li.innerText = article.title;
            li.addEventListener('click', () => {
                window.open(article.url, '_blank');
            });
            newsFeed.appendChild(li);
        });
    } catch (err) {
        newsFeed.innerHTML = "Failed to load news.";
        console.error(err);
    }

    // Set dashboard src (replace with your KNIME dashboard URL)
    document.getElementById('dashboard-frame').src = "path-to-knime-dashboard.html";
}

// Load news when News button is clicked
document.querySelector('.menu-btn[onclick="showSection(\'news\')"]').addEventListener('click', loadNews);


