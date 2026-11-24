import { useState, type MouseEvent } from 'react';

type NavProps = {
    index: number;
    onChange?: (index: number) => void;
    options?: readonly string[];
    text: string;
    onLogout?: () => void;
};

export const Nav = ({ index, onChange, options, text, onLogout }: NavProps) => {
    const [mobileButtonsVisible, setMobileButtonsVisible] = useState(false);

    const setNavIndex = (event: MouseEvent<HTMLButtonElement>) => {
        onChange?.(Number(event.currentTarget.id));
        setMobileButtonsVisible(false);
    };

    const handleBurgerButton = () => {
        setMobileButtonsVisible(!mobileButtonsVisible);
    };

    const getButtons = () => {
        return (
            <>
                <span className='options'>
                    {options?.map((option, i) => (
                        <button
                            className={index === i ? 'selected desktop' : 'desktop'}
                            onClick={setNavIndex}
                            id={String(i)}
                            key={i}
                        >
                            {option}
                        </button>
                    ))}
                </span>
                <button className='desktop' onClick={onLogout}>
                    Logout
                </button>
            </>
        );
    };

    const getMobileButtons = () => {
        return (
            <>
                <div className='mobile mobile-options'>
                    {options?.map((option, i) => (
                        <button className={index === i ? 'selected' : ''} onClick={setNavIndex} id={String(i)} key={i}>
                            {option}
                        </button>
                    ))}
                    <button onClick={onLogout}> Logout </button>
                </div>
                <div
                    className='back'
                    onClick={() => {
                        setMobileButtonsVisible(false);
                    }}
                ></div>
            </>
        );
    };

    return (
        <nav className='nav'>
            <span className='title'>
                <label> {text} </label>
                {getButtons()}
                <button className='burger-btn mobile' onClick={handleBurgerButton}>
                    &#9776;
                </button>
                {mobileButtonsVisible && getMobileButtons()}
            </span>
        </nav>
    );
};
