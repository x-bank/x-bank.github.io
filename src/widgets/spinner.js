import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Label } from '@fluentui/react/lib/Label';

export function LargeSpinner({label}) {
    return <div className='w-full flex items-center justify-center'>
        <div className='mt-4'>
            <Label>{label ? label : 'Fetching datas'}</Label>
            <Spinner size={SpinnerSize.large} />
        </div>
    </div>
}