import React, { useState } from 'react'
import FigmaButton from "../FigmaButton/FigmaButton";

const FigmaLogin: React.FC<FigmaLoginProps> = (props) => {

    const { user, redirectUrl, CLIENT_ID, REDIRECT_URL, SCOPE } = props
    const handleClick = () => {
        window.location.href = `https://www.figma.com/oauth?client_id=${CLIENT_ID}&redirect_uri=${redirectUrl || REDIRECT_URL}&scope=${SCOPE}&state=null&response_type=code`
    }

    return (
        <>
            <FigmaButton
                user={user}
                onClick={handleClick}
            />
        </>
    )
}

interface FigmaLoginProps {
    CLIENT_ID: string,
    REDIRECT_URL: string,
    SCOPE: string

    [key: string]: any
}

export default FigmaLogin