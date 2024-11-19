import {FC, useEffect, useState} from "react";
import {UserService} from "../services/user.service.ts";
import {IList} from "../types/types.ts";
import List from "../components/list.tsx";

const Home : FC = () => {

    const [lists, setLists] = useState<IList[]>([])
    const [adding, setAdding] = useState<boolean>(false)
    const [listName, setListName] = useState<string>("")

    useEffect(() => {

        const getLists = async () =>{
            const data = await UserService.getLists();
            if (data){
                setLists(data);
            }
        }
        getLists();
    }, []);

    const addListHandler = async () => {
        if (listName.trim() != ""){
            const data = await UserService.addList({name: listName})
            if (data) {
                setLists(data)
            }
        }

        setAdding(false);
    }

    return <div className='flex flex-x lists-container'>
        {
            lists.map((list) => (
                <List key={list.id} list={list}/>
            ))
        }
        {
            adding ? (
                <form className='flex'>
                    <input type='text' className='add-list-input card'
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    onBlur={() => addListHandler()}/>
                </form>
            ) : (
                <div className='flex list pointer items-center justify-center' onClick={() => setAdding(true)}>
                    + Add List
                </div>
            )
        }
    </div>
}

export default Home;