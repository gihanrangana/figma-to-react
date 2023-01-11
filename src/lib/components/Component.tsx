import React from 'react'

const Component = (props: any) => {

    return (
        <div>
            {React.Children.map(props.str, (child) => {
                return React.cloneElement(child);
            })}
            {/*{props.str}*/}
        </div>
    )
}

interface ComponentProps {
    [key: string]: any
}

export default Component