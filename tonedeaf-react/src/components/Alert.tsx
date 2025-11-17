import { useState, type MouseEvent, type ReactNode } from "react"

type AlertProps = {
    children: ReactNode,
    visible: boolean,
    onClick: (event: MouseEvent<HTMLElement>) => void
}

const Alert = ({ children, visible, onClick }: AlertProps) => {
    if (visible) {
        return (
            <div className="alert flex">
                <div className="message flex-col">
                    <label className="large bold"> {children} </label>
                    <button className="small bold" onClick={onClick}> Ok </button>
                </div>
            </div>
        )
    }
}

Alert.useAlert = function(initialText: string) {
  return useState(initialText);
}

export default Alert;