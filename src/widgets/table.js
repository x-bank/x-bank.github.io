import { LargeSpinner } from "./spinner"
import { Table } from 'semantic-ui-react'

function TableCell(props) {
    return <Table.Cell>{props.children}</Table.Cell>
}

function Header({ headers }) {
    return <Table.Header>
        <Table.Row>
            {
                headers.map((x) => {
                    return <Table.HeaderCell>{x}</Table.HeaderCell>
                })
            }
        </Table.Row>
    </Table.Header>
}

function DataTable({ title, headers, items, itemRenderer, loading }) {
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
            return <div className="flex justify-center items-center pb-1">
                <div className="w-fit font-bold text-base">{title}</div>
            </div>
        }
    }
    const renderItems = () => {
        if (itemRenderer) {
            return items.map((item) => {
                return <Table.Row>
                    {itemRenderer(item)}
                </Table.Row>
            })
        } else {
            return items.map((item) => {
                return <Table.Row>
                    {item.map((x) => {
                        return <TableCell>{x}</TableCell>
                    })}
                </Table.Row>
            })
        }
    }
    const footerSpan = () => {
        if (headers) {
            return headers.length
        }
        if (items) {
            return items.length
        }
        return 1
    }
    const renderFooter = () => {
        let inner = null;
        if (loading && items.length === 0) {
            inner = <LargeSpinner></LargeSpinner>
        } else {
            if (items && items.length > 0) {
                return null
            } else {
                inner = <div className='w-full flex items-center justify-center'>
                    <div className="pt-2 pb-2 text-slate-400">Empty</div>
                </div>
            }
        }
        if (inner !== null) {
            return <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan={footerSpan()}>
                        {inner}
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        }

    }

    return <div className="overflow-x-auto overflow-y-hidden">
        {renderTitle()}
        <Table basic size='small'>
            {renderHeader()}
            <Table.Body>
                {renderItems()}
            </Table.Body>
            {renderFooter()}
        </Table>
    </div>
}

export {
    TableCell,
    Header,
    DataTable,
}