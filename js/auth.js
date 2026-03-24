// js/auth.js

// ==========================================
// 1. SUPABASE INITIALIZATION (Dev 1: Edit this!)
// Get these from Supabase Dashboard -> Project Settings -> API
// ==========================================
const SUPABASE_URL = 'https://zkbshaktsiecanyindfy.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprYnNoYWt0c2llY2FueWluZGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjUwMDMsImV4cCI6MjA4OTk0MTAwM30.MClnGfvTr_IAf2gAO2lv817OFrjVjZ2PSY2DZCoYgRY';

// Initialize the Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 2. LOGIN LOGIC (Runs on index.html)
// ==========================================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // CRITICAL: Stops the page from refreshing!

        // Grab the input values from the HTML
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        // Hide previous errors and show a Bootstrap loading spinner
        errorDiv.classList.add('d-none');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Logging in...';
        submitBtn.disabled = true;

        // Ask Supabase to log the user in
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        // Restore button back to normal
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        if (error) {
            // Show the error on the screen
            errorDiv.textContent = "Error: " + error.message;
            errorDiv.classList.remove('d-none');
        } else {
            // Success! Send them to the dashboard.
            // Note: Later, you can add logic here to check if they are a prof or student to send them to the right page.
            window.location.href = 'student-dashboard.html';
        }
    });
}

// ==========================================
// 3. LOGOUT LOGIC (Runs on Dashboard pages)
// ==========================================
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Tell Supabase to end the session
        const { error } = await supabase.auth.signOut();
        
        if (!error) {
            window.location.href = 'index.html'; // Kick them back to login
        } else {
            alert('Error logging out: ' + error.message);
        }
    });
}

// ==========================================
// 4. ROUTE PROTECTION (Runs on every page)
// ==========================================
async function checkSession() {
    // Check if the user is currently logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    // Check if the current page is the login page
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
    
    if (!session && !isLoginPage) {
        // Intruder alert! They are not logged in but trying to view a dashboard.
        window.location.href = 'index.html';
    } else if (session && isLoginPage) {
        // They are already logged in, but trying to view the login page.
        window.location.href = 'student-dashboard.html';
    }
}

// Run the security check immediately when the script loads
checkSession();