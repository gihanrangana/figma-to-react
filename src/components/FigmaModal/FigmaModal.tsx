import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from "react-dom";

import styles from './FigmaModal.module.scss'

const ModalContainer: React.FC<any> = (props) => {

    const { setKey, status, handleSubmit } = props;

    const [value, setValue] = useState<any>(null)
    const [step, setStep] = useState(0)

    const handleChange = (event: any) => {
        const val: any = { [event.target.name]: event.target.value }
        if (val.fileKey) setKey(val.fileKey)
        setValue((prev: any) => ({ ...prev, ...val }))
    }

    const setNextStep = useCallback(() => {
        setStep(prev => prev + 1)
    }, [step])

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>

                {step === 0 &&
                    <>
                        <input
                            type={"text"}
                            onChange={handleChange}
                            name={"fileKey"} value={value?.fileKey || ''}
                            placeholder={"Paste your Figma file id here..."}
                        />
                        <button onClick={setNextStep}>Next</button>
                    </>
                }

                {step === 1 &&
                    <>
                        <button
                            onClick={handleSubmit.bind(null, { title: "name", para: "paragraph" } /* this object should change in future */)}
                        >
                            {status ? status : 'Run'}
                        </button>
                    </>
                }

            </div>
        </div>
    )
}

const FigmaModal: React.FC<FigmaModalProps> = (props) => {
    return createPortal(<ModalContainer {...props}/>, document.body)
}

interface FigmaModalProps {
    [key: string]: any
}

export default FigmaModal