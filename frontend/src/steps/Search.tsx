import { useEffect, useState } from "react"
import { Data } from "../types"
import { searchData } from "../services/search"
import { toast } from "sonner";
import { useDebounce } from "@uidotdev/usehooks"

const DEBOUNCE_TIME = 500


export const Search = ({ initialData }: { initialData: Data }) => {
    const [data, setData] = useState<Data>(initialData)

    const [search, setSearch] = useState<string>(() => {
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    
    })

    const useDebouncedSearch = useDebounce(search, DEBOUNCE_TIME)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        const newPathname = useDebouncedSearch === '' ? window.location.pathname : `?q=${useDebouncedSearch}`

        window.history.pushState({}, "", newPathname)
    }, [useDebouncedSearch])

    useEffect(() => {
        if(!useDebouncedSearch){
            setData(initialData)
            return
        }
        searchData(useDebouncedSearch).then(([err, newData]) => {
            if (err) {
                toast.error(err.message)
                return
            }
            if (newData) {
                setData(newData)
            }
        }
        )
    }, [useDebouncedSearch, initialData])

    return (
        <div>
            <h1> Search </h1>
            <form>
                <input type="text" placeholder="Buscar información..." value={search} onChange={handleSearch} />
            </form>
            <ul>
                {data.map((row) => (
                    <li key={row.id}>
                        <article>
                            {Object.entries(row).map(([key, value]) => (
                                <p key={key}>
                                    <strong>{key}</strong>: {value}
                                </p>
                            ))}
                        </article>
                    </li>
                ))}
            </ul>
        </div>
    )
}