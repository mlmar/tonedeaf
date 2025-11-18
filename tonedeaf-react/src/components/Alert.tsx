type AlertProps = {
    children: React.ReactNode;
    visible: boolean;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export const Alert = ({ children, visible, onClick }: AlertProps) => {
    if (visible) {
        return (
            <div className='alert flex'>
                <div className='message flex-col'>
                    <label className='large bold'> {children} </label>
                    <button className='small bold' onClick={onClick}>
                        Ok
                    </button>
                </div>
            </div>
        );
    }
};
