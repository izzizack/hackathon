// ========================================
// CYBERSHIELD - Enhanced JavaScript
// ========================================

// Global state
let uploadedFiles = [];
let reports = [];

// ========================================
// NAVIGATION
// ========================================

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Remove active from all menu buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active to clicked button
    event.target.classList.add('active');
    
    // Load section-specific data
    if (sectionId === 'news') {
        loadNews();
        loadStats();
    }
}

// ========================================
// REPORT FORM HANDLING
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reportForm');
    const descriptionField = document.getElementById('description');
    const anonymousCheckbox = document.getElementById('anonymous');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('evidence');
    
    // Character counter
    if (descriptionField) {
        descriptionField.addEventListener('input', function() {
            const count = this.value.length;
            document.getElementById('charCount').textContent = count;
            
            // Auto-priority based on keywords
            updatePriority(this.value);
        });
    }
    
    // Anonymous checkbox handler
    if (anonymousCheckbox) {
        anonymousCheckbox.addEventListener('change', function() {
            const contactFields = ['reporterName', 'reporterEmail', 'reporterPhone'];
            contactFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.disabled = this.checked;
                    if (this.checked) field.value = '';
                }
            });
        });
    }
    
    // File upload handling
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-color)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            handleFiles(e.dataTransfer.files);
        });
        
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // FAQ toggles
    setupFAQ();
});

function updatePriority(text) {
    const urgentKeywords = ['hack', 'steal', 'money', 'bank', 'urgent', 'help', 'scam', 'fraud'];
    const priorityBox = document.getElementById('priorityBox');
    const priorityLevel = document.getElementById('priorityLevel');
    
    const lowerText = text.toLowerCase();
    const hasUrgent = urgentKeywords.some(keyword => lowerText.includes(keyword));
    
    if (hasUrgent) {
        priorityBox.style.display = 'block';
        priorityLevel.textContent = 'High';
        priorityLevel.style.color = '#ef4444';
    } else if (text.length > 100) {
        priorityBox.style.display = 'block';
        priorityLevel.textContent = 'Medium';
        priorityLevel.style.color = '#f59e0b';
    } else {
        priorityBox.style.display = 'none';
    }
}

function handleFiles(files) {
    const fileList = document.getElementById('fileList');
    
    Array.from(files).forEach(file => {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum size is 10MB.`);
            return;
        }
        
        uploadedFiles.push(file);
        
        // Create file item
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-item-name">📄 ${file.name} (${formatFileSize(file.size)})</span>
            <button type="button" class="file-item-remove" onclick="removeFile('${file.name}')">Remove</button>
        `;
        
        fileList.appendChild(fileItem);
    });
}

function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
    
    // Re-render file list
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    uploadedFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-item-name">📄 ${file.name} (${formatFileSize(file.size)})</span>
            <button type="button" class="file-item-remove" onclick="removeFile('${file.name}')">Remove</button>
        `;
        fileList.appendChild(fileItem);
    });
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Generate case number
    const caseNumber = generateCaseNumber();
    
    // Collect form data
    const reportData = {
        caseNumber: caseNumber,
        crimeType: document.getElementById('crimeType').value,
        incidentDate: document.getElementById('incidentDate').value,
        incidentTime: document.getElementById('incidentTime').value,
        platform: document.getElementById('platform').value,
        description: document.getElementById('description').value,
        reporterName: document.getElementById('reporterName').value,
        reporterEmail: document.getElementById('reporterEmail').value,
        reporterPhone: document.getElementById('reporterPhone').value,
        anonymous: document.getElementById('anonymous').checked,
        files: uploadedFiles.map(f => f.name),
        status: 'New',
        submittedAt: new Date().toISOString(),
        priority: determinePriority(document.getElementById('description').value)
    };
    
    // Store report (in real app, send to backend)
    reports.push(reportData);
    localStorage.setItem('cybershield_reports', JSON.stringify(reports));
    
    // Show success message
    document.getElementById('reportForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('caseNumber').textContent = caseNumber;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateCaseNumber() {
    const year = new Date().getFullYear();
    const number = String(reports.length + 1).padStart(4, '0');
    return `CR-${year}-${number}`;
}

function determinePriority(description) {
    const urgentKeywords = ['hack', 'steal', 'money', 'bank', 'urgent', 'help', 'scam', 'fraud'];
    const lowerText = description.toLowerCase();
    
    if (urgentKeywords.some(keyword => lowerText.includes(keyword))) {
        return 'High';
    } else if (description.length > 100) {
        return 'Medium';
    }
    return 'Low';
}

function resetForm() {
    document.getElementById('reportForm').reset();
    uploadedFiles = [];
    document.getElementById('fileList').innerHTML = '';
    document.getElementById('priorityBox').style.display = 'none';
    document.getElementById('charCount').textContent = '0';
}

function submitAnother() {
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('reportForm').style.display = 'block';
    resetForm();
}

// ========================================
// TRACK REPORT
// ========================================

function trackReport() {
    const trackingNumber = document.getElementById('trackingNumber').value.trim();
    
    if (!trackingNumber) {
        alert('Please enter a case number');
        return;
    }
    
    // Load reports from storage
    const storedReports = JSON.parse(localStorage.getItem('cybershield_reports') || '[]');
    const report = storedReports.find(r => r.caseNumber === trackingNumber);
    
    if (!report) {
        alert('Case not found. Please check your case number.');
        return;
    }
    
    // Display report details
    displayTrackingResult(report);
}

function displayTrackingResult(report) {
    const resultDiv = document.getElementById('trackingResult');
    
    // Update case details
    document.getElementById('trackCaseNumber').textContent = report.caseNumber;
    document.getElementById('trackCrimeType').textContent = formatCrimeType(report.crimeType);
    document.getElementById('trackDate').textContent = formatDate(report.submittedAt);
    document.getElementById('trackInvestigator').textContent = report.assignedTo || 'Not assigned yet';
    
    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = report.status;
    statusBadge.className = 'status-badge ' + report.status.toLowerCase();
    
    // Update timeline
    document.getElementById('timeline1').textContent = formatDate(report.submittedAt);
    
    if (report.status === 'Investigating' || report.status === 'Resolved') {
        document.getElementById('timelineStep2').classList.add('active');
        document.getElementById('timeline2').textContent = formatDate(report.updatedAt || report.submittedAt);
    }
    
    if (report.status === 'Resolved') {
        document.getElementById('timelineStep3').classList.add('active');
        document.getElementById('timeline3').textContent = formatDate(report.resolvedAt || report.updatedAt || report.submittedAt);
    }
    
    resultDiv.style.display = 'block';
}

function formatCrimeType(type) {
    const types = {
        'phishing': 'Phishing / Fake Emails',
        'hacking': 'Account Hacking',
        'scam': 'Online Scam / Fraud',
        'identity-theft': 'Identity Theft',
        'cyberbullying': 'Cyberbullying / Harassment',
        'malware': 'Malware / Ransomware',
        'financial-fraud': 'Financial Fraud',
        'data-breach': 'Data Breach',
        'other': 'Other'
    };
    return types[type] || type;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// ========================================
// CHATBOT
// ========================================

function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    
    if (text === '') return;
    
    // Add user message
    addMessage(text, 'user');
    input.value = '';
    
    // Generate bot response
    setTimeout(() => {
        const response = generateBotResponse(text);
        addMessage(response, 'bot');
    }, 500);
}

function quickQuestion(question) {
    document.getElementById('userInput').value = question;
    sendMessage();
}

function addMessage(text, sender) {
    const chatbox = document.getElementById('chatbox');
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = text;
    
    msg.appendChild(content);
    chatbox.appendChild(msg);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function generateBotResponse(userMessage) {
    const lower = userMessage.toLowerCase();
    
    // Phishing
    if (lower.includes('phishing') || lower.includes('fake email')) {
        return `<strong>Phishing Protection Tips:</strong>
        <ul>
            <li>Never click suspicious links in emails</li>
            <li>Verify sender email addresses carefully</li>
            <li>Enable two-factor authentication</li>
            <li>Check website URLs before entering credentials</li>
            <li>Report phishing emails to your email provider</li>
        </ul>
        Would you like to report a phishing incident?`;
    }
    
    // Account hacked
    if (lower.includes('hack') || lower.includes('account') && lower.includes('hack')) {
        return `<strong>If Your Account is Hacked:</strong>
        <ol>
            <li>Change password immediately on a secure device</li>
            <li>Enable two-factor authentication</li>
            <li>Check for unauthorized access or changes</li>
            <li>Notify the platform's support team</li>
            <li>Scan devices for malware</li>
            <li>Report through our platform</li>
        </ol>
        I can help you file a report. Click "Report Crime" in the menu.`;
    }
    
    // How to report
    if (lower.includes('report') || lower.includes('how to')) {
        return `<strong>How to Report a Cybercrime:</strong>
        <ol>
            <li>Click "Report Crime" in the sidebar</li>
            <li>Select the type of cybercrime</li>
            <li>Provide date, time, and platform details</li>
            <li>Describe the incident in detail</li>
            <li>Upload evidence (screenshots, emails, etc.)</li>
            <li>Optionally provide contact information</li>
            <li>Submit and receive your case number</li>
        </ol>
        You can report anonymously if you prefer.`;
    }
    
    // Scam
    if (lower.includes('scam')) {
        return `<strong>Recognizing Online Scams:</strong>
        <ul>
            <li>Requests for money or personal information</li>
            <li>Too-good-to-be-true offers</li>
            <li>Pressure tactics ("act now!")</li>
            <li>Suspicious links or fake websites</li>
            <li>Impersonation of officials or companies</li>
        </ul>
        If you've encountered a scam, report it immediately to help protect others.`;
    }
    
    // Identity theft
    if (lower.includes('identity') || lower.includes('theft')) {
        return `<strong>Identity Theft Prevention:</strong>
        <ul>
            <li>Safeguard personal information</li>
            <li>Monitor bank accounts regularly</li>
            <li>Use strong, unique passwords</li>
            <li>Be cautious sharing information online</li>
            <li>Shred sensitive documents</li>
            <li>Enable fraud alerts with banks</li>
        </ul>
        If you suspect identity theft, report it immediately.`;
    }
    
    // General help
    if (lower.includes('help') || lower.includes('what can you do')) {
        return `I can assist you with:
        <ul>
            <li>🛡️ Information about different cybercrimes</li>
            <li>📝 Guidance on filing reports</li>
            <li>🔒 Cybersecurity best practices</li>
            <li>⚡ Immediate actions to take after an incident</li>
            <li>🔍 Tracking your report status</li>
        </ul>
        What would you like to know more about?`;
    }
    
    // Default response
    return `I understand you're asking about "${userMessage}". 
    
    For specific cybercrime assistance, I recommend:
    <ul>
        <li>Filing a detailed report using our "Report Crime" form</li>
        <li>Checking our FAQ section for more information</li>
        <li>Contacting local authorities if urgent</li>
    </ul>
    
    Is there a specific type of cybercrime I can help you understand?`;
}

// ========================================
// NEWS & STATS
// ========================================

function loadStats() {
    // Load from localStorage
    const storedReports = JSON.parse(localStorage.getItem('cybershield_reports') || '[]');
    
    const total = storedReports.length;
    const active = storedReports.filter(r => r.status === 'New' || r.status === 'Investigating').length;
    const resolved = storedReports.filter(r => r.status === 'Resolved').length;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    
    document.getElementById('totalReports').textContent = total;
    document.getElementById('activeReports').textContent = active;
    document.getElementById('resolvedReports').textContent = resolved;
    document.getElementById('resolutionRate').textContent = rate + '%';
}

async function loadNews() {
    const newsFeed = document.getElementById('news-feed');
    newsFeed.innerHTML = '<li>Loading latest cybersecurity news...</li>';
    
    // Sample news (in production, use real API)
    const sampleNews = [
        {
            title: "New Phishing Campaign Targets Online Banking Users",
            url: "#",
            source: "CyberSecurity Weekly"
        },
        {
            title: "Ransomware Attacks Increase by 30% in Q4 2024",
            url: "#",
            source: "Security Today"
        },
        {
            title: "Best Practices for Protecting Personal Data Online",
            url: "#",
            source: "Tech Guardian"
        },
        {
            title: "Social Media Scams: What to Watch Out For",
            url: "#",
            source: "Digital Safety News"
        },
        {
            title: "Two-Factor Authentication: Why It's Essential",
            url: "#",
            source: "InfoSec Insights"
        }
    ];
    
    newsFeed.innerHTML = '';
    sampleNews.forEach(article => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${article.title}</strong>
            <br><small style="color: var(--text-muted);">Source: ${article.source}</small>
        `;
        li.addEventListener('click', () => {
            alert('In production, this would open the news article.');
        });
        newsFeed.appendChild(li);
    });
    
    /* 
    // Real API implementation (replace YOUR_API_KEY)
    try {
        const response = await fetch('https://newsapi.org/v2/everything?q=cybersecurity&apiKey=YOUR_API_KEY&pageSize=10');
        const data = await response.json();
        
        newsFeed.innerHTML = '';
        data.articles.forEach(article => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${article.title}</strong>
                <br><small style="color: var(--text-muted);">Source: ${article.source.name}</small>
            `;
            li.addEventListener('click', () => window.open(article.url, '_blank'));
            newsFeed.appendChild(li);
        });
    } catch (err) {
        newsFeed.innerHTML = '<li>Failed to load news. Please try again later.</li>';
        console.error(err);
    }
    */
}

// ========================================
// FAQ
// ========================================

function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked FAQ if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// ========================================
// INITIALIZATION
// ========================================

// Load reports from localStorage on startup
document.addEventListener('DOMContentLoaded', function() {
    const stored = localStorage.getItem('cybershield_reports');
    if (stored) {
        reports = JSON.parse(stored);
    }
});
