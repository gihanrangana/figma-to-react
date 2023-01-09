import React, { useEffect } from 'react'
import useFigma from "../../hooks/useFigma";
import FigmaLogin from "../../components/FigmaLogin/FigmaLogin";
import Component from "../../Component";
import { useSearchParams } from "react-router-dom";

const CLIENT_ID = 'Z70USUDZKrFDMF1DabBe3Y'
const CLIENT_SECRET = 'AATunePpR13fV61pikgCxK0NReiUde'
const REDIRECT_URL = encodeURIComponent(window.location.href.substring(0, window.location.href.length - 1))
const SCOPE = 'file_read'

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
    const figma: any = useFigma("nAeqtS8nD4u59r6hvx841K")

    const [searchParams, setSearchParams] = useSearchParams();

    const handleClick = () => {
        // passing props to figma component, figma component should have text includes [title], props.title will replace with [title] text
        figma.run({
            title: "Name",
            para: "para"
        }).then((res: any) => {
            console.log(res);
        })
    }

    useEffect(() => {
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

            {/*{!figma.loading && !figma.error && figma.data &&*/}
            {/*    figma.data.map((El: any) => {*/}

            {/*        return (*/}
            {/*            <Component str={El}/>*/}
            {/*        )*/}
            {/*    })*/}
            {/*}*/}
        </div>
    )
}

interface HomeScreenProps {
    [key: string]: any
}

export default HomeScreen