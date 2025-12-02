import { useEffect, useRef, useState } from "react";
import Databox from "./Databox";
import chroma from "chroma-js";
import "./App.css";
import Plumbing from "./Plumbing";
import Noidlocker from "./Noidlocker";
import Datachart from "./Datachart";

function App() {
    //UI state
    const [alpha, setalpha] = useState({
        temps: [],
        pressures: [],
        thrusts: [],
        solenoids: [0, 0, 0, 0],
        going: 0,
    });

    //raw data
    const latestData = useRef({
        temps: [],
        pressures: [],
        thrusts: [],
        solenoids: [0, 0, 0, 0],
        going: 0,
    });

    //random state
    const [noidslocked, setnoidslocked] = useState(1);
    const [cloudcolor, setcloudcolor] = useState("#FFF");
    const [cloud2color, setcloud2color] = useState("#FFF");

    //chart buffers
    const thrustbuffer = useRef([]);
    const [thrustdata, setthrustdata] = useState([]);

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

    const colorscale = chroma.scale(["green", "yellow", "red"]);

    //websocket
    useEffect(() => {
        socket.current = new WebSocket("ws://10.12.123.45:3333/data");

        socket.current.onmessage = (event) => {
            // Parse data
            var data = JSON.parse(event.data);

            // convert pressure to psi
            if (data.pressures) {
                for (var i = 0; i < data.pressures.length; i++) {
                    data.pressures[i] =
                        (((data.pressures[i] * 5) / 4096 - 0.5) * 1000) / 4;
                }
            }

            // convert thrust to volts
            if (data.thrusts) {
                for (var i = 0; i < data.thrusts.length; i++) {
                    data.thrusts[i] = Math.abs(
                        ((data.thrusts[i] * 5) /
                            (128 * Math.pow(2, 24)) /
                            15e-3) *
                            500
                    );
                }
            }

            //push data to thrust buffer
            if (data.thrusts && data.thrusts.length > 0) {
                thrustbuffer.current.push({ thrust: data.thrusts[0] });
            }

            latestData.current = data;
        };

        return () => socket.current.close();
    }, []);

    //render UI at 30 hz
    useEffect(() => {
        const loop = setInterval(() => {
            //set ui state
            setalpha({ ...latestData.current });

            //update chart
            const currentBuffer = thrustbuffer.current;

            // check for new data
            if (currentBuffer.length > 0) {
                thrustbuffer.current = [];

                //update state
                setthrustdata((prev) => {
                    const merged = [...prev, ...currentBuffer];
                    return merged.slice(-100); // keep 50 points
                });
            }

            //update cloud colors
            const p0 = latestData.current.pressures
                ? latestData.current.pressures[0]
                : 0;
            const p1 = latestData.current.pressures
                ? latestData.current.pressures[1]
                : 0;

            setcloudcolor(colorscale(Math.abs(p0 * 300) / 1000).hex());
            setcloud2color(colorscale(Math.abs(p1 / 1000)).hex());
        }, 33); //30fps

        return () => clearInterval(loop);
    }, []);

    //keystroke listeners
    useEffect(() => {
        const handler = (event) => {
            const currentSolenoids = latestData.current.solenoids || [
                0, 0, 0, 0,
            ];

            if (event.key === "1")
                sendCommand(
                    currentSolenoids[0] ? COMMANDS.S1_OFF : COMMANDS.S1_ON
                );
            if (event.key === "2")
                sendCommand(
                    currentSolenoids[1] ? COMMANDS.S2_OFF : COMMANDS.S2_ON
                );
            if (event.key === "3")
                sendCommand(
                    currentSolenoids[2] ? COMMANDS.S3_OFF : COMMANDS.S3_ON
                );
            if (event.key === "4")
                sendCommand(
                    currentSolenoids[3] ? COMMANDS.S4_OFF : COMMANDS.S4_ON
                );
        };

        window.addEventListener("keypress", handler);
        return () => window.removeEventListener("keypress", handler);
    }, [noidslocked]);

    //Command Function
    function sendCommand(command) {
        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket not open");
            return;
        }
        if (0 <= command && command <= 9 && noidslocked) {
            alert("UNLOCK SOLENOIDS TO TOGGLE!");
            return;
        }
        socket.current.send(JSON.stringify({ command }));
        console.log("COMMAND SENT: ", command);
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
        <div id="container">
            <div className="left">
                <h1 style={{ color: "var(--yellow)" }}>&nbsp;</h1>
                <h2
                    style={{ textAlign: "center", color: "var(--dark-yellow)" }}
                >
                    Data:
                </h2>
                <div>
                    <Databox title={"Temps:"} data={alpha.temps}></Databox>
                    <Databox
                        title={"Pressures:"}
                        data={alpha.pressures}
                    ></Databox>
                    <Databox title={"Thrusts:"} data={alpha.thrusts}></Databox>
                    <Datachart data={thrustdata}></Datachart>
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
                        // Pass the state 'alpha' here, it updates at 30fps
                        alpha={alpha}
                        sendCommand={sendCommand}
                        COMMANDS={COMMANDS}
                        className="glow"
                        style={{ padding: "10px" }}
                    ></Plumbing>
                </div>

                <h3 style={{ textAlign: "center" }}>
                    <span style={{ color: cloudcolor }}>●</span>
                    <span style={{ color: cloud2color }}>●</span>
                    Scaling color based on P0/P1
                </h3>
            </div>
            <div className="right">
                <h1 style={{ color: "var(--yellow)" }}>&nbsp;</h1>
                <h2 style={{ textAlign: "center", color: "var(--yellow)" }}>
                    Control:
                </h2>
                <h4>
                    Solenoids:
                    <br />
                    {noidslocked ? "🔴LOCKED🔒" : "🟢UNLOCKED🔓"}
                </h4>
                <Noidlocker
                    noidslocked={noidslocked}
                    lockNoids={lockNoids}
                    unlockNoids={unlockNoids}
                ></Noidlocker>
            </div>
        </div>
    );
}

export default App;
