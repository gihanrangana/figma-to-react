import ReactHtmlParser from "react-html-parser"
import * as ReactDOMServer from 'react-dom/server';
import useFigma from "./hooks/useFigma";
import Component from "./Component";
import React from "react";
import ReactDOM from "react-dom/client";
import JsxParser from "react-jsx-parser";

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

                    // const Com = ReactDOM.createClass()

                    return (
                        // <div key={key} dangerouslySetInnerHTML={{__html:figma.data[key].doc}}></div>
                        <div key={key}>
                            {/* @ts-ignore */}
                            <JsxParser jsx={figma.data[key].doc}/>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default App
