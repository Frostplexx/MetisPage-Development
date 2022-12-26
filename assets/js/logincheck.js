//when page loads check if there is a connection to the bot
window.onload = async function () {
    try {
        const response = await fetch("https://localhost:3000/online")
        if (response.status !== 200) {
            document.getElementById("no-connection-warn").classList.remove("hidden");
        } else {
            document.getElementById("no-connection-warn").classList.add("hidden");
        }
    } catch (e) {
        document.getElementById("no-connection-warn").classList.remove("hidden");
    }
};