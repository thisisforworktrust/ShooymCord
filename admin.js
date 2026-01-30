// --- ADMIN HANDLER ---
// This function handles commands sent via type: 'admin-cmd'

function handleAdminData(data) {
    console.log("ADMIN CMD:", data.action);

    // 1. Broadcast if Host (so all clients get the command)
    if (typeof myRole !== 'undefined' && myRole === 'host') {
        broadcast(data);
    }

    // 2. Execute Local Action
    if (data.action === 'wipe') {
        // Clear global history variables
        if (typeof messageHistory !== 'undefined') messageHistory = [];
        if (typeof processedIds !== 'undefined') processedIds.clear();

        localStorage.removeItem(STORAGE_KEY);
        document.getElementById('chat-feed').innerHTML = '';

        const note = document.createElement('div');
        note.style.cssText = "color: #fa777c; text-align: center; padding: 10px; border: 1px dashed #fa777c; margin: 10px;";
        note.innerText = "⚠️ CHAT HISTORY WIPED BY ADMIN ⚠️";
        document.getElementById('chat-feed').appendChild(note);
    } 
    else if (data.action === 'alert') {
        setTimeout(() => {
            alert("📢 SYSTEM ALERT:\n\n" + data.payload);
        }, 50);
    } 
    else if (data.action === 'force-refresh') {
        location.reload();
    } 
    else if (data.action === 'lock') {
        isLocked = true;
        updateInputState();
    } 
    else if (data.action === 'unlock') {
        isLocked = false;
        updateInputState();
    } 
    else if (data.action === 'announce') {
        // Create a fake "System" message in the chat
        const sysMsg = {
            id: Date.now() + "sys",
            user: "SYSTEM",
            pfp: "https://ui-avatars.com/api/?name=SYS&background=fa777c&color=fff",
            msg: "📢 " + data.payload,
            type: 'text',
            timestamp: Date.now()
        };
        processIncomingData(sysMsg);
    } 
    else if (data.action === 'kick') {
        // Check if my name matches the kicked user
        if (myName.toLowerCase().trim() === data.payload.toLowerCase().trim()) {
            document.body.innerHTML = "<div style='display:flex;justify-content:center;align-items:center;height:100vh;background:black;color:red;'><h1>🚫 YOU HAVE BEEN KICKED 🚫</h1></div>";
            if (peer) peer.destroy();
            // Close window after 2 seconds
            setTimeout(() => window.close(), 2000);
        }
    } 
    else if (data.action === 'slowmode-on') {
        const feed = document.getElementById('chat-feed');
        const div = document.createElement('div');
        div.style.cssText = "color: #faa61a; text-align: center; font-size: 0.8rem; padding: 5px; background: #222; margin: 5px 0;";
        div.innerText = "☃ snowman";
        feed.appendChild(div);
    } // <--- This closing brace was missing in your original code
    else if (data.action === 'slowmode-off') {
        const feed = document.getElementById('chat-feed');
        const div = document.createElement('div');

        div.style.cssText = `
            text-align: center;
            padding: 6px;
            background: #222;
            margin: 5px 0;
            border-radius: 6px;
        `;

        const img = document.createElement('img');
        img.src = "https://www.peanutbutter.com/wp-content/uploads/Web_2400_Recipe_Peanut-Butter-and-Jelly-Sandwich.jpg";
        img.style.maxWidth = "220px";
        img.style.borderRadius = "6px";
        img.style.display = "block";
        img.style.margin = "0 auto";

        div.appendChild(img);
        feed.appendChild(div);
    }
}
