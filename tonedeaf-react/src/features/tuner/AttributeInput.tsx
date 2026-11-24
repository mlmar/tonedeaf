import type { ChangeEvent } from 'react';
import type { AttributeConfig } from '~/util/SpotifyUtil';

type AttributeInputProps = AttributeConfig & {
    userMin: number;
    userMax: number;
    onChange?: (id: string, value: number, bound: 'min' | 'max') => void;
};

export const AttributeInput = ({ id, name, min, max, step, userMin, userMax, onChange }: AttributeInputProps) => {
    const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(id, event.currentTarget.valueAsNumber, 'min');
    };

    const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(id, event.currentTarget.valueAsNumber, 'max');
    };

    const rangeProps = { id, name, min, max, step };

    const minLabel = (
        <label className='slider-label small'> {min} </label>
    );
    const maxLabel = (
        <label className='slider-label small'> {max} </label>
    );

    return (
        <div className='flex-col attribute'>
            <div className='description flex-col'>
                <label className='bold'> {name} </label>
                <label className='small descrioption'>
                    <span className='italic'> Current Range: </span>
                    {userMin} &mdash; {userMax}
                </label>
            </div>

            <div className='flex'>
                <label className='minmax-label italic'> Min </label>
                <span className='slider flex'>
                    {minLabel}
                    <input
                        type='range'
                        {...rangeProps}
                        value={userMin}
                        onChange={handleMinChange}
                    />
                    {maxLabel}
                </span>
            </div>

            <div className='flex'>
                <label className='minmax-label italic'> Max </label>
                <span className='slider flex'>
                    {minLabel}
                    <input
                        type='range'
                        {...rangeProps}
                        value={userMax}
                        onChange={handleMaxChange}
                    />
                    {maxLabel}
                </span>
            </div>
        </div>
    );
};
