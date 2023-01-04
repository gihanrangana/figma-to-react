import useFigma from "./hooks/useFigma";
import { useEffect } from "react";

function App () {

    const figma: any = useFigma("WKp4dRaGlTUUDimbDsZF3x")

    const handleClick = () => {
        figma.run().then((res: any) => {
            console.log(res);
        })
    }

    return (
        <div>
            <button onClick={handleClick}>Get Component</button>
        </div>
    )
}

export default App
