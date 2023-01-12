import React from 'react'
import FigmaToReact from "../../lib/components/FigmaToReact/FigmaToReact";
import useFigma from "../../lib/hooks/useFigma";

const HomeScreen: React.FC<HomeScreenProps> = (props) => {

    const figma: any = useFigma()

    const onHtmlReceived = (html: any) => {
        console.log(html)
    }

    return (
        <div>
            <FigmaToReact
                // authToken={{
                //     "user_id": 1005336488153569200,
                //     "access_token": "figu_uUtIUCHHr9znSYQrOfHLZOBbaRn8l2jfgOiAaJd8",
                //     "refresh_token": "figur_EljjxfPNwg_EKQ9QmBRpy436Rs02jafZSPaGRh_ywvkoRgqmGfz-TA",
                //     "expires_in": 7776000
                // }}
                figma={figma}
                onHtmlReceived={onHtmlReceived}
            />
        </div>
    )
}

interface HomeScreenProps {
    [key: string]: any
}

export default HomeScreen