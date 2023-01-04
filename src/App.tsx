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
            <button onClick={handleClick}>{figma.loading ? 'Loading...' : 'Get Component'}</button>

            {!figma.loading && figma.data &&
                Object.keys(figma.data).map((key) => {
                    return (
                        <div key={key} dangerouslySetInnerHTML={{ __html: figma.data[key].doc }}></div>
                    )
                })
            }
        </div>
    )
}

export default App
