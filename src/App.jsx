import { useEffect, useState } from "react";
import Databox from "./Databox";
import Balloon from "./Balloon";
import colormap from "colormap";
import "./App.css";
import Plumbing from "./Plumbing";

function App() {
    const [alpha, setalpha] = useState({ temps: [], pressures: [], going: 0 });
    const [cloudcolor, setcloudcolor] = useState("#FFF");
    const [cloud2color, setcloud2color] = useState("#FFF");

    var colors = colormap({
        colormap: "cool",
        nshades: 4096,
        format: "hex",
        alpha: 1,
    });

    useEffect(() => {
        //WebSockets
        const socket = new WebSocket("ws://10.12.123.45:3333/data");

        socket.onmessage = (event) => {
            var data = JSON.parse(event.data);
            //console.log(data);
            setalpha(data);
        };

        return () => socket.close();
    }, []);

    useEffect(() => {
        var index = alpha.pressures[0];
        var index1 = alpha.pressures[1];
        setcloudcolor(colors[Math.floor(index / 2)]);
        setcloud2color(colors[Math.floor(index1) - 800]);
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
