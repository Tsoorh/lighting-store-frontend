
import React, { useEffect, useState } from "react"
import type { FullProductsOrNull } from "../../model/product.model"
import { productService } from "../../services/product.service"
import { ProductPreview } from "./ProductPreview"
import { Icons } from "../Icons"
import { useWindowWidth } from "../../hooks/useWindowWidth"


export const ProductSuggestion = ({ category }: { category: string }) => {
    const [products, setProducts] = useState<FullProductsOrNull | undefined>()
    const [position, setPosition] = useState<number>(0)
    const [numOfSugg, setNumOfSugg] = useState<number>(4)
    const width = useWindowWidth()



    useEffect(() => {
        const changeScreenWidth = (suggestions: number): void => {
            setPosition(0)
            setNumOfSugg(suggestions)
        }
        if (width > 1250) changeScreenWidth(4)
        if (width > 1000 && width < 1250) changeScreenWidth(3)
        if (width > 825 && width < 1000) changeScreenWidth(2)
        if (width > 678 && width < 825) changeScreenWidth(1)
        if (width < 678) changeScreenWidth(0)
    }, [width])

    useEffect(() => {
        if (category) {
            const getProducts = async () => {
                const filterBy = { category: category }
                const productsFromDB = await productService.query(filterBy)
                setProducts(productsFromDB)
            }
            getProducts()
        }
    }, [category])


    const onHandleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation()
        ev.preventDefault()
        const { name } = ev.currentTarget;
        if (name === 'left') setPosition(prev => prev - 1)
        if (name === 'right') {
            setPosition(prev => prev + 1)
        }
    }

    if (!products) return <p>No products to suggest</p>
    return (
        <div>
            <button className="shadow" name="left" onClick={onHandleClick} disabled={position === 0}><Icons iconName="left" /></button>
            <ul>
                {products.map((product, idx) => {
                    if (idx >= position && idx <= position + numOfSugg) return <li key={product._id} ><ProductPreview product={product} /></li>
                })}
            </ul>
            <button className="shadow" name="right" onClick={onHandleClick} disabled={position === (products?.length - numOfSugg - 1)}><Icons iconName="right" /></button>
        </div>
    )
}
