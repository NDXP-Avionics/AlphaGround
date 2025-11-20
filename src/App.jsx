import { useEffect, useState } from "react";
import Databox from "./Databox";
import chroma from "chroma-js";
import "./App.css";
import Plumbing from "./Plumbing";

function App() {
    const [alpha, setalpha] = useState({
        temps: [],
        pressures: [],
        thrusts: [],
        going: 0,
    });
    const [cloudcolor, setcloudcolor] = useState("#FFF");
    const [cloud2color, setcloud2color] = useState("#FFF");

    var colorscale = chroma.scale(["green", "yellow", "red"]);

    useEffect(() => {
        //WebSockets
        const socket = new WebSocket("ws://10.12.123.45:3333/data");

        socket.onmessage = (event) => {
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

        return () => socket.close();
    }, []);

    useEffect(() => {
        var index = alpha.pressures[0];
        var index1 = alpha.pressures[1];
        setcloudcolor(colorscale(Math.abs(index * 300) / 1000));
        setcloud2color(colorscale(Math.abs(index1 / 1000)));
    }, [alpha]);

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
                        }}
                    >
                        <Plumbing
                            cloudcolor={cloudcolor}
                            cloud2color={cloud2color}
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
                </div>

                <ul style={{ overflow: "hidden", listStyleType: "none" }}></ul>
            </div>
        </>
    );
}

export default App;
