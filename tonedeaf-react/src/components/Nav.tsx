import { useId, useRef, useState } from 'react';

type NavProps = {
    index: number;
    onChange?: (index: number) => void;
    options?: readonly string[];
    text: string;
    onLogout?: () => void;
};

export const Nav = ({ index, onChange, options, text, onLogout }: NavProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileOptionsId = useId();
    const mobileOptionsRef = useRef<HTMLDivElement>(null);
    const burgerButtonRef = useRef<HTMLButtonElement>(null);

    const closeMobileMenu = () => {
        // Return focus to the trigger before disabling the drawer buttons.
        if (mobileOptionsRef.current?.contains(document.activeElement)) {
            burgerButtonRef.current?.focus();
        }

        setMobileMenuOpen(false);
    };

    const handleOptionSelect = (nextIndex: number) => {
        // Switch sections immediately while CSS handles the drawer exit.
        onChange?.(nextIndex);
        closeMobileMenu();
    };

    const toggleMobileMenu = () => {
        if (mobileMenuOpen) {
            closeMobileMenu();
            return;
        }

        setMobileMenuOpen(true);
    };

    const getDesktopButtons = () => {
        return (
            <>
                <span className='options'>
                    {options?.map((option, optionIndex) => (
                        <button
                            className={index === optionIndex ? 'selected desktop' : 'desktop'}
                            onClick={() => handleOptionSelect(optionIndex)}
                            key={optionIndex}
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
        const viewportClass = `mobile mobile-options-viewport${mobileMenuOpen ? ' is-open' : ''}`;

        return (
            <div className={viewportClass}>
                <div
                    className='mobile-options'
                    id={mobileOptionsId}
                    ref={mobileOptionsRef}
                    aria-hidden={!mobileMenuOpen}
                >
                    {options?.map((option, optionIndex) => (
                        <button
                            className={index === optionIndex ? 'selected' : ''}
                            disabled={!mobileMenuOpen}
                            onClick={() => handleOptionSelect(optionIndex)}
                            key={optionIndex}
                        >
                            {option}
                        </button>
                    ))}
                    <button disabled={!mobileMenuOpen} onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        );
    };

    return (
        <nav className='nav'>
            <span className='title'>
                <label> {text} </label>
                {getDesktopButtons()}
                <button
                    className='burger-btn mobile'
                    ref={burgerButtonRef}
                    aria-label='Navigation menu'
                    aria-controls={mobileOptionsId}
                    aria-expanded={mobileMenuOpen}
                    onClick={toggleMobileMenu}
                >
                    &#9776;
                </button>
                {/* Keep the drawer mounted so CSS can finish or reverse the slide. */}
                {getMobileButtons()}
                {mobileMenuOpen && (
                    <div
                        className='mobile mobile-nav-backdrop'
                        aria-hidden='true'
                        onPointerDown={(event) => {
                            // Preserve drawer focus until the click handler can return it to the trigger.
                            event.preventDefault();
                        }}
                        onClick={closeMobileMenu}
                    />
                )}
            </span>
        </nav>
    );
};
