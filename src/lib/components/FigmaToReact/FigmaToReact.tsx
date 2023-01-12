import React, { useEffect } from 'react'
import { useSearchParams } from "react-router-dom";
import FigmaModal from "../FigmaModal/FigmaModal";
import Component from "../Component";

const FigmaToReact: React.FC<FigmaToReactProps> = (props) => {

    const { figma, authToken, onHtmlReceived } = props

    const [searchParams, setSearchParams] = useSearchParams();

    const handleClick = async (props: any) => {
        await figma.run(props)
    }

    useEffect(() => {

        if (!onHtmlReceived) return;
        onHtmlReceived(figma.html)

    }, [figma.html])

    useEffect(() => {

        if (authToken) {
            // console.log('Auth token')
            figma.setAuthToken(authToken)
            return;
        }

        const code = searchParams.get("code");
        if (!code) return

        (async () => {
            await figma.authenticate(code);
        })()

    }, [searchParams])

    return (
        <div>

            {/* This is just only for show the errors, remove this on production */}
            {figma.error &&
                <pre style={{ width: '660px', wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(figma.error)}
                </pre>
            }

            {figma.status && <p>{figma.status}</p>}

            {figma.renderLogin()}

            {figma.user && !figma.error && !figma.data &&
                <FigmaModal
                    status={figma.status}
                    handleSubmit={handleClick}
                    retrieveFiles={figma.retrieveFiles}
                    frames={figma.frames}
                    setSelectedFrame={figma.setSelectedFrame}
                />
            }

            {figma.data &&
                figma.data.map((El: any, index: any) => {
                    return (
                        <Component key={index} str={El}/>
                    )
                })
            }
        </div>
    )
}

interface FigmaToReactProps {
    figma: any,
    authToken?: {},
    onHtmlReceived?: (html: any) => void
}

export default FigmaToReact