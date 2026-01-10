import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { SkeletonProductDetails } from "../Skeleton/SkeletonProductDetails"
import type { FullProduct, hebrewEnglishObj } from "../../model/product.model"
import { productService } from "../../services/product.service"
import { useLanguage } from "../../hooks/useLanguage"
import { Icons } from "../Icons"
import { ProductSuggestion } from "./ProductSuggestion"

export const ProductDetails = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState<FullProduct | null>(null)
    const { language } = useLanguage()



    useEffect(() => {
        const loadProduct = async (): Promise<void> => {
            if (!productId) return
            try {
                const productFromDb = await productService.getById(productId)
                setProduct(productFromDb);
            } catch (err) {
                console.log("Error loading product:", err)
            }
        }
        loadProduct()
    }, [productId])

    const checkWoodType = (currentWood: hebrewEnglishObj, woodType: string): boolean => {
        return currentWood.en.toLowerCase().includes(woodType)
    }


    const isOak = product?.woodType.some(wood =>
        checkWoodType(wood, 'oak')
    )
    const isWalnut = product?.woodType.some(wood =>
        checkWoodType(wood, 'walnut')
    )

    if (!product) return <SkeletonProductDetails />

    const isEnglish = language === 'en'
    const nameLabel = isEnglish ? product.name.en : product.name.he
    const descriptionLabel = isEnglish ? product.description.en : product.description.he
    const linkLabel = isEnglish ? `Custom Order` : `הזמנה בייצור אישי `
    const materialsLabel = isEnglish ? 'Materials -' : '- חומרים'
    const bulbLabel = isEnglish ? 'Bulb type -' : ' - סוג נורה'
    const voltLabel = isEnglish ? 'Voltage -' : ' - הספק'
    const alignLanguage = { alignItems: isEnglish ? 'flex-start' : 'flex-end' }
    const iconsLanguageAlign = isEnglish ? `technical-details-en` : `technical-details-he`
    const sizeLabel = isEnglish ? 'Size -' : '- מידות'
    const woodLabel = isEnglish ? "Wood types:" : ": סוגי עץ זמינים"
    return (
        <div className="product-details">
            <div className="product-card">
                {product.imgsUrl.map((imgUrl, idx) => {
                    return <img key={idx} src={`https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${imgUrl}.webp`} alt={product.name.en + idx} />
                })}
                <div className="info" style={alignLanguage}>
                    <h1 className="name">{nameLabel}</h1>
                    <p className="price note shadow">₪{product.price}</p>
                    <p className="">{descriptionLabel}</p>

                    <h2>{woodLabel}</h2>
                    <div className="wood-types">
                        {isWalnut && <div className="wood">
                            <img src="/images/walnut.jpg" />
                            <span>{isEnglish ? "walnut" : "אגוז"}</span>
                        </div>}
                        {isOak && <div className="wood">
                            <img src="/images/oak.jpg" />
                            <span>{isEnglish ? "oak" : "אלון"}</span>
                        </div>
                        }
                    </div>
                    <a href='https://wa.me/972524000102'>{linkLabel} <Icons iconName="whatsapp" /></a>
                    <div className="details-icons " >
                        <div className={iconsLanguageAlign}>
                            <Icons iconName='material' />
                            <p>{materialsLabel}</p>
                            {product.material.map((m, idx) => {
                                return <span key={idx}>{isEnglish ? m.en : m.he}</span>
                            })}
                        </div>
                        <div className={iconsLanguageAlign}>
                            <Icons iconName='size' />
                            <p>{sizeLabel}</p>
                            {product.size.map((s, idx) => {
                                return <>
                                    <span key={idx + 'r'}>{isEnglish ? `radius ${s.radius} cm` : `רדיוס ${s.radius} ס"מ`}</span>
                                    <span key={idx + 'h'}>{isEnglish ? `height ${s.height} cm` : `רדיוס ${s.height} ס"מ`}</span>
                                </>
                            })}
                        </div>
                        <div className={iconsLanguageAlign}>
                            <Icons iconName='bulb' />
                            <p>{bulbLabel}</p>
                            <span>{product.socketType.screwType}</span>
                        </div>
                        <div className={iconsLanguageAlign}>
                            <Icons iconName='bolt' />
                            <p>{voltLabel}</p>
                            <span>{product.socketType.lightType}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="suggestion">
                <ProductSuggestion category={product.category[0].en} />
            </div>
        </div >
    )
}