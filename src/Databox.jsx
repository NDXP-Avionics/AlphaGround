export default function Databox({ title, data }) {
    return (
        <div
            style={{
                width: "100%",
                border: "2px solid var(--blue)",
                boxSizing: "border-box",
                backgroundColor: "var(--dark-blue)",
                flex: 1,
            }}
        >
            <div
                style={{
                    backgroundColor: "var(--blue)",
                    textAlign: "center",
                    color: "var(--dark-yellow)",
                }}
            >
                <b>
                    <i>{title}</i>
                </b>
            </div>
            <ul style={{ listStyleType: "none" }}>
                <div>
                    {data.map((item, index) => {
                        return (
                            <li>
                                <p>
                                    {index}: {item}
                                </p>
                            </li>
                        );
                    })}
                </div>
            </ul>
        </div>
    );
}
