import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from "react-dom";

import styles from './FigmaModal.module.scss'

const ModalContainer: React.FC<any> = (props) => {

    const { status, handleSubmit, retrieveFiles, frames, setSelectedFrame } = props;

    const [value, setValue] = useState<any>(null)
    const [step, setStep] = useState(0)

    const handleChange = (event: any) => {
        const val: any = { [event.target.name]: event.target.value }
        setValue((prev: any) => ({ ...prev, ...val }))
    }

    const setNextStep = useCallback(() => {
        retrieveFiles(value.fileKey).then(() => {
            setStep(prev => prev + 1)
        })
    }, [step, value])

    const handleSelectFrame = (id: string) => {
        setSelectedFrame(id)
        setStep(prev => prev + 1)
    }

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>

                {step === 0 &&
                    <>
                        <input
                            type={"text"}
                            onChange={handleChange}
                            name={"fileKey"}
                            value={value?.fileKey || ''}
                            placeholder={"Paste your Figma file id here..."}
                        />
                        <button onClick={setNextStep}>{status ? status : 'Next'}</button>
                    </>
                }

                {step === 1 &&
                    <>
                        <div>
                            <h3>Select Frame to generate the design</h3>

                            {frames &&
                                <ul className={styles.framesList}>
                                    {frames.map((frame: any, i: number) => {
                                        return (
                                            <li
                                                className={styles.frameListItem}
                                                onClick={handleSelectFrame.bind(null, frame.id)}
                                            >
                                                {frame.name}
                                            </li>
                                        )
                                    })}
                                </ul>
                            }
                        </div>
                    </>
                }

                {step === 2 &&
                    <button
                        onClick={handleSubmit.bind(null, { title: "name", para: "paragraph" } /* this object should change in future */)}
                        disabled={!frames}
                    >
                        {status ? status : 'Run'}
                    </button>
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