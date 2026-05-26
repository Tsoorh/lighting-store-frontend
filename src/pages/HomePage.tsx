export const HomePage = () => {
    return (
        <div className="main-layout">
            <div className="entry-vid" style={{ width: '100%', height: '810px' }}>
                <video 
                    src="/images/Figma/Main_video.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div className="wall-sec"></div>
            <div className="hanging-sec"></div>
            <div className="ceiling-sec"></div>
            <div className="accessories-sec"></div>
            <div className="products-sec"></div>
        </div>
    )
}