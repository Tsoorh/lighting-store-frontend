import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { SkeletonProductDetails } from "../Skeleton/SkeletonProductDetails"
import type { FullProduct, hebrewEnglishObj } from "../../model/product.model"
import { productService } from "../../services/product.service"
import { useLanguage } from "../../hooks/useLanguage"
import { Icons } from "../Icons"

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
    const balbLabel = isEnglish ? 'Bulb type -' : ' - סוג נורה'
    const voltLabel = isEnglish ? 'Voltage -' : ' - הספק'
    return (
        <div className="product-details">
            <div className="product-card">
                {product.imgsUrl.map((imgUrl, idx) => {
                    return <img key={idx} src={`https://res.cloudinary.com/dhixlriwm/image/upload/4G8A${imgUrl}.webp`} alt={product.name.en + idx} />
                })}
                <div className="info">
                    <h1 className="name">{nameLabel}</h1>
                    <p className="price note shadow">₪{product.price}</p>
                    <p className="">{descriptionLabel}</p>

                    <h2>Wood types:</h2>
                    <div className="wood-types">
                        {isWalnut && <div className="wood">
                            <img src="/images/walnut.jpg" />
                            <span>walnut</span>
                        </div>}
                        {isOak && <div className="wood">
                            <img src="/images/oak.jpg" />
                            <span>oak</span>
                        </div>
                        }
                    </div>
                    <a href='https://wa.me/972524000102'>{linkLabel} <Icons iconName="whatsapp" /></a>
                    <div className="details-icons">
                        <div className="technical-details">
                            <Icons iconName='material' />
                            <p>{materialsLabel}</p>
                            {product.material.map((m, idx) => {
                                return <span key={idx}>{isEnglish ? m.en : m.he}</span>
                            })}
                        </div>
                        <div className="technical-details">
                            <Icons iconName='size' />
                            <p>{isEnglish ? 'Size -' : '- מידות'}</p>
                            {product.size.map((s, idx) => {
                                return <>
                                    <span key={idx + 'r'}>{isEnglish ? `radius ${s.radius} cm` : `רדיוס ${s.radius} ס"מ`}</span>
                                    <span key={idx + 'h'}>{isEnglish ? `height ${s.height} cm` : `רדיוס ${s.height} ס"מ`}</span>
                                </>
                            })}
                        </div>
                        <div className="technical-details">
                            <Icons iconName='bulb' />
                            <p>{balbLabel}</p>
                            <span>{product.socketType.screwType}</span>
                        </div>
                        <div className="technical-details">
                            <Icons iconName='bolt' />
                            <p>{voltLabel}</p>
                            <span>{product.socketType.lightType}</span>
                        </div>
                    </div>

                    {/* 
                    {product.woodType.map((wood, idx) => {
                        return <p className="note shadow" key={idx}>{isEnglish ? wood.en : wood.he}</p>
                    })}

                    <span className="note shadow">{product.socketType.lightType}</span>
                    <div className="notes">
                        {product.category.map((c, idx) => {
                            return <p className="note shadow" key={idx}>{isEnglish ? c.en : c.he} </p>
                        })}
                        <p className="note shadow">{product.socketType.lightType}</p>
                    </div>  */}
                </div>
            </div>
        </div>
    )
}