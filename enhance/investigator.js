// ========================================
// INVESTIGATOR PANEL - JavaScript
// ========================================

let allCases = [];
let filteredCases = [];

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadCases();
    updateDashboard();
});

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
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Load section-specific data
    if (sectionId === 'cases') {
        displayAllCases();
    }
}

// ========================================
// LOAD CASES
// ========================================

function loadCases() {
    // Load from localStorage
    const stored = localStorage.getItem('cybershield_reports');
    if (stored) {
        allCases = JSON.parse(stored);
        filteredCases = [...allCases];
    } else {
        // Sample data for demonstration
        allCases = generateSampleCases();
        filteredCases = [...allCases];
    }
}

function generateSampleCases() {
    return [
        {
            caseNumber: 'CR-2025-0001',
            crimeType: 'phishing',
            incidentDate: '2025-11-14',
            platform: 'Email',
            description: 'Received fake banking email requesting password reset',
            status: 'New',
            priority: 'High',
            submittedAt: new Date('2025-11-14T10:30:00').toISOString(),
            reporterEmail: 'user1@example.com',
            anonymous: false
        },
        {
            caseNumber: 'CR-2025-0002',
            crimeType: 'hacking',
            incidentDate: '2025-11-13',
            platform: 'Instagram',
            description: 'Social media account hacked, unauthorized posts made',
            status: 'Investigating',
            priority: 'High',
            submittedAt: new Date('2025-11-13T15:45:00').toISOString(),
            assignedTo: 'INV-001',
            reporterEmail: 'user2@example.com',
            anonymous: false
        },
        {
            caseNumber: 'CR-2025-0003',
            crimeType: 'scam',
            incidentDate: '2025-11-12',
            platform: 'WhatsApp',
            description: 'Received messages claiming lottery winnings, requesting payment',
            status: 'Resolved',
            priority: 'Medium',
            submittedAt: new Date('2025-11-12T09:15:00').toISOString(),
            resolvedAt: new Date('2025-11-14T16:00:00').toISOString(),
            reporterEmail: 'user3@example.com',
            anonymous: false
        }
    ];
}

// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {
    const newCases = allCases.filter(c => c.status === 'New').length;
    const activeCases = allCases.filter(c => c.status === 'Investigating').length;
    const resolvedCases = allCases.filter(c => c.status === 'Resolved').length;
    const highPriority = allCases.filter(c => c.priority === 'High').length;
    
    document.getElementById('newCases').textContent = newCases;
    document.getElementById('activeCases').textContent = activeCases;
    document.getElementById('resolvedCases').textContent = resolvedCases;
    document.getElementById('highPriority').textContent = highPriority;
    
    displayRecentCases();
    displayCrimeTypeChart();
}

function displayRecentCases() {
    const container = document.getElementById('recentCasesList');
    
    if (allCases.length === 0) {
        container.innerHTML = '<p class="no-data">No cases to display</p>';
        return;
    }
    
    // Get 5 most recent cases
    const recent = [...allCases]
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 5);
    
    container.innerHTML = recent.map(caseData => `
        <div class="case-row" onclick="viewCaseDetail('${caseData.caseNumber}')">
            <div class="case-number">${caseData.caseNumber}</div>
            <div class="case-type">${formatCrimeType(caseData.crimeType)}</div>
            <div class="case-date">${formatDate(caseData.submittedAt)}</div>
            <div class="case-priority ${caseData.priority.toLowerCase()}">${caseData.priority}</div>
            <div class="case-status ${caseData.status.toLowerCase()}">${caseData.status}</div>
        </div>
    `).join('');
}

function displayCrimeTypeChart() {
    const chartContainer = document.getElementById('crimeTypeChart');
    
    // Count crime types
    const typeCounts = {};
    allCases.forEach(c => {
        typeCounts[c.crimeType] = (typeCounts[c.crimeType] || 0) + 1;
    });
    
    if (Object.keys(typeCounts).length === 0) {
        chartContainer.innerHTML = '<p class="no-data">No data to display</p>';
        return;
    }
    
    // Create simple bar chart
    const maxCount = Math.max(...Object.values(typeCounts));
    
    chartContainer.innerHTML = Object.entries(typeCounts)
        .map(([type, count]) => {
            const percentage = (count / maxCount) * 100;
            return `
                <div style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--text-secondary);">${formatCrimeType(type)}</span>
                        <span style="color: var(--text-primary); font-weight: 600;">${count}</span>
                    </div>
                    <div style="background: var(--bg-dark); height: 12px; border-radius: 6px; overflow: hidden;">
                        <div style="background: var(--primary-color); height: 100%; width: ${percentage}%; transition: width 0.5s ease;"></div>
                    </div>
                </div>
            `;
        })
        .join('');
}

// ========================================
// ALL CASES
// ========================================

function displayAllCases() {
    const container = document.getElementById('casesList');
    
    if (filteredCases.length === 0) {
        container.innerHTML = '<p class="no-data">No cases match your filters</p>';
        return;
    }
    
    container.innerHTML = filteredCases.map(caseData => `
        <div class="case-card" onclick="viewCaseDetail('${caseData.caseNumber}')">
            <div class="case-card-header">
                <h4>${caseData.caseNumber}</h4>
                <div class="case-status ${caseData.status.toLowerCase()}">${caseData.status}</div>
            </div>
            <div class="case-card-body">
                <p><strong>Type:</strong> ${formatCrimeType(caseData.crimeType)}</p>
                <p><strong>Platform:</strong> ${caseData.platform || 'Not specified'}</p>
                <p><strong>Date:</strong> ${caseData.incidentDate}</p>
                <p style="margin-top: 12px; color: var(--text-muted);">
                    ${caseData.description.substring(0, 100)}${caseData.description.length > 100 ? '...' : ''}
                </p>
            </div>
            <div class="case-card-footer">
                <div class="case-priority ${caseData.priority.toLowerCase()}">${caseData.priority} Priority</div>
                <small style="color: var(--text-muted);">${formatDate(caseData.submittedAt)}</small>
            </div>
        </div>
    `).join('');
}

// ========================================
// FILTERS
// ========================================

function filterCases() {
    const statusFilter = document.getElementById('filterStatus').value;
    const typeFilter = document.getElementById('filterCrimeType').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    const searchQuery = document.getElementById('searchCase').value.toLowerCase();
    
    filteredCases = allCases.filter(caseData => {
        const matchesStatus = statusFilter === 'all' || caseData.status === statusFilter;
        const matchesType = typeFilter === 'all' || caseData.crimeType === typeFilter;
        const matchesPriority = priorityFilter === 'all' || caseData.priority === priorityFilter;
        const matchesSearch = searchQuery === '' || caseData.caseNumber.toLowerCase().includes(searchQuery);
        
        return matchesStatus && matchesType && matchesPriority && matchesSearch;
    });
    
    displayAllCases();
}

// ========================================
// CASE DETAIL MODAL
// ========================================

function viewCaseDetail(caseNumber) {
    const caseData = allCases.find(c => c.caseNumber === caseNumber);
    
    if (!caseData) {
        alert('Case not found');
        return;
    }
    
    const modal = document.getElementById('caseDetailModal');
    const content = document.getElementById('caseDetailContent');
    
    content.innerHTML = `
        <div class="detail-section">
            <h3>Case Information</h3>
            <div class="detail-grid">
                <div class="detail-label">Case Number:</div>
                <div class="detail-value"><strong>${caseData.caseNumber}</strong></div>
                
                <div class="detail-label">Status:</div>
                <div class="detail-value">
                    <span class="case-status ${caseData.status.toLowerCase()}">${caseData.status}</span>
                </div>
                
                <div class="detail-label">Priority:</div>
                <div class="detail-value">
                    <span class="case-priority ${caseData.priority.toLowerCase()}">${caseData.priority}</span>
                </div>
                
                <div class="detail-label">Crime Type:</div>
                <div class="detail-value">${formatCrimeType(caseData.crimeType)}</div>
                
                <div class="detail-label">Platform:</div>
                <div class="detail-value">${caseData.platform || 'Not specified'}</div>
                
                <div class="detail-label">Incident Date:</div>
                <div class="detail-value">${caseData.incidentDate} ${caseData.incidentTime || ''}</div>
                
                <div class="detail-label">Submitted:</div>
                <div class="detail-value">${formatDate(caseData.submittedAt)}</div>
                
                <div class="detail-label">Assigned To:</div>
                <div class="detail-value">${caseData.assignedTo || 'Not assigned'}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Description</h3>
            <p style="color: var(--text-secondary); line-height: 1.8;">${caseData.description}</p>
        </div>
        
        ${caseData.files && caseData.files.length > 0 ? `
            <div class="detail-section">
                <h3>Evidence Files</h3>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    ${caseData.files.map(file => `
                        <div style="padding: 12px; background: var(--bg-dark); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                            📄 ${file}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        ${!caseData.anonymous ? `
            <div class="detail-section">
                <h3>Reporter Information</h3>
                <div class="detail-grid">
                    <div class="detail-label">Name:</div>
                    <div class="detail-value">${caseData.reporterName || 'Not provided'}</div>
                    
                    <div class="detail-label">Email:</div>
                    <div class="detail-value">${caseData.reporterEmail || 'Not provided'}</div>
                    
                    <div class="detail-label">Phone:</div>
                    <div class="detail-value">${caseData.reporterPhone || 'Not provided'}</div>
                </div>
            </div>
        ` : '<p style="color: var(--text-muted); font-style: italic;">Anonymous report</p>'}
        
        <div class="action-buttons">
            ${caseData.status === 'New' ? `
                <button class="btn btn-primary" onclick="assignCase('${caseData.caseNumber}')">
                    Assign to Me
                </button>
                <button class="btn btn-primary" onclick="updateCaseStatus('${caseData.caseNumber}', 'Investigating')">
                    Start Investigation
                </button>
            ` : ''}
            
            ${caseData.status === 'Investigating' ? `
                <button class="btn btn-success" onclick="updateCaseStatus('${caseData.caseNumber}', 'Resolved')">
                    Mark as Resolved
                </button>
            ` : ''}
            
            ${caseData.status === 'Resolved' ? `
                <button class="btn btn-primary" onclick="updateCaseStatus('${caseData.caseNumber}', 'Closed')">
                    Close Case
                </button>
            ` : ''}
            
            <button class="btn btn-danger" onclick="updateCasePriority('${caseData.caseNumber}')">
                Change Priority
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('caseDetailModal').classList.remove('active');
}

// Close modal on background click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('caseDetailModal');
    if (e.target === modal) {
        closeModal();
    }
});

// ========================================
// CASE ACTIONS
// ========================================

function assignCase(caseNumber) {
    const caseData = allCases.find(c => c.caseNumber === caseNumber);
    if (caseData) {
        caseData.assignedTo = 'INV-001';
        saveCases();
        alert('Case assigned to you successfully');
        closeModal();
        updateDashboard();
    }
}

function updateCaseStatus(caseNumber, newStatus) {
    const caseData = allCases.find(c => c.caseNumber === caseNumber);
    if (caseData) {
        caseData.status = newStatus;
        caseData.updatedAt = new Date().toISOString();
        
        if (newStatus === 'Resolved') {
            caseData.resolvedAt = new Date().toISOString();
        }
        
        saveCases();
        alert(`Case status updated to: ${newStatus}`);
        closeModal();
        updateDashboard();
        displayAllCases();
    }
}

function updateCasePriority(caseNumber) {
    const caseData = allCases.find(c => c.caseNumber === caseNumber);
    if (caseData) {
        const priorities = ['Low', 'Medium', 'High'];
        const currentIndex = priorities.indexOf(caseData.priority);
        const newIndex = (currentIndex + 1) % priorities.length;
        
        caseData.priority = priorities[newIndex];
        saveCases();
        alert(`Priority changed to: ${caseData.priority}`);
        closeModal();
        updateDashboard();
        displayAllCases();
    }
}

function saveCases() {
    localStorage.setItem('cybershield_reports', JSON.stringify(allCases));
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

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
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}
