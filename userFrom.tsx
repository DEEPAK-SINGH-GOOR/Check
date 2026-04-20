import { useState, useEffect } from "react";
import api from "../service/api"
import type { Product } from "./userList";

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]); 
    const [form, setForm] = useState<Product>({
        name: "",
        price: 0,
        des: "",
        category: "",
    })
    const [editId, setEditId] = useState<string | null>(null)

    const fetchProducts = async () => {
        const res = await api.get("/")
        setProducts(res.data.data)
    }

    useEffect(() => {
        fetchProducts()
    }, []) 

    const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.name === "price"
                    ? Number(e.target.value)
                    : e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            await api.put(`/update/${editId}`, form)
        } else {
            await api.post("/create", form)
        }
        setForm({
            name: "", price: 0,
            des: "",
            category: "",
        })
        setEditId(null) 
        fetchProducts()
    }

    const handleDelete = async (id: string) => {
        await api.delete(`${id}`)
        fetchProducts()
    }

    const handleEdit = (item: Product) => { 
        setForm({
            name: item.name,
            price: item.price,
            des: item.des,
            category: item.category,
        })
        setEditId(item._id || null)
    }
    return (
        <div style={{ padding: "30px" }}>
            <h1>Product CRUD</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="enter name" value={form.name} onChange={handlechange} />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handlechange}
                />

                <input
                    type="text"
                    name="des"
                    placeholder="Description"
                    value={form.des}
                    onChange={handlechange}
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handlechange}
                />
                <button type="submit">
                    {editId ? "Update" : "Submit"}
                </button>
            </form>
            <hr />
            {products.map((item) => {
                return (<div key={item._id}>
                    <h3>{item.name}</h3>
                    <p>₹ {item.price}</p>
                    <p>{item.des}</p>
                    <p>{item.category}</p>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                </div>)

            })}
        </div >
    )
}

export default Home