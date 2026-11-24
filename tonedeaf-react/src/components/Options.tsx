import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';

type OptionLabel = string | { icon: string; text: string };

type OptionsProps = Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> & {
    subtitle?: ReactNode;
    description?: string;
    options?: readonly OptionLabel[];
    onClick?: ((index: number) => void) | null;
    col?: boolean;
    index?: number;
};

export const Options = ({
    title,
    subtitle,
    description,
    options,
    onClick,
    col,
    index,
    children,
    className,
    ...props
}: OptionsProps) => {
    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        if (!(event.target instanceof Element)) {
            return;
        }

        const option = event.target.closest('.option');
        if (option?.id) {
            onClick?.(Number(option.id));
        }
    };

    return (
        <div
            className={'options-panel flex-col ' + (className || '')}
            {...props}
        >
            {title ? (
                <label className={'medium bold flex'} title={'Toggle Menu'}>
                    {title}
                </label>
            ) : null}
            {description && <p className='small'> {description} </p>}
            {subtitle}
            <div
                className={'options ' + (col ? 'flex-col' : '')}
                onClick={handleClick}
            >
                {options?.map((option, i) => (
                    <Option selected={index === i} id={String(i)} key={i}>
                        {typeof option === 'string' ? option : <img src={option.icon} alt={option.text} />}
                    </Option>
                ))}
                {children}
            </div>
        </div>
    );
};

type OptionProps = {
    id: string;
    selected: boolean;
    children: ReactNode;
    href?: string;
};

export const Option = ({ id, selected, children, href }: OptionProps) => {
    return (
        <a
            id={id}
            className={
                'gray-btn bold flex option ' + (selected ? 'selected' : '')
            }
            href={href}
            target='_blank'
            rel='noreferrer'
        >
            {children}
        </a>
    );
};
