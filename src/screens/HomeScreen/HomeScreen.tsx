import React, { useEffect } from 'react'
import useFigma from "../../hooks/useFigma";
import { useSearchParams } from "react-router-dom";
import FigmaModal from "../../components/FigmaModal/FigmaModal";
import Component from "../../Component";

const HomeScreen: React.FC<HomeScreenProps> = (props) => {

    const figma: any = useFigma()

    const [searchParams, setSearchParams] = useSearchParams();

    const handleClick = (props: any, values: any) => {
        // figma.setKey(value)
        console.log(`handleClick`, values)
        // passing props to figma component, figma component should have text includes [title], props.title will replace with [title] text
        figma.run(props).then((res: any) => {
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

            {figma.user && !figma.error && !figma.data && <FigmaModal setKey={figma.setFileKey} status={figma.status} handleSubmit={handleClick}/>}

            {figma.data &&
                figma.data.map((El: any) => {

                    return (
                        <Component str={El}/>
                    )
                })
            }

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