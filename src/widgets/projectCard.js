import { Popup } from 'semantic-ui-react'

export function ProjectCard(props) {
    return <div className="w-full bg-orange-50 pb-1 mb-4">
        <Popup
            hoverable
            position='right center'
            trigger={
                <div className="bg-green-200 w-fit pl-2 pr-2 font-bold italic capitalize">
                    {props.name}
                </div>
            }
        >
            {
                props.hintView ?
                    <Popup.Content className='text-sm'>
                        {props.hintView}
                    </Popup.Content>
                    : null
            }
        </Popup>
        <div className="pl-3 pr-3 pt-2">
            {props.children}
        </div>
    </div>
}