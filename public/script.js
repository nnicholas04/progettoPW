document.addEventListener("DOMContentLoaded", function() {  
  
    const navLinks = document.querySelectorAll('nav ul li a');  
    const currentPath = window.location.pathname;  
  
    for (let link of navLinks) {  
        const href = link.getAttribute('href');  
        link.classList.remove('active');  
  
        if (currentPath.includes("menu.html") && href.includes("menu.html")) {  
            link.classList.add('active');  
        } else if (currentPath.includes("contatti.html") && href.includes("contatti.html")) {  
            link.classList.add('active');  
        } else if ((currentPath.endsWith("index.html") || currentPath === "/" || currentPath.endsWith("trc/")) && href === "index.html") {  
            link.classList.add('active');  
        }  
    }  
  
    const prenotationForm = document.getElementById('prenotationForm');  
  
    if (prenotationForm) {  
        prenotationForm.addEventListener('submit', async (e) => {  
            e.preventDefault();   
  
            const btnSubmit = prenotationForm.querySelector('button[type="submit"]');
            const originalBtnText = btnSubmit.innerHTML;  
            btnSubmit.innerHTML = "Invio in corso..."; 
            btnSubmit.disabled = true;  
  
            const name = document.getElementById('name').value;  
            const phone = document.getElementById('phone').value;  
            const date = document.getElementById('date').value;  
            const time = document.getElementById('time').value;  
            const guests = document.getElementById('guests').value;  
            const message = document.getElementById('message').value;  
  
            const dateParts = date.split('-');  
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;  
  
            const prenotazioneData = {  
                nome: name,  
                telefono: phone,  
                data: formattedDate,  
                ora: time,  
                persone: parseInt(guests),  
                note: message || ""  
            };  
  
            try {  
                let response = await fetch('/api/prenotazioni', {  
                    method: 'POST',  
                    headers: {  
                        'Content-Type': 'application/json'  
                    },  
                    body: JSON.stringify(prenotazioneData)  
                });  
  
                if (!response.ok) {  
                    throw new Error(`Errore HTTP: ${response.status}`);  
                }  
  
                let result = await response.json();  
  
                alert("Prenotazione inviata con successo al pub! ID: " + result.id);  
                prenotationForm.reset();  
  
                const selectTime = document.getElementById('time');  
                if(selectTime) {  
                    selectTime.innerHTML = '<option value="" disabled selected>-- : --</option>';  
                    selectTime.disabled = true;  
                }  
  
            } catch (error) {  
                console.error("Errore durante l'invio:", error);  
                alert("Si è verificato un errore durante l'invio della prenotazione. Riprova.");  
            } finally {  
                btnSubmit.innerHTML = originalBtnText;  
                btnSubmit.disabled = false;  
            }  
        });  
    }  
  
    const dateInput = document.getElementById('date');  
    const selectTime = document.getElementById('time');  
  
    if (dateInput && selectTime) {  
        const timeSlots = [  
            "18:00", "18:15", "18:30", "18:45",  
            "19:00", "19:15", "19:30", "19:45",  
            "20:00", "20:15", "20:30", "20:45",  
            "21:00", "21:15", "21:30", "21:45",  
            "22:00", "22:15", "22:30", "22:45",  
            "23:00", "23:15", "23:30", "23:45",  
            "00:00", "00:15", "00:30", "00:45",  
            "01:00", "01:15", "01:30", "01:45", "02:00"  
        ];  
  
        const today = new Date();  
        const yyyy = today.getFullYear();  
        const mm = String(today.getMonth() + 1).padStart(2, '0');  
        const dd = String(today.getDate()).padStart(2, '0');  
        const todayString = `${yyyy}-${mm}-${dd}`;  
  
        dateInput.setAttribute('min', todayString);  
  
        function updateTimeOptions() {  
            if (!dateInput.value) {  
                selectTime.innerHTML = '<option value="" disabled selected>-- : --</option>';  
                selectTime.disabled = true;  
                return;  
            }  
  
            selectTime.disabled = false;  
            selectTime.innerHTML = '<option value="" disabled selected>Scegli l\'orario</option>';  
  
            const isToday = dateInput.value === todayString;  
            const now = new Date();  
  
            let currentH = now.getHours();  
            if (currentH >= 0 && currentH <= 5) currentH += 24;   
            const currentTotalMins = (currentH * 60) + now.getMinutes();  
  
            for (let time of timeSlots) {  
                let parts = time.split(':');  
                let h = Number(parts[0]);  
                let m = Number(parts[1]);  
  
                if (h >= 0 && h <= 5) h += 24;   
                const slotTotalMins = (h * 60) + m;  
  
                if (isToday && slotTotalMins <= currentTotalMins) {  
                    continue;  
                }  
  
                const option = document.createElement('option');  
                option.value = time;  
                option.textContent = time;  
                selectTime.appendChild(option);  
            }  
  
            if (selectTime.options.length === 1) {  
                selectTime.innerHTML = '<option value="" disabled selected>Nessun tavolo disponibile stasera</option>';  
            }  
        }  
  
        dateInput.addEventListener('change', function() {  
            if (this.value && this.value < todayString) {  
                alert("Non puoi prenotare per un giorno passato! La data è stata reimpostata a oggi.");  
                this.value = todayString;  
            }  
            updateTimeOptions();  
        });  
    }  
  
    async function caricaMenu() {  
        if (!window.location.pathname.includes("menu.html")) return;  
  
        const categorie = ["food", "sfiziosita", "birre", "cocktail", "liquori", "softdrink", "dessert"];  
  
        for (let cat of categorie) {  
            const grid = document.querySelector(`#${cat} .menu-grid`);  
            if (grid) {  
                grid.innerHTML = '<p style="color: var(--primary-color); grid-column: 1 / -1; text-align: center;">Caricamento menu in corso...</p>';  
            }  
        }  
  
        try {  
            const response = await fetch('/api/menu');  
  
            if (!response.ok) {  
                throw new Error(`Errore HTTP: ${response.status}`);  
            }  
  
            const menuData = await response.json();  
  
            for (let cat of categorie) {  
                const grid = document.querySelector(`#${cat} .menu-grid`);  
                if (grid) grid.innerHTML = '';   
            }  
  
            if (menuData.length === 0) {  
                document.querySelector('#food .menu-grid').innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Nessun prodotto disponibile al momento.</p>';  
                return;  
            }  
  
            for (let prodotto of menuData) {  
                const grid = document.querySelector(`#${prodotto.categoria} .menu-grid`);  
                if (!grid) continue;  
  
                const menuItem = document.createElement('div');  
                menuItem.className = 'menu-item'; 
  
                const haVarianti = prodotto.prezzo && prodotto.prezzo.includes('|');  
  
                let htmlContent = `  
                <div class="menu-item-header">  
                    <h3>${prodotto.nome}</h3>  
                    ${(!haVarianti && prodotto.prezzo !== "-") ? `<span class="price">${prodotto.prezzo}</span>` : ""}  
                </div>  
                `;  
  
                if (prodotto.descrizione) {  
                    htmlContent += `<p>${prodotto.descrizione}</p>`;  
                }  
  
                if (haVarianti) {  
                    const varianti = prodotto.prezzo.split('|');  
                    htmlContent += `<div class="price-variants">`;  
  
                    for (let v of varianti) {  
                        htmlContent += `<span>${v.trim()}</span>`;  
                    }  
  
                    htmlContent += `</div>`;  
                }  
  
                menuItem.innerHTML = htmlContent;  
                grid.appendChild(menuItem);  
            }  
  
        } catch (error) {  
            console.error("Errore durante il caricamento del menu:", error);  
  
            for (let cat of categorie) {  
                const grid = document.querySelector(`#${cat} .menu-grid`);  
                if (grid) {  
                    grid.innerHTML = '<p style="color: var(--accent-color); grid-column: 1 / -1; text-align: center;">Impossibile caricare i dati. Controlla la connessione al server.</p>';  
                }  
            }  
        }  
    }  
  
    caricaMenu();  
  
});