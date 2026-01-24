// Abortbutton.jsx
function Abortbutton({ sendCommand, commands }) {
    return (
        <button
            className="button"
            style={{
                marginTop: "20px",
                backgroundColor: "#8B0000",
                borderColor: "#FF0000",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                padding: "15px"
            }}
            onClick={() => {
                sendCommand(commands.ABRT);
            }}
        >
            🚨 ABORT 🚨
        </button>
    );
}

export default Abortbutton;