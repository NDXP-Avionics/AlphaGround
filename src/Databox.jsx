export default function Databox({ title, data }) {
    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "var(--dark-blue)",
                overflow: "hidden",
                marginTop: "10px",
                flex: 1,
                fontFamily: "Space Mono",
                fontWeight: "400",
                fontStyle: "normal",
            }}
            className="glow"
        >
            <div
                style={{
                    textAlign: "center",
                    color: "var(--dark-yellow)",
                    margin: "10px",
                    fontSize: "20px",
                }}
            >
                <b>
                    <i>{title}</i>
                </b>
            </div>
            <ul
                style={{
                    listStyleType: "none",
                    margin: "0px",
                    marginBottom: "20px",
                    padding: "0px",
                    textAlign: "Center",
                }}
            >
                {data.map((item, index) => {
                    return (
                        <li>
                            <p style={{ margin: "2px" }}>
                                {index}: {item ? item.toFixed(2) : "--"}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
