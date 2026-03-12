document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initTheme();
    initUser();
    initTimer();
    initTasks();
    initLinks();
});

// 1. JAM, TANGGAL, & SAPAAN
function initClock() {
    const timeEl = document.getElementById('current-time');
    const dateEl = document.getElementById('current-date');
    const greetingEl = document.getElementById('greeting-text');

    const update = () => {
        const now = new Date();
        // Jam:Menit:Detik
        timeEl.textContent = now.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        // Hari, Tanggal Bulan Tahun
        dateEl.textContent = now.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        
        const hrs = now.getHours();
        let greet = hrs < 12 ? 'Selamat Pagi,' : hrs < 15 ? 'Selamat Siang,' : hrs < 18 ? 'Selamat Sore,' : 'Selamat Malam,';
        greetingEl.textContent = greet;
    };
    setInterval(update, 1000); 
    update();
}

// 2. TEMA & WARNA AKSEN
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const accentPicker = document.getElementById('accent-picker');
    const root = document.documentElement;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeBtn.querySelector('i').className = 'fas fa-sun';
        } else {
            document.body.removeAttribute('data-theme');
            themeBtn.querySelector('i').className = 'fas fa-moon';
        }
    };

    applyTheme(localStorage.getItem('ios_theme') || 'light');

    themeBtn.onclick = () => {
        const newTheme = document.body.hasAttribute('data-theme') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('ios_theme', newTheme);
    };

    const savedAccent = localStorage.getItem('ios_accent') || '#007AFF';
    root.style.setProperty('--accent-color', savedAccent);
    accentPicker.value = savedAccent;

    accentPicker.oninput = (e) => {
        root.style.setProperty('--accent-color', e.target.value);
        localStorage.setItem('ios_accent', e.target.value);
    };
}

// 3. TIMER FOKUS
function initTimer() {
    let timeLeft = 25 * 60;
    let timerId = null;

    const updateDisplay = () => {
        document.getElementById('timer-minutes').textContent = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        document.getElementById('timer-seconds').textContent = String(timeLeft % 60).padStart(2, '0');
    };

    document.getElementById('start-timer').onclick = () => {
        if (timerId) return;
        timerId = setInterval(() => { 
            if (timeLeft > 0) { timeLeft--; updateDisplay(); } 
            else { clearInterval(timerId); alert('Waktu Fokus Selesai!'); }
        }, 1000);
    };

    document.getElementById('pause-timer').onclick = () => { clearInterval(timerId); timerId = null; };

    document.getElementById('reset-timer').onclick = () => {
        clearInterval(timerId);
        timerId = null;
        timeLeft = document.getElementById('timer-duration').value * 60;
        updateDisplay();
    };

    document.getElementById('apply-timer').onclick = () => {
        timeLeft = document.getElementById('timer-duration').value * 60;
        updateDisplay();
    };
}

// 4. USER, TASKS, & LINKS  
function initUser() {
    const input = document.getElementById('user-name');
    input.value = localStorage.getItem('ios_user') || '';
    input.oninput = (e) => localStorage.setItem('ios_user', e.target.value);
}

function initTasks() {
    const form = document.getElementById('task-form');
    const container = document.getElementById('tasks-container');
    let tasks = JSON.parse(localStorage.getItem('ios_tasks')) || [];
    
    const render = () => {
        container.innerHTML = tasks.map((t, i) => `
            <li style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--input-bg);">
                <span>${t}</span>
                <button onclick="delTask(${i})" style="background:none; border:none; color:red; cursor:pointer"><i class="fas fa-trash"></i></button>
            </li>`).join('');
    };

    window.delTask = (i) => { 
        tasks.splice(i, 1); 
        localStorage.setItem('ios_tasks', JSON.stringify(tasks)); 
        render(); 
    };

    form.onsubmit = (e) => {
        e.preventDefault();
        const val = document.getElementById('new-task').value.trim();
        
        // --- CEK DUPLIKASI DISINI ---
        if (tasks.includes(val)) {
            alert('Tugas ini sudah ada di daftar, Yank!');
            return;
        }

        if (val) { 
            tasks.push(val); 
            localStorage.setItem('ios_tasks', JSON.stringify(tasks)); 
            render(); 
            e.target.reset(); 
        }
    };
    render();
}

function initLinks() {
    const form = document.getElementById('link-form');
    const container = document.getElementById('links-container');
    let links = JSON.parse(localStorage.getItem('ios_links')) || [];
    
    const render = () => {
        container.innerHTML = links.map((l, i) => `
            <div style="display:flex; justify-content:space-between; background:var(--input-bg); padding:10px; border-radius:10px; margin-bottom:8px;">
                <a href="${l.url}" target="_blank" style="color:var(--accent-color); text-decoration:none; font-weight:600;">${l.name}</a>
                <button onclick="delLink(${i})" style="background:none; border:none; color:var(--text-secondary); cursor:pointer"><i class="fas fa-times"></i></button>
            </div>`).join('');
    };

    window.delLink = (i) => { 
        links.splice(i, 1); 
        localStorage.setItem('ios_links', JSON.stringify(links)); 
        render(); 
    };

    form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('link-name').value.trim();
        let url = document.getElementById('link-url').value.trim();
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

        // --- CEK DUPLIKASI URL DISINI ---
        const isDuplicate = links.some(link => link.url.toLowerCase() === url.toLowerCase());
        if (isDuplicate) {
            alert('Tautan ini sudah kamu simpan sebelumnya!');
            return;
        }

        links.push({ name, url }); 
        localStorage.setItem('ios_links', JSON.stringify(links)); 
        render(); 
        e.target.reset();
    };
    render();
}