import { LargeSpinner } from "./spinner"
import { Label } from '@fluentui/react/lib/Label';

function TableCell(props) {
    return <td className="border-t-1 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">{props.children}</td>
}

function Header({ headers }) {
    return <thead className="thead-light">
        <tr>
            {
                headers.map((x) => {
                    return <th className="px-3 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">{x}</th>
                })
            }
        </tr>
    </thead>
}

function Table({ title, headers, items, itemRenderer, loading }) {
    const renderHeader = () => {
        if (!headers || headers.length === 0) {
            return null
        } else {
            return <Header headers={headers}></Header>
        }
    }
    const renderTitle = () => {
        if (!title || title.length === 0) {
            return null
        } else {
            return <div className="flex justify-center items-center pb-2">
                <div className="w-fit font-bold text-base">{title}</div>
            </div>
        }
    }
    const renderItems = () => {
        if (itemRenderer) {
            return items.map((item) => {
                return <tr>
                    {itemRenderer(item)}
                </tr>
            })
        } else {
            return items.map((item) => {
                return <tr>
                    {item.map((x) => {
                        return <TableCell>{x}</TableCell>
                    })}
                </tr>
            })
        }
    }
    const renderEmptyLabel = () => {
        if (loading) {
            return null
        }
        if (items && items.length > 0) {
            return null
        }
        return <div className='w-full flex items-center justify-center'>
            <Label disabled className="pt-2">Empty</Label>
        </div>
    }

    return <div className="overflow-x-auto overflow-y-hidden">
        {renderTitle()}
        <table className="items-center w-full border-collapse text-blueGray-700">
            {renderHeader()}
            <tbody className="border-t-0 px-6 align-middle border-l-1 border-r-1 text-sm whitespace-nowrap p-4">
                {renderItems()}
            </tbody>
        </table>
        {
            renderEmptyLabel()
        }
        {
            (loading && items.length === 0)
                ? <LargeSpinner></LargeSpinner>
                : null
        }
    </div>
}

export {
    TableCell,
    Header,
    Table
}