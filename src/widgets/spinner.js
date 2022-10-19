import { Loader } from 'semantic-ui-react'

export function LargeSpinner({label}) {
    return <div className='w-full flex items-center justify-center'>
        <div className='mt-4'>
            <Loader active inline size='small'>{label ? label : 'Fetching datas'}</Loader>
        </div>
    </div>
}