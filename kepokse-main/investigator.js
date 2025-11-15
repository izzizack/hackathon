// Section switching
function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = "none");
    document.getElementById(id).style.display = "block";

    if(id === 'news') loadNews();
}

// Sample user report data
const userReports = [
    {name: "Alice", report: "Phishing email received from fake bank site."},
    {name: "Bob", report: "Account hacked on social media, suspicious messages sent."},
    {name: "Charlie", report: "Received scam WhatsApp messages asking for money."}
];

// Populate user buttons
const userList = document.getElementById('user-list');
userReports.forEach((user, index) => {
    const btn = document.createElement('button');
    btn.classList.add('user-btn');
    btn.innerText = user.name;
    btn.addEventListener('click', () => showReportDetails(index));
    userList.appendChild(btn);
});

// Show report + chat
function showReportDetails(index) {
    const details = document.getElementById('report-details');
    details.innerHTML = `
        <h3>${userReports[index].name}</h3>
        <div id="report-text">
            <p>${userReports[index].report}</p>
        </div>

        <div id="chatbox">
            <!-- Messages appear here -->
        </div>

        <div id="message-area">
            <input type="text" id="investigatorMessage" placeholder="Type your message...">
            <button onclick="sendInvestigatorMessage(${index})">Send</button>
        </div>
    `;
}

// Send message to chatbox
function sendInvestigatorMessage(index) {
    const input = document.getElementById('investigatorMessage');
    const text = input.value.trim();
    if(text === "") return;

    const chatbox = document.getElementById('chatbox');

    const msg = document.createElement('div');
    msg.classList.add('message', 'investigator-msg');
    msg.innerText = text;
    chatbox.appendChild(msg);

    chatbox.scrollTop = chatbox.scrollHeight;
    input.value = "";
}

// Load news feed from API (replace YOUR_API_KEY)
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
            li.addEventListener('click', () => window.open(article.url, '_blank'));
            newsFeed.appendChild(li);
        });
    } catch (err) {
        newsFeed.innerHTML = "Failed to load news.";
        console.error(err);
    }

    // KNIME dashboard URL
    document.getElementById('dashboard-frame').src = "path-to-knime-dashboard.html";
}

// Initialize
loadNews();



