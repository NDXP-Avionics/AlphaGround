import { useState } from "react";

export default function Noidlocker({ noidslocked, lockNoids, unlockNoids }) {
    const [unlocking, setunlocking] = useState(0);

    const [unlocktext, setunlocktext] = useState("");

    return (
        <>
            {noidslocked ? (
                unlocking ? (
                    <div>
                        <input
                            type="text"
                            value={unlocktext}
                            onChange={(e) => {
                                setunlocktext(e.target.value);
                            }}
                            style={{ width: "100%", marginBottom: "10px" }}
                        ></input>

                        <div
                            className="button"
                            onClick={() => {
                                if (unlocktext.toLowerCase() == "unlock") {
                                    setunlocking(0);
                                    unlockNoids();
                                } else {
                                    alert('INCORRECT PASSCODE, ENTER "UNLOCK"');
                                    setunlocking(0);
                                }
                                setunlocktext("");
                            }}
                        >
                            Enter
                        </div>
                    </div>
                ) : (
                    <div
                        className="button"
                        onClick={() => {
                            setunlocking(1);
                        }}
                    >
                        Unlock Solenoids
                    </div>
                )
            ) : (
                <div
                    className="button"
                    onClick={() => {
                        lockNoids();
                    }}
                >
                    Lock Solenoids
                </div>
            )}
        </>
    );
}
