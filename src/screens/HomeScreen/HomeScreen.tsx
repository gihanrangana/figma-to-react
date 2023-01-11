import React from 'react'
import FigmaToReact from "../../lib/components/FigmaToReact/FigmaToReact";
import useFigma from "../../lib/hooks/useFigma";

const HomeScreen: React.FC<HomeScreenProps> = (props) => {

    const figma: any = useFigma()

    return (
        <div>
            <FigmaToReact figma={figma}/>
        </div>
    )
}

interface HomeScreenProps {
    [key: string]: any
}

export default HomeScreen