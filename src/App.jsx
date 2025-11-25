import { useEffect, useRef, useState } from "react";
import Databox from "./Databox";
import chroma from "chroma-js";
import "./App.css";
import Plumbing from "./Plumbing";
import Noidlocker from "./Noidlocker";

function App() {
    const [alpha, setalpha] = useState({
        temps: [],
        pressures: [],
        thrusts: [],
        solenoids: [0, 0, 0, 0],
        going: 0,
    });

    const [noidslocked, setnoidslocked] = useState(1);

    const [cloudcolor, setcloudcolor] = useState("#FFF");
    const [cloud2color, setcloud2color] = useState("#FFF");

    const COMMANDS = {
        S1_ON: 0,
        S1_OFF: 1,
        S2_ON: 2,
        S2_OFF: 3,
        S3_ON: 4,
        S3_OFF: 5,
        S4_ON: 6,
        S4_OFF: 7,
        PYRO_ON: 8,
        PYRO_OFF: 9,
    };

    const socket = useRef();

    var colorscale = chroma.scale(["green", "yellow", "red"]);

    useEffect(() => {
        //WebSockets
        socket.current = new WebSocket("ws://10.12.123.45:3333/data");

        socket.current.onmessage = (event) => {
            var data = JSON.parse(event.data);
            //console.log(data);

            //convert pressure to psi
            for (var i = 0; i < data.pressures.length; i++) {
                data.pressures[i] =
                    (((data.pressures[i] * 5) / 4096 - 0.5) * 1000) / 4;
            }

            //convert thrust to volts
            for (var i = 0; i < data.thrusts.length; i++) {
                data.thrusts[i] = Math.abs(
                    ((data.thrusts[i] * 5) / (128 * Math.pow(2, 24)) / 15e-3) *
                        500
                );
            }

            setalpha(data);
        };

        return () => socket.current.close();
    }, []);

    useEffect(() => {
        //keypresses for solenoids
        const handler = (event) => {
            if (event.key === "1") {
                sendCommand(
                    alpha.solenoids[0] ? COMMANDS.S1_OFF : COMMANDS.S1_ON
                );
            }
            if (event.key === "2") {
                sendCommand(
                    alpha.solenoids[1] ? COMMANDS.S2_OFF : COMMANDS.S2_ON
                );
            }
            if (event.key === "3") {
                sendCommand(
                    alpha.solenoids[2] ? COMMANDS.S3_OFF : COMMANDS.S3_ON
                );
            }
            if (event.key === "4") {
                sendCommand(
                    alpha.solenoids[3] ? COMMANDS.S4_OFF : COMMANDS.S4_ON
                );
            }
        };

        window.addEventListener("keypress", handler);

        // cleanup to prevent stacking listeners
        return () => {
            window.removeEventListener("keypress", handler);
        };
    }, [alpha]); // 👈 reruns when alpha changes

    useEffect(() => {
        //set pressure colors
        var index = alpha.pressures[0];
        var index1 = alpha.pressures[1];
        setcloudcolor(colorscale(Math.abs(index * 300) / 1000));
        setcloud2color(colorscale(Math.abs(index1 / 1000)));
    }, [alpha]);

    function sendCommand(command) {
        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket not open — command not sent");
            return;
        }

        //guard for solenoids
        if (0 <= command && command <= 9) {
            if (noidslocked) {
                alert("UNLOCK SOLENOIDS TO TOGGLE!");
                return;
            }
        }

        socket.current.send(JSON.stringify({ command }));

        console.log("COMMAND SENT: ", JSON.stringify({ command }));
    }

    function unlockNoids() {
        setnoidslocked(0);
        alert("SOLENOIDS UNLOCKED");
    }

    function lockNoids() {
        setnoidslocked(1);
        alert("SOLENOIDS LOCKED");
    }

    return (
        <>
            <div id="container">
                <div className="left">
                    <h1 style={{ color: "var(--yellow)" }}>&nbsp;</h1>
                    <h2
                        style={{
                            textAlign: "center",
                            color: "var(--dark-yellow)",
                        }}
                    >
                        Data:
                    </h2>
                    <div>
                        <Databox title={"Temps:"} data={alpha.temps}></Databox>
                        <Databox
                            title={"Pressures:"}
                            data={alpha.pressures}
                        ></Databox>
                        <Databox
                            title={"Thrusts:"}
                            data={alpha.thrusts}
                        ></Databox>
                    </div>
                </div>
                <div className="center">
                    <h1 style={{ color: "var(--yellow)", textAlign: "Center" }}>
                        <i>Alpha</i>
                    </h1>

                    <h2 style={{ textAlign: "center", color: "var(--yellow)" }}>
                        Monitoring:
                    </h2>
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                        }}
                    >
                        <Plumbing
                            cloudcolor={cloudcolor}
                            cloud2color={cloud2color}
                            alpha={alpha}
                            sendCommand={sendCommand}
                            COMMANDS={COMMANDS}
                        ></Plumbing>
                    </div>

                    <h3 style={{ textAlign: "center" }}>
                        clouds currently scaling color based on presure 0 and
                        pressure 1 data
                    </h3>
                </div>
                <div className="right">
                    <h1 style={{ color: "var(--yellow)" }}>&nbsp;</h1>
                    <h2 style={{ textAlign: "center", color: "var(--yellow)" }}>
                        Control:
                    </h2>
                    <h4>
                        Solenoids:
                        <br></br>
                        {noidslocked ? "🔴LOCKED🔒" : "🟢UNLOCKED🔓"}
                    </h4>
                    <Noidlocker
                        noidslocked={noidslocked}
                        lockNoids={lockNoids}
                        unlockNoids={unlockNoids}
                    ></Noidlocker>
                </div>

                <ul style={{ overflow: "hidden", listStyleType: "none" }}></ul>
            </div>
        </>
    );
}

export default App;
